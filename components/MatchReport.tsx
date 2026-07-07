import type { MatchReport as MatchReportData, ComparisonRow } from "@/lib/matchReport";

/**
 * "Fit Match Report" — the quantitative dashboard at the top of the results
 * page. It makes the matching legible: the profile it matched against, the
 * non-negotiable hard filters, headline score cards, per-dimension score bars,
 * a product comparison table, and a plain-language "how we calculated this".
 * Every number comes from lib/matchReport.ts (real match state, not invented).
 */

function barColor(value: number): string {
  if (value >= 85) return "bg-primary-700";
  if (value >= 70) return "bg-primary-500";
  if (value >= 50) return "bg-clay";
  return "bg-ink/30";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-ink/75">{label}</span>
        <span className="font-display text-sm font-semibold tabular-nums text-ink">{value}%</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/10"
        role="img"
        aria-label={`${label}: ${value} percent`}
      >
        <div className={`h-full rounded-full ${barColor(value)}`} style={{ width: `${Math.max(value, 3)}%` }} />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        accent ? "border-primary-200 bg-primary-50" : "border-ink/10 bg-paper"
      }`}
    >
      <p className="panel-eyebrow">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink/55">{sub}</p>}
    </div>
  );
}

const QUALITY_STYLE: Record<ComparisonRow["matchQuality"], string> = {
  exact: "bg-primary-700 text-white",
  strong: "bg-primary-100 text-primary-900",
  partial: "bg-amber-100 text-amber-900",
  alternative: "border border-ink/20 text-ink/70",
};

const QUALITY_LABEL: Record<ComparisonRow["matchQuality"], string> = {
  exact: "Exact",
  strong: "Strong",
  partial: "Partial",
  alternative: "Alternative",
};

function cell(value: number | null): string {
  return value === null ? "—" : `${value}%`;
}

export default function MatchReport({ report }: { report: MatchReportData }) {
  const { profile, hardFilters, summary, bars, comparison } = report;

  return (
    <section aria-labelledby="match-report-heading" className="rounded-3xl border border-ink/10 bg-ivory/70 p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Recommendation analysis</p>
          <h2 id="match-report-heading" className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
            Your Fit Match Report
          </h2>
        </div>
        <p className="text-sm text-ink/60">
          {summary.exactCount + summary.strongCount} strong match
          {summary.exactCount + summary.strongCount === 1 ? "" : "es"}
          {summary.alternativeCount > 0 ? ` · ${summary.alternativeCount} alternative${summary.alternativeCount === 1 ? "" : "s"}` : ""}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Profile + hard filters */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink/10 bg-paper p-4">
            <p className="panel-eyebrow">Matched against your profile</p>
            <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {profile.map((row) => (
                <div key={row.label} className="min-w-0">
                  <dt className="text-xs text-ink/55">{row.label}</dt>
                  <dd className="truncate text-sm font-semibold text-ink" title={row.value}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {hardFilters.length > 0 && (
            <div>
              <p className="panel-eyebrow">
                Non-negotiable filters
              </p>
              <p className="mt-1 text-xs leading-5 text-ink/55">
                Every recommendation below is required to pass these — they can never be traded off for style or budget.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {hardFilters.map((chip) => (
                  <li key={chip} className="chip-soft">
                    <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Summary cards + bars */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryCard label="Overall match" value={`${summary.overallQuality}%`} accent />
            <SummaryCard
              label="Hard requirements"
              value={`${summary.hardPassed}/${summary.hardTotal}`}
              sub="passed"
            />
            <SummaryCard
              label="Soft preferences"
              value={`${summary.softMatched}/${summary.softTotal}`}
              sub="matched"
            />
            <SummaryCard label="Data confidence" value={summary.confidenceLabel} />
            <SummaryCard label="Exact matches" value={String(summary.exactCount)} />
            <SummaryCard
              label="Missing fields"
              value={String(summary.missingFields)}
              sub="avg per item"
            />
          </div>

          {bars.length > 0 && (
            <div className="rounded-2xl border border-ink/10 bg-paper p-4">
              <p className="panel-eyebrow">Score breakdown</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {bars.map((bar) => (
                  <ScoreBar key={bar.key} label={bar.label} value={bar.value ?? 0} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      {comparison.length > 0 && (
        <div className="mt-6">
          <p className="panel-eyebrow">Product comparison</p>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-ink/10">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-paper text-left text-xs font-bold uppercase tracking-wide text-ink/55">
                  <th scope="col" className="px-3 py-2.5">Product</th>
                  <th scope="col" className="px-3 py-2.5">Category</th>
                  <th scope="col" className="px-3 py-2.5">Access</th>
                  <th scope="col" className="px-3 py-2.5">Location</th>
                  <th scope="col" className="px-3 py-2.5">Style</th>
                  <th scope="col" className="px-3 py-2.5">Budget</th>
                  <th scope="col" className="px-3 py-2.5">Confidence</th>
                  <th scope="col" className="px-3 py-2.5">Final</th>
                  <th scope="col" className="px-3 py-2.5">Match</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.id} className="border-t border-ink/10 odd:bg-paper/60">
                    <th scope="row" className="max-w-[200px] truncate px-3 py-2.5 text-left font-semibold text-ink" title={row.name}>
                      {row.name}
                    </th>
                    <td className="px-3 py-2.5 text-ink/70">{row.category}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink/80">{cell(row.breakdown.accessibility)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink/80">{cell(row.breakdown.location)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink/80">{cell(row.breakdown.style)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink/80">{cell(row.breakdown.budget)}</td>
                    <td className="px-3 py-2.5 capitalize text-ink/80">{row.confidence}</td>
                    <td className="px-3 py-2.5 font-display font-semibold tabular-nums text-ink">{row.finalScore}%</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${QUALITY_STYLE[row.matchQuality]}`}>
                        {QUALITY_LABEL[row.matchQuality]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-xs text-ink/45">Scroll sideways to see every column. “—” means that dimension wasn’t part of your profile.</p>
        </div>
      )}

      {/* How we calculated this */}
      <details className="group mt-6 rounded-2xl border border-ink/10 bg-paper px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-ink">
          How we calculated this
          <svg className="h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
          <p>
            We check <strong>hard requirements first</strong>: clothing type, location availability,
            your accessibility needs, and clothing range. Only products that pass every one of those
            can become an <strong>exact match</strong>.
          </p>
          <p>
            We then rank those by <strong>soft preferences</strong> — style, budget, data confidence
            and brand variety. These change the order, never whether an item qualifies.
          </p>
          <p>
            <strong>Closest alternatives</strong> only appear when there aren’t enough exact matches,
            and each one says exactly which need it doesn’t yet cover. Percentages reflect how much
            product evidence supports each dimension — they’re a shopping signal, not a guarantee.
          </p>
        </div>
      </details>
    </section>
  );
}
