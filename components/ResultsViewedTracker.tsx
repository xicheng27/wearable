"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { captureFeedback, setFeedbackContext } from "@/lib/feedback";

/**
 * Fires the `results_viewed` funnel event once when the quiz results render,
 * and seeds the feedback session context (needs / category / location) so
 * every later interaction event carries it. Also records a coarse
 * `results_shown` (or `no_results`) signal for future recommendation tuning.
 *
 * Only coarse, controlled values are passed — no free text, no diagnoses.
 */
export default function ResultsViewedTracker({
  exactCount,
  fallbackCount,
  selectedNeeds,
  selectedCategory,
  selectedLocation,
}: {
  exactCount: number;
  fallbackCount: number;
  selectedNeeds?: string[];
  selectedCategory?: string | null;
  selectedLocation?: string | null;
}) {
  const sentRef = useRef(false);
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const total = exactCount + fallbackCount;

    // Seed context first so results_shown / no_results (and every later event)
    // carry what the shopper was looking for.
    setFeedbackContext({
      selectedNeeds,
      selectedCategory: selectedCategory ?? null,
      selectedLocation: selectedLocation ?? null,
    });

    trackEvent("results_viewed", { exactCount, fallbackCount, total });

    captureFeedback({
      actionType: total === 0 ? "no_results" : "results_shown",
    });
  }, [exactCount, fallbackCount, selectedNeeds, selectedCategory, selectedLocation]);

  return null;
}
