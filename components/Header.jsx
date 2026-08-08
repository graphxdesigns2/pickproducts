"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
export default function Header({ search, onSearchChange, onOpenCart, onScrollToId }) {
  const { cartCount } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileMenuOpen(false);
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header>
      <div className="header-top-inner">
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
          <div className="account-link-wrap">
            <Link
  href={customer ? "/account" : "/login"}
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
          <button
            className="hamburger-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className="header-nav-row">
        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/#shop">Shop</Link>
          <Link href="/#support">Support</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>

      <div
  className={`mobile-menu-overlay${mobileMenuOpen ? " open" : ""}`}
  onClick={closeMobileMenu}
></div>
<div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
  <div className="mobile-menu-head">
    <div className="word">PickMy<span>Products</span>.com</div>
    <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  </div>
  <nav className="mobile-nav">
    <Link href="/" onClick={closeMobileMenu}>Home</Link>
    <Link href="/products" onClick={closeMobileMenu}>Products</Link>
    <Link href="/#shop" onClick={closeMobileMenu}>Shop</Link>
    <Link href="/#support" onClick={closeMobileMenu}>Support</Link>
    <Link href="/#about" onClick={closeMobileMenu}>About</Link>
    <Link href="/login" onClick={closeMobileMenu}>
      {customer ? "Account" : "Log in"}
    </Link>
  </nav>
</div>
    </header>
  );
}