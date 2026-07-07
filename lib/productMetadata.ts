import type { Product } from "@/types";
import { GLOBAL, expandShippingRegions } from "@/lib/countries";

/**
 * Product metadata normalization & validation.
 *
 * The catalog is partly generated from brand product feeds, and free-text
 * titles/tags routinely poison naive keyword classification (e.g. a knit
 * SHIRT titled "… for Assisted Dressing | Easy-Dress Snap Closure" being
 * shelved as a DRESS). This module is the single source of truth for:
 *
 *   - inferring the true garment category from a product title
 *     (adaptive-phrase stripping + head-noun-wins matching),
 *   - normalized enums for category / gender fit / availability,
 *   - metadata warnings so tests and the sync pipeline catch bad records
 *     before shoppers ever see them.
 *
 * The recommendation engine treats `categoryNormalized` as authoritative;
 * `scripts/repair-product-metadata.ts` stamps it (and repairs the legacy
 * clothingType/category fields) across the generated catalog.
 */

export type CategoryNormalized =
  | "footwear"
  | "tops"
  | "bottoms"
  | "dresses_skirts"
  | "outerwear"
  | "undergarments"
  | "sleepwear"
  | "accessories"
  | "adaptive_sets"
  | "unknown";

export type GenderFitNormalized =
  | "women"
  | "men"
  | "unisex"
  | "kids"
  | "teen"
  | "adaptive_universal"
  | "unknown";

export type AvailabilityNormalized =
  | "singapore"
  | "ships_to_singapore"
  | "global"
  | "us_only"
  | "uk_only"
  | "regional"
  | "unknown";

export interface MetadataWarning {
  productId: string;
  field: string;
  /** "error" = actively misleading data; "notice" = incomplete data. */
  severity: "error" | "notice";
  message: string;
}

/** Display + legacy-field values per normalized category. */
export const CATEGORY_DISPLAY: Record<
  Exclude<CategoryNormalized, "unknown">,
  { label: string; clothingType: string; legacyCategory: string }
> = {
  footwear: { label: "Footwear", clothingType: "Shoes", legacyCategory: "shoes" },
  tops: { label: "Tops", clothingType: "Tops", legacyCategory: "tops" },
  bottoms: { label: "Bottoms", clothingType: "Pants", legacyCategory: "pants" },
  dresses_skirts: { label: "Dresses & skirts", clothingType: "Dresses", legacyCategory: "dresses" },
  outerwear: { label: "Outerwear", clothingType: "Jackets", legacyCategory: "jackets" },
  undergarments: { label: "Undergarments", clothingType: "Underwear", legacyCategory: "underwear" },
  sleepwear: { label: "Sleepwear", clothingType: "Nightwear", legacyCategory: "nightwear" },
  accessories: { label: "Accessories", clothingType: "Accessories", legacyCategory: "accessories" },
  adaptive_sets: { label: "Adaptive sets", clothingType: "Sets", legacyCategory: "sets" },
};

// ---------------------------------------------------------------------------
// Title → category inference
// ---------------------------------------------------------------------------

/**
 * Adaptive/marketing phrases that contain garment words but do NOT describe
 * the garment ("easy-dress", "assisted dressing", "stay dressed", "easy on").
 * They are removed before any noun matching so they can never misclassify.
 */
const NOISE_PHRASES: RegExp[] = [
  /\beasy[- ]?dress(ing)?\b/g,
  /\bassisted[- ]dressing\b/g,
  /\bself[- ]dressing\b/g,
  /\bstay dressed\b/g,
  /\bdressing (aid|loop|loops|hook|stick)s?\b/g,
  /\beasy[- ]on\b/g,
  /\beasy[- ]off\b/g,
  /\bslip[- ]?on\b/g, // closure style, not a slip garment
  /\bpull[- ]?on\b/g,
  /\bopen[- ]back\b/g,
  /\bback[- ]overlap\b/g,
  /\bshoe ?horn\b/g,
  /\bboot ?jack\b/g,
];

interface GarmentNoun {
  pattern: RegExp;
  category: Exclude<CategoryNormalized, "unknown">;
  /** Optional finer display type (defaults to CATEGORY_DISPLAY). */
  clothingType?: string;
  legacyCategory?: string;
}

/**
 * Garment head nouns. When several match, the LAST occurrence in the title
 * wins — English compounds put the head noun last ("shirt dress" is a dress,
 * "dress shirt" is a shirt, "sweater knit dress" is a dress).
 */
