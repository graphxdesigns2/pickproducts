import { CATEGORIES } from "@/lib/products";

export default function CategoryRail({ activeCategory, onSelect }) {
  return (
    <div className="category-rail">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={`chip${c === activeCategory ? " active" : ""}`}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
