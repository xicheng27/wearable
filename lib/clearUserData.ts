/**
 * On-device data deletion.
 *
 * Everything this app knows about a visitor lives in `localStorage` under the
 * `xis-` namespace (quiz answers / Fit Passport, saved items, submitted item
 * suggestions, feedback signals, country/currency preferences, accessibility
 * settings). Because nothing is ever uploaded, deleting the local copy IS the
 * deletion — there is no server record to also remove.
 *
 * The keys are grouped so the UI can offer a focused "delete my quiz &
 * profile data" action without wiping unrelated, non-sensitive UI preferences
 * (currency, accessibility settings) unless the visitor asks for a full reset.
 */

/** Sensitive, person-describing data: quiz answers, submissions, feedback. */
export const PERSONAL_DATA_KEYS = [
  "xis-fit-passport",
  "xis-passport-filter",
  "xis-user-profile",
  "xis-saved-items",
  "xis-submitted-items",
  "xis-feedback-log",
  "xis-feedback-context",
  "xis-session-id",
] as const;

/** Low-sensitivity UI/shopping preferences. */
export const PREFERENCE_KEYS = [
  "xis-shopping-country",
  "xis-display-currency",
  "xis-currency-manual",
  "xis-accessibility-settings",
] as const;

export interface ClearResult {
  /** Keys that existed and were removed. */
  removed: string[];
}

function removeKeys(keys: readonly string[]): string[] {
  const removed: string[] = [];
  if (typeof window === "undefined") return removed;
  for (const key of keys) {
    try {
      if (window.localStorage.getItem(key) !== null) {
        window.localStorage.removeItem(key);
        removed.push(key);
      }
    } catch {
      // Storage unavailable/blocked — nothing to remove.
    }
  }
  return removed;
}

/**
 * Delete the visitor's quiz answers, Fit Passport, saved items, submitted
 * suggestions and interaction signals. Leaves currency / accessibility
 * preferences alone unless `includePreferences` is set.
 */
export function clearPersonalData(options?: { includePreferences?: boolean }): ClearResult {
  const keys = options?.includePreferences
    ? [...PERSONAL_DATA_KEYS, ...PREFERENCE_KEYS]
    : PERSONAL_DATA_KEYS;
  return { removed: removeKeys(keys) };
}
