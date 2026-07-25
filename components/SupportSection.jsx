const FAQS = [
  { cat: "Shipping", q: "How long does delivery take?", a: "Most orders arrive in 7–14 business days as they ship directly from our supplier network." },
  { cat: "Returns", q: "What's the return policy?", a: "30 days from delivery for unused items in original packaging. Refunds to original payment method." },
  { cat: "Payments", q: "Is checkout secure?", a: "Yes — all payment data is encrypted in transit and never stored on our servers." },
  { cat: "Contact", q: "Need to reach a human?", a: "Email support@pickmyproducts.store or use live chat, 7 days a week, 8am–10pm ET." },
];

export default function SupportSection() {
  return (
    <section className="section" id="support">
      <div className="section-head">
        <div>
          <h2>Support Center</h2>
          <p>Answers to the most common questions — or reach out directly.</p>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {FAQS.map((f) => (
          <div className="card" style={{ cursor: "default" }} key={f.q}>
            <div className="card-body" style={{ padding: "20px" }}>
              <div className="card-cat">{f.cat}</div>
              <div className="card-title" style={{ fontSize: "15px" }}>{f.q}</div>
              <p style={{ fontSize: "13px", color: "var(--text-soft)", lineHeight: 1.5 }}>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
