"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data.user || null);
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

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
      // Auto-login after signup
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
    <CustomerContext.Provider value={{ customer, loading, login, signup, logout }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}