const GARMENT_NOUNS: GarmentNoun[] = [
  // footwear
  { pattern: /\b(shoes?|boots?|sneakers?|sandals?|slippers?|trainers?|loafers?|clogs?|moccasins?|footwear)\b/g, category: "footwear" },
  // sleepwear (before dresses so "nightgown"/"nightshirt" resolve here)
  { pattern: /\b(pajamas?|pyjamas?|nightgowns?|nightshirts?|nighties?|sleepwear|sleepsuits?|robes?|bathrobes?|nightdress(es)?)\b/g, category: "sleepwear" },
  // undergarments (socks/tights are base layers, not footwear)
  { pattern: /\b(socks?|tights|stockings?)\b/g, category: "undergarments", clothingType: "Socks", legacyCategory: "underwear" },
  { pattern: /\b(bras?|briefs?|boxers?|underwear|undergarments?|panty|panties|knickers|undershirts?|camisoles?|camis?|bodysuits?|lingerie)\b/g, category: "undergarments" },
  { pattern: /\bslips?\b(?![- ]?on)/g, category: "undergarments" },
  // dresses & one-piece
  { pattern: /\b(dress(es)?)\b(?!\s+(shirt|pant|trouser)s?)/g, category: "dresses_skirts", clothingType: "Dresses" },
  { pattern: /\b(skirts?|skorts?|gowns?|jumpsuits?|rompers?|overalls?|pinafores?|kaftans?|muu ?muus?|sarongs?)\b/g, category: "dresses_skirts", clothingType: "Dresses" },
  // bottoms (plural "shorts" only — "short sleeve" must not match)
  { pattern: /\b(jeans?)\b/g, category: "bottoms", clothingType: "Jeans", legacyCategory: "jeans" },
  { pattern: /\bshorts\b/g, category: "bottoms", clothingType: "Shorts", legacyCategory: "pants" },
  { pattern: /\b(pants?|trousers?|leggings?|joggers?|sweatpants?|chinos?|capris?|bottoms|slacks)\b/g, category: "bottoms", clothingType: "Pants" },
  // outerwear
  { pattern: /\b(jackets?|coats?|capes?|ponchos?|parkas?|blazers?|vests?|gilets?|windbreakers?|raincoats?|anoraks?|outerwear|shawls?|wraps?)\b/g, category: "outerwear" },
  // tops (incl. knitwear — a cardigan/hoodie shops as a top, not a coat)
  { pattern: /\b(shirts?|blouses?|polos?|tees?|t-?shirts?|tank tops?|tanks?|tunics?|sweaters?|hoodies?|jumpers?|pullovers?|sweatshirts?|cardigans?|henleys?|turtlenecks?|rash ?guards?|tankinis?|tops?)\b/g, category: "tops" },
  // accessories (mostly excluded upstream; kept for validation robustness)
  { pattern: /\b(hats?|caps?|beanies?|scarf|scarves|belts?|gloves?|mittens?|bags?|totes?)\b/g, category: "accessories" },
];

const SET_PATTERN = /\b(sets?|two[- ]piece|2[- ]piece)\b/;
const SLEEP_HINT = /\b(pj|pjs|pajama|pyjama|sleep|night|lounge)\b/;

/**
 * The part of the title that names the garment: everything after "with" /
 * "for" describes attachments or purposes ("Jumpsuit with Polo Shirt",
 * "Shirt for Assisted Dressing"), so it is cut before matching.
 */
function garmentPhrase(title: string): string {
  let t = ` ${title.toLowerCase()} `;
  t = t.split(/\bwith\b/)[0];
  t = t.split(/\bfor\b/)[0];
  NOISE_PHRASES.forEach((p) => {
    t = t.replace(p, " ");
  });
  return t;
}

interface InferredGarment {
  category: Exclude<CategoryNormalized, "unknown">;
  clothingType: string;
  legacyCategory: string;
}

