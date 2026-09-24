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
    const response = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.code !== 200) {
      return NextResponse.json(
        {
          error: "CJ authentication failed",
          details: data,
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "CJ authentication successful",
      accessToken: data.data.accessToken,
      accessTokenExpiryDate: data.data.accessTokenExpiryDate,
    });
  } catch (error) {
    console.error("CJ authentication error:", error);

    return NextResponse.json(
      { error: "Unable to connect to CJ" },
      { status: 500 }
    );
  }
}