"use client";

import { useMemo, useState } from "react";
import { useCountry } from "@/components/CountryProvider";
import { countries, GLOBAL } from "@/lib/countries";

export default function CountryPicker() {
  const { pickerOpen, closePicker, setCountry, country } = useCountry();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return countries;
    return countries.filter((name) => name.toLowerCase().includes(term));
  }, [query]);

  if (!pickerOpen) return null;

  const canDismiss = !!country;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-picker-heading"
      onClick={() => canDismiss && closePicker()}
    >
      <div
        className="paper-texture max-h-[85vh] w-full overflow-hidden rounded-t-[2rem] border border-ink/10 bg-paper shadow-paper sm:max-w-md sm:rounded-[1.5rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 pb-4 pt-6">
          <div>
            <p className="eyebrow">Before we start</p>
            <h2 id="country-picker-heading" className="mt-1 font-display text-2xl font-semibold text-ink">
              Where are you shopping from?
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              We&apos;ll show items that ship to you. You can change this anytime.
            </p>
          </div>
          {canDismiss && (
            <button
              type="button"
              onClick={closePicker}
              aria-label="Close"
              className="rounded-lg p-1 text-ink/50 hover:bg-sand/50 hover:text-ink"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="px-6 pt-4">
          <label className="sr-only" htmlFor="country-search">
            Search countries
          </label>
          <input
            id="country-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for your country"
            autoFocus
            className="w-full rounded-xl border border-ink/15 bg-ivory px-4 py-3 text-sm text-ink shadow-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <ul className="mt-2 max-h-72 overflow-y-auto px-3 pb-3" role="listbox" aria-label="Countries">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink/50">No countries match &ldquo;{query}&rdquo;.</li>
          )}
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => setCountry(name)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-sand/60 ${
                  country === name ? "bg-primary-50 text-primary-800" : "text-ink/80"
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-ink/10 px-6 py-4">
          <button
            type="button"
            onClick={() => setCountry(GLOBAL)}
            className="btn-secondary w-full justify-center text-sm"
          >
            View globally available items
          </button>
        </div>
      </div>
    </div>
  );
}
