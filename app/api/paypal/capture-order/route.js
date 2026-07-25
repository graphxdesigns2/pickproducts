import { NextResponse } from "next/server";
import { getAccessToken, PAYPAL_API } from "@/lib/paypal";

export async function POST(request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
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

    if (!captureRes.ok) {
      const err = await captureRes.text();
      throw new Error(`PayPal capture failed: ${err}`);
    }

    const captureData = await captureRes.json();

    // captureData.status should be "COMPLETED" if successful
    return NextResponse.json(captureData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}