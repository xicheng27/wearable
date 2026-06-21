"use client";

import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";

export default function CountryEmptyState({
  generic = false,
}: {
  generic?: boolean;
}) {
  const { setCountry } = useCountry();

  return (
    <div className="paper-panel rounded-[1.5rem_.6rem_1.5rem_1.5rem] px-6 py-16 text-center">
      <h2 className="font-display text-2xl font-semibold text-ink">
        {generic
          ? "No clothing items found"
          : "No products currently available for your location."}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
        {generic
          ? "Try a broader phrase or remove one of the filters."
          : "Availability changes over time. Browse the full catalogue while we continue verifying more shipping destinations."}
      </p>
      {!generic && (
        <button
          type="button"
          onClick={() => setCountry(GLOBAL)}
          className="btn-primary mt-6"
        >
          View globally available items
        </button>
      )}
    </div>
  );
}
