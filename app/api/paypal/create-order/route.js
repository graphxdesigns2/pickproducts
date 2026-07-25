import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getCartTotals } from "@/lib/pricing";
import { getAccessToken, PAYPAL_API } from "@/lib/paypal";

export async function POST(request) {
  try {
    const { cartItems } = await request.json();
    // cartItems from client: [{ id, qty }, ...] — price is NEVER trusted from here

    // Rebuild cart with real prices from the product catalog
    const cart = cartItems.map((item) => {
      const product = getProductById(item.id);
      if (!product) throw new Error(`Unknown product id: ${item.id}`);
      return { price: product.price, qty: item.qty };
    });

    const { total } = getCartTotals(cart);

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
              value: total.toFixed(2),
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
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}