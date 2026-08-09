"use client";
import { useCart } from "@/context/CartContext";
import { getCartTotals } from "@/lib/pricing";

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, changeQty, removeItem } = useCart();
  const { subtotal, shipping, tax, total } = getCartTotals(cart);

  return (
    <>
      <div className={`overlay${isOpen ? " open" : ""}`} onClick={onClose}></div>
      <div className={`drawer${isOpen ? " open" : ""}`}>
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty.<br />Browse the catalog to find something you'll love.</div>
          ) : (
            cart.map((c, idx) => {
              // Extract size label safely whether c.size is an object ({ id, size }) or a string
              const sizeLabel = typeof c.size === "object" && c.size !== null
                ? (c.size.size || c.size.name || c.size.id || "")
                : (c.size || "");

              // Helper function to resolve image URL from any common structure/key
              const getImageUrl = (item) => {
                const img = item.image || item.icon || item.thumbnail || item.featuredImage;
                if (!img) return null;

                // Handle object types (e.g., Payload CMS media upload object)
                if (typeof img === "object" && img !== null) {
                  return img.url || img.src || (img.sizes && img.sizes.thumbnail?.url) || null;
                }

                // Handle string types
                if (typeof img === "string") return img;

                return null;
              };

              const imageUrl = getImageUrl(c);

              return (
                <div className="cart-item" key={c.id + "|" + (sizeLabel || idx)}>
                  <div className="thumb">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={c.name || "Product"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <span style={{ fontSize: "20px" }}>📦</span>
                    )}
                  </div>
                  <div className="info">
                    <div className="name">{c.name}</div>
                    {sizeLabel && <div className="meta">Size: {sizeLabel}</div>}
                    <div className="qty-ctrl">
                      <button onClick={() => changeQty(idx, -1)}>−</button>
                      <span className="n">{c.qty}</span>
                      <button onClick={() => changeQty(idx, 1)}>+</button>
                    </div>
                  </div>
                  <div className="price-col">
                    <div className="line-price">${(c.price * c.qty).toFixed(2)}</div>
                    <div className="remove-link" style={{ cursor: "pointer" }} onClick={() => removeItem(idx)}>Remove</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="sum-row"><span>Subtotal</span><span className="mono">${subtotal.toFixed(2)}</span></div>
            <div className="sum-row"><span>Shipping</span><span className="mono">{shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span></div>
            <div className="sum-row"><span>Estimated tax</span><span className="mono">${tax.toFixed(2)}</span></div>
            <div className="sum-row total"><span>Total</span><span className="mono">${total.toFixed(2)}</span></div>
            <button className="btn btn-gold" style={{ width: "100%", marginTop: "12px" }} onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}