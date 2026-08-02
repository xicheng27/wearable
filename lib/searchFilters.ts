import type { Product } from "@/types";
import { assessClimate, type ClimateSuitability } from "@/lib/climate";

/**
 * Shared, catalogue-free shopping-filter model used by `/search`,
 * `/singapore` and quiz-result editing — one implementation, no divergent
 * copies.
 *
 * Design:
 *   • Multi-select per facet. OR within a facet, AND between facets.
 *   • All state lives in the URL (comma-separated per facet) so refresh,
 *     sharing and browser back/forward just work. Serialisation is
 *     deterministic (facets and values sorted) for stable, cacheable URLs.
 *   • Predicates read only a product's own fields — this module never imports
 *     the product catalogue, so it can run on the server OR the client without
 *     pulling the multi-megabyte `verifiedProducts` array into a bundle.
 */

export type FacetKey =
  | "type"
  | "need"
  | "closure"
  | "climate"
  | "fabric"
  | "gender"
  | "size"
  | "style"
  | "budget"
  | "brand"
  | "instock"
  | "shipsSG";

/** The multi-select facets (array of chosen values). */
export const MULTI_FACETS: FacetKey[] = [
  "type",
  "need",
  "closure",
  "climate",
  "fabric",
  "gender",
  "size",
  "style",
  "budget",
  "brand",
];

/** Boolean facets (present in URL = on). */
export const BOOL_FACETS: FacetKey[] = ["instock", "shipsSG"];

export type FilterState = Partial<Record<FacetKey, string[]>>;

/* ----------------------------- URL <-> state ----------------------------- */

function readParam(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Parse filter state from Next.js searchParams. */
export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): FilterState {
  const state: FilterState = {};
  for (const facet of MULTI_FACETS) {
    const values = readParam(searchParams[facet]);
    if (values.length) state[facet] = Array.from(new Set(values)).sort();
  }
  for (const facet of BOOL_FACETS) {
    if (readParam(searchParams[facet]).some((v) => v === "1" || v === "true")) {
      state[facet] = ["1"];
    }
  }
  return state;
}

/** Serialise filter state to a deterministic URLSearchParams. */
export function serializeFilters(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  for (const facet of [...MULTI_FACETS].sort()) {
    const values = state[facet];
    if (values && values.length) {
      params.set(facet, Array.from(new Set(values)).sort().join(","));
    }
  }
  for (const facet of BOOL_FACETS) {
    if (state[facet]?.length) params.set(facet, "1");
  }
  return params;
}

/** Toggle a value within a facet (immutably). */
export function toggleFacetValue(state: FilterState, facet: FacetKey, value: string): FilterState {
  const current = new Set(state[facet] ?? []);
  if (current.has(value)) current.delete(value);
  else current.add(value);
  const next = { ...state };
  if (current.size) next[facet] = Array.from(current).sort();
  else delete next[facet];
  return next;
}

export function isBoolOn(state: FilterState, facet: FacetKey): boolean {
  return Boolean(state[facet]?.length);
}

export function activeFilterCount(state: FilterState): number {
  return (Object.keys(state) as FacetKey[]).reduce(
    (n, facet) => n + (state[facet]?.length ?? 0),
    0
  );
}

/* ------------------------- Per-product facet values ---------------------- */

const CLOSURE_KEYWORDS = /magnet|velcro|touch|snap|zip|hook|button|toggle|drawstring|elastic|pull-on|pull on/i;

/** Family a product belongs to (leaf logic — no engine/catalogue import). */
function typeFamily(product: Product): string {
  const t = `${product.categoryNormalized ?? ""} ${product.clothingType} ${product.category}`.toLowerCase();
  if (/shoe|footwear|sneaker|boot|sandal|slipper|sock/.test(t)) return "footwear";
  if (/jean|pant|trouser|short|legging|jogger|bottom|skirt/.test(t)) return "bottoms";
  if (/jacket|coat|outerwear|hoodie|blazer|parka|vest|cardigan/.test(t)) return "outerwear";
  if (/dress|jumpsuit|gown|romper/.test(t)) return "dresses";
  if (/bra|underwear|brief|base ?layer|undergarment/.test(t)) return "undergarments";
  if (/top|shirt|tee|blouse|polo|sweater|sweatshirt/.test(t)) return "tops";
  return "other";
}

