"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { brands } from "@/data/brands";
import {
  adaptiveFeatureOptions,
  availabilityOptions,
  budgetOptions,
  clothingTypeOptions,
  disabilityNeedOptions,
  dressingDifficultyOptions,
  fitOptions,
  products,
  sizeOptions,
  styleOptions,
} from "@/data/products";
import CountrySelector from "@/components/CountrySelector";

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
      trackEvent("filter_cleared", { filter: paramKey });
    } else {
      params.set(paramKey, value);
      trackEvent("filter_applied", { filter: paramKey });
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <details className="border-b border-ink/10 py-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold text-ink">
        {label}
        <span className="text-lg font-normal text-ink/40" aria-hidden="true">
          +
        </span>
      </summary>
      <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
        {options.map((option) => {
          const checked = current.toLowerCase() === option.toLowerCase();
          return (
            <li key={option}>
              <label className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 py-1 hover:bg-sand/45">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option)}
                  className="h-5 w-5 cursor-pointer rounded border-ink/25 text-primary-600 focus:ring-primary-400"
                />
                <span
                  className={`text-base ${
                    checked
                      ? "font-bold text-primary-800"
                      : "text-ink/75 group-hover:text-ink"
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
    if (checked) {
      params.delete(paramKey);
      trackEvent("filter_cleared", { filter: paramKey });
    } else {
      params.set(paramKey, "true");
      trackEvent("filter_applied", { filter: paramKey });
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl px-2 py-2 hover:bg-sand/45">
      <span className="text-base font-semibold text-ink/78">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
        className="h-5 w-5 rounded border-ink/25 text-primary-600 focus:ring-primary-400"
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
    "difficulty",
    "sensory",
    "seated",
    "oneHanded",
    "easyClosures",
    "wheelchair",
    "limitedDexterity",
    "prosthetic",
  ];
  const hasFilters = filterKeys.some((key) => searchParams.has(key));
  const brandOptions = brands
    .filter((brand) => products.some((product) => product.brandId === brand.id))
    .map((brand) => brand.name);

  function clearAll() {
    const query = searchParams.get("q");
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    trackEvent("filter_cleared", { filter: "all" });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="w-full" aria-label="Product filters">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="rounded-lg px-2 py-1 text-sm font-bold text-primary-800 underline underline-offset-2 hover:bg-primary-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-2">
        {/* Primary filters — most people start here, always visible. */}
        <FilterGroup
          label="Clothing type"
          paramKey="clothing"
          options={clothingTypeOptions}
          open
        />
        <FilterGroup
          label="Accessibility need"
          paramKey="disability"
          options={disabilityNeedOptions}
          open
        />
        <div className="border-b border-ink/10 py-4">
          <p className="mb-3 text-sm font-extrabold text-ink">
            Location availability
          </p>
          <CountrySelector className="w-full justify-between" />
        </div>

        <div className="py-2">
          <p className="mb-2 mt-2 text-sm font-extrabold text-ink">Quick needs</p>
          <ToggleFilter label="Sensory-friendly fabric" paramKey="sensory" />
          <ToggleFilter label="Seated fit" paramKey="seated" />
          <ToggleFilter label="One-handed dressing" paramKey="oneHanded" />
          <ToggleFilter label="Velcro / easy closures" paramKey="easyClosures" />
          <ToggleFilter label="Wheelchair users" paramKey="wheelchair" />
        </div>

        {/* Lower-priority filters tucked away so the rail isn't a wall on mobile. */}
        <details className="mt-2 border-t border-ink/10 pt-2" open={hasFilters}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 text-sm font-extrabold text-primary-800">
            More filters
            <span className="text-lg font-normal text-ink/40" aria-hidden="true">
              +
            </span>
          </summary>
          <FilterGroup label="Brand" paramKey="brand" options={brandOptions} />
          <FilterGroup
            label="Adaptive feature"
            paramKey="feature"
            options={adaptiveFeatureOptions}
          />
          <FilterGroup
            label="Dressing difficulty"
            paramKey="difficulty"
            options={dressingDifficultyOptions}
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
          <div className="pt-2">
            <ToggleFilter label="Arthritis / limited dexterity" paramKey="limitedDexterity" />
            <ToggleFilter label="Prosthetic or AFO access" paramKey="prosthetic" />
          </div>
        </details>
      </div>
    </aside>
  );
}