/** Rich title inference: normalized category plus display/legacy fields. */
export function inferGarmentFromTitle(title: string): InferredGarment | null {
  const phrase = garmentPhrase(title);

  // A "set" naming two different garment families is a set, not either garment.
  if (SET_PATTERN.test(phrase)) {
    const families = new Set<string>();
    GARMENT_NOUNS.forEach((noun) => {
      if (new RegExp(noun.pattern.source).test(phrase)) families.add(noun.category);
    });
    if (families.size >= 2 || SLEEP_HINT.test(phrase)) {
      const cat = SLEEP_HINT.test(phrase) ? "sleepwear" : "adaptive_sets";
      return { category: cat, ...CATEGORY_DISPLAY[cat], clothingType: CATEGORY_DISPLAY[cat].clothingType };
    }
  }

  // Head noun wins: the LAST garment noun in the phrase names the garment.
  let best: { index: number; noun: GarmentNoun } | null = null;
  for (const noun of GARMENT_NOUNS) {
    const re = new RegExp(noun.pattern.source, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(phrase)) !== null) {
      if (!best || m.index > best.index) best = { index: m.index, noun };
    }
  }
  if (!best) return null;
  const display = CATEGORY_DISPLAY[best.noun.category];
  return {
    category: best.noun.category,
    clothingType: best.noun.clothingType ?? display.clothingType,
    legacyCategory: best.noun.legacyCategory ?? display.legacyCategory,
  };
}

/** Normalized category inferred from the product title alone. */
export function inferCategoryFromTitle(title: string): CategoryNormalized {
  return inferGarmentFromTitle(title)?.category ?? "unknown";
}

/** Map a stored clothingType/category string onto the normalized enum. */
function categoryFromStored(value: string): CategoryNormalized {
  const v = value.toLowerCase();
  if (/^(footwear|shoes?|socks?)$/.test(v)) return v.startsWith("sock") ? "undergarments" : "footwear";
  if (/^(tops?|shirts?|t-?shirts?)$/.test(v)) return "tops";
  if (/^(bottoms?|pants?|jeans?|shorts?|trousers?)$/.test(v)) return "bottoms";
  if (/^(dresses?(_skirts)?|skirts?)$/.test(v)) return "dresses_skirts";
  if (/^(outerwear|jackets?|coats?)$/.test(v)) return "outerwear";
  if (/^(undergarments?|underwear)$/.test(v)) return "undergarments";
  if (/^(sleepwear|nightwear)$/.test(v)) return "sleepwear";
  if (/^(accessories)$/.test(v)) return "accessories";
  if (/^(adaptive_sets|sets?)$/.test(v)) return "adaptive_sets";
  return "unknown";
}

/**
 * The product's authoritative normalized category: explicit structured
 * metadata first, then the title (which outranks the loose legacy fields —
 * legacy fields are what the feed classifier got wrong), then legacy fields.
 */
export function normalizeCategory(product: Product): CategoryNormalized {
  if (product.categoryNormalized) {
    const explicit = categoryFromStored(product.categoryNormalized);
    if (explicit !== "unknown") return explicit;
  }
  const fromTitle = inferCategoryFromTitle(product.name);
  if (fromTitle !== "unknown") return fromTitle;
  const fromType = categoryFromStored(product.clothingType);
  if (fromType !== "unknown") return fromType;
  return categoryFromStored(product.category);
}

/**
 * Does the stored category agree with what the title clearly says the
 * garment is? Returns an "error" warning on conflict (e.g. category "shoes"
 * but the title names a cape), or null when consistent/inconclusive.
 */
export function validateCategoryAgainstTitle(product: Product): MetadataWarning | null {
  const fromTitle = inferCategoryFromTitle(product.name);
  if (fromTitle === "unknown") return null;
  const stored = product.categoryNormalized
    ? categoryFromStored(product.categoryNormalized)
    : categoryFromStored(product.clothingType) !== "unknown"
      ? categoryFromStored(product.clothingType)
      : categoryFromStored(product.category);
  if (stored === "unknown" || stored === fromTitle) return null;
  return {
    productId: product.id,
    field: "category",
    severity: "error",
    message: `Categorized as "${stored}" but the title "${product.name}" reads as ${fromTitle}.`,
  };
}

// ---------------------------------------------------------------------------
// Gender fit + availability normalization
// ---------------------------------------------------------------------------

