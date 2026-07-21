export default function FeatureStrip() {
  return (
    <section className="strip" id="about">
      <div className="strip-inner">
        <div className="strip-item">
          <div className="ic">🌍</div>
          <div><h3>Global Sourcing</h3><p>Products shipped direct from vetted supplier partners worldwide.</p></div>
        </div>
        <div className="strip-item">
          <div className="ic">🔐</div>
          <div><h3>Secure by design</h3><p>Encrypted checkout with redundant, backed-up order storage.</p></div>
        </div>
        <div className="strip-item">
          <div className="ic">💳</div>
          <div><h3>Pay your way</h3><p>PayPal, Google Pay, or Apple Pay — all supported.</p></div>
        </div>
        <div className="strip-item">
          <div className="ic">🎧</div>
          <div><h3>Real support</h3><p>Live order help, 7 days a week.</p></div>
        </div>
      </div>
    </section>
  );
}
