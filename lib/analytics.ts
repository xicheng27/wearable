import { track } from "@vercel/analytics";

/**
 * Centralised product-funnel analytics.
 *
 * All event tracking goes through `trackEvent` so event names stay consistent
 * and we never scatter `track(...)` calls (or accidental PII) across the
 * codebase. Vercel Web Analytics only sends data in production by default, so
 * these calls are inert during local development.
 *
 * PRIVACY: never pass personally identifying information (emails, free-text
 * the user typed, names, precise location) into event payloads. Payloads are
 * limited to coarse, non-identifying facts (which step, which filter key, a
 * product id, a category).
 */
export type AnalyticsEvent =
  | "cta_quiz_start"
  | "quiz_started"
  | "quiz_step_completed"
  | "quiz_completed"
  | "results_viewed"
  | "product_saved"
  | "product_unsaved"
  | "official_link_clicked"
  | "location_used"
  | "filter_applied"
  | "filter_cleared"
  | "submit_item_started"
  | "submit_item_submitted"
  | "passport_saved"
  | "passport_edited"
  | "passport_reset"
  | "passport_filter_toggled";

type AllowedValue = string | number | boolean | null;

/** Vercel Analytics only accepts flat properties of string | number | boolean | null. */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, AllowedValue>
): void {
  try {
    if (properties) {
      track(event, properties);
    } else {
      track(event);
    }
  } catch {
    // Analytics must never break a user interaction.
  }
}
