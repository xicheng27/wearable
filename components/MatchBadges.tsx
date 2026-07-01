/**
 * Shared match badges used on both the quiz-results cards and the search-results
 * cards so the two surfaces speak the same user-facing language:
 *   • "Exact match" / "Closest alternative"
 *   • "Constraint coverage X%"  (real — never a fabricated match score)
 *
 * `coverage` is the share of the user's ACTIVE access needs the item meets. Pass
 * `null` when there are no functional needs to cover (normal browsing) so no
 * percentage is shown.
 */
export default function MatchBadges({
  isFallback,
  coverage,
  className = "",
}: {
  isFallback: boolean;
  coverage: number | null;
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
          Constraint coverage {coverage}%
        </span>
      )}
    </div>
  );
}
