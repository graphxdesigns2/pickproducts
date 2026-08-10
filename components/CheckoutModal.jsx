"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getCartTotals } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/components/PaymentIcons";
import {
  PayPalOneTimePaymentButton,
  ApplePayOneTimePaymentButton,
  useGooglePayOneTimePaymentSession,
} from "@paypal/react-paypal-js/sdk-v6";

// Isolated so the hook only initializes once this actually mounts (i.e. once selected)
function GooglePayButton({ total, createOrder, captureOrder, onError }) {
  const { isPending, handleClick, error } = useGooglePayOneTimePaymentSession({
    paymentRequest: {
      countryCode: "US",
      currencyCode: "USD",
      total: { label: "PickMyProducts", amount: total.toFixed(2), type: "final" },
    },
    createOrder,
    onApprove: (data) => captureOrder(data.orderId),
    onError,
  });

  if (error) return <div className="notice">Google Pay isn't available right now.</div>;

  return (
    <button className="place-order" disabled={isPending} onClick={handleClick}>
      Pay with Google Pay — ${total.toFixed(2)}
    </button>
  );
}

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const { total } = getCartTotals(cart);
  const itemCount = cart.reduce((s, c) => s + c.qty, 0);
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);

  function placeOrder() {
    onClose();
    clearCart();
    showToast("🎉 Order placed! Confirmation sent to your account.");
  }

  async function createOrder() {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart.map((c) => ({ id: c.id, qty: c.qty })) }),
    });
    const data = await res.json();
    if (!data.id) throw new Error("No order ID returned");
    return { orderId: data.id };
  }

  async function captureOrder(orderId) {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: orderId }),
    });
    const captureData = await res.json();
    if (captureData.status === "COMPLETED") {
      placeOrder();
    } else {
      showToast("⚠️ Payment could not be completed. Please try again.");
    }
  }

  function onError(err) {
    console.error(err);
    showToast("⚠️ Something went wrong. Please try again.");
  }

  return (
    <div className={`modal-overlay${isOpen ? " open" : ""}`}>
      <div className="modal" style={{ gridTemplateColumns: "1fr", maxWidth: "520px" }}>
        <div className="checkout-body">
          <button className="modal-close" style={{ position: "absolute", top: "14px", right: "14px" }} onClick={onClose}>✕</button>
          <h2>Express Checkout</h2>
          <div className="sub">{itemCount} item(s) · Total due <strong className="mono">${total.toFixed(2)}</strong></div>
          <div className="field-label" style={{ marginTop: "16px" }}>Select Payment Method</div>
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
            Payment details and shipping address will be safely provided directly through {activeMethod?.label || "your express provider"}.
          </div>

          {selectedPayment === "paypal" && (
            <div style={{ marginTop: "16px" }}>
              <PayPalOneTimePaymentButton
                createOrder={createOrder}
                onApprove={(data) => captureOrder(data.orderId)}
                onError={onError}
                presentationMode="auto"
              />
            </div>
          )}

          {selectedPayment === "apay" && (
            <div style={{ marginTop: "16px" }}>
              <ApplePayOneTimePaymentButton
                paymentRequest={{
                  countryCode: "US",
                  currencyCode: "USD",
                  total: { label: "PickMyProducts", amount: total.toFixed(2), type: "final" },
                }}
                applePaySessionVersion={4}
                createOrder={createOrder}
                onApprove={(data) => captureOrder(data.orderId)}
                onError={onError}
                buttonstyle="black"
              />
            </div>
          )}

          {selectedPayment === "gpay" && (
            <div style={{ marginTop: "16px" }}>
              <GooglePayButton total={total} createOrder={createOrder} captureOrder={captureOrder} onError={onError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}