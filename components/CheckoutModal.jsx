"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getCartTotals } from "@/lib/pricing";
import { PAYMENT_METHODS } from "@/components/PaymentIcons";

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
    showToast("🎉 Order placed! Confirmation sent to your email.");
  }

  return (
    <div className={`modal-overlay${isOpen ? " open" : ""}`}>
      <div className="modal" style={{ gridTemplateColumns: "1fr", maxWidth: "520px" }}>
        <div className="checkout-body">
          <button className="modal-close" style={{ position: "absolute", top: "14px", right: "14px" }} onClick={onClose}>✕</button>
          <h2>Checkout</h2>
          <div className="sub">{itemCount} item(s) · Total due <strong className="mono">${total.toFixed(2)}</strong></div>

          <div className="field-label" style={{ marginTop: 0 }}>Payment method</div>
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

          <div className="notice" style={{ marginTop: "10px" }}>
            You'll be redirected to {activeMethod?.label} to confirm this payment securely.
          </div>

          <div className="field-label">Shipping address</div>
          <div className="form-grid">
            <div className="full"><label>Full name</label><input type="text" placeholder="Jane Doe" /></div>
            <div className="full"><label>Address</label><input type="text" placeholder="123 Main St" /></div>
            <div><label>City</label><input type="text" placeholder="City" /></div>
            <div><label>Postal code</label><input type="text" placeholder="ZIP / Postal" /></div>
          </div>

          <button className="place-order" onClick={placeOrder}>
            Place Order — ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
