# PickMyProducts.com — Next.js

## What changed
- **Structure**: one HTML file → pages/components (`app/page.js` + `components/*.jsx`)
- **State**: global `let cart = []` and DOM manipulation → React state via `context/CartContext.js` and `context/ToastContext.js`
- **Styling**: the exact same design system, ported into `app/globals.css` (no visual changes)
- **Data**: product catalog moved to `lib/products.js` — this is the file to eventually swap for real database calls

## Run it locally
```
npm install
npm run dev
```
Then open http://localhost:3000

## Project layout
```
app/
  layout.js          — fonts, global providers, metadata
  page.js             — home page, wires all sections + modal state together
  globals.css         — full design system (ported 1:1 from the original file)
components/
  Header.jsx, Hero.jsx, Marquee.jsx, CategoryRail.jsx,
  ProductGrid.jsx, ProductCard.jsx, FeatureStrip.jsx,
  SupportSection.jsx, Footer.jsx, CartDrawer.jsx,
  ProductModal.jsx, CheckoutModal.jsx, PaymentIcons.jsx
context/
  CartContext.js      — cart state (add/remove/change qty)
  ToastContext.js      — toast notifications
lib/
  products.js          — product catalog (swap for a database later)
  pricing.js            — shipping/tax/total calculation
```

## Next steps (per the roadmap)
1. Deploy this to Vercel and connect the domain
2. Add a database (Supabase/Neon) and replace `lib/products.js` with real queries
3. Wire up real PayPal checkout in `components/CheckoutModal.jsx`
