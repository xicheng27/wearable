"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";
import BrandCard from "@/components/BrandCard";
import Reveal from "@/components/Reveal";
import { searchBrands } from "@/data/brands";

export default function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const fromQuiz = searchParams.get("from") === "quiz";
  const disability = searchParams.get("disability") ?? "";
  const clothing = searchParams.get("clothing") ?? "";
  const feature = searchParams.get("feature") ?? "";
  const location = searchParams.get("location") ?? "";
  const price = searchParams.get("price") ?? "";

  const results = searchBrands({
    query: q || undefined,
    disabilityType: disability || undefined,
    clothingType: clothing || undefined,
    adaptiveFeature: feature || undefined,
    country: location || undefined,
    priceRange: price || undefined,
  });

  const activeFilters = [
    disability && { key: "disability", label: disability },
    clothing && { key: "clothing", label: clothing },
    feature && { key: "feature", label: feature },
    location && { key: "location", label: `Ships to: ${location}` },
    price && { key: "price", label: `Budget: ${price}` },
  ].filter(Boolean) as { key: string; label: string }[];

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {fromQuiz
              ? "Your matches"
              : q
                ? `Results for “${q}”`
                : "Browse adaptive brands"}
          </h1>
          {fromQuiz && (
            <p className="mt-1.5 text-sm text-gray-500">
              Based on your answers. Adjust the filters anytime to refine your matches.
            </p>
          )}
          <div className="mt-5 max-w-xl">
            <SearchBar defaultValue={q} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              <SearchFilters />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{results.length}</span>{" "}
                  {results.length === 1 ? "brand" : "brands"} found
                </p>
                {activeFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => removeFilter(f.key)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors duration-200 hover:bg-primary-100"
                    aria-label={`Remove filter: ${f.label}`}
                  >
                    {f.label}
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
                {activeFilters.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="card animate-fade-in px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-gray-900">No brands found</h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Try adjusting your search or removing some filters.
                </p>
                <button
                  onClick={() => router.push("/search")}
                  className="btn-primary mt-6"
                >
                  Clear all filters
                </button>
                <div className="mt-8 border-t border-gray-50 pt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-300">
                    Popular searches
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {["Sensory friendly", "Wheelchair", "Magnetic closures", "Footwear"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                        className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((brand, i) => (
                  <Reveal key={brand.id} delay={Math.min(i * 50, 300)} className="h-full">
                    <BrandCard brand={brand} />
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
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SearchFilters />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              Show {results.length} {results.length === 1 ? "brand" : "brands"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