function budgetBucket(priceRange: string): string {
  const p = priceRange.toLowerCase();
  if (/25-\$?50|under \$?50/.test(p)) return "under-50";
  if (/50-\$?100/.test(p)) return "50-100";
  if (/75-\$?125|100-\$?150/.test(p)) return "100-150";
  if (/150/.test(p)) return "over-150";
  return "other";
}

/** Does the product genuinely ship to a given country (declared data only)? */
function shipsToCountry(product: Product, country: string): boolean {
  const declared = [
    ...(product.shipsTo ?? []),
    ...(product.availability?.countries ?? []),
  ].map((c) => c.toLowerCase());
  if (declared.length === 0) return false; // unknown ≠ ships
  return declared.includes("global") || declared.includes("worldwide") || declared.includes(country.toLowerCase());
}

/** The set of facet values a product satisfies, for filtering + facet counts. */
export function productFacetValues(product: Product): Record<FacetKey, string[]> {
  const climate = assessClimate(product);
  const closures = [
    ...(product.closureTypes ?? []),
    ...product.adaptiveFeatures.filter((f) => CLOSURE_KEYWORDS.test(f)),
  ].map((c) => c.toLowerCase());

  return {
    type: [typeFamily(product)],
    need: [...product.bestFor, ...product.disabilityNeeds].map((n) => n.toLowerCase()),
    closure: Array.from(new Set(closures)),
    climate: [climate.suitability, ...climate.tags],
    fabric: [
      ...(product.materials ?? []),
      ...(product.materialComposition ? [product.materialComposition] : []),
    ].map((f) => f.toLowerCase()),
    gender: product.genderFit.map((g) => g.toLowerCase()),
    size: product.sizes.map((s) => s.toLowerCase()),
    style: product.styleTags.map((s) => s.toLowerCase()),
    budget: [budgetBucket(product.priceRange)],
    brand: [product.brandId.toLowerCase()],
    instock: product.stockStatus === "out_of_stock" ? [] : ["1"],
    shipsSG: shipsToCountry(product, "Singapore") ? ["1"] : [],
  };
}

/* ------------------------------- Filtering ------------------------------- */

function facetMatches(productValues: string[], selected: string[]): boolean {
  // OR within a facet: the product must match at least one selected value.
  const set = new Set(productValues.map((v) => v.toLowerCase()));
  return selected.some((s) => {
    const needle = s.toLowerCase();
    // Substring match so "cotton" matches "100% cotton", "seated" matches tags.
    return set.has(needle) || productValues.some((v) => v.toLowerCase().includes(needle));
  });
}

/**
 * Apply the filter state to a product list. OR within a facet, AND between
 * facets. Boolean facets (instock/shipsSG) require the product to satisfy them.
 */
export function applyFilters(productList: Product[], state: FilterState): Product[] {
  const activeFacets = (Object.keys(state) as FacetKey[]).filter((f) => state[f]?.length);
  if (activeFacets.length === 0) return productList;

  return productList.filter((product) => {
    const values = productFacetValues(product);
    // AND between facets: every active facet must be satisfied.
    return activeFacets.every((facet) => {
      const selected = state[facet]!;
      if (BOOL_FACETS.includes(facet)) return values[facet].length > 0;
      return facetMatches(values[facet], selected);
    });
  });
}

/* ----------------------------- Quick filters ----------------------------- */

export interface QuickFilter {
  id: string;
  label: string;
  /** The facet/value(s) this chip sets. */
  patch: FilterState;
}

export const QUICK_FILTERS: QuickFilter[] = [
  { id: "hot-humid", label: "Hot & humid", patch: { climate: ["high", "medium"] } },
  { id: "in-stock", label: "In stock", patch: { instock: ["1"] } },
  { id: "ships-sg", label: "Ships to Singapore", patch: { shipsSG: ["1"] } },
  { id: "easy-closures", label: "Easy closures", patch: { closure: ["magnetic", "velcro", "snap", "touch"] } },
  { id: "seated-fit", label: "Seated fit", patch: { need: ["seated", "wheelchair"] } },
  { id: "sensory", label: "Sensory-friendly", patch: { need: ["sensory"] } },
  { id: "assisted", label: "Assisted dressing", patch: { need: ["assisted dressing", "caregiver"] } },
  { id: "one-handed", label: "One-handed dressing", patch: { closure: ["magnetic", "snap"], need: ["one-handed"] } },
];

/** Climate ordering for a hot-humid default sort: high → medium → unknown → low. */
export const CLIMATE_SORT: Record<ClimateSuitability, number> = {
  high: 0,
  medium: 1,
  unknown: 2,
  low: 3,
};
