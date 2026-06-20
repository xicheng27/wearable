"use client";

import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { filterProductsByCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  emptyMessage = "Product listings here are being added.",
}: ProductGridProps) {
  const { country, setCountry } = useCountry();
  const visibleProducts = filterProductsByCountry(products, country);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-gray-600">
        {emptyMessage}
      </div>
    );
  }

  if (visibleProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          No products currently available for your location.
        </h2>
        <button
          type="button"
          onClick={() => setCountry(GLOBAL)}
          className="btn-primary mt-6 inline-block"
        >
          View globally available items
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
