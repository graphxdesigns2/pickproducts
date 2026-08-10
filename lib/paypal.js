// lib/paypal.js

export const PAYPAL_API =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getAccessToken() {
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret =
    process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      `Missing PayPal environment variables. Client ID: ${Boolean(
        clientId
      )}, Secret: ${Boolean(clientSecret)}`
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("PayPal Token Error Response:", data);
    throw new Error(
      data.error_description || "Failed to get PayPal access token"
    );
  }

  return data.access_token;
}