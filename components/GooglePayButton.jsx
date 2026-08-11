"use client";

import { useEffect, useRef, useState } from "react";

// Set NEXT_PUBLIC_PAYPAL_ENV=live in production. Anything else stays in
// Google's TEST environment, matching PayPal sandbox.
const GOOGLE_PAY_ENV =
  process.env.NEXT_PUBLIC_PAYPAL_ENV === "live" ? "PRODUCTION" : "TEST";

/**
 * Renders Google's own native "Buy with G Pay" button and drives the
 * PayPal <-> Google Pay confirmation flow directly, per PayPal's
 * documented Google Pay integration:
 * https://developer.paypal.com/docs/checkout/apm/google-pay/
 *
 * Props:
 * - total: string/number, the cart total to display in Google's sheet
 *   (the actual charge amount is still decided server-side in createOrder)
 * - createOrder: async () => orderId   (reuse the one already in CheckoutModal)
 * - captureOrder: async (orderId) => void  (reuse the one already in CheckoutModal)
 * - onError: (err) => void
 */
export default function GooglePayButton({ total, createOrder, captureOrder, onError }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | ineligible | error

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      // Both SDKs load async; poll briefly instead of assuming order.
      const ready = await waitFor(
        () => window.paypal?.Googlepay && window.google?.payments?.api
      );
      if (!ready || cancelled) {
        setStatus("ineligible");
        return;
      }

      try {
        const googlePayConfig = await window.paypal.Googlepay().config();

        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: GOOGLE_PAY_ENV,
          paymentDataCallbacks: {
            onPaymentAuthorized: (paymentData) =>
              handlePaymentAuthorized(paymentData, { createOrder, captureOrder, onError }),
          },
        });

        const isReadyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        };

        const { result } = await paymentsClient.isReadyToPay(isReadyToPayRequest);

        if (!result || cancelled) {
          setStatus("ineligible");
          return;
        }

        const button = paymentsClient.createButton({
          onClick: () =>
            onGooglePayClick(paymentsClient, googlePayConfig, total),
          buttonType: "buy",
          buttonSizeMode: "fill",
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(button);
        }
        setStatus("ready");
      } catch (err) {
        console.error("Google Pay setup error:", err);
        if (!cancelled) setStatus("error");
        onError?.(err);
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (status === "ineligible") {
    return (
      <div className="notice" style={{ marginTop: "16px" }}>
        Google Pay isn't available in this browser right now — try PayPal instead.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="notice" style={{ marginTop: "16px" }}>
        Google Pay couldn't load. Try PayPal instead, or refresh the page.
      </div>
    );
  }

  return <div ref={containerRef} style={{ marginTop: "16px", minHeight: "45px" }} />;
}

async function onGooglePayClick(paymentsClient, googlePayConfig, total) {
  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
    merchantInfo: googlePayConfig.merchantInfo,
    transactionInfo: {
      countryCode: googlePayConfig.countryCode || "US",
      currencyCode: "USD",
      totalPriceStatus: "FINAL",
      totalPrice: String(total),
    },
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
  };

  // loadPaymentData triggers Google's payment sheet; the actual order
  // creation/confirmation happens inside the onPaymentAuthorized callback
  // registered on the PaymentsClient above.
  await paymentsClient.loadPaymentData(paymentDataRequest);
}

async function handlePaymentAuthorized(paymentData, { createOrder, captureOrder, onError }) {
  try {
    const orderId = await createOrder();

    const confirmResponse = await window.paypal.Googlepay().confirmOrder({
      orderId,
      paymentMethodData: paymentData.paymentMethodData,
    });

    if (confirmResponse.status === "APPROVED") {
      await captureOrder({ orderID: orderId });
      return { transactionState: "SUCCESS" };
    }

    if (confirmResponse.status === "PAYER_ACTION_REQUIRED") {
      // 3DS or similar additional auth step required.
      await window.paypal.initiatePayerAction?.({ orderId });
      await captureOrder({ orderID: orderId });
      return { transactionState: "SUCCESS" };
    }

    throw new Error(`Unexpected confirmOrder status: ${confirmResponse.status}`);
  } catch (err) {
    console.error("Google Pay authorization error:", err);
    onError?.(err);
    return {
      transactionState: "ERROR",
      error: { message: err.message || "Payment could not be completed." },
    };
  }
}

// Polls a condition every 100ms up to ~5s, since Google's and PayPal's
// scripts both load asynchronously and we can't guarantee order.
function waitFor(condition, timeoutMs = 5000, intervalMs = 100) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (condition()) return resolve(true);
      if (Date.now() - start >= timeoutMs) return resolve(false);
      setTimeout(check, intervalMs);
    };
    check();
  });
}
