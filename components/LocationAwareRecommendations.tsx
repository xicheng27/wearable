"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import LocationEmptyState from "@/components/LocationEmptyState";
import { useShoppingLocation } from "@/components/LocationProvider";
import { productShipsTo } from "@/lib/shipping";
import { Product } from "@/types";
import type { ProductRecommendation } from "@/lib/recommendations";

type Recommendation = {
  product: Product;
  reasons: string[];
  score?: number;
  metadata?: ProductRecommendation["metadata"];
};

function RecommendationDetails({
  product,
  reasons,
  score,
  metadata,
}: Recommendation) {
  const why =
    reasons.length > 0
      ? reasons.slice(0, 4).join(". ")
      : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${product.styleTags[0]?.toLowerCase() ?? "practical"} style.`;
  const targetGroups =
    metadata?.targetGroups?.filter((group) => group !== "Friend").slice(0, 3) ??
    product.bestFor.slice(0, 2);
  const features =
    metadata?.adaptiveFeatures?.slice(0, 4) ?? product.adaptiveFeatures.slice(0, 4);

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
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Recommended adaptive features">
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
    </div>
  );
}

export default function LocationAwareRecommendations({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const { selectedCountry, ready } = useShoppingLocation();
  if (!ready) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  const available = recommendations.filter(({ product }) =>
    productShipsTo(product, selectedCountry)
  );

  if (available.length === 0) return <LocationEmptyState />;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {available.map(({ product, reasons, score, metadata }) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            <RecommendationDetails
              product={product}
              reasons={reasons}
              score={score}
              metadata={metadata}
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

