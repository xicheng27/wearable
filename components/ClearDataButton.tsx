"use client";

import { useState } from "react";
import { clearPersonalData } from "@/lib/clearUserData";

/**
 * "Delete my saved data" control. Wipes the quiz answers / Fit Passport,
 * saved items, submitted suggestions and interaction signals stored on this
 * device, then reloads so every provider re-reads empty storage.
 *
 * A two-step confirm avoids accidental deletion; the result is announced via
 * role="status" so screen readers hear what was removed.
 */
export default function ClearDataButton({
  className = "",
  label = "Delete my saved data",
  includePreferences = false,
}: {
  className?: string;
  label?: string;
  /** Also clear currency / accessibility preferences (full reset). */
  includePreferences?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function handleClear() {
    const { removed } = clearPersonalData({ includePreferences });
    setConfirming(false);
    setDone(
      removed.length > 0
        ? "Your quiz answers, Fit Passport, saved items and any item suggestions saved on this device have been deleted."
        : "There was no saved data on this device to delete."
    );
    // Reload so all providers re-hydrate from the now-empty storage.
    if (removed.length > 0) {
      window.setTimeout(() => window.location.reload(), 1200);
    }
  }

  if (done) {
    return (
      <p role="status" className="text-sm leading-6 text-ink/75">
        {done}
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={className || "btn-outline"}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Confirm data deletion">
      <p className="text-sm font-semibold text-ink">
        This permanently removes your saved data from this device. Continue?
      </p>
      <button type="button" onClick={handleClear} className="btn-primary">
        Yes, delete it
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="btn-outline"
      >
        Cancel
      </button>
    </div>
  );
}
