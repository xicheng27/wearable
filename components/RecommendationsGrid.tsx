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
        {available.map(({ product, reasons }) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            <div className="-mt-3 rounded-b-2xl border border-t-0 border-primary-100 bg-primary-50 px-5 pb-5 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
                Why it matches
              </p>
              <p className="mt-1 text-sm text-primary-950">
                {reasons.length > 0
                  ? reasons.join(". ")
                  : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${product.styleTags[0].toLowerCase()} style.`}
              </p>
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
