"use client";

import LocationEmptyState from "@/components/LocationEmptyState";
import { useShoppingLocation } from "@/components/LocationProvider";
import { productShipsTo } from "@/lib/shipping";
import { Product } from "@/types";

export default function ProductLocationGate({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const { selectedCountry, ready } = useShoppingLocation();
  if (!ready) return null;
  if (!productShipsTo(product, selectedCountry)) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <LocationEmptyState />
      </main>
    );
  }
  return <>{children}</>;
}

