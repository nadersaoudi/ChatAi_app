/**
 * Codenix brand mark: code brackets fused with a lightning bolt —
 * "code at the speed of thought". Tile uses the theme gradient.
 */
export default function Logo({ size = "w-5 h-5" }: { size?: string }) {
  return (
    <svg
      className={size}
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <defs>
        <linearGradient id="codenix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--accent)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6.5" fill="url(#codenix-grad)" />
      {/* </> brackets */}
      <path
        d="M9.3 8.3 5.8 12l3.5 3.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7 8.3l3.5 3.7-3.5 3.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* lightning slash */}
      <path
        d="M13.35 6.2 10.35 12h1.75l-.65 2.8 3.05-4.1h-1.75l.6-2.7z"
        fill="#fff"
      />
    </svg>
  );
}
