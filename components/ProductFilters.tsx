"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { brands, disabilityOptionsList, shippingLocationsList } from "@/data/brands";
import { clothingCategories } from "@/data/categories";

export interface FilterOption {
  label: string;
  value: string;
}

const toOptions = (values: string[]): FilterOption[] =>
  values.map((v) => ({ label: v, value: v }));

export const productFeatureOptions: FilterOption[] = [
  { label: "Magnetic closures", value: "magnetic" },
  { label: "Velcro fastenings", value: "velcro" },
  { label: "Easy zips", value: "zip" },
  { label: "Slip-on", value: "slip-on" },
  { label: "Seated fit", value: "seated" },
  { label: "Open-back", value: "open-back" },
  { label: "Side-opening", value: "side" },
  { label: "One-handed dressing", value: "one-handed" },
  { label: "Easy pull-on", value: "pull-on" },
  { label: "Tag-free", value: "tag-free" },
  { label: "Flat seams", value: "flat" },
  { label: "Wide fit", value: "wide" },
  { label: "Catheter access", value: "catheter" },
];

const styleOptions = toOptions([
  "Swedish style",
  "Clean / minimal",
  "Old money",
  "Streetwear",
  "Formal",
  "Casual",
  "Sporty",
  "Vintage",
  "Smart casual",
]);

export const productFilterGroups: {
  label: string;
  paramKey: string;
  options: FilterOption[];
}[] = [
  {
    label: "Clothing type",
    paramKey: "category",
    options: clothingCategories.map((c) => ({
      label: c.name.replace("Adaptive ", "").replace(" Adaptive", ""),
      value: c.id,
    })),
  },
  {
    label: "Accessibility need",
    paramKey: "need",
    options: toOptions(disabilityOptionsList),
  },
  { label: "Adaptive feature", paramKey: "feature", options: productFeatureOptions },
  {
    label: "Brand",
    paramKey: "brand",
    options: brands.map((b) => ({ label: b.name, value: b.id })),
  },
  { label: "Style", paramKey: "style", options: styleOptions },
  { label: "Budget", paramKey: "budget", options: toOptions(["$", "$$", "$$$"]) },
  {
    label: "Size",
    paramKey: "size",
    options: toOptions(["XS", "S", "M", "L", "XL", "2XL", "3XL"]),
  },
  {
    label: "Gender & fit",
    paramKey: "gender",
    options: toOptions(["Men", "Women", "Unisex"]),
  },
  {
    label: "Availability",
    paramKey: "availability",
    options: toOptions(["Online", "In stores"]),
  },
  {
    label: "Singapore availability",
    paramKey: "sg",
    options: [
      { label: "Local Singapore brand", value: "local" },
      { label: "Ships to Singapore", value: "ships" },
    ],
  },
  { label: "Ships to", paramKey: "location", options: toOptions(shippingLocationsList) },
];

export const productFilterKeys = productFilterGroups.map((g) => g.paramKey);

/** Display label for an active filter param value. */
export function filterValueLabel(paramKey: string, value: string): string {
  const group = productFilterGroups.find((g) => g.paramKey === paramKey);
  return group?.options.find((o) => o.value === value)?.label ?? value;
}

function FilterGroup({
  label,
  paramKey,
  options,
  defaultOpen = false,
}: {
  label: string;
  paramKey: string;
  options: FilterOption[];
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? "";
  const [open, setOpen] = useState(defaultOpen || current !== "");

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (current === value) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }
    router.push(`/search?${params.toString()}`);
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
            const checked = current === opt.value;
            return (
              <li key={opt.value}>
                <label className="group -mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 transition-colors focus:ring-primary-400"
                    aria-label={`Filter by ${opt.label}`}
                  />
                  <span
                    className={`text-sm transition-colors duration-150 ${
                      checked
                        ? "font-medium text-primary-700"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  >
                    {opt.label}
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

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = productFilterKeys.some((k) => searchParams.has(k));

  function clearAll() {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="w-full" aria-label="Product filters">
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
        {productFilterGroups.map((group, i) => (
          <FilterGroup
            key={group.paramKey}
            label={group.label}
            paramKey={group.paramKey}
            options={group.options}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </aside>
  );
}
