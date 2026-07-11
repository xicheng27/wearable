/**
 * GET /api/geo — returns the visitor's approximate country for defaulting the
 * shopping region.
 *
 * PRIVACY: this uses Vercel's own request geolocation (the `x-vercel-ip-country`
 * header Vercel adds at the edge). No third-party IP-lookup service is called,
 * the visitor's IP is never sent anywhere new, and we only ever read/return the
 * two-letter COUNTRY — never a precise location, and nothing is stored.
 *
 * Runs on the Edge so the geo header is populated. Off Vercel (local dev) the
 * header is absent and this returns `{ country: null }`, so the client falls
 * back to the region picker.
 */

export const runtime = "edge";
export const dynamic = "force-dynamic";

const COUNTRY_CODE = /^[A-Z]{2}$/;

export function GET(req: Request): Response {
  const raw = req.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  const country = COUNTRY_CODE.test(raw) ? raw : null;
  return Response.json(
    { country },
    { headers: { "cache-control": "private, no-store" } }
  );
}
