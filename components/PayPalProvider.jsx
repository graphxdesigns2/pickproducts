"use client";
import { PayPalProvider as PayPalV6Provider } from "@paypal/react-paypal-js/sdk-v6";

export default function PayPalProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const environment = process.env.NEXT_PUBLIC_PAYPAL_ENV === "production" ? "production" : "sandbox";

  if (!clientId) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PayPalProvider: NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing from environment variables.");
    }
    return <>{children}</>;
  }

  return (
    <PayPalV6Provider
      clientId={clientId}
      environment={environment}
      components={["paypal-payments", "applepay-payments", "googlepay-payments"]}
      pageType="checkout"
    >
      {children}
    </PayPalV6Provider>
  );
}