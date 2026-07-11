# Internal Security & Privacy Audit — Xi's Adaptive Clothing

_Pre-implementation snapshot. Framework, data flows and risks found before the
hardening pass. See the commit history / final report for the fixes applied._

## 1. Framework & architecture

- **Next.js 14.2.5, App Router** (`app/` directory, route groups, server + client components).
- React 18, TypeScript (strict), Tailwind. Package manager: **npm** (`package-lock.json`).
- **No backend of any kind**: no `app/api` routes, no Server Actions (`grep "use server"` = 0),
  no database, no ORM, no Supabase/Firebase, no auth provider.
- Deploy target: **Vercel**. Analytics: `@vercel/analytics` + `@vercel/speed-insights` (only third-party scripts).
- **All user data is client-side only** (browser `localStorage`). Nothing is ever sent to a server we control.

## 2. Data stores (all `localStorage`, `xis-*` namespace)

| Key | Written by | Contents | Sensitivity |
|-----|-----------|----------|-------------|
| `xis-fit-passport` | PassportProvider | Full quiz answers incl. medical area/access, sensory, body zones, **free-text** | **High** |
| `xis-user-profile` | UserProfileProvider | country, clothing categories, challenges, style | Medium |
| `xis-submitted-items` | SubmitItemForm | product name/brand/url/country/notes + **optional email** | Medium |
| `xis-saved-items` | SavedItemsProvider | array of product slugs | Low |
| `xis-shopping-country` | CountryProvider | detected/chosen country name | Low |
| `xis-display-currency`, `xis-currency-manual` | CurrencyProvider | currency code / flag | Low |
| `xis-accessibility-settings` | AccessibilityPanel | UI prefs (text size, contrast…) | Low |
| `xis-passport-filter` | PassportProvider | boolean filter flag | Low |
| `xis-feedback-log`, `xis-feedback-context`, `xis-session-id` | lib/feedback | coarse interaction signals, random session id | Low |

## 3. Third-party services (all called from the **browser**)

- **Country detection**: sequentially calls up to 4 IP-geolocation APIs — `api.country.is`,
  `ipwho.is`, `get.geojs.io`, `ipapi.co`. Sends the visitor's IP to third parties. Result cached in
  `localStorage`, so it only runs on first visit. **Not documented on the privacy page.**
- **Currency rates**: `api.frankfurter.app` (no PII, just FX rates).
- **Vercel Web Analytics + Speed Insights** (same-origin proxied).
- Product **images** loaded via `next/image` optimiser from 8 allow-listed retailer CDNs.

## 4. Key risks found

1. **Privacy contradiction (submissions).** UI says "saved on this device for review"; privacy page
   claims "Every submitted item is read by a person" and offers email deletion — but submissions are
   **local-only** and never leave the browser. The email field implies impossible follow-up. _(§2, §21)_
2. **Sensitive free-text in URL.** `buildResultParams` writes the quiz free-text (`otherNeeds`,
   `custom`) — where users describe medical/accessibility needs in their own words — into the
   `/quiz/results?…` query string. Leaks into browser history, Vercel server access logs and analytics. _(§5)_
3. **Personal Gmail hardcoded** (`wangxicheng2007@gmail.com`) on the privacy and contact pages. _(§22)_
4. **Fake sign-in page** (`/signin`) collects an email **and password** and just `router.push`es to
   `/search` — no auth exists. Dead route that harvests real passwords into nothing. _(§7, §20)_
5. **Loose CSP**: `script-src` allows `'unsafe-eval'`; `connect-src https:` and `img-src https:` allow
   any HTTPS host. No COOP/CORP. _(§8)_
6. **No input validation library / no length caps / no URL-scheme validation** on the submission form
   beyond honeypot + min-time. Client-only, but still needs sane limits and safe URL handling. _(§3)_
7. **Analytics may receive query strings** (which now carry coded quiz answers). Needs a `beforeSend`
   scrubber. _(§12)_
8. **No `.env.example`, no env validation, no Dependabot/CI**. _(§13, §19)_

## 5. Things that were already correct

- `dangerouslySetInnerHTML` only used for JSON-LD built from `JSON.stringify` of static config (safe).
- External links already use `rel="noopener noreferrer"` + `target="_blank"`.
- `next/image` `remotePatterns` are specific hosts (no wildcards); SVG optimisation left default-off.
- Analytics event names are coarse (`quiz_completed`, not `arthritis_selected`); no free-text sent to `track()`.
- Referrer-Policy `strict-origin-when-cross-origin` already prevents the results URL leaking to retailers.
- `robots.ts` disallows `/signin`, `/results`, `/quiz/results`; results pages are `noindex`.
- No `console.log`, `eval`, or raw `innerHTML` in app code.

## 6. Addendum — submission backend (second pass)

The product-suggestion form was changed from local-only to a **real uploaded
backend** so submissions can actually be reviewed (resolving the review
contradiction properly rather than by removing the review claim):

- **Endpoint:** `POST /api/submit` (Node runtime). POST-only — `GET` returns 405,
  so submissions are never publicly readable.
- **Protections:** JSON content-type required, 8 KB body cap (declared + actual),
  safe JSON parse, honeypot + min-time, sliding-window rate limit (5 / 10 min per
  hashed IP), duplicate detection, explicit-field validation (reused
  `lib/security/submission`), generic client errors, redacted server logs.
- **Storage:** Upstash Redis (via Vercel KV / Upstash integration). Records carry
  the product fields, a server timestamp and a **salted hash of the IP** (never
  the raw IP, no user agent). 180-day TTL → auto-deletion. In production the
  route fail-safes to 503 if no store is configured (never silently drops).
- **Country detection** was moved off third-party IP-lookup services onto our own
  `/api/geo`, which reads Vercel's edge geolocation header — no third party sees
  the request. CSP `connect-src` tightened accordingly (dropped the two IP hosts).
- New server-only secrets: `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or
  `UPSTASH_REDIS_REST_*`) and `SUBMISSION_HASH_SALT`. All read only from
  `lib/server/*` / `app/api/*` (guarded with `import "server-only"`).
