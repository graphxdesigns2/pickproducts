'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pickmyproducts_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('pickmyproducts_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  /**
   * Helper function to extract a clean image URL string
   * from any Payload CMS or standard product object structure.
   */
  const extractImageUrl = (product) => {
    if (!product) return null;

    const img =
      product.image ||
      product.featuredImage ||
      product.images?.[0]?.image ||
      product.images?.[0] ||
      product.icon;

    if (!img) return null;

    // Payload CMS Media Upload Object or Nesting
    if (typeof img === 'object' && img !== null) {
      return (
        img.url ||
        img.src ||
        (img.sizes && (img.sizes.thumbnail?.url || img.sizes.card?.url)) ||
        null
      );
    }

    // Direct String URL or Emoji
    if (typeof img === 'string') {
      return img;
    }

    return null;
  };

  /**
   * Helper function to normalize size parameter into a plain string/value
   */
  const extractSizeValue = (size) => {
    if (!size) return '';
    if (typeof size === 'object' && size !== null) {
      return size.size || size.name || size.label || size.id || '';
    }
    return String(size);
  };

  const addToCart = (product, selectedSize = null, qty = 1) => {
    if (!product) return;

    const imageUrl = extractImageUrl(product);
    const sizeValue = extractSizeValue(selectedSize || product.size);

    const newItem = {
      id: product.id,
      name: product.name || product.title || 'Product',
      price: Number(product.price) || 0,
      image: imageUrl,
      size: sizeValue,
      qty: Number(qty) || 1,
    };

    setCart((prevCart) => {
      // Find matching item by ID and size combination
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: updatedCart[existingIndex].qty + newItem.qty,
          image: imageUrl || updatedCart[existingIndex].image, // Preserve/update image if missing
        };
        return updatedCart;
      }

      return [...prevCart, newItem];
    });
  };

  const changeQty = (index, delta) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      if (!updatedCart[index]) return prevCart;

      const newQty = updatedCart[index].qty + delta;
      if (newQty <= 0) {
        return updatedCart.filter((_, i) => i !== index);
      }

      updatedCart[index] = {
        ...updatedCart[index],
        qty: newQty,
      };

      return updatedCart;
    });
  };

  const removeItem = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        changeQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}