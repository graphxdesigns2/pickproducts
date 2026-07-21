"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // {id, name, icon, price, size, qty}

  const addToCart = useCallback((product, size, qty) => {
    setCart(prev => {
      const key = product.id + "|" + (size || "");
      const existing = prev.find(c => (c.id + "|" + (c.size || "")) === key);
      if (existing) {
        return prev.map(c =>
          c === existing ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { id: product.id, name: product.name, icon: product.icon, price: product.price, size, qty }];
    });
  }, []);

  const changeQty = useCallback((idx, delta) => {
    setCart(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      if (next[idx].qty <= 0) next.splice(idx, 1);
      return next;
    });
  }, []);

  const removeItem = useCallback((idx) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
