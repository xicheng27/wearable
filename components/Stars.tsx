"use client";

interface StarsProps {
  /** Current rating 0–5 (supports halves visually by rounding). */
  value: number;
  /** When set, stars become clickable buttons calling onChange. */
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

function StarIcon({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.93 5.34.46c.49.04.69.66.31.98l-4.05 3.52 1.21 5.23c.11.48-.41.86-.83.6L12 16.9l-4.63 2.82c-.42.26-.94-.12-.83-.6l1.21-5.23-4.05-3.52a.56.56 0 01.31-.98l5.34-.46L11.48 3.5z"
      />
    </svg>
  );
}

export default function Stars({ value, onChange, size = "md", className = "" }: StarsProps) {
  const cls = sizeClass[size];
  const rounded = Math.round(value);

  if (!onChange) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`}
        role="img"
        aria-label={`${value.toFixed(1)} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} filled={n <= rounded} className={cls} />
        ))}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === Math.round(value)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded p-1 text-amber-500 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <StarIcon filled={n <= value} className={cls} />
        </button>
      ))}
    </span>
  );
}
