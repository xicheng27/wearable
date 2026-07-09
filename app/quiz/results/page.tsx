import Link from "next/link";
import StrictMatchingResults from "@/components/StrictMatchingResults";
import ResultsViewedTracker from "@/components/ResultsViewedTracker";
import SignalMap from "@/components/SignalMap";
import MatchReport from "@/components/MatchReport";
import { buildSignalMap } from "@/lib/signalMap";
import { buildMatchReport } from "@/lib/matchReport";
import { expandShippingRegions } from "@/lib/countries";
import { findNearbyStores } from "@/lib/mapProvider";
import PassportSummary from "@/components/PassportSummary";
import {
  buildMatchSummary,
  classifyAdaptiveProfiles,
  recommendAdaptiveProducts,
} from "@/lib/recommendationEngine";
import { parseResultParams } from "@/lib/quiz/resultsInput";

interface QuizResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata = {
  title: "Your Adaptive Clothing Matches | Xi's",
  description:
    "Individual adaptive clothing recommendations matched to accessibility needs, style, location and budget.",
  // Personalised, query-string-driven results — not a stable indexable page.
  robots: { index: false, follow: true },
};

export default function QuizResultsPage({ searchParams }: QuizResultsPageProps) {
  // Shared parsing with the Adaptive Fit Passport, so a passport-generated
  // results link and a fresh quiz submission are interpreted identically.
  const { input, needs, clothing, styles, availability, otherNeeds, location } =
    parseResultParams(searchParams);

  // Whether the shopper is buying for someone else / with caregiver support —
  // wording below must not assume the reader is the wearer.
  const caregiverAssisted = input.caregiverInvolvement === "caregiver-assisted";
  const shoppingForSomeoneElse =
    input.targetGroup === "caregiver" || input.targetGroup === "elderly";

  const profiles = classifyAdaptiveProfiles(input);
  const summary = buildMatchSummary(input);
  // The engine strictly filters by the chosen clothing categories already, so
  // results never cross categories (unless the shopper picked "Not sure").
  const allResults = recommendAdaptiveProducts(input);
  const availabilityFiltered = availability.toLowerCase().includes("in-store")
    ? allResults.filter(({ product }) => product.availability.inStore)
    : allResults;
  const visibleResults = availabilityFiltered.length > 0 ? availabilityFiltered : allResults;
  const exactMatches = visibleResults.filter((result) => !result.isFallback);
  const fallbackMatches = visibleResults.filter((result) => result.isFallback);

  // Plain-language description of what the strict filters were, so an empty
  // state can say exactly what is missing instead of showing unrelated items.
  const strictParts: string[] = [];
  if (clothing.length > 0) strictParts.push(clothing.join(" / ").toLowerCase());
  const strictWhere = location ? ` in ${location}` : "";
  const needHighlights = Array.from(
    new Set(
      needs.filter((n) =>
        /wheelchair|seated|one-handed|sensory|caregiver|orthotic|afo|prosthetic|medical|dexterity/i.test(n)
      )
    )
  ).slice(0, 3);
  const strictFor = needHighlights.length
    ? ` for ${needHighlights.join(", ").toLowerCase()} needs`
    : "";
  const emptyStateMessage = `We couldn't find exact ${
    strictParts.length ? strictParts.join(", ") : "clothing"
  } matches${strictWhere}${strictFor} yet.`;

  // The shopper's active constraints, shown as chips so it's obvious every
  // answer is being respected.
  const rangeLabel =
    input.childrenTeen
      ? "Kids / teen"
      : input.genderRange === "womenswear"
        ? "Womenswear"
        : input.genderRange === "menswear"
          ? "Menswear"
          : input.genderRange === "gender_neutral"
            ? "Gender-neutral"
            : undefined;
  const activeConstraints = Array.from(
    new Set([
      ...(location ? [location] : []),
      ...clothing,
      ...needHighlights,
      ...(rangeLabel ? [rangeLabel] : []),
      ...styles.slice(0, 2),
      ...(input.budget ? [input.budget] : []),
    ])
  );

  const nearbyCountries = location
    ? Array.from(new Set([location, ...expandShippingRegions([location])]))
    : [];
  const nearbyStores = location ? findNearbyStores({ countries: nearbyCountries }) : null;

  const signalMap = buildSignalMap(searchParams);

  const shoppingFor = input.childrenTeen
    ? "Child or teen"
    : input.targetGroup === "elderly"
      ? "Older adult"
      : input.targetGroup === "caregiver"
        ? "Someone I care for"
        : "Myself";
  const matchReport = buildMatchReport(visibleResults, input, {
    shoppingFor,
    clothing,
    styles,
    location,
  });

  return (
    <div className="min-h-screen bg-ivory">
      <ResultsViewedTracker
        exactCount={exactMatches.length}
        fallbackCount={fallbackMatches.length}
        selectedNeeds={needs}
        selectedCategory={clothing.length > 0 ? clothing.join(", ") : null}
        selectedLocation={location || null}
      />
      <header className="paper-texture border-b border-ink/10 bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Your adaptive clothing results
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            {summary}
          </p>
          {profiles.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profiles.slice(0, 6).map((profile) => (
                <span
                  key={profile.id}
                  title={profile.description}
                  className="badge bg-primary-50 text-primary-800"
                >
                  {profile.label}
                </span>
              ))}
            </div>
          )}
          {activeConstraints.length > 0 && (
            <div className="mt-5 max-w-4xl rounded-2xl border border-ink/10 bg-ivory/70 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/55">
                Showing matches for
              </p>
              <ul className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
                {activeConstraints.map((constraint, index) => (
                  <li key={constraint} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-ink/30">
                        ·
                      </span>
                    )}
                    <span className="rounded-full border border-primary-200 bg-paper px-2.5 py-1 text-sm font-semibold text-primary-900">
                      {constraint}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(caregiverAssisted || shoppingForSomeoneElse) && (
            <p className="mt-4 max-w-3xl rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3 text-sm leading-6 text-ink/75">
              {caregiverAssisted
                ? "These picks prioritise assisted dressing — open backs, side openings and simpler fastenings — and the notes below are written for the wearer and whoever helps them dress."
                : "You're shopping for someone else, so the fit and comfort notes below are about the wearer, not the person reading this."}
            </p>
          )}
          <p className="mt-3 text-xs text-ink/50">
            We group your self-selected answers into shopping categories only. This
            is not a medical assessment or diagnosis.
          </p>
          <PassportSummary />
          {otherNeeds && (
            <div className="paper-panel mt-6 max-w-3xl rounded-[1.2rem_.5rem_1.2rem_1.2rem] px-5 py-4">
              <p className="font-hand text-xs font-semibold text-primary-700">
                What you added
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/70">{otherNeeds}</p>
            </div>
          )}
          {nearbyStores && nearbyStores.places.length > 0 && (
            <div className="mt-4 max-w-3xl rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-gray-700">
                {nearbyStores.places.length} demo stockist
                {nearbyStores.places.length === 1 ? "" : "s"} mapped near {location}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Sample locations from our directory, not a live store locator yet.{" "}
                <Link href="/map" className="font-semibold text-primary-700 underline">
                  See the map
                </Link>
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {visibleResults.length > 0 && (
          <div className="mb-8">
            <MatchReport report={matchReport} />
          </div>
        )}

        <SignalMap data={signalMap} />

        <div className="mt-12 mb-6 max-w-3xl">
          <p className="eyebrow">Matched for you</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
            Your recommended clothing pieces
          </h2>
          <p className="mt-2 text-base leading-7 text-ink/65">
            Ranked by your hard functional needs first, then body-zone fit,
            access, country availability, budget and style. Every card explains
            why it matched.
          </p>
        </div>

        {visibleResults.length === 0 && (
          <section
            aria-labelledby="no-matches-heading"
            className="rounded-3xl border border-amber-200 bg-amber-50/70 px-6 py-10 text-center"
          >
            <h2
              id="no-matches-heading"
              className="font-display text-2xl font-semibold text-ink"
            >
              {emptyStateMessage}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              Rather than show clothing that doesn&apos;t fit what you asked for,
              we&apos;d suggest broadening one filter and trying again:
            </p>
            <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm leading-6 text-ink/75">
              <li>• Add another clothing type, or choose “Not sure” to see all suitable categories.</li>
              {location && <li>• Switch your shopping region to Global to include international brands.</li>}
              <li>• Keep your access needs and relax a style or budget choice instead.</li>
            </ul>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/quiz" className="btn-primary">
                Adjust my answers
              </Link>
              <Link href="/search" className="btn-outline">
                Browse the catalog
              </Link>
            </div>
          </section>
        )}

        {exactMatches.length === 0 && fallbackMatches.length > 0 && (
          <div
            className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4"
            role="status"
          >
            <p className="text-sm font-bold text-ink">{emptyStateMessage}</p>
            <p className="mt-1 text-sm leading-6 text-ink/70">
              Turn off <span className="font-semibold">Strict needs matching</span>{" "}
              below to see the closest alternatives in your selected category and
              region — each card says exactly which of your needs it does not yet
              cover. Broadening one filter (clothing type, region, or one need)
              usually unlocks exact matches.
            </p>
          </div>
        )}

        {(exactMatches.length > 0 || fallbackMatches.length > 0) && (
          <StrictMatchingResults
            exactMatches={exactMatches}
            fallbackMatches={fallbackMatches}
          />
        )}
      </main>
    </div>
  );
}
