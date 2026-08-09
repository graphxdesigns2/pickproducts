// context/CurrencyContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext({
  currency: "USD",
  rates: { USD: 1, CAD: 1.35, EUR: 0.92, GBP: 0.79 },
  formatDisplayPrice: (price) => `$${Number(price || 0).toFixed(2)}`,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1, CAD: 1.35, EUR: 0.92, GBP: 0.79 });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) setRates(data.rates);
      })
      .catch(() => console.warn("Using fallback exchange rates"));
  }, []);

  function formatDisplayPrice(priceInUSD) {
    const rate = rates[currency] || 1;
    const amount = (Number(priceInUSD) || 0) * rate;

    return new Intl.NumberFormat(currency === "EUR" ? "de-DE" : "en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatDisplayPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: "USD",
      formatDisplayPrice: (price) => `$${Number(price || 0).toFixed(2)}`,
      setCurrency: () => {},
    };
  }
  return context;
}