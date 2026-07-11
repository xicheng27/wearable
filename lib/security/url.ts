/**
 * Safe URL handling. Used everywhere a user-provided or data-provided URL is
 * validated before it is rendered as a link or stored.
 *
 * The only schemes we ever allow are http/https. Everything else —
 * `javascript:`, `data:`, `file:`, `ftp:`, `blob:`, `mailto:` in link
 * position, etc. — is rejected so a submitted string can never become an
 * active script/redirect vector when later rendered in an <a href>.
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Control chars (NUL..US and DEL) that must never appear in a URL. */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1F\x7F]/;

export interface SafeUrlOptions {
  /** When true only `https:` is accepted. Defaults to false (http+https). */
  httpsOnly?: boolean;
  /** Reject URLs longer than this. Defaults to 2048. */
  maxLength?: number;
}

/**
 * Returns the normalised URL string if it is a safe http(s) URL, otherwise
 * null. Never throws.
 */
export function safeExternalUrl(
  input: string | null | undefined,
  options: SafeUrlOptions = {}
): string | null {
  const { httpsOnly = false, maxLength = 2048 } = options;
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  if (CONTROL_CHARS.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
  if (httpsOnly && url.protocol !== "https:") return null;
  if (!url.hostname) return null;

  return url.toString();
}

/** Boolean convenience wrapper around {@link safeExternalUrl}. */
export function isSafeExternalUrl(
  input: string | null | undefined,
  options: SafeUrlOptions = {}
): boolean {
  return safeExternalUrl(input, options) !== null;
}

/** The registrable-ish host (www stripped) of a URL, or "unknown". */
export function hostOf(input: string | null | undefined): string {
  if (typeof input !== "string") return "unknown";
  try {
    return new URL(input).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}
