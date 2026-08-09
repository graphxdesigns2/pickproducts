"use client";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductCard({ product, onOpen, onQuickAdd }) {
  const { currency, formatDisplayPrice } = useCurrency();
  const p = product;

  return (
    <div className="card" onClick={() => onOpen(p.id)}>
      <div className="card-media">
        {p.image?.url ? (
          <img src={p.image.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          p.icon
        )}
        {p.was ? <div className="badge">SALE</div> : null}
      </div>
      <div className="card-body">
        <div className="card-title">{p.name}</div>
        <div className="card-cat">{p.cat?.name}</div>
        <div className="card-foot">
          <div className="card-price">
            {p.was ? <span className="was">{formatDisplayPrice(p.was)}</span> : null}
            {" "}{formatDisplayPrice(p.price)}
            {currency !== "USD" && <span className="currency-note" style={{ fontSize: "0.75rem", opacity: 0.8, marginLeft: "4px" }}>({currency})</span>}
          </div>
          <button
            className="add-btn"
            aria-label="Quick add to cart"
            onClick={(e) => { e.stopPropagation(); onQuickAdd(p.id); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}