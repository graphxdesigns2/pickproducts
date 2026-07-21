export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="logo" style={{ marginBottom: "12px" }}>
            <div className="mark">P</div>
            <div className="word" style={{ color: "var(--white)" }}>PickMy<span>Products</span>.com</div>
          </div>
          <p style={{ fontSize: "12.5px", lineHeight: 1.6, maxWidth: "280px" }}>
            A curated dropshipping storefront connecting you to trending products from trusted suppliers worldwide.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul><li><a href="#shop">All Products</a></li><li><a href="#shop">New Arrivals</a></li><li><a href="#shop">Best Sellers</a></li></ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul><li><a href="#support">Shipping Info</a></li><li><a href="#support">Returns</a></li><li><a href="#support">Track Order</a></li></ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul><li><a href="#about">About Us</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 PickMyProducts.com — All rights reserved.</span>
      </div>
    </footer>
  );
}
