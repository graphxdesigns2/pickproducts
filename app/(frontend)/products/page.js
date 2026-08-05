"use client";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { useSearchParams } from "next/navigation";

// Local fixed categories (add hardcoded categories here if needed, or leave empty)
const FIXED_CATEGORIES = [];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [activeCategories, setActiveCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productModalId, setProductModalId] = useState(null);

  useEffect(() => {
    fetch("/api/products?limit=100&depth=1")
      .then((res) => res.json())
      .then((data) => setProducts(data.docs || []))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const fromProducts = products.map((p) => p.cat?.name).filter(Boolean);
    return [...new Set([...FIXED_CATEGORIES, ...fromProducts])].sort();
  }, [products]);

  function getProductById(id) {
    return products.find((p) => p.id === id);
  }

  function toggleCategory(cat) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function clearFilters() {
    setActiveCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
    setSearch("");
  }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = [...products];

    if (activeCategories.length > 0) {
      items = items.filter((p) => activeCategories.includes(p.cat?.name));
    }
    if (q) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat?.name?.toLowerCase().includes(q)
      );
    }
    if (minPrice !== "") {
      items = items.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      items = items.filter((p) => p.price <= parseFloat(maxPrice));
    }

    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return items;
  }, [products, activeCategories, search, minPrice, maxPrice, sortBy]);

  function quickAdd(id) {
    const p = getProductById(id);
    if (!p) return;
    addToCart(p, p.sizes ? p.sizes[0] : null, 1);
    showToast(`Added ${p.name} to cart`);
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
      <Header
        search={search}
        onSearchChange={setSearch}
        onOpenCart={openCart}
        onScrollToId={() => {}}
      />

      <div className="products-page">
        <div className="products-page-header">
          <h1>All Products</h1>
          <p>{filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} found</p>
        </div>

        <div className="products-layout">
          <aside className="filter-panel">
            <div className="filter-block">
              <div className="filter-block-head">
                <h3>Categories</h3>
              </div>
              <div className="filter-options">
                {categories.map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={activeCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <div className="filter-block-head">
                <h3>Price</h3>
              </div>
              <div className="filter-price-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <button className="filter-clear" onClick={clearFilters}>
              Clear all filters
            </button>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>

            {loading ? (
              <div className="products-loading">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty">
                No products match your filters.
                <button className="filter-clear" onClick={clearFilters} style={{ marginTop: "12px" }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                search={search}
                onOpen={setProductModalId}
                onQuickAdd={quickAdd}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={openCheckout} />
      <ProductModal product={activeProduct} isOpen={!!activeProduct} onClose={closeAll} />
      <CheckoutModal isOpen={checkoutOpen} onClose={closeAll} />
    </>
  );
}