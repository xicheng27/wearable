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
  unmetNeeds?: string[];
  isFallback?: boolean;
};

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
        {available.map(({ product, reasons, itemClassification, unmetNeeds, isFallback }) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            <div className="-mt-3 rounded-b-2xl border border-t-0 border-primary-100 bg-primary-50 px-5 pb-5 pt-6">
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
                Why it matches
              </p>
              <p className="mt-1 text-sm text-primary-950">
                {reasons.length > 0
                  ? reasons.join(". ")
                  : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${product.styleTags[0].toLowerCase()} style.`}
              </p>
              {isFallback && unmetNeeds && unmetNeeds.length > 0 && (
                <p className="mt-2 text-xs font-medium text-amber-700">
                  Closest match available — doesn&apos;t yet cover {unmetNeeds.slice(0, 2).join(", ").toLowerCase()}.
                </p>
              )}
            </div>
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
