import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload-config'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const apiKey = process.env.CJ_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'CJ_API_KEY environment variable is not set.' },
        { status: 500 },
      )
    }

    // 1. Get CJ Access Token
    const authRes = await fetch(
      'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      },
    )
    const authData = await authRes.json()

    if (!authRes.ok || authData.code !== 200 || !authData.data?.accessToken) {
      return NextResponse.json(
        { error: 'CJ Authentication failed', details: authData },
        { status: 500 },
      )
    }

    const accessToken = authData.data.accessToken

    // 2. Fetch products from CJ
    const cjRes = await fetch(
      'https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=1&size=20',
      {
        method: 'GET',
        headers: {
          'CJ-Access-Token': accessToken,
          'access-token': accessToken,
          'Content-Type': 'application/json',
        },
      },
    )

    const cjData = await cjRes.json()

    if (!cjRes.ok || cjData.code !== 200) {
      return NextResponse.json(
        { error: 'Failed to fetch products from CJ', details: cjData },
        { status: 500 },
      )
    }

    const cjProducts = cjData.data?.list || []
    const results = {
      totalFetched: cjProducts.length,
      created: 0,
      updated: 0,
      failed: 0,
    }

    // 3. Upsert into Payload PostgreSQL Database
    for (const item of cjProducts) {
      try {
        const cjPid = item.pid
        const wholesaleCost = parseFloat(item.sellPrice || item.price || '0')
        
        // Calculate retail price with a 40% margin (Wholesale * 1.4)
        const retailPrice = parseFloat((wholesaleCost * 1.4).toFixed(2))
        const originalWasPrice = parseFloat((retailPrice * 1.25).toFixed(2))

        // Check if item already exists in Payload
        const existing = await payload.find({
          collection: 'products',
          where: {
            cjPid: {
              equals: cjPid,
            },
          },
          limit: 1,
        })

        const productData = {
          name: item.productNameEn || item.productName || 'CJ Product',
          price: retailPrice > 0 ? retailPrice : 19.99,
          was: originalWasPrice,
          desc: item.description || '',
          cjPid: cjPid,
          cjSku: item.productSku || '',
          cjCostPrice: wholesaleCost,
          cjImage: item.productImage || '',
        }

        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'products',
            id: existing.docs[0].id,
            data: productData,
          })
          results.updated++
        } else {
          await payload.create({
            collection: 'products',
            data: productData,
          })
          results.created++
        }
      } catch (err) {
        console.error(`Error syncing CJ product ${item.pid}:`, err)
        results.failed++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully synced CJ products with Payload database',
      results,
    })
  } catch (error: any) {
    console.error('CJ Sync Route Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}