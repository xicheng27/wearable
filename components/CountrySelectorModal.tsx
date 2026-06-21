"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, GLOBAL_LOCATION } from "@/lib/countries";

const quickCountries = [
  "Singapore",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  GLOBAL_LOCATION,
];

export default function CountrySelectorModal({
  selectedCountry,
  onSelect,
  onClose,
}: {
  selectedCountry: string;
  onSelect: (country: string) => void;
  onClose?: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countries;
    return countries.filter(
      ({ name, code }) =>
        name.toLowerCase().includes(normalized) ||
        code.toLowerCase() === normalized
    );
  }, [query]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) onClose();
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-selector-title"
      aria-describedby="country-selector-description"
    >
      <div
        ref={dialogRef}
        className="paper-panel relative flex max-h-[min(44rem,calc(100dvh-2rem))] w-full max-w-xl flex-col overflow-hidden rounded-[2rem_.8rem_2rem_2rem] bg-ivory"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg p-2 text-2xl text-ink/55 hover:bg-sand/60 hover:text-ink"
            aria-label="Close location selector"
          >
            &times;
          </button>
        )}

        <div className="border-b border-ink/10 px-6 pb-5 pt-7 sm:px-8">
          <p className="eyebrow">Shopping location</p>
          <h2
            id="country-selector-title"
            className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl"
          >
            Where are you shopping from?
          </h2>
          <p
            id="country-selector-description"
            className="mt-3 max-w-md text-base leading-7 text-ink/70"
          >
            We will show pieces available in or shipping to your country. You
            can change this later from the navigation bar or results page.
          </p>

          <div className="mt-5" aria-label="Common shopping locations">
            <p className="mb-2 text-sm font-bold text-ink">Quick choices</p>
            <div className="flex flex-wrap gap-2">
              {quickCountries.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => onSelect(country)}
                  className={`rounded-xl border px-3.5 py-2.5 text-sm font-bold transition ${
                    selectedCountry === country
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-ink/15 bg-paper text-ink/75 hover:border-primary-400 hover:text-primary-800"
                  }`}
                >
                  {country === GLOBAL_LOCATION ? "View global items" : country}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block" htmlFor="country-search">
            <span className="mb-2 block text-sm font-bold text-ink">
              Search all countries
            </span>
            <div className="flex items-center gap-3 rounded-xl border border-ink/15 bg-paper px-4 shadow-soft focus-within:border-primary-500">
              <svg
                className="h-5 w-5 flex-none text-ink/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="country-search"
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a country..."
                className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-ink outline-none placeholder:text-ink/40"
                role="combobox"
                aria-controls="country-options"
                aria-expanded="true"
                autoComplete="off"
              />
            </div>
          </label>
        </div>

        <div
          id="country-options"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
          role="listbox"
          aria-label="Countries"
        >
          {matches.length > 0 ? (
            matches.map(({ code, name }) => (
              <button
                type="button"
                role="option"
                aria-selected={selectedCountry === name}
                key={code}
                onClick={() => onSelect(name)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base text-ink/80 hover:bg-sand/55 hover:text-ink"
              >
                <span>{name}</span>
                <span className="text-xs font-bold tracking-wider text-ink/35">
                  {code}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-8 text-center text-sm text-ink/55">
              No country matches &quot;{query}&quot;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
