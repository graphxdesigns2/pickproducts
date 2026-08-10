import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCartTotals } from "@/lib/pricing";
import { getAccessToken, PAYPAL_API } from "@/lib/paypal";

export async function POST(request) {
  try {
    const body = await request.json();
    const cartItems = body.cartItems || body.items;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Await configPromise for Payload 3.0+ App Router compatibility
    const config = await configPromise;
    const payloadCms = await getPayload({ config });

    // Fetch live product data from Payload CMS to prevent price mismatch
    const cart = await Promise.all(
      cartItems.map(async (item) => {
        const productId = item.id || item.productId;
        if (!productId) {
          throw new Error("Missing product ID in cart item");
        }

        const product = await payloadCms.findByID({
          collection: "products",
          id: productId,
        });

        if (!product) {
          throw new Error(`Unknown product id: ${productId}`);
        }

        const price = Number(product.price) || 0;
        // Check for both 'qty' and 'quantity' to avoid defaulting to 1 incorrectly
        const qty = Number(item.qty ?? item.quantity) || 1;

        return { price, qty };
      })
    );

    const { total } = getCartTotals(cart);
    const formattedTotal = Number(total).toFixed(2);

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
      const errText = await orderRes.text();
      console.error("PayPal API Error Response:", errText);
      throw new Error(`PayPal API responded with status ${orderRes.status}`);
    }

    const order = await orderRes.json();
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("PayPal Order Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}