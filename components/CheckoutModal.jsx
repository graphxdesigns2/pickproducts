"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getCartTotals } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/components/PaymentIcons";
import { PayPalButtons } from "@paypal/react-paypal-js";

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

  function createOrder() {
    return fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: cart.map((c) => ({ id: c.id, qty: c.qty })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.id) throw new Error("No order ID returned");
        return data.id;
      });
  }

  function onApprove(data) {
    return fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID }),
    })
      .then((res) => res.json())
      .then((captureData) => {
        if (captureData.status === "COMPLETED") {
          placeOrder();
        } else {
          showToast("⚠️ Payment could not be completed. Please try again.");
        }
      });
  }

  function onError(err) {
    console.error(err);
    showToast("⚠️ Something went wrong with PayPal. Please try again.");
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

          {selectedPayment === "paypal" ? (
            <div style={{ marginTop: "16px" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </div>
          ) : (
            <button className="place-order" onClick={placeOrder}>
              Pay with {activeMethod?.label || "Express Payment"} — ${total.toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}