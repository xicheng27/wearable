"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires the `results_viewed` funnel event once when the quiz results render.
 * Receives only coarse counts (no answers, no free text) so nothing
 * identifying reaches analytics.
 */
export default function ResultsViewedTracker({
  exactCount,
  fallbackCount,
}: {
  exactCount: number;
  fallbackCount: number;
}) {
  const sentRef = useRef(false);
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    trackEvent("results_viewed", {
      exactCount,
      fallbackCount,
      total: exactCount + fallbackCount,
    });
  }, [exactCount, fallbackCount]);
  return null;
}
