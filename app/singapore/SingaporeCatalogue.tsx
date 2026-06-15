"use client";

import { useMemo, useState } from "react";
import AdaptiveProductCard from "@/components/AdaptiveProductCard";
import LocationEmptyState from "@/components/LocationEmptyState";
import { useShoppingLocation } from "@/components/LocationProvider";
import {
  adaptiveBrands,
  adaptiveProducts,
  AdaptiveProduct,
} from "@/data/adaptiveBrands";
import { GLOBAL_LOCATION } from "@/lib/countries";

type Filters = {
  brand: string;
  productType: string;
  gender: string;
  need: string;
  closure: string;
  availability: string;
  sensory: boolean;
  assisted: boolean;
  seated: boolean;
  elderly: boolean;
};

const emptyFilters: Filters = {
  brand: "",
  productType: "",
  gender: "",
  need: "",
  closure: "",
  availability: "",
  sensory: false,
  assisted: false,
  seated: false,
  elderly: false,
};

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function mixedByBrand(products: AdaptiveProduct[]) {
  const groups = adaptiveBrands.map((brand) =>
    products.filter((product) => product.brandId === brand.id)
  );
  const mixed: AdaptiveProduct[] = [];
  const longest = Math.max(...groups.map((group) => group.length));
  for (let index = 0; index < longest; index += 1) {
    groups.forEach((group) => {
      if (group[index]) mixed.push(group[index]);
    });
  }
  return mixed;
}

const mixedProducts = mixedByBrand(adaptiveProducts);
const brandOptions = adaptiveBrands.map((brand) => brand.name);
const typeOptions = unique(adaptiveProducts.map((product) => product.productType));
const genderOptions = unique(adaptiveProducts.map((product) => product.gender));
const needOptions = unique(adaptiveProducts.flatMap((product) => product.bestFor));
const closureOptions = unique(
  adaptiveProducts.flatMap((product) =>
    product.closureType ? [product.closureType] : []
  )
);
const availabilityOptions = unique(
  adaptiveProducts.map((product) => product.singaporeAvailability)
);

function productText(product: AdaptiveProduct) {
  return [
    product.name,
    product.brandName,
    product.productType,
    product.category,
    product.gender,
    product.closureType ?? "",
    ...product.adaptiveFeatures,
    ...product.bestFor,
  ]
    .join(" ")
    .toLowerCase();
}

function includesAny(product: AdaptiveProduct, terms: string[]) {
  const text = productText(product);
  return terms.some((term) => text.includes(term));
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-lg border border-ink/15 bg-paper px-3 text-base text-ink focus:border-primary-500 focus:ring-primary-400"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SingaporeCatalogue() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const { selectedCountry, ready } = useShoppingLocation();

  const results = useMemo(
    () =>
      mixedProducts.filter((product) => {
        const text = productText(product);
        if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
        if (filters.brand && product.brandName !== filters.brand) return false;
        if (filters.productType && product.productType !== filters.productType) return false;
        if (filters.gender && product.gender !== filters.gender) return false;
        if (filters.need && !product.bestFor.includes(filters.need)) return false;
        if (filters.closure && product.closureType !== filters.closure) return false;
        if (
          filters.availability &&
          product.singaporeAvailability !== filters.availability
        ) {
          return false;
        }
        if (filters.sensory && !includesAny(product, ["sensory"])) return false;
        if (
          filters.assisted &&
          !includesAny(product, ["assisted dressing", "carers"])
        ) {
          return false;
        }
        if (
          filters.seated &&
          !includesAny(product, ["seated", "wheelchair"])
        ) {
          return false;
        }
        if (
          filters.elderly &&
          !includesAny(product, ["elderly", "older adult", "bed-bound"])
        ) {
          return false;
        }
        return true;
      }),
    [filters, query]
  );

  const hasFilters =
    query.trim() !== "" ||
    Object.values(filters).some((value) =>
      typeof value === "boolean" ? value : value !== ""
    );

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  if (
    ready &&
    selectedCountry !== GLOBAL_LOCATION &&
    selectedCountry !== "Singapore"
  ) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <LocationEmptyState />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-[#EEE5D5] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Singapore adaptive clothing guide</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[.98] tracking-[-.04em] text-ink sm:text-6xl">
            Clothing, collections and services available to Singapore.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/65">
            Browse products and useful adaptive clothing sources across brands,
            mixed together by dressing need rather than grouped by label.
          </p>
          <div className="mt-7 max-w-4xl rounded-xl border border-clay/25 bg-paper/80 px-5 py-4 text-base leading-7 text-ink/70">
            Some listings are exact products, while others are brand/category
            listings where product-level information is still being verified.
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section
          className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-5 sm:p-6"
          aria-labelledby="catalogue-filters"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="catalogue-filters" className="font-display text-2xl font-semibold text-ink">
                Find suitable clothing
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Search names, brands, features or who an item may suit.
              </p>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilters(emptyFilters);
                }}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-ink">Search catalogue</span>
            <div className="relative mt-1.5">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 'side opening', 'JAM', 'wheelchair' or 'carers'"
                className="h-14 w-full rounded-xl border border-ink/15 bg-paper pl-12 pr-4 text-base text-ink placeholder:text-ink/40 focus:border-primary-500 focus:ring-primary-400"
              />
            </div>
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectFilter label="Brand" value={filters.brand} options={brandOptions} onChange={(value) => updateFilter("brand", value)} />
            <SelectFilter label="Clothing type" value={filters.productType} options={typeOptions} onChange={(value) => updateFilter("productType", value)} />
            <SelectFilter label="Gender / fit" value={filters.gender} options={genderOptions} onChange={(value) => updateFilter("gender", value)} />
            <SelectFilter label="Adaptive need" value={filters.need} options={needOptions} onChange={(value) => updateFilter("need", value)} />
            <SelectFilter label="Closure type" value={filters.closure} options={closureOptions} onChange={(value) => updateFilter("closure", value)} />
            <SelectFilter label="Singapore availability" value={filters.availability} options={availabilityOptions} onChange={(value) => updateFilter("availability", value)} />
          </div>

          <fieldset className="mt-6 border-t border-ink/10 pt-5">
            <legend className="text-sm font-bold text-ink">Quick needs</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["sensory", "Sensory friendly"],
                ["assisted", "Assisted dressing"],
                ["seated", "Seated / wheelchair friendly"],
                ["elderly", "Elderly-friendly"],
              ].map(([key, label]) => (
                <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm font-semibold text-ink/70">
                  <input
                    type="checkbox"
                    checked={filters[key as keyof Pick<Filters, "sensory" | "assisted" | "seated" | "elderly">]}
                    onChange={(event) =>
                      updateFilter(
                        key as keyof Pick<Filters, "sensory" | "assisted" | "seated" | "elderly">,
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 rounded border-ink/25 text-primary-700 focus:ring-primary-400"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <div className="my-7 flex items-center justify-between gap-4">
          <p className="text-base text-ink/60" role="status" aria-live="polite">
            <strong className="text-ink">{results.length}</strong>{" "}
            {results.length === 1 ? "listing" : "listings"}
          </p>
          <p className="hidden text-sm text-ink/45 sm:block">
            Products from different brands are mixed together.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              No matching adaptive clothing found.
            </h2>
            <p className="mt-2 text-base text-ink/55">
              Try removing a filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilters(emptyFilters);
              }}
              className="btn-primary mt-6"
            >
              Show all listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <AdaptiveProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
