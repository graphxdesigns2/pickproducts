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

  // duplicate the list once for a seamless infinite scroll loop
  const list = [...products, ...products];

  return (
    <div className="marquee-wrap">
      <div className="marquee-track" id="marqueeTrack">
        {list.map((p, i) => (
          <div
            className="chip-product"
            key={p.id + "-" + i}
            onClick={() => onOpen && onOpen(p.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="ci">
              {p.image?.url ? (
                <img src={p.image.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                p.icon
              )}
            </div>
            <div className="cn">{p.name}</div>
            <div className="cp">${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}