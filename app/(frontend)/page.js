"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryRail from "@/components/CategoryRail";
import ProductGrid from "@/components/ProductGrid";
import FeatureStrip from "@/components/FeatureStrip";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import CheckoutModal from "@/components/CheckoutModal";
import Carousel from "@/components/Carousel";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(id, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productModalId, setProductModalId] = useState(null);

useEffect(() => {
  fetch("/api/products?limit=100&depth=1")
    .then((res) => res.json())
    .then((data) => setProducts(data.docs || []))
    .catch((err) => console.error("Failed to load products:", err));
}, []);

  function getProductById(id) {
    return products.find((p) => p.id === id);
  }

const filteredProducts = useMemo(() => {
  const q = search.trim().toLowerCase();
  let items = products.filter(p => p.trending);
  items = items.filter(p => activeCategory === "All" || p.cat?.name === activeCategory);
  if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.cat?.name?.toLowerCase().includes(q));
  return items;
}, [search, activeCategory, products]);

function quickAdd(id) {
  const p = getProductById(id);
  if (!p) return;

  // Extract the image URL from Payload CMS structure
  const imageUrl =
    p.image?.url ||
    p.images?.[0]?.image?.url ||
    p.images?.[0]?.url ||
    p.featuredImage?.url ||
    (typeof p.image === "string" ? p.image : null);

  const productToCart = {
    ...p,
    name: p.name || p.title,
    image: imageUrl, // Guarantees a valid image URL string is attached
  };

  addToCart(productToCart, p.sizes ? p.sizes[0] : null, 1);
  showToast(`Added ${p.name || p.title} to cart`);
}

  function openCart() {
    setCartOpen(true);
  }
  function closeAll() {
    setCartOpen(false);
    setProductModalId(null);
    setCheckoutOpen(false);
  }
  function openCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  const activeProduct = productModalId ? getProductById(productModalId) : null;

  return (
    <>
      <div className="utility-bar">
	  <span className="dot"></span>
        <span>Free shipping over $50</span><span className="dot"></span>
        <span>24 hour responses</span><span className="dot"></span>
        <span>Secure checkout with Paypal / Google Pay / Apple Pay</span>
		<span className="dot"></span>
      </div>

      <Header
        search={search}
        onSearchChange={setSearch}
        onOpenCart={openCart}
        onScrollToId={scrollToId}
      />

      <Hero onSmoothScrollTo={smoothScrollTo} />
	  <Carousel onOpen={setProductModalId} />
      <CategoryRail activeCategory={activeCategory} onSelect={setActiveCategory} />

      <main className="section" id="shop">
        <div className="section-head">
          <div>
            <h2>Trending right now</h2>
            <p>Handpicked from our top-performing suppliers this week.</p>
          </div>
        </div>
        <ProductGrid
          products={filteredProducts}
          search={search}
          onOpen={setProductModalId}
          onQuickAdd={quickAdd}
        />
      </main>

      <FeatureStrip />
      <SupportSection />
      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={openCheckout}
      />

      <ProductModal
        product={activeProduct}
        isOpen={!!activeProduct}
        onClose={closeAll}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={closeAll}
      />
    </>
  );
}