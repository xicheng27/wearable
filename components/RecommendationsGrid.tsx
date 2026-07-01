"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CountryEmptyState from "@/components/CountryEmptyState";
import { productShipsToCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";
import type { Product, RecommendationResult } from "@/types";

type Recommendation = Partial<RecommendationResult> & {
  product: Product;
  reasons: string[];
  matchedTags?: string[];
  unmatchedTags?: string[];
};

type FeedbackValue = "saved" | "liked" | "disliked" | "not_relevant";

function RecommendationFeedback({ productId }: { productId: string }) {
  const [selected, setSelected] = useState<FeedbackValue | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(`xis-feedback-${productId}`);
    if (
      stored === "saved" ||
      stored === "liked" ||
      stored === "disliked" ||
      stored === "not_relevant"
    ) {
      setSelected(stored);
    }
  }, [productId]);

  function choose(value: FeedbackValue) {
    setSelected(value);
    window.localStorage.setItem(`xis-feedback-${productId}`, value);
  }

  const actions: { value: FeedbackValue; label: string }[] = [
    { value: "saved", label: "Save" },
    { value: "liked", label: "Like" },
    { value: "disliked", label: "Dislike" },
    { value: "not_relevant", label: "Not relevant" },
  ];

  return (
    <div className="mt-4 border-t border-primary-200 pt-3">
      <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
        Feedback
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => choose(action.value)}
            aria-pressed={selected === action.value}
            className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-bold ${
              selected === action.value
                ? "border-primary-800 bg-primary-800 text-white"
                : "border-primary-200 bg-paper text-primary-900 hover:border-primary-500"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-xs font-semibold text-primary-900" role="status">
          Feedback saved for later recommendation tuning.
        </p>
      )}
    </div>
  );
}

function MatchDetail({
  product,
  reasons,
  itemClassification,
  needsSatisfied,
  preferencesSatisfied,
  unmetNeeds,
  isFallback,
  explanation,
  availabilityLabel,
  matchedTags,
  unmatchedTags,
}: Recommendation) {
  const why =
    explanation && explanation.length > 0
      ? explanation
      : reasons.length > 0
        ? reasons.join(". ")
        : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${
            product.styleTags[0]?.toLowerCase() ?? "practical"
          } style.`;

  const shownMatchedTags =
    matchedTags && matchedTags.length > 0
      ? matchedTags
      : [...(needsSatisfied ?? []), ...(preferencesSatisfied ?? [])];

  // Constraint coverage is REAL: the share of your active access needs this item
  // meets (satisfied vs satisfied + still-unmet). Exact matches cover them all;
  // when no functional needs were set there is nothing to cover, so we hide the
  // percentage rather than invent one. No fabricated "match %" is ever shown.
  const satisfied = needsSatisfied ?? [];
  const unmet = unmetNeeds ?? [];
  const totalConstraints = satisfied.length + unmet.length;
  const coverage =
    totalConstraints > 0
      ? Math.round((satisfied.length / totalConstraints) * 100)
      : null;

  return (
    <div
      className={`-mt-3 rounded-b-2xl border border-t-0 px-5 pb-5 pt-6 ${
        isFallback ? "border-amber-200 bg-amber-50/60" : "border-primary-100 bg-primary-50"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
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
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-primary-800/80">
        Why this matches you
      </p>

      {itemClassification && itemClassification.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {itemClassification.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-semibold text-primary-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-2 text-sm leading-6 text-primary-950">{why}</p>

      {availabilityLabel && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-800">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          {availabilityLabel}
        </p>
      )}

      {shownMatchedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Needs covered
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {shownMatchedTags.slice(0, 8).map((need) => (
              <span
                key={need}
                className="rounded-md border border-primary-200 bg-paper px-2 py-0.5 text-xs font-semibold text-primary-900"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {unmatchedTags && unmatchedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Still check
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {unmatchedTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary-200 bg-transparent px-2 py-0.5 text-xs font-semibold text-primary-900/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {isFallback && unmetNeeds && unmetNeeds.length > 0 && (
        <p className="mt-3 text-xs font-medium text-amber-700">
          Doesn&apos;t yet cover: {unmetNeeds.slice(0, 2).join(", ").toLowerCase()}.
        </p>
      )}

      <RecommendationFeedback productId={product.id} />
    </div>
  );
}

export default function RecommendationsGrid({
  recommendations,
  showActions = true,
}: {
  recommendations: Recommendation[];
  showActions?: boolean;
}) {
  const { country } = useCountry();
  const available = recommendations.filter(({ product }) =>
    productShipsToCountry(product, country ?? GLOBAL)
  );

  if (available.length === 0) return <CountryEmptyState />;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {available.map((recommendation) => (
          <div key={recommendation.product.id} className="flex flex-col">
            <ProductCard product={recommendation.product} />
            <MatchDetail {...recommendation} />
          </div>
        ))}
      </div>

      {showActions && (
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className="btn-outline">
            Retake quiz
          </Link>
          <Link href="/search" className="btn-primary">
            Browse all clothing
          </Link>
        </div>
      )}
    </>
  );
}
