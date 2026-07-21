import { PRODUCTS } from "@/lib/products";

export default function Marquee() {
  // duplicate the list once for a seamless infinite scroll loop
  const list = [...PRODUCTS, ...PRODUCTS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track" id="marqueeTrack">
        {list.map((p, i) => (
          <div className="chip-product" key={p.id + "-" + i}>
            <div className="ci">{p.icon}</div>
            <div className="cn">{p.name}</div>
            <div className="cp">${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
