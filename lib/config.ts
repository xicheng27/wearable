/**
 * Public runtime configuration.
 *
 * This app has no server secrets — every value that reaches the browser is,
 * by definition, public, so the only environment variables it reads are
 * `NEXT_PUBLIC_*` ones. Keep it that way: never read a non-`NEXT_PUBLIC_`
 * secret from a module that a client component can import.
 *
 * `NEXT_PUBLIC_CONTACT_EMAIL` — the public support/privacy address shown in
 * the UI. Configure a neutral project inbox in Vercel before launch. If it is
 * missing we fall back to a safe, non-personal placeholder so the UI never
 * renders `undefined` or leaks a private address.
 */

const FALLBACK_CONTACT_EMAIL = "privacy@example.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveContactEmail(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (raw && EMAIL_RE.test(raw)) return raw;
  return FALLBACK_CONTACT_EMAIL;
}

export const publicConfig = {
  /** Configured support/privacy contact email, or a safe placeholder. */
  contactEmail: resolveContactEmail(),
  /** True when a real contact address has been configured. */
  hasContactEmail: Boolean(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() &&
      EMAIL_RE.test(process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim())
  ),
} as const;
