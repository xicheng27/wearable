"use client";

import { useShoppingLocation } from "@/components/LocationProvider";
import { GLOBAL_LOCATION } from "@/lib/countries";

export default function LocationButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { selectedCountry, ready, openSelector } = useShoppingLocation();
  const label =
    selectedCountry === GLOBAL_LOCATION
      ? "Global"
      : selectedCountry || "Choose location";

  return (
    <span className={compact ? "inline-flex" : "inline-flex flex-col gap-1"}>
      {!compact && ready && (
        <span className="text-xs font-semibold text-ink/55">
          Showing items available in {label}
        </span>
      )}
      <button
        type="button"
        onClick={openSelector}
        className={`inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-paper px-3 py-2 text-xs font-bold text-ink/75 shadow-soft transition hover:border-primary-300 hover:text-primary-800 ${className}`}
        aria-label={`Change shopping location. Current location: ${label}`}
      >
        <svg
          className="h-4 w-4 flex-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.3" />
        </svg>
        {!compact && <span>Change location</span>}
        <span className="max-w-28 truncate">{ready ? label : "Loading..."}</span>
      </button>
    </span>
  );
}

