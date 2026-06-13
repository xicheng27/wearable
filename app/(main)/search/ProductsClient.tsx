"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import ProductFilters, {
  filterValueLabel,
  productFilterKeys,
} from "@/components/ProductFilters";
import Reveal from "@/components/Reveal";
import { searchProducts } from "@/data/products";
import { clothingCategories } from "@/data/categories";

const quickNeeds = [
  { label: "Sensory-friendly", key: "feature", value: "sensory" },
  { label: "Wheelchair seated-fit", key: "feature", value: "seated" },
  { label: "One-handed dressing", key: "feature", value: "one-handed" },
];

const fashionStyles = [
  "Clean / minimal",
  "Smart casual",
  "Old money",
  "Streetwear",
  "Formal",
  "Casual",
  "Sporty",
  "Vintage",
  "Swedish style",
];

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const filterEntries = productFilterKeys
    .map((key) => ({ key, value: searchParams.get(key) ?? "" }))
    .filter((f) => f.value);

  const results = searchProducts({
    query: q || undefined,
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    need: searchParams.get("need") ?? undefined,
    feature: searchParams.get("feature") ?? undefined,
    style: searchParams.get("style") ?? undefined,
    budget: searchParams.get("budget") ?? undefined,
    size: searchParams.get("size") ?? undefined,
    gender: searchParams.get("gender") ?? undefined,
    availability: searchParams.get("availability") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    sg: searchParams.get("sg") ?? undefined,
  });

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  }

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileFiltersOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileFiltersOpen]);

  const showCategoryStrip = !q && filterEntries.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {q ? `Results for “${q}”` : "Browse adaptive clothing"}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Individual pieces from every adaptive brand, in one place.{" "}
            <Link href="/brands" className="font-medium text-primary-600 hover:text-primary-700">
              Prefer browsing by brand?
            </Link>
          </p>
          <div className="mt-5 max-w-xl">
            <SearchBar
              defaultValue={q}
              placeholder="Try 'magnetic shirt', 'wheelchair jeans', 'easy shoes'…"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickNeeds.map((n) => {
              const active = searchParams.get(n.key) === n.value;
              return (
                <button
                  key={n.label}
                  onClick={() => setParam(n.key, n.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-base font-medium transition-colors duration-200 ${
                    active
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-primary-400 hover:bg-primary-50"
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Shop by style
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {fashionStyles.map((style) => {
                const active = searchParams.get("style") === style;
                return (
                  <button
                    key={style}
                    onClick={() => setParam("style", style)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-base font-medium transition-colors duration-200 ${
                      active
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-primary-400 hover:bg-primary-50"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showCategoryStrip && (
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex gap-2">
              {clothingCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/clothing/${c.id}`}
                  className="flex-shrink-0 rounded-full bg-gray-50 px-3.5 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  {c.name.replace("Adaptive ", "").replace(" Adaptive", "")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <ProductFilters />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{results.length}</span>{" "}
                  {results.length === 1 ? "item" : "items"}
                </p>
                {filterEntries.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setParam(f.key, null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors duration-200 hover:bg-primary-100"
                    aria-label={`Remove filter: ${filterValueLabel(f.key, f.value)}`}
                  >
                    {filterValueLabel(f.key, f.value)}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>

              <button
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filters"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {filterEntries.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                    {filterEntries.length}
                  </span>
                )}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="card animate-fade-in px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-gray-900">No items found</h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Try fewer filters, or one of these popular searches.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["magnetic shirt", "wheelchair jeans", "easy shoes", "sensory t-shirt"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                      className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button onClick={() => router.push("/search")} className="btn-primary mt-6">
                  Clear everything
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product, i) => (
                  <Reveal key={product.id} delay={Math.min(i * 40, 280)} className="h-full">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          id="mobile-filters"
        >
          <div
            className="animate-fade-in fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-in-right relative ml-auto h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProductFilters />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              Show {results.length} {results.length === 1 ? "item" : "items"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
