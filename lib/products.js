export const PRODUCTS = [
  {id:1, name:"Owala 32oz", cat:"Kitchen", img src="/images/owala.png", price:39.99, rating:4.6, reviews:812, sizes:["24oz", "32oz"], desc:"I’m kind of a big deal. Why? Because I invented the whole sip-or-swig thing. Hold me upright and sip through my built-in straw, or tilt me back to swig through the wide-mouth opening. But that’s not all—one push and I pop open, one push and I’m locked tight (bye bye, leaks). Basically, I’m the overachiever of water bottles, and darn proud of it."},
  {id:2, name:"Smart Fitness Watch", cat:"Electronics", icon:"⌚", price:44.50, was:79.00, rating:4.4, reviews:530, sizes:["S/M","L/XL"], desc:"Heart-rate, sleep, and step tracking with a 10-day battery and swim-proof design."},
  {id:3, name:"Minimalist Leather Wallet", cat:"Accessories", icon:"👛", price:22.00, was:null, rating:4.8, reviews:1204, sizes:null, desc:"RFID-blocking slim wallet in full-grain leather. Holds up to 8 cards plus cash."},
  {id:4, name:"Ceramic Pour-Over Coffee Set", cat:"Home", icon:"☕", price:28.75, was:35.00, rating:4.7, reviews:342, sizes:null, desc:"Hand-glazed ceramic dripper and carafe set, 600ml capacity, includes 50 filters."},
  {id:5, name:"LED Desk Lamp w/ Wireless Charging", cat:"Home", icon:"💡", price:31.99, was:null, rating:4.3, reviews:198, sizes:null, desc:"Touch-dimmable LED lamp with built-in Qi wireless charging pad and USB port."},
  {id:6, name:"Oversized Cotton Hoodie", cat:"Apparel", icon:"🧥", price:26.40, was:38.00, rating:4.5, reviews:687, sizes:["S","M","L","XL","XXL"], desc:"Heavyweight brushed-cotton hoodie with a relaxed oversized fit and kangaroo pocket."},
  {id:7, name:"Portable Blender Bottle", cat:"Kitchen", icon:"🥤", price:19.99, was:null, rating:4.2, reviews:275, sizes:null, desc:"USB-rechargeable personal blender, 380ml, perfect for smoothies and shakes on the go."},
  {id:8, name:"Yoga Mat with Carry Strap", cat:"Fitness", icon:"🧘", price:24.99, was:32.00, rating:4.6, reviews:410, sizes:["4mm","6mm"], desc:"Non-slip TPE yoga mat, eco-friendly and lightweight, includes carry strap."},
  {id:9, name:"Stainless Steel Water Bottle", cat:"Fitness", icon:"🚰", price:16.50, was:null, rating:4.7, reviews:960, sizes:["500ml","750ml","1L"], desc:"Double-wall vacuum insulated bottle, keeps drinks cold 24h or hot 12h."},
  {id:10, name:"Canvas Weekender Bag", cat:"Accessories", icon:"👜", price:34.90, was:49.99, rating:4.4, reviews:156, sizes:null, desc:"Water-resistant canvas duffel with leather trim, fits airline carry-on sizing."},
  {id:11, name:"Aromatherapy Diffuser", cat:"Home", icon:"🕯️", price:21.30, was:null, rating:4.5, reviews:389, sizes:null, desc:"Ultrasonic essential oil diffuser with 7-color LED mood lighting and auto shut-off."},
  {id:12, name:"Polarized Sunglasses", cat:"Accessories", icon:"🕶️", price:18.75, was:27.00, rating:4.3, reviews:221, sizes:null, desc:"UV400 polarized lenses with a lightweight aluminum frame, unisex fit."},
  {id:13, name:"Mechanical Keyboard, Compact", cat:"Electronics", icon:"⌨️", price:52.00, was:69.99, rating:4.7, reviews:503, sizes:null, desc:"75% hot-swappable mechanical keyboard with RGB backlight and PBT keycaps."},
  {id:14, name:"Plush Weighted Blanket", cat:"Home", icon:"🛏️", price:41.20, was:58.00, rating:4.6, reviews:298, sizes:["7lb","12lb","15lb"], desc:"Breathable glass-bead weighted blanket for deeper, calmer sleep."},
  {id:15, name:"Kids' Building Block Set", cat:"Toys", icon:"🧱", price:23.99, was:null, rating:4.8, reviews:445, sizes:null, desc:"350-piece compatible building block set, ages 6+, includes storage tub."},
  {id:16, name:"Chef's Santoku Knife", cat:"Kitchen", icon:"🔪", price:27.60, was:36.00, rating:4.7, reviews:167, sizes:null, desc:"High-carbon stainless steel santoku knife with ergonomic pakkawood handle."},
];

export const CATEGORIES = ["All", ...new Set(PRODUCTS.map(p => p.cat))];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}
