import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CJ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    // Get a fresh CJ access token
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

    // Get products from CJ
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

    return NextResponse.json({
      success: true,
      products: productsData.data,
    });
  } catch (error) {
    console.error("CJ products error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve products from CJ" },
      { status: 500 }
    );
  }
}