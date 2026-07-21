export function PayPalMark() {
  return (
    <svg width="62" height="20" viewBox="0 0 62 20" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="15" fontFamily="Helvetica Neue, Arial, sans-serif" fontStyle="italic" fontWeight="800" fontSize="15">
        <tspan fill="#003087">Pay</tspan><tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}

export function GooglePayMark() {
  return (
    <svg width="56" height="20" viewBox="0 0 56 20" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0,2)">
        <path d="M7.6 8.18v3.35h4.63c-.2 1.08-.8 2-1.72 2.6v2.16h2.78c1.62-1.5 2.56-3.7 2.56-6.31 0-.61-.06-1.2-.15-1.76z" fill="#4285F4" />
        <path d="M7.6 16.6c2.32 0 4.27-.77 5.69-2.09l-2.78-2.16c-.77.52-1.76.83-2.91.83-2.24 0-4.13-1.51-4.81-3.55H0v2.23A8.4 8.4 0 0 0 7.6 16.6z" fill="#34A853" />
        <path d="M2.79 9.63a5.04 5.04 0 0 1 0-3.26V4.14H0a8.4 8.4 0 0 0 0 7.72z" fill="#FBBC05" />
        <path d="M7.6 3.02c1.26 0 2.4.43 3.29 1.28l2.47-2.47C11.86.66 9.92 0 7.6 0A8.4 8.4 0 0 0 0 4.14l2.79 2.23c.68-2.04 2.57-3.55 4.81-3.55z" fill="#EA4335" />
      </g>
      <text x="18" y="15" fontFamily="Roboto, Helvetica Neue, Arial, sans-serif" fontWeight="500" fontSize="13" fill="#5f6368">Pay</text>
    </svg>
  );
}

export function ApplePayMark() {
  return (
    <svg width="50" height="20" viewBox="0 0 50 20" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0,2.5) scale(0.65)" fill="currentColor">
        <path d="M6.87 2.1c-.55.65-1.44 1.16-2.32 1.09-.11-.87.32-1.8.82-2.37C5.92.14 6.9-.32 7.7-.36c.09.9-.26 1.79-.83 2.46z" />
        <path d="M7.69 3.36c-1.28-.08-2.37.73-2.98.73-.62 0-1.55-.69-2.56-.67-1.32.02-2.54.77-3.21 1.95-1.38 2.38-.36 5.9.98 7.84.65.95 1.43 2 2.46 1.96 1-.04 1.36-.65 2.55-.65 1.2 0 1.51.65 2.56.63 1.06-.02 1.73-.96 2.38-1.92.75-1.09 1.05-2.15 1.07-2.2-.02-.01-2.05-.79-2.07-3.13-.02-1.96 1.6-2.9 1.67-2.95-.92-1.35-2.35-1.5-2.85-1.53z" />
      </g>
      <text x="14" y="15" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="600" fontSize="14" fill="currentColor">Pay</text>
    </svg>
  );
}

export const PAYMENT_METHODS = [
  { id: "paypal", label: "PayPal", Icon: PayPalMark },
  { id: "gpay", label: "Google Pay", Icon: GooglePayMark },
  { id: "apay", label: "Apple Pay", Icon: ApplePayMark },
];
