import Link from "next/link";
import MatchBadges, { ConfidenceBadge } from "@/components/MatchBadges";
import OfficialProductLink from "@/components/OfficialProductLink";
import PriceDisplay from "@/components/PriceDisplay";
import ProductImage from "@/components/ProductImage";
import { getBrandName } from "@/data/products";
import { fitSignals, type DemoScenario } from "@/lib/demoScenarios";
import { recommendAdaptiveProducts } from "@/lib/recommendationEngine";
import type { RecommendationResult } from "@/types";

/**
 * The public demo "recommendation report". Everything on this page comes
 * from the real engine and real product data at render time — no result is
 * hand-picked, so the page is living proof the matching is data-driven and
 * the hard filters hold (including the honest limited-match state when the
 * catalogue can't satisfy a strict profile).
 */

/* --------------------------- Small visual pieces -------------------------- */

/** Real needs-matched share as a ring — never an invented composite score. */
function MatchRing({ pct }: { pct: number | null }) {
  const R = 30;
  const C = 2 * Math.PI * R;
  const filled = pct === null ? 0 : (pct / 100) * C;
  return (
    <div
      role="img"
      aria-label={
        pct === null
          ? "No functional needs to score in this profile"
          : `Needs matched: ${pct} percent`
      }
      className="relative h-20 w-20 flex-shrink-0"
    >
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle cx="36" cy="36" r={R} fill="none" strokeWidth="7" className="stroke-ink/10" />
        {pct !== null && (
          <circle
            cx="36"
            cy="36"
            r={R}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${C}`}
            className={pct === 100 ? "stroke-primary-700" : "stroke-amber-500"}
          />
        )}
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold leading-none text-ink">
          {pct === null ? "—" : `${pct}%`}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wide text-ink/50">needs</span>
      </span>
    </div>
  );
}

/** One labelled 0–100 signal bar with its evidence named beside the number. */
function SignalBar({ label, score, evidence }: { label: string; score: number; evidence: string }) {
  return (
    <div role="img" aria-label={`${label}: ${score} out of 100 — ${evidence}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-bold text-ink/75">{label}</span>
        <span className="text-xs font-extrabold tabular-nums text-ink">{score}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-primary-600"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-0.5 text-[11px] leading-4 text-ink/55">{evidence}</p>
    </div>
  );
}

function StatTile({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-4">
      <p className="font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-sm font-bold text-ink/70">{label}</p>
      {sub && <p className="mt-0.5 text-xs leading-4 text-ink/50">{sub}</p>}
    </div>
  );
}

function PassFail({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold ${
        pass ? "text-primary-800" : "text-amber-800"
      }`}
    >
      <span aria-hidden="true">{pass ? "✓" : "✗"}</span>
      {pass ? "Pass" : "Misses"}
      <span className="sr-only"> for {label}</span>
    </span>
  );
}

/* --------------------------------- Report --------------------------------- */

function coverageOf(result: RecommendationResult): number | null {
  const total = result.needsSatisfied.length + result.unmetNeeds.length;
  if (total === 0) return null;
  return Math.round((result.needsSatisfied.length / total) * 100);
}

/**
 * Judge one hard-filter column for one product, from the result's own
 * structured fields — category chips always pass (the engine pre-filters),
 * availability comes from shipsToLocation, and functional needs are checked
 * against the unmet-needs labels by keyword.
 */
function filterPass(result: RecommendationResult, filter: string): boolean {
  const f = filter.toLowerCase();
  if (/\bonly\b|everyday/.test(f)) return true; // category — strictly pre-filtered
  if (/available/.test(f)) return result.shipsToLocation;
  const key = f.match(/afo|orthotic|seated|wheelchair|sensory|closure|dexterity|assisted|caregiver|medical/)?.[0];
  if (!key) return result.unmetNeeds.length === 0;
  return !result.unmetNeeds.some((unmet) => unmet.toLowerCase().includes(key));
}

/** Plain-language "matched because" bullets from the structured result. */
function matchedBecause(result: RecommendationResult): string[] {
  const bullets = [
    ...result.needsSatisfied.map((need) => `Covers: ${need.toLowerCase()}`),
    ...(result.availabilityLabel ? [result.availabilityLabel] : []),
    ...result.preferencesSatisfied.slice(0, 2).map((pref) => `Matches preference: ${pref}`),
  ];
  return bullets.slice(0, 5);
}

/** "Watch out for" — unmet needs first, then the sharpest pre-purchase checks. */
function watchOutFor(result: RecommendationResult): string[] {
  return [
    ...result.unmetNeeds.map((need) => `Does not cover: ${need.toLowerCase()}`),
    ...result.checkBeforeBuying,
  ].slice(0, 4);
}

export default function DemoReport({ scenario }: { scenario: DemoScenario }) {
  const results = recommendAdaptiveProducts(scenario.input);
  const bestMatches = results.filter((r) => !r.isFallback);
  const alternatives = results.filter((r) => r.isFallback);
  const highConfidence = results.filter((r) => r.confidence === "high").length;
  const limited = bestMatches.length < 3;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Demo banner */}
      <div className="border-b border-primary-200 bg-primary-50 px-4 py-2.5 text-center text-sm font-semibold text-primary-900">
        Public demo report — a sample profile run through the real matching
        engine, not your data.{" "}
        <Link href="/quiz" className="underline underline-offset-2">
          Take the quiz for your own report
        </Link>
      </div>

      <header className="paper-texture border-b border-ink/10 bg-paper py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Demo recommendation report</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            {scenario.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">{scenario.persona}</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Profile summary */}
            <section
              aria-label="Sample profile"
              className="rounded-2xl border border-ink/10 bg-ivory/70 px-5 py-4"
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink/55">
                Profile
              </h2>
              <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {scenario.profile.map((row) => (
                  <div key={row.label} className="flex flex-wrap gap-x-2 text-sm leading-6">
                    <dt className="font-bold text-ink/60">{row.label}:</dt>
                    <dd className="text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Hard filters */}
            <section
              aria-label="Non-negotiable requirements"
              className="rounded-2xl border border-primary-200 bg-primary-50/60 px-5 py-4"
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-800">
                Non-negotiable requirements
              </h2>
              <p className="mt-1 text-xs leading-5 text-ink/60">
                Strict filters — never traded away for style, budget or variety.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {scenario.hardFilters.map((filter) => (
                  <li
                    key={filter}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1.5 text-sm font-bold text-white"
                  >
                    <span aria-hidden="true">✓</span>
                    {filter}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Match dashboard */}
        <section aria-label="Match summary" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            value={String(bestMatches.length)}
            label="Full matches"
            sub="Meet every requirement above"
          />
          <StatTile
            value={String(alternatives.length)}
            label="Partial / closest alternatives"
            sub="Clearly labelled with what they miss"
          />
          <StatTile
            value={String(highConfidence)}
            label="High confidence"
            sub="Confirmed by listed product data"
          />
          <StatTile
            value={scenario.input.location ?? "Global"}
            label="Availability enforced"
            sub="Exact matches must be available here"
          />
        </section>

        {/* Limited-match honesty */}
        {limited && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4"
          >
            <p className="text-sm font-bold text-ink">
              We found limited matches because this profile&apos;s requirements
              are highly specific.
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-ink/70">
              Rather than pad the page, we show only products that pass the core
              access needs — anything below that is labelled as a partial match
              or closest alternative with exactly what it misses. Accuracy
              matters more than quantity.
            </p>
          </div>
        )}

        {/* Truth cards */}
        <section aria-label="Recommended products" className="mt-10 grid gap-6">
          {results.map((result) => {
            const signals = fitSignals(result.product, scenario.input);
            const brand = getBrandName(result.product.brandId);
            const because = matchedBecause(result);
            const watch = watchOutFor(result);
            return (
              <article
                key={result.product.id}
                className="overflow-hidden rounded-3xl border border-ink/10 bg-paper"
              >
                <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                  <ProductImage
                    src={result.product.imageUrl}
                    alt={result.product.imageAlt}
                    source={brand}
                    className="aspect-[4/5] w-full md:aspect-auto md:h-full"
                  />
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <MatchBadges
                          isFallback={result.isFallback}
                          coverage={null}
                          confidence={result.confidence}
                          quality={result.matchQuality}
                        />
                        <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-ink">
                          {result.product.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-ink/60">
                          {brand} · {result.product.clothingType} ·{" "}
                          <PriceDisplay
                            price={result.product.price}
                            sourceCurrency={result.product.currency}
                            fallback={result.product.priceRange}
                          />
                        </p>
                      </div>
                      <MatchRing pct={coverageOf(result)} />
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/75">
                      {result.explanation}
                    </p>

                    <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary-800/80">
                          Matched because
                        </h4>
                        <ul className="mt-1.5 space-y-1">
                          {because.map((line) => (
                            <li key={line} className="flex gap-1.5 text-sm leading-6 text-ink/80">
                              <span aria-hidden="true" className="mt-0.5 text-primary-700">
                                ✓
                              </span>
                              {line}
                            </li>
                          ))}
                        </ul>

                        {watch.length > 0 && (
                          <>
                            <h4 className="mt-4 text-[11px] font-bold uppercase tracking-wide text-amber-800/90">
                              Watch out for
                            </h4>
                            <ul className="mt-1.5 space-y-1">
                              {watch.map((line) => (
                                <li key={line} className="flex gap-1.5 text-sm leading-6 text-ink/75">
                                  <span aria-hidden="true" className="mt-0.5 text-amber-700">
                                    !
                                  </span>
                                  {line}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      <div aria-label="Fit signals" className="grid content-start gap-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wide text-ink/55">
                          Fit signals{" "}
                          <span className="font-semibold normal-case tracking-normal text-ink/45">
                            (derived from listed product data)
                          </span>
                        </h4>
                        {signals.map((signal) => (
                          <SignalBar key={signal.id} {...signal} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <OfficialProductLink
                        href={result.product.productUrl}
                        exact={result.product.linkType === "exact-product"}
                        productId={result.product.id}
                        className="btn-primary px-5 py-2.5 text-sm"
                      >
                        {result.product.linkType === "exact-product"
                          ? "View official product →"
                          : "Visit brand site →"}
                      </OfficialProductLink>
                      <Link
                        href={`/products/${result.product.id}`}
                        className="btn-secondary px-5 py-2.5 text-sm"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Comparison table */}
        {results.length > 1 && (
          <section aria-labelledby="demo-compare-heading" className="mt-12">
            <h2 id="demo-compare-heading" className="font-display text-2xl font-semibold text-ink">
              Side-by-side comparison
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-paper">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/55">
                    <th scope="col" className="px-4 py-3">Product</th>
                    <th scope="col" className="px-4 py-3">Match</th>
                    <th scope="col" className="px-4 py-3">Needs matched</th>
                    <th scope="col" className="px-4 py-3">Confidence</th>
                    {scenario.hardFilters.map((filter) => (
                      <th scope="col" key={filter} className="px-4 py-3">
                        {filter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 6).map((result) => {
                    const pct = coverageOf(result);
                    return (
                      <tr key={result.product.id} className="border-b border-ink/5 last:border-0">
                        <th scope="row" className="max-w-[16rem] px-4 py-3 font-semibold text-ink">
                          {result.product.name}
                          <span className="block text-xs font-normal text-ink/55">
                            {getBrandName(result.product.brandId)}
                          </span>
                        </th>
                        <td className="px-4 py-3">
                          <MatchBadges
                            isFallback={result.isFallback}
                            coverage={null}
                            quality={result.matchQuality}
                          />
                        </td>
                        <td className="px-4 py-3 font-extrabold tabular-nums text-ink">
                          {pct === null ? "—" : `${pct}%`}
                        </td>
                        <td className="px-4 py-3">
                          <ConfidenceBadge level={result.confidence} />
                        </td>
                        {scenario.hardFilters.map((filter) => (
                          <td key={filter} className="px-4 py-3">
                            <PassFail pass={filterPass(result, filter)} label={filter} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs leading-5 text-ink/50">
              &quot;Misses&quot; means the item does not prove that requirement —
              it can only ever appear as a labelled partial match or closest
              alternative, never as a full match.
            </p>
          </section>
        )}

        {/* How we ranked these */}
        <section className="mt-10 rounded-2xl border border-primary-200 bg-primary-50/60 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-bold text-primary-900">How this report was built</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-ink/70">
            This sample profile was run through the same engine the quiz uses:
            the clothing category, accessibility needs and country availability
            are strict filters; fit, style and budget only re-rank what passes;
            and every score above names the product data it came from.
            Accessibility always outranks style.
          </p>
        </section>

        {/* CTAs */}
        <section aria-label="Next steps" className="mt-10 flex flex-wrap gap-3">
          <Link href="/quiz" className="btn-primary">
            Retake quiz
          </Link>
          <Link href="/passport" className="btn-secondary">
            Edit needs
          </Link>
          <Link href="/search" className="btn-secondary">
            View all matching products
          </Link>
          <Link href="/passport" className="btn-secondary">
            Save profile
          </Link>
        </section>

        <p className="mt-8 text-xs leading-5 text-ink/50">
          Demo profiles are illustrative. Product details, availability, prices
          and shipping may change — always confirm on the official retailer&apos;s
          site. This is a shopping aid, not medical advice.
        </p>
      </main>
    </div>
  );
}
