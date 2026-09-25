import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET() {
  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CJ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    // Start Payload
    const payload = await getPayload({
      config,
    });

    // Get CJ access token
    const authResponse = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      }
    );

    const authData = await authResponse.json();

    if (!authResponse.ok || authData.code !== 200) {
      return NextResponse.json(
        {
          error: "CJ authentication failed",
          details: authData,
        },
        { status: 500 }
      );
    }

    const accessToken = authData.data.accessToken;

    // Get 20 products from CJ
    const productsResponse = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=1&size=20",
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": accessToken,
        },
      }
    );

    const productsData = await productsResponse.json();

    if (!productsResponse.ok || productsData.code !== 200) {
      return NextResponse.json(
        {
          error: "CJ product request failed",
          details: productsData,
        },
        { status: 500 }
      );
    }

    const productList =
      productsData?.data?.content?.[0]?.productList || [];

    const imported = [];
    const skipped = [];

    for (const cjProduct of productList) {
      // Check if this CJ product is already in Payload
      const existing = await payload.find({
        collection: "products",
        where: {
          cjProductId: {
            equals: cjProduct.id,
          },
        },
        limit: 1,
        overrideAccess: true,
      });

      if (existing.docs.length > 0) {
        skipped.push({
          name: cjProduct.nameEn,
          reason: "Already imported",
        });

        continue;
      }

      // Convert CJ price to a number.
      // If CJ gives a price range, use the lowest price.
      const priceText = String(cjProduct.sellPrice || "0");
      const firstPrice = priceText.split("--")[0].trim();
      const cjPrice = parseFloat(firstPrice);

      if (!Number.isFinite(cjPrice)) {
        skipped.push({
          name: cjProduct.nameEn,
          reason: "Invalid CJ price",
        });

        continue;
      }

      // Create the product in Payload
      const newProduct = await payload.create({
        collection: "products",
        overrideAccess: true,
        data: {
          name: cjProduct.nameEn || "CJ Product",
          price: cjPrice,
          desc: `CJ Dropshipping SKU: ${cjProduct.sku}`,
          cjProductId: cjProduct.id,
          cjSku: cjProduct.sku,
        },
      });

      imported.push({
        id: newProduct.id,
        name: cjProduct.nameEn,
        cjSku: cjProduct.sku,
        price: cjPrice,
      });
    }

    return NextResponse.json({
      success: true,
      message: "CJ products imported successfully",
      importedCount: imported.length,
      skippedCount: skipped.length,
      imported,
      skipped,
    });
  } catch (error) {
    console.error("CJ import error:", error);

    return NextResponse.json(
      {
        error: "Unable to import CJ products into Payload",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}