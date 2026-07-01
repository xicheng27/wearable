import type { Metadata } from "next";
import SearchResults from "@/app/search/SearchResultsClient";
import { absoluteUrl } from "@/lib/siteConfig";

// Reading searchParams opts this route into dynamic (per-request) server
// rendering, so the initial HTML always contains real, filter-specific
// product content instead of a "Loading..." shell.
type RawSearchParams = Record<string, string | string[] | undefined>;

const filterSummaryLabels: Record<string, string> = {
  clothing: "Clothing",
  brand: "Brand",
  disability: "Need",
  feature: "Feature",
  style: "Style",
  budget: "Budget",
  size: "Size",
  fit: "Fit",
  availability: "Availability",
  difficulty: "Dressing difficulty",
  sensory: "Sensory-friendly",
  seated: "Seated fit",
  oneHanded: "One-handed dressing",
  easyClosures: "Easy closures",
  wheelchair: "Wheelchair users",
  limitedDexterity: "Limited dexterity",
  prosthetic: "Prosthetic access",
};

/** Flatten Next's searchParams (which may hold arrays) into single-value strings. */
function flattenParams(searchParams: RawSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    out[key] = Array.isArray(value) ? value[0] ?? "" : value;
  }
  return out;
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: RawSearchParams;
}): Metadata {
  const params = flattenParams(searchParams);
  const query = params.q?.trim();

  const activeLabels = Object.keys(filterSummaryLabels)
    .filter((key) => params[key])
    .map((key) =>
      params[key] === "true"
        ? filterSummaryLabels[key]
        : `${filterSummaryLabels[key]}: ${params[key]}`
    );

  const title = query
    ? `Adaptive clothing for "${query}"`
    : activeLabels.length > 0
      ? `Adaptive clothing — ${activeLabels.slice(0, 3).join(", ")}`
      : "Browse Adaptive Clothing";

  const description = query
    ? `Adaptive and accessible clothing matching "${query}" — filter by need, feature, style, budget, size and country availability.`
    : "Browse disability-friendly and mobility-friendly clothing. Filter individual adaptive pieces by accessibility need, adaptive feature, style, budget, size and location availability.";

  // Only the clean /search URL is canonical; filtered permutations point back
  // to it to avoid duplicate-content dilution while staying crawlable.
  const isDefault = !query && activeLabels.length === 0;

  return {
    title,
    description,
    alternates: { canonical: "/search" },
    robots: isDefault ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${title} | Xi's`,
      description,
      url: absoluteUrl("/search"),
      type: "website",
    },
  };
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const params = flattenParams(searchParams);

  // The client component recomputes the identical filtered list from these
  // params (the product catalogue lives in the bundle), so the server-rendered
  // HTML and the hydrated output match exactly — no flash of "Loading...".
  return <SearchResults params={params} />;
}
