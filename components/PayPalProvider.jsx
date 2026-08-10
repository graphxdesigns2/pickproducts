"use client";
import { PayPalProvider as PayPalV6Provider } from "@paypal/react-paypal-js/sdk-v6";

export default function PayPalProvider({ children }) {
  return (
    <PayPalV6Provider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}
      environment={process.env.NODE_ENV === "production" ? "production" : "sandbox"}
      components={[
        "paypal-payments",
        "applepay-payments",
        "googlepay-payments",
      ]}
      pageType="checkout"
    >
      {children}
    </PayPalV6Provider>
  );
}