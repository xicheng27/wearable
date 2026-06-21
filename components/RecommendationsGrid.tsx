"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CountryEmptyState from "@/components/CountryEmptyState";
import { productShipsToCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";
import { Product } from "@/types";

type Recommendation = {
  product: Product;
  reasons: string[];
  itemClassification?: string[];
  needsSatisfied?: string[];
  preferencesSatisfied?: string[];
  unmetNeeds?: string[];
  isFallback?: boolean;
  explanation?: string;
  availabilityLabel?: string;
};

function MatchDetail({
  product,
  reasons,
  itemClassification,
  needsSatisfied,
  preferencesSatisfied,
  unmetNeeds,
  isFallback,
  explanation,
}: Recommendation) {
  const why =
    explanation && explanation.length > 0
      ? explanation
      : reasons.length > 0
        ? reasons.join(". ")
        : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${
            product.styleTags[0]?.toLowerCase() ?? "practical"
          } style.`;

  return (
    <div
      className={`-mt-3 rounded-b-2xl border border-t-0 px-5 pb-5 pt-6 ${
        isFallback ? "border-amber-200 bg-amber-50/60" : "border-primary-100 bg-primary-50"
      }`}
    >
      {itemClassification && itemClassification.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
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

      <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
        {isFallback ? "Closest alternative" : "Why it matches"}
      </p>
      <p className="mt-1 text-sm leading-6 text-primary-950">{why}</p>

      {needsSatisfied && needsSatisfied.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Matches your needs
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {needsSatisfied.map((need) => (
              <span
                key={need}
                className="rounded-md border border-primary-200 bg-paper px-2 py-0.5 text-xs font-semibold text-primary-900"
              >
                ✓ {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {preferencesSatisfied && preferencesSatisfied.length > 0 && (
        <div className="mt-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Also matches
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {preferencesSatisfied.map((pref) => (
              <span
                key={pref}
                className="rounded-md bg-primary-100/70 px-2 py-0.5 text-xs font-medium text-primary-800"
              >
                {pref}
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
