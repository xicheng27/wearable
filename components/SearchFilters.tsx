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
    <fieldset className="mb-6">
      <legend className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
        {label}
      </legend>
      <ul className="space-y-2">
        {options.map((opt) => {
          const checked = current.toLowerCase() === opt.toLowerCase();
          return (
            <li key={opt}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                  aria-label={`Filter by ${opt}`}
                />
                <span
                  className={`text-sm transition-colors ${
                    checked
                      ? "text-primary-700 font-medium"
                      : "text-gray-700 group-hover:text-gray-900"
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
    <aside
      className="w-full"
      aria-label="Search filters"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100 space-y-0">
        <CheckboxGroup
          label="Disability type"
          paramKey="disability"
          options={disabilityOptions}
        />
        <div className="pt-6">
          <CheckboxGroup
            label="Clothing type"
            paramKey="clothing"
            options={clothingTypesList}
          />
        </div>
        <div className="pt-6">
          <CheckboxGroup
            label="Adaptive feature"
            paramKey="feature"
            options={adaptiveFeaturesList}
          />
        </div>
        <div className="pt-6">
          <CheckboxGroup
            label="Ships to"
            paramKey="location"
            options={locationOptions}
          />
        </div>
      </div>
    </aside>
  );
}
