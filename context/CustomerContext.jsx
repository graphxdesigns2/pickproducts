"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function so it can be called on mount and on demand
  const fetchCustomer = useCallback(async () => {
    try {
      // Added cache: "no-store" and timestamp to bypass Next.js / browser fetch caching
      const res = await fetch(`/api/customers/me?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();
      setCustomer(data.user || null);
    } catch (err) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  async function refreshCustomer() {
    await fetchCustomer();
  }

  async function login(email, password) {
    const res = await fetch("/api/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setCustomer(data.user);
      return { success: true };
    }
    return { success: false, error: data.errors?.[0]?.message || "Login failed" };
  }

  async function signup(email, password, name) {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (res.ok) {
      return login(email, password);
    }
    return { success: false, error: data.errors?.[0]?.message || "Signup failed" };
  }

  async function logout() {
    await fetch("/api/customers/logout", {
      method: "POST",
      credentials: "include",
    });
    setCustomer(null);
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        login,
        signup,
        logout,
        refreshCustomer, // Exported so components can trigger re-fetches
        setCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}