"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adaptiveFeaturesList,
  clothingTypesList,
  disabilityOptionsList,
  shippingLocationsList,
} from "@/data/brands";

interface FilterGroupProps {
  label: string;
  paramKey: string;
  options: string[];
  defaultOpen?: boolean;
}

function FilterGroup({ label, paramKey, options, defaultOpen = false }: FilterGroupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? "";
  const [open, setOpen] = useState(defaultOpen || current !== "");

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (current.toLowerCase() === value.toLowerCase()) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }
    router.push(`/brands?${params.toString()}`);
  }

  return (
    <fieldset>
      <legend className="w-full">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-center justify-between py-1 text-left"
        >
          <span className="text-sm font-medium text-gray-900">
            {label}
            {current && (
              <span
                className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 align-middle"
                aria-label="Filter active"
              />
            )}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </legend>
      {open && (
        <ul className="animate-fade-in mt-2 space-y-0.5">
          {options.map((opt) => {
            const checked = current.toLowerCase() === opt.toLowerCase();
            return (
              <li key={opt}>
                <label className="group -mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 transition-colors focus:ring-primary-400"
                    aria-label={`Filter by ${opt}`}
                  />
                  <span
                    className={`text-sm transition-colors duration-150 ${
                      checked
                        ? "font-medium text-primary-700"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  >
                    {opt}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = ["disability", "clothing", "feature", "location", "price"].some(
    (k) => searchParams.has(k)
  );

  function clearAll() {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/brands?${params.toString()}`);
  }

  return (
    <aside className="w-full" aria-label="Search filters">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary-600 transition-colors duration-150 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100 [&>*+*]:pt-4 [&>*:not(:last-child)]:pb-4">
        <FilterGroup
          label="Disability type"
          paramKey="disability"
          options={disabilityOptionsList}
          defaultOpen
        />
        <FilterGroup
          label="Clothing type"
          paramKey="clothing"
          options={clothingTypesList}
        />
        <FilterGroup
          label="Adaptive feature"
          paramKey="feature"
          options={adaptiveFeaturesList}
        />
        <FilterGroup
          label="Ships to"
          paramKey="location"
          options={shippingLocationsList}
        />
      </div>
    </aside>
  );
}
