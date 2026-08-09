import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getCartTotals } from "@/lib/pricing";
import { getAccessToken, PAYPAL_API } from "@/lib/paypal";

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    const payloadCms = await getPayload({ config });

    // Fetch live product data from Payload CMS to prevent price mismatch
    const cart = await Promise.all(
      cartItems.map(async (item) => {
        const product = await payloadCms.findByID({
          collection: "products",
          id: item.id,
        });

        if (!product) {
          throw new Error(`Unknown product id: ${item.id}`);
        }

        const price = Number(product.price) || 0;
        const qty = Number(item.qty) || 1;

        return { price, qty };
      })
    );

    const { total } = getCartTotals(cart);
    const formattedTotal = total.toFixed(2);

    const accessToken = await getAccessToken();

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: formattedTotal,
            },
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error(`PayPal order creation failed: ${err}`);
    }

    const order = await orderRes.json();
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("PayPal Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}