"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (product) {
      setSize(product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);
      setQty(1);
    }
  }, [product]);
  if (!product) return null;
  const p = product;
  function handleAdd() {
    addToCart(p, size, qty);
    onClose();
    showToast(`Added ${qty} × ${p.name} to cart`);
  }
  return (
    <div className={`modal-overlay${isOpen ? " open" : ""}`}>
      <div className="modal">
        <div className="modal-media">
          {p.image?.url ? (
            <img src={p.image.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            p.icon
          )}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-info">
          <div className="cat">{p.cat?.name}</div>
          <h2>{p.name}</h2>
          <div className="modal-price">
            {p.was ? <span className="was" style={{ fontSize: "14px" }}>${p.was.toFixed(2)} </span> : null}${p.price.toFixed(2)}
          </div>
          <div className="desc">{p.desc}</div>
          {p.sizes && p.sizes.length > 0 && (
            <div>
              <div className="field-label">Size</div>
              <div className="size-opts">
                {p.sizes.map((s) => (
                  <button
                    key={s.id || s.size}
                    className={`size-opt${s.size === size ? " selected" : ""}`}
                    onClick={() => setSize(s.size)}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="field-label">Quantity</div>
            <div className="qty-row">
              <div className="qty-ctrl">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="n">{qty}</span>
                <button onClick={() => setQty(Math.min(20, qty + 1))}>+</button>
              </div>
              <span className="stock-note">✓ In stock</span>
            </div>
          </div>
          <button className="modal-add" onClick={handleAdd}>
            Add {qty} to Cart — ${(p.price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}