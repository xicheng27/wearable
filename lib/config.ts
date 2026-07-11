/**
 * Public runtime configuration.
 *
 * Only reads `NEXT_PUBLIC_*` values, which are exposed to the browser by
 * design. Server-only secrets (Upstash/KV tokens, the submission hash salt)
 * live in server-only modules under `lib/server/*` and `app/api/*` and must
 * never be read from here or any other client-importable module.
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
