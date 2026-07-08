"use client";

import { useState } from "react";
import RecommendationsGrid from "@/components/RecommendationsGrid";
import StrictMatchingToggle from "@/components/StrictMatchingToggle";
import type { RecommendationResult } from "@/types";

/**
 * Client wrapper that owns the "Strict needs matching" state for the results
 * page. Exact matches (all hard requirements met) always show; the closest
 * alternatives — partial / weaker matches from the engine's fallback tier —
 * are shown only when strict matching is turned off, with a clear heading that
 * explains each card flags what it does not cover.
 */
export default function StrictMatchingResults({
  exactMatches,
  fallbackMatches,
}: {
  exactMatches: RecommendationResult[];
  fallbackMatches: RecommendationResult[];
}) {
  const [strict, setStrict] = useState(true);
  const hasFallback = fallbackMatches.length > 0;
  const showFallback = hasFallback && !strict;

  return (
    <div>
      {(exactMatches.length > 0 || hasFallback) && (
        <StrictMatchingToggle
          strict={strict}
          onChange={setStrict}
          hiddenCount={hasFallback ? fallbackMatches.length : 0}
        />
      )}

      {exactMatches.length > 0 && (
        <section aria-labelledby="exact-matches-heading">
          <h2 id="exact-matches-heading" className="sr-only">
            Best matches
          </h2>
          <RecommendationsGrid
            recommendations={exactMatches}
            showActions={!showFallback}
          />
        </section>
      )}

      {hasFallback && strict && (
        <div
          className="mt-8 rounded-2xl border border-ink/10 bg-sand/30 px-5 py-4"
          role="status"
        >
          <p className="text-sm font-semibold text-ink">
            {fallbackMatches.length} close{" "}
            {fallbackMatches.length === 1 ? "match is" : "matches are"} hidden by
            strict matching.
          </p>
          <p className="mt-1 text-sm leading-6 text-ink/70">
            Turn off <span className="font-semibold">Strict needs matching</span>{" "}
            above to see partial matches that cover most — but not every — need.
            Each card states exactly what it does and does not cover.
          </p>
        </div>
      )}

      {showFallback && (
        <section aria-labelledby="closest-alternatives-heading" className="mt-14">
          <div className="mb-6 max-w-3xl">
            <h2
              id="closest-alternatives-heading"
              className="font-display text-2xl font-semibold text-ink"
            >
              Partial matches &amp; closest alternatives
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              These do not meet every need you chose, so they are the nearest
              options — partial matches still cover most of your needs; closest
              alternatives cover fewer. Each card states exactly what it does and
              does not cover.
            </p>
          </div>
          <RecommendationsGrid recommendations={fallbackMatches} />
        </section>
      )}
    </div>
  );
}
