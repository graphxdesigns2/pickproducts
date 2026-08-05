"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";

export default function Header({ search, onSearchChange, onOpenCart, onScrollToId }) {
  const { cartCount } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();

  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header>
      <div className="header-top-inner">
        {/* Changed from <a href="#home"> to <Link href="/"> */}
        <Link className="logo" href="/">
          <div className="word">PickMy<span>Products</span>.com</div>
        </Link>
        <div className="search-wrap">
          <input
            id="searchInput"
            type="text"
            placeholder="Search for products, brands, categories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => onScrollToId("support")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4" />
              <path d="M12 17h.01" />
            </svg>
          </button>
          <div className="account-link-wrap">
            <Link
              href="/login"
              className="icon-btn"
              aria-label={customer ? "Account" : "Log in"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <span className="account-tooltip">{customer ? "Account" : "Log in"}</span>
          </div>
          <button className="cart-btn" onClick={onOpenCart} aria-label="Open cart">
            <div className="cart-inner">
              <div className="sign">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </div>
              <div className="cart-text">Cart</div>
            </div>
            <span className="cart-count" style={{ display: cartCount > 0 ? "flex" : "none" }}>
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </button>
        </div>
      </div>
      <div className="header-nav-row">
        <nav className="main-nav">
          {/* Changed from <a href="#home"> to <Link href="/"> */}
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/#shop">Shop</Link>
          <Link href="/#support">Support</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>
    </header>
  );
}