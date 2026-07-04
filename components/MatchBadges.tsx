import type { ConfidenceLevel } from "@/types";

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

export default function MatchBadges({
  isFallback,
  coverage,
  confidence,
  className = "",
}: {
  isFallback: boolean;
  coverage: number | null;
  confidence?: ConfidenceLevel;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          isFallback ? "bg-amber-100 text-amber-900" : "bg-primary-700 text-white"
        }`}
      >
        <span aria-hidden="true">{isFallback ? "≈" : "✓"}</span>
        {isFallback ? "Closest alternative" : "Exact match"}
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
