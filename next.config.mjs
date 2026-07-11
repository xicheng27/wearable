/** @type {import('next').NextConfig} */

// Hosts the browser legitimately connects to (fetch/XHR). Kept as an explicit
// allowlist instead of a blanket `https:` so a compromised/injected script
// can't exfiltrate to an arbitrary origin.
// - Vercel Analytics / Speed Insights POST to same-origin /_vercel/* ('self').
// - Country detection: two IP-geolocation providers (see CountryProvider).
// - Currency rates: Frankfurter (ECB data), no PII sent.
const connectSrc = [
  "'self'",
  "https://api.country.is",
  "https://ipapi.co",
  "https://api.frankfurter.app",
].join(" ");

// Content-Security-Policy.
//
// script-src keeps 'unsafe-inline' (no 'unsafe-eval'): Next.js App Router
// injects inline bootstrap/streaming scripts and we emit inline JSON-LD, and a
// nonce-based policy in Next 14 requires per-request middleware that would also
// have to thread a nonce into the Vercel Analytics loader. Dropping
// 'unsafe-eval' removes the eval() injection sink while keeping the app working;
// tightening to a nonce is the documented follow-up.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Optimised images are served same-origin from /_next/image; data:/blob: for
  // inline SVGs and canvas; https: because product art comes from many
  // retailer CDNs (the source hosts are pinned in images.remotePatterns below).
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Redundant with CSP frame-ancestors 'none', kept for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    // Microphone is allowed for the same origin so voice search keeps working.
    value:
      "camera=(), geolocation=(), microphone=(self), browsing-topics=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Isolate our browsing context and restrict who can embed our resources.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig = {
  // Don't ship source maps for client bundles to production.
  productionBrowserSourceMaps: false,
  // Never reveal the framework version in the response headers.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    // Explicit product-image CDNs only — no wildcard hosts, so a user-submitted
    // image domain can never be fetched/optimised by the server.
    remotePatterns: [
      { protocol: "https", hostname: "shoptommy.scene7.com" },
      { protocol: "https", hostname: "izadaptive.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "billyfootwear.com" },
      { protocol: "https", hostname: "magnaready.com" },
      { protocol: "https", hostname: "slickchicksonline.com" },
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
    // Keep the optimiser's SVG handling off (default). If an SVG ever slips
    // through it is served with a restrictive CSP and never executed.
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'none'; sandbox;",
  },
};

export default nextConfig;
