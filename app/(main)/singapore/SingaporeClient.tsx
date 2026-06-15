"use client";

import { useMemo, useState } from "react";
import CatalogCard from "@/components/CatalogCard";
import Reveal from "@/components/Reveal";
import {
  adaptiveCatalog,
  adaptiveNeedMatchers,
  AdaptiveProduct,
  clothingBucket,
} from "@/data/adaptiveBrands";

function availabilityFacet(value: string): string {
  const v = value.toLowerCase();
  if (v.includes("local singapore")) return "Singapore local";
  if (v.includes("initiative")) return "Singapore initiative";
  if (v.includes("sgd store")) return "SGD store";
  if (v.includes("ships to singapore")) return "Ships to Singapore";
  if (v.includes("contact")) return "Contact to order";
  return value;
}

const genderOptions = ["Women", "Men", "Unisex", "Femme", "Masc"];

/** Interleave entries so brands are mixed, not grouped. */
function interleaveByBrand(items: AdaptiveProduct[]): AdaptiveProduct[] {
  const groups = new Map<string, AdaptiveProduct[]>();
  for (const p of items) {
    const list = groups.get(p.brandId) ?? [];
    list.push(p);
    groups.set(p.brandId, list);
  }
  const queues = Array.from(groups.values());
  const out: AdaptiveProduct[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const q of queues) {
      const next = q.shift();
      if (next) {
        out.push(next);
        added = true;
      }
    }
  }
  return out;
}

interface FacetGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FacetGroup({ label, options, selected, onToggle }: FacetGroupProps) {
  return (
    <fieldset className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-base font-semibold text-gray-900">{label}</legend>
      <ul className="space-y-0.5">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <li key={opt}>
              <label className="group -mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-400 text-primary-700 focus:ring-primary-400"
                />
                <span
                  className={`text-base ${
                    checked ? "font-medium text-primary-700" : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {opt}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export default function SingaporeClient() {
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [closures, setClosures] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const facets = useMemo(() => {
    const brandNames = Array.from(new Set(adaptiveCatalog.map((p) => p.brandName))).sort();
    const typeBuckets = Array.from(new Set(adaptiveCatalog.map(clothingBucket))).sort();
    const closureTypes = Array.from(
      new Set(adaptiveCatalog.map((p) => p.closureType).filter(Boolean) as string[])
    ).sort();
    const avail = Array.from(new Set(adaptiveCatalog.map((p) => availabilityFacet(p.singaporeAvailability)))).sort();
    return { brandNames, typeBuckets, closureTypes, avail };
  }, []);

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    const filtered = adaptiveCatalog.filter((p) => {
      if (brands.length && !brands.includes(p.brandName)) return false;
      if (types.length && !types.includes(clothingBucket(p))) return false;
      if (genders.length && !genders.some((g) => p.gender.toLowerCase().includes(g.toLowerCase())))
        return false;
      if (closures.length && !(p.closureType && closures.includes(p.closureType))) return false;
      if (availability.length && !availability.includes(availabilityFacet(p.singaporeAvailability)))
        return false;
      if (needs.length) {
        const matchers = adaptiveNeedMatchers.filter((m) => needs.includes(m.label));
        if (!matchers.some((m) => m.test(p))) return false;
      }
      return true;
    });
    return interleaveByBrand(filtered);
  }, [brands, types, genders, closures, availability, needs]);

  const activeCount =
    brands.length + types.length + genders.length + closures.length + availability.length + needs.length;

  function clearAll() {
    setBrands([]);
    setTypes([]);
    setGenders([]);
    setClosures([]);
    setAvailability([]);
    setNeeds([]);
  }

  const sidebar = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm font-medium text-primary-700 hover:text-primary-800"
          >
            Clear all
          </button>
        )}
      </div>
      <FacetGroup label="Brand" options={facets.brandNames} selected={brands} onToggle={toggle(brands, setBrands)} />
      <FacetGroup label="Clothing type" options={facets.typeBuckets} selected={types} onToggle={toggle(types, setTypes)} />
      <FacetGroup label="Gender" options={genderOptions} selected={genders} onToggle={toggle(genders, setGenders)} />
      <FacetGroup label="Closure type" options={facets.closureTypes} selected={closures} onToggle={toggle(closures, setClosures)} />
      <FacetGroup label="Singapore availability" options={facets.avail} selected={availability} onToggle={toggle(availability, setAvailability)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-line bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Singapore directory</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-gray-900 sm:text-4xl">
            Adaptive clothing you can get in Singapore
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-600">
            Local labels, brands that ship here, and Singapore initiatives — gathered in one place.
            Some entries are exact products; others are brand or category listings where
            product-level details are still being verified. Every card links to the official site.
          </p>

          {/* Adaptive-need quick filters */}
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Filter by need
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {adaptiveNeedMatchers.map((m) => {
                const active = needs.includes(m.label);
                return (
                  <button
                    key={m.label}
                    onClick={() => toggle(needs, setNeeds)(m.label)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-base font-medium transition-colors duration-200 ${
                      active
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-primary-400 hover:bg-primary-50"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">{sidebar}</div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-base text-gray-700">
                <span className="font-bold text-gray-900">{results.length}</span>{" "}
                {results.length === 1 ? "listing" : "listings"}
              </p>
              <button
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                Filters
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="card px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-900">No listings match those filters</p>
                <p className="mt-1.5 text-base text-gray-600">Try removing a filter or two.</p>
                <button onClick={clearAll} className="btn-primary mt-6">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i * 40, 240)} className="h-full">
                    <CatalogCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="animate-fade-in fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-in-right relative ml-auto h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebar}
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">
              Show {results.length} {results.length === 1 ? "listing" : "listings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
