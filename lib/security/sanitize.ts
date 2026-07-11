/**
 * Small, dependency-free input hygiene helpers shared by forms.
 *
 * These are NOT an HTML sanitiser — React already escapes text when it renders
 * it, so submitted content is only ever stored/displayed as plain text. What
 * these do is defensive normalisation: trim, strip control characters, cap
 * length, and validate emails, so garbage/oversized/binary input never gets
 * persisted or later re-displayed.
 */

// Control characters except normal whitespace (tab/newline are allowed in
// multi-line notes but collapsed by callers that want single-line values).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_KEEP_WS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/** Trim, remove control chars, and hard-cap the length. Never throws. */
export function cleanText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.replace(CONTROL_CHARS_KEEP_WS, "").trim().slice(0, maxLength);
}

/** Single-line variant: also collapses internal whitespace runs to one space. */
export function cleanLine(input: unknown, maxLength: number): string {
  return cleanText(input, maxLength).replace(/\s+/g, " ");
}

// Pragmatic email check — RFC-perfect validation is famously fragile, so we
// require the common shape and let the mailto/consumer decide the rest.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Normalises (trim + lowercase) and validates an email address. Returns the
 * normalised address, or null if it is empty/invalid/too long.
 */
export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH) return null;
  return EMAIL_RE.test(email) ? email : null;
}

/** True when the string contains markup that looks like an HTML/script tag. */
export function looksLikeHtml(input: string): boolean {
  return /<[a-z!/]/i.test(input);
}
