"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCategoryById } from "@/data/categories";
import { getBrandOfProduct, productsInCategory } from "@/data/products";

const budgetOptions = ["$", "$$", "$$$"];
const availabilityOptions = ["Online", "In stores"] as const;

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
        active
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

export default function CategoryClient({ categoryId }: { categoryId: string }) {
  const category = getCategoryById(categoryId)!;
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [activeBudgets, setActiveBudgets] = useState<string[]>([]);
  const [activeAvailability, setActiveAvailability] = useState<string[]>([]);

  const allProducts = useMemo(() => productsInCategory(category.id), [category]);

  const results = useMemo(() => {
    return allProducts.filter((p) => {
      const featureOk = activeFeatures.every((label) => {
        const keyword = category.features.find((f) => f.label === label)?.keyword ?? "";
        return p.adaptiveFeatures.some((f) => f.toLowerCase().includes(keyword));
      });
      const budgetOk =
        activeBudgets.length === 0 || activeBudgets.includes(p.priceRange);
      const availOk = activeAvailability.every((a) =>
        p.availability.includes(a as "Online" | "In stores")
      );
      return featureOk && budgetOk && availOk;
    });
  }, [allProducts, category, activeFeatures, activeBudgets, activeAvailability]);

  const brandCount = new Set(results.map((p) => getBrandOfProduct(p).id)).size;

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const hasFilters =
    activeFeatures.length > 0 || activeBudgets.length > 0 || activeAvailability.length > 0;

  function clearAll() {
    setActiveFeatures([]);
    setActiveBudgets([]);
    setActiveAvailability([]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li><Link href="/" className="transition-colors hover:text-gray-700">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/search" className="transition-colors hover:text-gray-700">Clothing</Link></li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-gray-700" aria-current="page">{category.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
            <div className="animate-fade-up lg:col-span-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-3 max-w-xl leading-relaxed text-gray-500">
                {category.longDescription}
              </p>
            </div>
            <div className="animate-fade-up hidden lg:col-span-2 lg:block" style={{ animationDelay: "100ms" }}>
              <Photo src={category.image} alt="" className="aspect-[8/5] rounded-3xl shadow-soft" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-2.5 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Features
            </span>
            {category.features.map((f) => (
              <Chip
                key={f.label}
                label={f.label}
                active={activeFeatures.includes(f.label)}
                onClick={() => toggle(activeFeatures, setActiveFeatures)(f.label)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Budget
            </span>
            {budgetOptions.map((b) => (
              <Chip
                key={b}
                label={b}
                active={activeBudgets.includes(b)}
                onClick={() => toggle(activeBudgets, setActiveBudgets)(b)}
              />
            ))}
            <span className="ml-3 mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Availability
            </span>
            {availabilityOptions.map((a) => (
              <Chip
                key={a}
                label={a}
                active={activeAvailability.includes(a)}
                onClick={() => toggle(activeAvailability, setActiveAvailability)(a)}
              />
            ))}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="ml-2 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{results.length}</span>{" "}
          {results.length === 1 ? "item" : "items"}
          {brandCount > 0 && (
            <>
              {" "}from <span className="font-semibold text-gray-900">{brandCount}</span>{" "}
              {brandCount === 1 ? "brand" : "brands"}
            </>
          )}
          {hasFilters ? ", filtered" : ""}
        </p>

        {results.length === 0 ? (
          <div className="card animate-fade-in px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No exact matches</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              No item combines all of those filters yet — try removing one.
            </p>
            <button onClick={clearAll} className="btn-primary mt-6">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 50, 250)} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
