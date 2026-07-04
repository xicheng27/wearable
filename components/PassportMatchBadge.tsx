"use client";

import { useMemo } from "react";
import { ConfidenceBadge } from "@/components/MatchBadges";
import { usePassport } from "@/components/PassportProvider";
import { passportToRecommendationInput } from "@/lib/passport";
import { evaluateProductForInput } from "@/lib/recommendationEngine";
import type { Product } from "@/types";

/**
 * A compact "does this meet my passport?" line for product cards outside the
 * quiz results (saved items, browsing). Renders nothing when no passport
 * exists. States are conveyed with icon + text, never colour alone.
 */
export default function PassportMatchBadge({ product }: { product: Product }) {
  const { passport, hydrated } = usePassport();

  const input = useMemo(
    () => (passport ? passportToRecommendationInput(passport) : null),
    [passport]
  );
  const evaluation = useMemo(
    () => (input ? evaluateProductForInput(product, input) : null),
    [input, product]
  );

  if (!hydrated || !passport || !evaluation) return null;

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      {evaluation.meetsAllNeeds ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">
          <span aria-hidden="true">✓</span>
          Meets your passport
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          <span aria-hidden="true">≈</span>
          Check: {evaluation.unmetNeeds[0]?.toLowerCase() ?? "some needs"}
        </span>
      )}
      <ConfidenceBadge level={evaluation.confidence} />
    </div>
  );
}
