/**
 * Central site configuration. Single source of truth for the public URL,
 * brand name and default SEO copy so metadata, robots, sitemap and JSON-LD
 * all stay consistent.
 */

// Prefer the Vercel-provided URL in production, fall back to the known
// production domain so canonical/OG/sitemap URLs are always absolute.
function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  return (fromEnv || "https://wearable-five.vercel.app").replace(/\/$/, "");
}

export const siteConfig = {
  name: "Xi's",
  shortName: "Xi's Adaptive Clothing",
  url: resolveSiteUrl(),
  title: "Xi's | Adaptive Clothing Finder",
  description:
    "Find adaptive clothing that works for your body. Take a short quiz or browse disability-friendly, mobility-friendly and sensory-friendly clothing by need, style and location.",
  keywords: [
    "adaptive clothing",
    "accessible fashion",
    "disability-friendly clothing",
    "mobility-friendly clothing",
    "sensory-friendly clothing",
    "wheelchair clothing",
    "magnetic shirts",
    "easy entry shoes",
    "adaptive clothing Singapore",
    "clothing recommendations by need",
  ],
} as const;

/** Build an absolute URL for a given path on the site. */
export function absoluteUrl(path = "/"): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.url}${path}`;
}
