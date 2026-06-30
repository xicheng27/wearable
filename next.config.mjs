/** @type {import('next').NextConfig} */

// Content-Security-Policy tuned for this app:
// - product images come from many retailer CDNs   -> img-src https:
// - country detection calls external IP APIs        -> connect-src https:
// - Vercel Analytics / Speed Insights are same-origin proxied
// - voice search uses the Web Speech API (mic)      -> Permissions-Policy mic self
// Kept deliberately not-too-strict so external images, maps and analytics keep
// working; tighten later with a nonce-based script-src if desired.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src 'self'",
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
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    // Microphone is allowed for the same origin so voice search keeps working.
    value: "camera=(), geolocation=(), microphone=(self), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shoptommy.scene7.com",
      },
      {
        protocol: "https",
        hostname: "izadaptive.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "billyfootwear.com",
      },
      {
        protocol: "https",
        hostname: "magnaready.com",
      },
      {
        protocol: "https",
        hostname: "slickchicksonline.com",
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
