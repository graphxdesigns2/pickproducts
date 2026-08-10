import { NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API } from "@/lib/paypal";

export async function POST(request) {
  try {
    const body = await request.json();
    const orderID = body.orderID || body.orderId;

    if (!orderID) {
      return NextResponse.json(
        { error: "Missing orderID in request body" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("PayPal Capture API Failure Response:", captureData);
      const errorMessage =
        captureData?.details?.[0]?.description ||
        captureData?.message ||
        `PayPal capture failed with status ${captureRes.status}`;

      return NextResponse.json(
        { error: errorMessage, details: captureData },
        { status: captureRes.status }
      );
    }

    // Returns full capture payload (containing status: "COMPLETED")
    return NextResponse.json(captureData, { status: 200 });
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture order" },
      { status: 500 }
    );
  }
}