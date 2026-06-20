"use client";

import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";

export default function CountrySelector({
  className = "",
}: {
  className?: string;
}) {
  const { country, openPicker } = useCountry();

  return (
    <button
      type="button"
      onClick={openPicker}
      className={`flex items-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-2 py-2 text-xs font-bold text-ink/65 shadow-sm transition hover:border-primary-400 hover:text-ink ${className}`}
      aria-label="Change shopping location"
    >
      <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5S4.5 15.75 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span className="max-w-[7.5rem] truncate">
        {country && country !== GLOBAL ? country : "Global"}
      </span>
    </button>
  );
}
