"use client";
import { useEffect, useState } from "react";

export default function Carousel({ onOpen }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?limit=50&depth=1&where[carousel][equals]=true")
      .then((res) => res.json())
      .then((data) => setProducts(data.docs || []))
      .catch((err) => console.error("Failed to load carousel products:", err));
  }, []);

  if (products.length === 0) return null;

  // If items are too few to fill screen, tile them until we have at least 10 items per group
  const minItemsPerGroup = 10;
  const multiplier = Math.ceil(minItemsPerGroup / products.length);
  const filledProducts = Array(multiplier).fill(products).flat();

  return (
    <div className="marquee-wrap">
      <div className="marquee-track" id="marqueeTrack">
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} className="marquee-group">
            {filledProducts.map((p, i) => (
              <div
                className="chip-product"
                key={`${p.id}-${groupIndex}-${i}`}
                onClick={() => onOpen && onOpen(p.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="ci">
                  {p.image?.url ? (
                    <img
                      src={p.image.url}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    p.icon
                  )}
                </div>
                <div className="cn">{p.name}</div>
                <div className="cp">
                  ${typeof p.price === "number" ? p.price.toFixed(2) : "0.00"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}