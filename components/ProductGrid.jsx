import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products, search, onOpen, onQuickAdd }) {
  if (products.length === 0) {
    return (
      <div className="grid" id="productGrid">
        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px", color: "var(--text-soft)" }}>
          No products match "{search}". Try a different search.
        </div>
      </div>
    );
  }
  return (
    <div className="grid" id="productGrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOpen={onOpen} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}
