"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getCartTotals } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/components/PaymentIcons";
import { PayPalButtons, FUNDING, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// Maps our UI ids to the PayPal SDK's funding source constants
const FUNDING_SOURCE_MAP = {
  paypal: FUNDING.PAYPAL,
  gpay: FUNDING.GOOGLEPAY,
  apay: FUNDING.APPLEPAY,
};

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const [{ isResolved }] = usePayPalScriptReducer();
  const [ineligible, setIneligible] = useState(false);

  const fundingSource = FUNDING_SOURCE_MAP[selectedPayment] || FUNDING.PAYPAL;

  // Apple Pay / Google Pay only render when the SDK has loaded AND the
  // buyer's browser/device actually supports that wallet (e.g. Apple Pay
  // needs Safari on an Apple device with a card in Wallet). We check
  // eligibility so we can show a clear fallback instead of a blank button.
  useEffect(() => {
    setIneligible(false);
    if (!isResolved || typeof window === "undefined" || !window.paypal) return;
    if (selectedPayment === "paypal") return; // always eligible
    const eligible =
      typeof window.paypal.isFundingEligible === "function"
        ? window.paypal.isFundingEligible(fundingSource)
        : true;
    setIneligible(!eligible);
  }, [isResolved, selectedPayment, fundingSource]);

  if (!isOpen) return null;

  const { total } = getCartTotals(cart || []);
  const itemCount = (cart || []).reduce((s, c) => s + (c.qty || c.quantity || 1), 0);
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);

  function placeOrder() {
    onClose();
    clearCart();
    showToast("🎉 Order placed! Confirmation sent to your account.");
  }

  async function createOrder() {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart.map((c) => ({
            id: c.id || c.productId,
            qty: c.qty || c.quantity || 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || (!data.id && !data.orderID)) {
        throw new Error(data.error || data.details || "Failed to create order on server");
      }

      // Return the string order ID directly
      return data.id || data.orderID;
    } catch (err) {
      console.error("createOrder error:", err);
      showToast(`⚠️ ${err.message || "Failed to initiate payment."}`);
      throw err;
    }
  }

  async function captureOrder(data) {
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const captureData = await res.json();

      if (res.ok && captureData.status === "COMPLETED") {
        placeOrder();
      } else {
        showToast("⚠️ Payment could not be completed. Please try again.");
      }
    } catch (err) {
      console.error("captureOrder error:", err);
      showToast("⚠️ Payment capture error. Please try again.");
    }
  }

  function onError(err) {
    console.error("PayPal Error Details:", err);
    showToast("⚠️ Something went wrong with the payment provider. Check console for details.");
  }

  return (
    <div className={`modal-overlay${isOpen ? " open" : ""}`}>
      <div className="modal" style={{ gridTemplateColumns: "1fr", maxWidth: "520px" }}>
        <div className="checkout-body">
          <button
            className="modal-close"
            style={{ position: "absolute", top: "14px", right: "14px" }}
            onClick={onClose}
          >
            ✕
          </button>
          <h2>Express Checkout</h2>
          <div className="sub">
            {itemCount} item(s) · Total due <strong className="mono">${total.toFixed(2)}</strong>
          </div>

          <div className="field-label" style={{ marginTop: "16px" }}>
            Select Payment Method
          </div>
          <div className="pay-methods">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                className={`pay-method${selectedPayment === m.id ? " selected" : ""}`}
                onClick={() => setSelectedPayment(m.id)}
                aria-label={m.label}
              >
                <m.Icon />
              </button>
            ))}
          </div>

          <div className="notice" style={{ marginTop: "12px", marginBottom: "16px" }}>
            Payment details and shipping address will be safely provided directly through{" "}
            {activeMethod?.label || "your express provider"}.
          </div>

          {itemCount === 0 ? (
            <div className="notice">Your cart is empty.</div>
          ) : ineligible ? (
            <div className="notice" style={{ marginTop: "16px" }}>
              {activeMethod?.label || "This payment method"} isn't available in this
              browser or on this device. Try PayPal instead, or open this page on a
              device/browser that supports it (e.g. Safari on an Apple device for
              Apple Pay, Chrome with a saved card for Google Pay).
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <PayPalButtons
                key={selectedPayment}
                fundingSource={fundingSource}
                style={{ layout: "vertical", shape: "rect", label: "checkout" }}
                createOrder={createOrder}
                onApprove={captureOrder}
                onError={onError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}