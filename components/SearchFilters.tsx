"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { adaptiveFeaturesList, clothingTypesList } from "@/data/brands";

const disabilityOptions = [
  "Wheelchair users",
  "Mobility impairments",
  "Limb differences",
  "Sensory processing",
  "Fine motor difficulties",
  "Neurological conditions",
  "Stroke survivors",
  "Parkinson's disease",
  "Autism spectrum",
  "Visual impairments",
  "Chronic pain",
  "Elderly / age-related",
];

const locationOptions = ["USA", "Canada", "UK", "EU", "Australia"];

interface CheckboxGroupProps {
  label: string;
  paramKey: string;
  options: string[];
}

function CheckboxGroup({ label, paramKey, options }: CheckboxGroupProps) {
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
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </legend>
      <ul className="space-y-1">
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
                      : "text-gray-600 group-hover:text-gray-900"
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

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = ["disability", "clothing", "feature", "location"].some(
    (k) => searchParams.has(k)
  );

  function clearAll() {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="w-full" aria-label="Search filters">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary-600 transition-colors duration-150 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100 [&>*+*]:pt-6 [&>*:not(:last-child)]:pb-6">
        <CheckboxGroup
          label="Disability type"
          paramKey="disability"
          options={disabilityOptions}
        />
        <CheckboxGroup
          label="Clothing type"
          paramKey="clothing"
          options={clothingTypesList}
        />
        <CheckboxGroup
          label="Adaptive feature"
          paramKey="feature"
          options={adaptiveFeaturesList}
        />
        <CheckboxGroup
          label="Ships to"
          paramKey="location"
          options={locationOptions}
        />
      </div>
    </aside>
  );
}
