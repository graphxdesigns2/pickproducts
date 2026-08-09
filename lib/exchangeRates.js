export async function getExchangeRates() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 86400 }, // Cache rates in Next.js for 24 hours
    });

    if (!res.ok) throw new Error("Failed to fetch rates");

    const data = await res.json();
    return data.rates; // Returns { CAD: 1.35, EUR: 0.92, GBP: 0.79, ... }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Fallback rates if API is unreachable
    return { USD: 1, CAD: 1.35, EUR: 0.92, GBP: 0.79 };
  }
}