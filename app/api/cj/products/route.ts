import { NextResponse } from "next/server";

// Cache token in memory during warm runtime
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getCJAccessToken(apiKey: string) {
  const now = Date.now();
  
  // Return cached token if valid (with 5-minute buffer)
  if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const response = await fetch(
    "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
      next: { revalidate: 86400 }, // Cache fetch response for 24 hours
    }
  );

  const data = await response.json();

  if (!response.ok || data.code !== 200 || !data.data?.accessToken) {
    throw new Error(data.message || "CJ Authentication Failed");
  }

  const accessToken = data.data.accessToken;
  // Parse expiry or fallback to 14 days
  const expiryTime = data.data.accessTokenExpiryDate 
    ? new Date(data.data.accessTokenExpiryDate).getTime() 
    : now + 14 * 24 * 60 * 60 * 1000;

  cachedToken = { token: accessToken, expiresAt: expiryTime };
  return accessToken;
}

export async function GET(request: Request) {
  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CJ_API_KEY is not configured in environment variables." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "20";
  const categoryId = searchParams.get("categoryId") || "";

  try {
    const accessToken = await getCJAccessToken(apiKey);

    let cjUrl = `https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=${page}&size=${size}`;
    if (categoryId) {
      cjUrl += `&categoryId=${categoryId}`;
    }

    const productsResponse = await fetch(cjUrl, {
      method: "GET",
      headers: {
        "CJ-Access-Token": accessToken,
        "access-token": accessToken, // Set both casing formats for API compatibility
        "Content-Type": "application/json",
      },
    });

    const productsData = await productsResponse.json();

    if (!productsResponse.ok || productsData.code !== 200) {
      return NextResponse.json(
        { error: "CJ product request failed", details: productsData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: productsData.data?.list || [],
      pagination: {
        pageNum: productsData.data?.pageNum || Number(page),
        pageSize: productsData.data?.pageSize || Number(size),
        total: productsData.data?.total || 0,
      },
    });
  } catch (error: any) {
    console.error("CJ products error:", error);
    return NextResponse.json(
      { error: error.message || "Unable to retrieve products from CJ" },
      { status: 500 }
    );
  }
}