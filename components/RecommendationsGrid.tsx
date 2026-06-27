"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CountryEmptyState from "@/components/CountryEmptyState";
import { productShipsToCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";
import { Product } from "@/types";
import type { ProductRecommendation } from "@/lib/recommendations";

type Recommendation = {
  product: Product;
  reasons: string[];
  score?: number;
  metadata?: ProductRecommendation["metadata"];
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

function RecommendationDetails({
  product,
  reasons,
  score,
  metadata,
  matchedTags = [],
  unmatchedTags = [],
}: Recommendation) {
  const why =
    reasons.length > 0
      ? reasons.slice(0, 4).join(". ")
      : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${
          product.styleTags[0]?.toLowerCase() ?? "practical"
        } style.`;
  const targetGroups =
    metadata?.targetGroups?.filter((group) => group !== "Friend").slice(0, 3) ??
    product.bestFor.slice(0, 2);
  const features =
    metadata?.adaptiveFeatures?.slice(0, 4) ??
    product.adaptiveFeatures.slice(0, 4);

  return (
    <div className="-mt-3 rounded-b-2xl border border-t-0 border-primary-100 bg-primary-50 px-5 pb-5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
          Why it matches
        </p>
        {typeof score === "number" && (
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-primary-900">
            Match {score}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-primary-950">{why}</p>

      {targetGroups.length > 0 && (
        <p className="mt-3 text-sm leading-6 text-primary-950">
          <span className="font-bold">Best for: </span>
          {targetGroups.join(", ")}
        </p>
      )}

      {features.length > 0 && (
        <div
          className="mt-3 flex flex-wrap gap-1.5"
          aria-label="Recommended adaptive features"
        >
          {features.map((feature) => (
            <span
              key={feature}
              className="rounded-md border border-primary-200 bg-paper px-2.5 py-1 text-xs font-bold text-primary-900"
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-bold uppercase tracking-wider text-primary-800">
            Matched tags
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matchedTags.slice(0, 8).map((tag) => (
              <span key={tag} className="rounded-md bg-paper px-2 py-1 font-bold text-primary-900">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-primary-800">
            Not matched
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {unmatchedTags.length > 0 ? (
              unmatchedTags.slice(0, 6).map((tag) => (
                <span key={tag} className="rounded-md border border-primary-200 bg-transparent px-2 py-1 font-bold text-primary-900/70">
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-md bg-paper px-2 py-1 font-bold text-primary-900">
                All key tags matched
              </span>
            )}
          </div>
        </div>
      </div>

      <RecommendationFeedback productId={product.id} />
    </div>
  );
}

export default function RecommendationsGrid({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const { country } = useCountry();
  const available = recommendations.filter(({ product }) =>
    productShipsToCountry(product, country ?? GLOBAL)
  );

  if (available.length === 0) return <CountryEmptyState />;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {available.map(({ product, reasons, score, metadata, matchedTags, unmatchedTags }) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            <RecommendationDetails
              product={product}
              reasons={reasons}
              score={score}
              metadata={metadata}
              matchedTags={matchedTags}
              unmatchedTags={unmatchedTags}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/quiz" className="btn-outline">
          Retake quiz
        </Link>
        <Link href="/search" className="btn-primary">
          Browse all clothing
        </Link>
      </div>
    </>
  );
}
