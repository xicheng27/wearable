"use client";

import { useId, useState } from "react";
import { featureVisual, type FeatureIconId } from "@/lib/adaptiveFeatures";

/**
 * A compact, reusable visual for a single adaptive feature: a simple icon, the
 * feature name, and a very short explanation — so a shopper understands WHY an
 * item is adaptive in a couple of seconds without reading a paragraph. A
 * tooltip/popover (tap or keyboard focus) reveals a longer explanation.
 *
 * Accessibility: the icon is decorative (the name is always shown as text, so
 * meaning is never carried by the icon alone); the disclosure button is
 * keyboard operable and labels its expanded state.
 */

function FeatureGlyph({ id }: { id: FeatureIconId }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };
  switch (id) {
    case "magnetic":
      return (
        <svg {...common}>
          <path d="M7 4v7a5 5 0 0 0 10 0V4" />
          <path d="M4 4h6M14 4h6M7 8h3M14 8h3" />
        </svg>
      );
    case "touch-close":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 12h16M8 9h1M11 9h1M14 9h1" />
        </svg>
      );
    case "zipper":
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M9 5h6M9 8h6M9 11h6" />
          <rect x="10" y="13" width="4" height="6" rx="1.5" />
        </svg>
      );
    case "side-opening":
      return (
        <svg {...common}>
          <path d="M8 3h8l-1 18H9L8 3Z" />
          <path d="M8 6v14" strokeDasharray="2 2" />
        </svg>
      );
    case "seated-rise":
      return (
        <svg {...common}>
          <path d="M6 5h12v4l-1 12h-4l-1-8-1 8H7L6 9V5Z" />
          <path d="M6 9h12" strokeDasharray="2 2" />
        </svg>
      );
    case "open-back":
      return (
        <svg {...common}>
          <path d="M7 4h10l-1 4v13H8V8L7 4Z" />
          <path d="M12 6v15" strokeDasharray="2 2" />
        </svg>
      );
    case "afo-wide":
      return (
        <svg {...common}>
          <path d="M4 15c0-2 2-3 3.5-4.5L10 12h7a3 3 0 0 1 3 3v2H4Z" />
          <path d="M10 9l1.5 2M13 9l1.5 2" />
        </svg>
      );
    case "pull-on":
      return (
        <svg {...common}>
          <path d="M6 4h12v3l-2 14H8L6 7V4Z" />
          <path d="M6 7h12" />
        </svg>
      );
    case "wide-neck":
      return (
        <svg {...common}>
          <path d="M5 6l3-2h8l3 2-3 4v11H8V10L5 6Z" />
          <path d="M9 6c1.5 1.5 4.5 1.5 6 0" />
        </svg>
      );
    case "sensory":
      return (
        <svg {...common}>
          <path d="M4 12c3-4 13-4 16 0-3 4-13 4-16 0Z" />
          <circle cx="12" cy="12" r="2.2" />
        </svg>
      );
    case "generic":
    default:
      return (
        <svg {...common}>
          <path d="M12 3l2.5 5 5.5.8-4 4 1 5.5L12 15.8 6.5 18.3l1-5.5-4-4L9 8 12 3Z" />
        </svg>
      );
  }
}

export function AdaptiveFeatureBadge({ feature }: { feature: string }) {
  const { icon, short, detail } = featureVisual(feature);
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const showDetail = Boolean(detail) && detail !== short;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => showDetail && setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-expanded={showDetail ? open : undefined}
        aria-controls={showDetail ? detailId : undefined}
        title={detail}
        className={`flex min-h-11 w-full items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-left transition ${
          showDetail ? "hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300" : "cursor-default"
        }`}
      >
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <FeatureGlyph id={icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold leading-tight text-primary-950">
            {feature}
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-primary-800/80">
            {short}
          </span>
        </span>
        {showDetail && (
          <svg
            className={`h-4 w-4 flex-shrink-0 text-primary-700 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>
      {showDetail && open && (
        <p
          id={detailId}
          className="mt-1 rounded-xl border border-primary-100 bg-paper px-3 py-2 text-xs leading-relaxed text-ink/75"
        >
          {detail}
        </p>
      )}
    </div>
  );
}

/** A responsive grid of feature badges. Renders nothing when empty. */
export function AdaptiveFeatureBadges({ features }: { features: string[] }) {
  if (features.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {features.map((feature) => (
        <AdaptiveFeatureBadge key={feature} feature={feature} />
      ))}
    </div>
  );
}
