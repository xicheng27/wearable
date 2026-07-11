/**
 * Validation schema for the "suggest an item" form.
 *
 * The app has no backend — submissions are stored in this browser's
 * localStorage only (see SubmitItemForm / the privacy page). There is
 * therefore no server to validate on, but we still validate hard on the
 * client so that:
 *   • what we persist is always well-formed, bounded, plain text;
 *   • a pasted `javascript:`/`data:` URL can never be stored and later
 *     re-rendered as an active link;
 *   • oversized / binary / markup input is rejected up front.
 *
 * A tiny hand-written validator is used instead of pulling in Zod: the app
 * currently ships zero runtime dependencies beyond React/Next/Vercel
 * analytics, and adding a validation library for one local-only form is not
 * worth the bundle cost. The field limits mirror the brief.
 */

import { cleanLine, cleanText, looksLikeHtml, normalizeEmail } from "./sanitize";
import { safeExternalUrl } from "./url";

export const SUBMISSION_LIMITS = {
  productName: 150,
  brandName: 100,
  country: 80,
  notes: 1500,
  url: 2048,
  email: 254,
} as const;

/** Raw, untrusted input coming off the form. */
export interface RawSubmission {
  productName?: unknown;
  brandName?: unknown;
  productUrl?: unknown;
  country?: unknown;
  notes?: unknown;
  contact?: unknown;
}

/** The cleaned, validated record we are willing to persist. */
export interface CleanSubmission {
  productName: string;
  brandName: string;
  productUrl: string;
  country: string;
  notes: string;
  contact: string;
}

export type SubmissionResult =
  | { ok: true; value: CleanSubmission }
  | { ok: false; error: string };

/**
 * Validate + normalise a submission. Only the explicitly-listed fields are
 * read (unknown fields are ignored, preventing mass-assignment into the
 * stored object). Returns a single generic, user-friendly error on failure.
 */
export function validateSubmission(raw: RawSubmission): SubmissionResult {
  const productName = cleanLine(raw.productName, SUBMISSION_LIMITS.productName);
  const brandName = cleanLine(raw.brandName, SUBMISSION_LIMITS.brandName);
  const country = cleanLine(raw.country, SUBMISSION_LIMITS.country);
  const notes = cleanText(raw.notes, SUBMISSION_LIMITS.notes);

  if (!productName || !brandName) {
    return { ok: false, error: "Please add at least the product name and brand name." };
  }

  if (looksLikeHtml(productName) || looksLikeHtml(brandName)) {
    return { ok: false, error: "Please remove any HTML tags from the product or brand name." };
  }

  // URL is optional, but if present it must be a safe http(s) URL.
  let productUrl = "";
  const rawUrl = typeof raw.productUrl === "string" ? raw.productUrl.trim() : "";
  if (rawUrl) {
    const safe = safeExternalUrl(rawUrl, { maxLength: SUBMISSION_LIMITS.url });
    if (!safe) {
      return {
        ok: false,
        error: "That product link doesn't look valid. Use a full https:// address, or leave it blank.",
      };
    }
    productUrl = safe;
  }

  // Email is optional, but if present it must be a valid address.
  let contact = "";
  const rawContact = typeof raw.contact === "string" ? raw.contact.trim() : "";
  if (rawContact) {
    const email = normalizeEmail(rawContact);
    if (!email) {
      return { ok: false, error: "That email address doesn't look valid. Check it, or leave it blank." };
    }
    contact = email;
  }

  return {
    ok: true,
    value: { productName, brandName, productUrl, country, notes, contact },
  };
}
