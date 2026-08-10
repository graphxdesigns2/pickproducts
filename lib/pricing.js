export function getCartTotals(cart = []) {
  const subtotal = cart.reduce((s, c) => {
    const price = Number(c.price) || 0;
    const qty = Number(c.qty) || 1;
    return s + price * qty;
  }, 0);

  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}