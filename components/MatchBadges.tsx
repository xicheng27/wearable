import type { ConfidenceLevel, MatchQuality } from "@/types";

/**
 * Shared match badges used on quiz-results, search-results and saved-item
 * cards so every surface speaks the same user-facing language:
 *   • "Exact match" / "Closest alternative"
 *   • "Needs matched X%" (real constraint coverage — never a fabricated score)
 *   • Confidence: how verifiable the match is (explicit data vs inferred)
 *
 * `coverage` is the share of the user's ACTIVE access needs the item meets.
 * Pass `null` when there are no functional needs to cover (normal browsing)
 * so no percentage is shown. Confidence is conveyed with text + a dot meter,
 * never colour alone.
 */

const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { label: string; dots: string; className: string }
> = {
  high: {
    label: "High confidence",
    dots: "●●●",
    className: "border-primary-300 bg-primary-50 text-primary-900",
  },
  medium: {
    label: "Medium confidence",
    dots: "●●○",
    className: "border-ink/20 bg-paper text-ink/75",
  },
  low: {
    label: "Low confidence",
    dots: "●○○",
    className: "border-amber-300 bg-amber-50 text-amber-900",
  },
};

export function ConfidenceBadge({
  level,
  className = "",
}: {
  level: ConfidenceLevel;
  className?: string;
}) {
  const meta = CONFIDENCE_META[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${meta.className} ${className}`}
    >
      <span aria-hidden="true" className="tracking-tighter">
        {meta.dots}
      </span>
      {meta.label}
    </span>
  );
}

/**
 * The four honest match tiers. Icon + text, never colour alone:
 * exact/strong passed every hard requirement (strong misses a minor
 * style/budget preference); partial ships and meets some needs;
 * alternative is the closest option when nothing better exists.
 */
const QUALITY_META: Record<
  MatchQuality,
  { label: string; icon: string; className: string }
> = {
  exact: { label: "Exact match", icon: "✓", className: "bg-primary-700 text-white" },
  strong: {
    label: "Strong match",
    icon: "✓",
    className: "bg-primary-100 text-primary-900 border border-primary-300",
  },
  partial: { label: "Partial match", icon: "≈", className: "bg-amber-100 text-amber-900" },
  alternative: {
    label: "Closest alternative",
    icon: "≈",
    className: "bg-amber-100 text-amber-900 border border-amber-300",
  },
};

export default function MatchBadges({
  isFallback,
  coverage,
  confidence,
  quality,
  className = "",
}: {
  isFallback: boolean;
  coverage: number | null;
  confidence?: ConfidenceLevel;
  /** Four-tier label; when absent, falls back to the binary exact/alternative. */
  quality?: MatchQuality;
  className?: string;
}) {
  const meta = QUALITY_META[quality ?? (isFallback ? "alternative" : "exact")];
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}
      >
        <span aria-hidden="true">{meta.icon}</span>
        {meta.label}
      </span>
      {coverage !== null && (
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
            coverage === 100
              ? "border-primary-200 bg-paper text-primary-800"
              : "border-amber-300 bg-paper text-amber-800"
          }`}
        >
          Needs matched {coverage}%
        </span>
      )}
      {confidence && <ConfidenceBadge level={confidence} />}
    </div>
  );
}
