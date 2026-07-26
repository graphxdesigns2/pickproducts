export default function ProductCard({ product, onOpen, onQuickAdd }) {
  const p = product;
  return (
    <div className="card" onClick={() => onOpen(p.id)}>
      <div className="card-media">
        {p.img ? (
          <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          p.icon
        )}
        {p.was ? <div className="badge">SALE</div> : null}
      </div>
      <div className="card-body">
        <div className="card-cat">{p.cat}</div>
        <div className="card-title">{p.name}</div>
        <div className="card-rating">★ {p.rating} <span style={{ color: "#c7cede" }}>({p.reviews})</span></div>
        <div className="card-foot">
          <div className="card-price">
            {p.was ? <span className="was">${p.was.toFixed(2)}</span> : null}${p.price.toFixed(2)}
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