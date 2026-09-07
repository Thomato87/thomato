"use client";

/**
 * Thomato logo — a tomato whose fruit doubles as the closing "o" of the wordmark.
 *
 * Colour contract:
 *   ring + wordmark → currentColor, so the mark inherits the surface it sits on
 *                     and needs no light/dark variants.
 *   stem + leaves   → var(--color-brand), the house blue. The supplied artwork
 *                     shipped a lavender accent (#9184d9); it is recoloured here
 *                     so the mark and the page run on a single accent.
 *
 * Geometry is taken verbatim from the delivered SVGs, so proportions and the gap
 * between the final "t" and the fruit stay exactly as drawn.
 */

type MarkProps = {
  className?: string;
  /** Draw the ring on when the mark enters — used once, in the footer. */
  animate?: boolean;
};

export function LogoMark({ className, animate = false }: MarkProps) {
  return (
    <svg
      viewBox="10 1 44 63"
      className={className}
      role="img"
      aria-label="Thomato"
      fill="none"
    >
      <circle
        className={animate ? "logo-ring logo-ring--draw" : "logo-ring"}
        cx="32"
        cy="41"
        r="18"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        transform="rotate(-90 32 41)"
      />
      <g className="logo-sprig" stroke="var(--color-brand)" strokeWidth="5" strokeLinecap="round">
        <path d="M32 23 L32 12" />
        <path className="logo-leaf-l" d="M31 14 L18 7" />
        <path className="logo-leaf-r" d="M33 14 L46 7" />
      </g>
    </svg>
  );
}

type WordmarkProps = {
  className?: string;
  animate?: boolean;
};

export function LogoWordmark({ className, animate = false }: WordmarkProps) {
  return (
    <svg
      viewBox="-318 -82 376 84"
      className={className}
      role="img"
      aria-label="thomato"
      fill="none"
    >
      <text
        x="0"
        y="0"
        textAnchor="end"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif"
        fontSize="100"
        fontWeight="500"
        letterSpacing="-4"
      >
        thomat
      </text>
      <circle
        className={animate ? "logo-ring logo-ring--draw" : "logo-ring"}
        cx="27"
        cy="-27"
        r="21.5"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        transform="rotate(-90 27 -27)"
      />
      <g className="logo-sprig" stroke="var(--color-brand)" strokeWidth="11" strokeLinecap="round">
        <path d="M27 -50.7 L27 -65.2" />
        <path className="logo-leaf-l" d="M25.7 -62.6 L8.6 -71.8" />
        <path className="logo-leaf-r" d="M28.3 -62.6 L45.4 -71.8" />
      </g>
    </svg>
  );
}
