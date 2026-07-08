"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * "Strict needs matching" switch shown above recommendation / search results.
 *
 * ON  → only items that meet every hard requirement the shopper selected.
 * OFF → also surface close matches, each clearly flagged for what it misses.
 *
 * The actual filtering lives in the parent (over the engine's four-tier
 * output); this component only owns the control + its analytics event.
 */
export default function StrictMatchingToggle({
  strict,
  onChange,
  hiddenCount = 0,
}: {
  strict: boolean;
  onChange: (next: boolean) => void;
  hiddenCount?: number;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-ink/10 bg-paper px-4 py-3 shadow-soft">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">Strict needs matching</p>
        <p className="mt-0.5 text-xs leading-5 text-ink/65">
          {strict
            ? hiddenCount > 0
              ? `Showing only items that meet every need you chose. ${hiddenCount} close ${hiddenCount === 1 ? "match is" : "matches are"} hidden.`
              : "Showing only items that meet every need you chose."
            : "Also showing close matches — each card flags what it does not cover."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={strict}
        aria-label="Strict needs matching"
        onClick={() => {
          const next = !strict;
          onChange(next);
          trackEvent("strict_matching_toggled", { strict: next });
        }}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
          strict ? "border-primary-800 bg-primary-700" : "border-ink/25 bg-ink/15"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
            strict ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
