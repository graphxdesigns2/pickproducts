export function getCartTotals(cart) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
