"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";
import BrandCard from "@/components/BrandCard";
import { searchBrands } from "@/data/brands";

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const disability = searchParams.get("disability") ?? "";
  const clothing = searchParams.get("clothing") ?? "";
  const feature = searchParams.get("feature") ?? "";
  const location = searchParams.get("location") ?? "";

  const results = searchBrands({
    query: q || undefined,
    disabilityType: disability || undefined,
    clothingType: clothing || undefined,
    adaptiveFeature: feature || undefined,
    country: location || undefined,
  });

  const activeFilters = [
    disability && { key: "disability", label: disability },
    clothing && { key: "clothing", label: clothing },
    feature && { key: "feature", label: feature },
    location && { key: "location", label: `Ships to: ${location}` },
  ].filter(Boolean) as { key: string; label: string }[];

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    window.location.href = `/search?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
            {q ? `Results for "${q}"` : "Browse adaptive brands"}
          </h1>
          <div className="max-w-2xl">
            <SearchBar defaultValue={q} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SearchFilters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{results.length}</span>{" "}
                  {results.length === 1 ? "brand" : "brands"} found
                </p>
                {activeFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => removeFilter(f.key)}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 px-2.5 py-1 rounded-full hover:bg-primary-100 transition-colors"
                    aria-label={`Remove filter: ${f.label}`}
                  >
                    {f.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>

              <button
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filters"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No brands found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or removing some filters.
                </p>
                <a
                  href="/search"
                  className="btn-primary inline-block"
                >
                  Clear all filters
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
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
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-80 h-full bg-white shadow-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SearchFilters />
          </div>
        </div>
      )}
    </div>
  );
}
