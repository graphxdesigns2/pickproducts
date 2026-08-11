"use client";

import { useEffect, useState } from "react";

export default function ApplePayButton({ total, createOrder, captureOrder, onError }) {
  const [isEligible, setIsEligible] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | ineligible | error

  useEffect(() => {
    let cancelled = false;

    async function setupApplePay() {
      // Poll until the PayPal SDK loaded the Applepay component
      const ready = await waitFor(() => window.paypal?.Applepay);
      if (!ready || cancelled) {
        setStatus("ineligible");
        return;
      }

      try {
        const applePayConfig = await window.paypal.Applepay().config();

        // Check if PayPal deems this buyer/device/domain eligible for Apple Pay
        if (applePayConfig.isEligible && !cancelled) {
          setIsEligible(true);
          setStatus("ready");
        } else if (!cancelled) {
          setStatus("ineligible");
        }
      } catch (err) {
        console.error("Apple Pay setup error:", err);
        if (!cancelled) setStatus("error");
        onError?.(err);
      }
    }

    setupApplePay();
    return () => {
      cancelled = true;
    };
  }, [onError]);

  async function handleApplePayClick() {
    try {
      const applepay = window.paypal.Applepay();
      const config = await applepay.config();

      const paymentRequest = {
        countryCode: config.countryCode || "US",
        currencyCode: "USD",
        merchantCapabilities: config.merchantCapabilities,
        supportedNetworks: config.supportedNetworks,
        requiredBillingContactFields: ["name", "email", "postalAddress"],
        requiredShippingContactFields: [],
        total: {
          label: "Store Checkout",
          amount: String(total),
          type: "final",
        },
      };

      // Check if native ApplePaySession exists (Safari), otherwise fallback to PayPal's session handler
      const session = window.ApplePaySession
        ? new window.ApplePaySession(4, paymentRequest)
        : await applepay.createSession(paymentRequest);

      session.onvalidatemerchant = async (event) => {
        try {
          const merchantSession = await applepay.validateMerchant({
            validationUrl: event.validationURL,
            displayName: "Store Checkout",
          });
          session.completeMerchantValidation(merchantSession);
        } catch (err) {
          console.error("Apple Pay merchant validation failed:", err);
          session.abort();
        }
      };

      session.onpaymentauthorized = async (event) => {
        try {
          const orderId = await createOrder();

          const confirmResponse = await applepay.confirmOrder({
            orderId,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
          });

          if (confirmResponse.status === "APPROVED") {
            await captureOrder({ orderID: orderId });
            session.completePayment(
              window.ApplePaySession?.STATUS_SUCCESS || "SUCCESS"
            );
          } else {
            session.completePayment(
              window.ApplePaySession?.STATUS_FAILURE || "FAILURE"
            );
          }
        } catch (err) {
          console.error("Apple Pay payment authorization error:", err);
          session.completePayment(
            window.ApplePaySession?.STATUS_FAILURE || "FAILURE"
          );
          onError?.(err);
        }
      };

      session.begin();
    } catch (err) {
      console.error("Error launching Apple Pay session:", err);
      onError?.(err);
    }
  }

  if (status === "ineligible" || !isEligible) {
    return (
      <div className="notice" style={{ marginTop: "16px" }}>
        Apple Pay isn't available on this browser or device right now — try PayPal or Google Pay instead.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="notice" style={{ marginTop: "16px" }}>
        Apple Pay couldn't load. Try PayPal or Google Pay instead.
      </div>
    );
  }

  return (
    <button
      onClick={handleApplePayClick}
      style={{
        width: "100%",
        height: "48px",
        marginTop: "16px",
        backgroundColor: "black",
        color: "white",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
       Pay
    </button>
  );
}

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