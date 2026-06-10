"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import {
  brandsForCategory,
  categoryFeaturesOfBrand,
  getCategoryById,
} from "@/data/categories";
import { Brand } from "@/types";

const budgetOptions = ["$", "$$", "$$$"];
const availabilityOptions = ["Online", "In stores"] as const;

function brandMatchesBudget(brand: Brand, budgets: string[]): boolean {
  if (budgets.length === 0) return true;
  return budgets.some((b) => brand.priceRange === b || brand.priceRange.includes("–"));
}

function brandMatchesAvailability(brand: Brand, availability: string[]): boolean {
  if (availability.length === 0) return true;
  const hasStores = brand.locations.some((l) => l.type !== "online-only");
  return availability.every((a) => (a === "In stores" ? hasStores : true));
}

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

  const allBrands = useMemo(() => brandsForCategory(category), [category]);

  const results = useMemo(() => {
    return allBrands
      .map((brand) => ({ brand, matched: categoryFeaturesOfBrand(category, brand) }))
      .filter(({ brand, matched }) => {
        const featureOk = activeFeatures.every((label) => {
          const keyword = category.features.find((f) => f.label === label)?.keyword ?? "";
          return matched.some((m) => m.toLowerCase().includes(keyword));
        });
        return (
          featureOk &&
          brandMatchesBudget(brand, activeBudgets) &&
          brandMatchesAvailability(brand, activeAvailability)
        );
      })
      .sort((a, b) => b.matched.length - a.matched.length);
  }, [allBrands, category, activeFeatures, activeBudgets, activeAvailability]);

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const hasFilters =
    activeFeatures.length > 0 || activeBudgets.length > 0 || activeAvailability.length > 0;

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
              <div className="mt-5 flex flex-wrap gap-1.5">
                {category.features.map((f) => (
                  <span key={f.label} className="badge border border-primary-100 bg-primary-50 text-primary-700">
                    {f.label}
                  </span>
                ))}
              </div>
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
                onClick={() => {
                  setActiveFeatures([]);
                  setActiveBudgets([]);
                  setActiveAvailability([]);
                }}
                className="ml-2 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison cards */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{results.length}</span>{" "}
          {results.length === 1 ? "brand makes" : "brands make"} adaptive {category.noun}
          {hasFilters ? " with those features" : ""}
        </p>

        {results.length === 0 ? (
          <div className="card animate-fade-in px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No exact matches</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              No brand combines all of those filters yet — try removing one.
            </p>
            <button
              onClick={() => {
                setActiveFeatures([]);
                setActiveBudgets([]);
                setActiveAvailability([]);
              }}
              className="btn-primary mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {results.map(({ brand, matched }, i) => {
              const hasStores = brand.locations.some((l) => l.type !== "online-only");
              return (
                <Reveal key={brand.id} delay={Math.min(i * 60, 240)}>
                  <article className="card card-hover overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-36 flex-shrink-0 sm:h-auto sm:w-44">
                        <Photo src={brand.image} alt="" className="h-full w-full" />
                        <div
                          className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold shadow-sm ring-1 ring-gray-900/5"
                          style={{ color: brand.heroColor }}
                          aria-hidden="true"
                        >
                          {brand.logo}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h2 className="text-lg font-semibold text-gray-900">{brand.name}</h2>
                          <span className="text-sm font-medium text-gray-500">{brand.priceRange}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Best for:</span>{" "}
                          {brand.whoItSuits[0]}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(matched.length > 0 ? matched : brand.adaptiveFeatures)
                            .slice(0, 4)
                            .map((f) => (
                              <span
                                key={f}
                                className="badge border border-primary-100 bg-primary-50 text-primary-700"
                              >
                                {f}
                              </span>
                            ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <svg className="h-3.5 w-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M3.6 9h16.8 M3.6 15h16.8 M12 3a14 14 0 010 18" />
                            </svg>
                            Online · ships {brand.shipping.countries.length > 4 ? "worldwide" : brand.shipping.countries.slice(0, 3).join(", ")}
                          </span>
                          {hasStores && (
                            <span className="inline-flex items-center gap-1">
                              <svg className="h-3.5 w-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              In stores
                            </span>
                          )}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link href={`/brands/${brand.id}`} className="btn-primary px-6 py-2.5 text-sm">
                            View brand
                          </Link>
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary px-6 py-2.5 text-sm"
                          >
                            Shop {category.noun}
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