export function normalizeGenderFit(product: Product): GenderFitNormalized {
  const fits = (product.genderFit ?? []).map((f) => f.toLowerCase());
  if (fits.length === 0) return "unknown";
  if (fits.some((f) => /teen/.test(f))) return "teen";
  if (fits.some((f) => /kid|child|youth|junior|boys|girls/.test(f))) return "kids";
  if (fits.some((f) => /universal|all bodies|everyone/.test(f))) return "adaptive_universal";
  const women = fits.some((f) => /women/.test(f));
  const men = fits.some((f) => /\bmen\b|^men'?s?$/.test(f) && !/women/.test(f));
  const unisex = fits.some((f) => /unisex|neutral/.test(f));
  if (unisex || (women && men)) return "unisex";
  if (women) return "women";
  if (men) return "men";
  return "unknown";
}

/** Countries a product is stated to ship to (no optimistic defaults). */
export function statedShipping(product: Product): string[] {
  const listed = product.shipsTo?.length
    ? product.shipsTo
    : product.availability?.countries ?? [];
  return listed.filter(Boolean);
}

/**
 * Availability enum for trust chips. Semantics:
 *  - singapore:          Singapore is explicitly listed
 *  - ships_to_singapore: a listed shipping region covers Singapore
 *  - global:             worldwide shipping is stated
 *  - us_only / uk_only:  ships only within the US / UK
 *  - regional:           some countries listed, none covering Singapore
 *  - unknown:            no shipping information stated at all
 */
export function normalizeAvailability(product: Product): AvailabilityNormalized {
  const listed = statedShipping(product);
  if (listed.length === 0) return "unknown";
  if (listed.includes("Singapore")) return "singapore";
  if (listed.some((c) => c === GLOBAL || /worldwide|international/i.test(c))) return "global";
  const expanded = expandShippingRegions(listed);
  if (expanded.includes("Singapore")) return "ships_to_singapore";
  const usOnly = expanded.every((c) => c === "United States");
  if (usOnly) return "us_only";
  const ukOnly = expanded.every((c) => c === "United Kingdom" || c === "Ireland");
  if (ukOnly) return "uk_only";
  return "regional";
}

/** Short human label for the availability enum (for trust chips). */
export function availabilityLabelFor(value: AvailabilityNormalized): string {
  switch (value) {
    case "singapore": return "Available in Singapore";
    case "ships_to_singapore": return "Ships to Singapore";
    case "global": return "Ships worldwide";
    case "us_only": return "US only";
    case "uk_only": return "UK only";
    case "regional": return "Selected countries";
    default: return "Shipping not confirmed";
  }
}

// ---------------------------------------------------------------------------
// Metadata warnings
// ---------------------------------------------------------------------------

/**
 * Everything suspicious or incomplete about one product record. "error"
 * severity means the data would actively mislead a shopper (wrong category);
 * "notice" means a gap the UI should disclose (no price, unknown shipping).
 * The verify suite asserts the live catalog contains zero errors.
 */
export function detectMetadataWarnings(product: Product): MetadataWarning[] {
  const warnings: MetadataWarning[] = [];
  const mismatch = validateCategoryAgainstTitle(product);
  if (mismatch) warnings.push(mismatch);

  const note = (field: string, message: string) =>
    warnings.push({ productId: product.id, field, severity: "notice", message });

  if (!product.name?.trim()) {
    warnings.push({ productId: product.id, field: "name", severity: "error", message: "Missing product name." });
  }
  if (!product.productUrl?.startsWith("http")) {
    warnings.push({ productId: product.id, field: "productUrl", severity: "error", message: "Missing or invalid product URL." });
  }
  if (normalizeCategory(product) === "unknown") note("category", "Category could not be determined.");
  if (!product.price || !Number.isFinite(Number(product.price))) note("price", "No verified numeric price.");
  if (!product.currency) note("currency", "No currency stated.");
  if (!product.imageUrl?.startsWith("http")) note("imageUrl", "No usable product image URL.");
  if (statedShipping(product).length === 0) note("availability", "No shipping countries stated.");
  if (normalizeGenderFit(product) === "unknown") note("genderFit", "No gender/fit range stated.");
  if ((product.sizes ?? []).length === 0) note("sizes", "No size range listed.");
  if ((product.adaptiveFeatures ?? []).length === 0) note("adaptiveFeatures", "No adaptive features listed.");
  if (!product.sourceVerifiedAt) note("sourceVerifiedAt", "Source has no verification date.");
  return warnings;
}

/** Convenience: audit a whole catalog, returning only the given severity. */
export function auditCatalog(
  catalog: Product[],
  severity: "error" | "notice" | "all" = "error"
): MetadataWarning[] {
  return catalog
    .flatMap((product) => detectMetadataWarnings(product))
    .filter((w) => severity === "all" || w.severity === severity);
}
