"use client";

import ProductCard from "@/components/ProductCard";
import LocationEmptyState from "@/components/LocationEmptyState";
import { useShoppingLocation } from "@/components/LocationProvider";
import { filterProductsForCountry } from "@/lib/shipping";
import { Product } from "@/types";

export default function LocationAwareProductGrid({
  products,
  className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  emptyFallback,
  showCount = false,
}: {
  products: Product[];
  className?: string;
  emptyFallback?: React.ReactNode;
  showCount?: boolean;
}) {
  const { selectedCountry, ready } = useShoppingLocation();
  if (!ready) {
    return <div className="h-48 animate-pulse rounded-2xl bg-sand/35" />;
  }

  const availableProducts = filterProductsForCountry(
    products,
    selectedCountry
  );

  if (availableProducts.length === 0) {
    return <>{emptyFallback ?? <LocationEmptyState />}</>;
  }

  return (
    <>
      {showCount && (
        <p className="mb-6 text-sm text-ink/60" aria-live="polite">
          <span className="font-bold text-ink">{availableProducts.length}</span>{" "}
          {availableProducts.length === 1 ? "item" : "items"} available for
          your location
        </p>
      )}
      <div className={className}>
        {availableProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

