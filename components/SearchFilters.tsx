"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { brands } from "@/data/brands";
import {
  adaptiveFeatureOptions,
  availabilityOptions,
  budgetOptions,
  clothingTypeOptions,
  disabilityNeedOptions,
  fitOptions,
  products,
  sizeOptions,
  styleOptions,
} from "@/data/products";
import LocationButton from "@/components/LocationButton";

interface FilterGroupProps {
  label: string;
  paramKey: string;
  options: string[];
  open?: boolean;
}

function FilterGroup({
  label,
  paramKey,
  options,
  open = false,
}: FilterGroupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? "";

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (current.toLowerCase() === value.toLowerCase()) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <details className="border-b border-gray-100 py-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900">
        {label}
        <span className="text-lg font-normal text-gray-400" aria-hidden="true">
          +
        </span>
      </summary>
      <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
        {options.map((option) => {
          const checked = current.toLowerCase() === option.toLowerCase();
          return (
            <li key={option}>
              <label className="group flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                />
                <span
                  className={`text-sm ${
                    checked
                      ? "font-semibold text-primary-700"
                      : "text-gray-700 group-hover:text-gray-950"
                  }`}
                >
                  {option}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function ToggleFilter({
  label,
  paramKey,
}: {
  label: string;
  paramKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checked = searchParams.get(paramKey) === "true";

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) params.delete(paramKey);
    else params.set(paramKey, "true");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
        className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
      />
    </label>
  );
}

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterKeys = [
    "clothing",
    "brand",
    "disability",
    "feature",
    "style",
    "budget",
    "size",
    "fit",
    "availability",
    "sensory",
    "seated",
    "oneHanded",
  ];
  const hasFilters = filterKeys.some((key) => searchParams.has(key));
  const brandOptions = brands
    .filter((brand) => products.some((product) => product.brandId === brand.id))
    .map((brand) => brand.name);

  function clearAll() {
    const query = searchParams.get("q");
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="w-full" aria-label="Product filters">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-primary-700 underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-2">
        <FilterGroup
          label="Clothing type"
          paramKey="clothing"
          options={clothingTypeOptions}
          open
        />
        <FilterGroup label="Brand" paramKey="brand" options={brandOptions} open />
        <FilterGroup
          label="Accessibility need"
          paramKey="disability"
          options={disabilityNeedOptions}
          open
        />
        <FilterGroup
          label="Adaptive feature"
          paramKey="feature"
          options={adaptiveFeatureOptions}
        />
        <FilterGroup label="Style" paramKey="style" options={styleOptions} />
        <FilterGroup label="Budget" paramKey="budget" options={budgetOptions} />
        <FilterGroup label="Size" paramKey="size" options={sizeOptions} />
        <FilterGroup label="Gender / fit" paramKey="fit" options={fitOptions} />
        <FilterGroup
          label="Availability"
          paramKey="availability"
          options={availabilityOptions}
        />
        <div className="border-b border-gray-100 py-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">
            Shopping location
          </p>
          <LocationButton className="w-full justify-between" />
        </div>

        <div className="pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-900">
            Quick needs
          </p>
          <ToggleFilter label="Sensory-friendly" paramKey="sensory" />
          <ToggleFilter label="Wheelchair seated-fit" paramKey="seated" />
          <ToggleFilter label="One-handed dressing" paramKey="oneHanded" />
        </div>
      </div>
    </aside>
  );
}
