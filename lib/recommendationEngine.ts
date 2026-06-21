import { budgetMatches, getProductShipsTo, matches, products } from "@/data/products";
import { expandShippingRegions, GLOBAL } from "@/lib/countries";
import { resolvePriceStatus } from "@/lib/pricingProvider";
import type {
  AdaptiveClothingProfile,
  Product,
  RecommendationInput,
  RecommendationResult,
} from "@/types";

/**
 * Adaptive recommendation engine. Builds on the existing catalog and the
 * shipping/budget helpers already used by recommendProducts/searchProducts —
 * those two functions are untouched; this file only adds new, additive
 * exports so the quiz results page can ask for richer, structured output
 * without changing how search or product-detail pages behave.
 */

const IGNORED_WORDS = new Set([
  "about", "after", "also", "and", "because", "clothes", "clothing",
  "could", "easy", "for", "from", "have", "into", "need", "that",
  "the", "their", "them", "this", "want", "while", "with", "would",
]);

function parseOpenEndedTerms(text?: string): string[] {
  return (
    (text ?? "")
      .toLowerCase()
      .match(/[a-z0-9'-]+/g)
      ?.filter((term) => term.length > 2 && !IGNORED_WORDS.has(term))
      .slice(0, 20) ?? []
  );
}

function searchableText(product: Product): string {
  return [
    product.name,
    product.clothingType,
    product.category,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
    ...product.styleTags,
  ]
    .join(" ")
    .toLowerCase();
}

// --- Item classification -------------------------------------------------

/**
 * Classifies a product by adaptive clothing *function* (not just brand),
 * computed from its existing fields. Runs over the full catalog (1600+
 * generated entries), so this stays a pure derived function rather than
 * stored per-product data.
 */
export function classifyItem(product: Product): string[] {
  const tags = new Set<string>();
  const features = product.adaptiveFeatures.map((f) => f.toLowerCase()).join(" ");
  const bestFor = product.bestFor.map((f) => f.toLowerCase()).join(" ");
  const needs = product.disabilityNeeds.map((f) => f.toLowerCase()).join(" ");
  const clothingType = product.clothingType.toLowerCase();
  const isLowerBody = ["pants", "jeans", "shorts"].includes(clothingType);
  const isUpperBody = ["tops", "shirts", "dresses"].includes(clothingType);

  if (product.seatedFit && isLowerBody) {
    tags.add(needs.includes("wheelchair") ? "Wheelchair-friendly trousers" : "Seated-fit trousers");
    if (clothingType === "jeans") tags.add("Seated-fit jeans");
  }
  if (features.includes("magnetic") && isUpperBody) {
    tags.add("Magnetic closure shirt");
  }
  if (features.includes("velcro") && clothingType === "shoes") {
    tags.add("Velcro closure shoes");
  }
  if (
    (features.includes("open back") || features.includes("open-back") || features.includes("shoulder opening")) &&
    isUpperBody
  ) {
    tags.add("Open-back top");
  }
  if (
    (features.includes("side fasten") || features.includes("side-zip") || features.includes("drop-front")) &&
    isLowerBody
  ) {
    tags.add("Side-zip pants");
  }
  if (product.sensoryFriendly) {
    tags.add(isUpperBody ? "Sensory-friendly shirt" : "Sensory-friendly clothing");
  }
  if (clothingType === "jackets") {
    tags.add("Lightweight adaptive outerwear");
  }
  if (features.includes("zip") || features.includes("zipper")) {
    tags.add("Easy-grip zipper clothing");
  }
  if (features.includes("hands-free") && clothingType === "shoes") {
    tags.add("Hands-free entry footwear");
  }
  if (clothingType === "shoes" && (features.includes("afo") || needs.includes("orthotic"))) {
    tags.add("Adaptive shoes");
  }
  if (
    bestFor.includes("assisted") ||
    bestFor.includes("care") ||
    needs.includes("care support") ||
    features.includes("assisted dressing")
  ) {
    tags.add("Caregiver-assisted dressing item");
  }
  if (product.oneHandedDressing) {
    tags.add("One-handed dressing item");
  }

  if (tags.size === 0) {
    tags.add(`Adaptive ${product.clothingType.toLowerCase()}`);
  }

  return Array.from(tags).slice(0, 3);
}

// --- Self-selected adaptive clothing profiles (non-medical) ---------------

interface ProfileRule {
  profile: AdaptiveClothingProfile;
  test: (input: RecommendationInput) => boolean;
}

const PROFILE_RULES: ProfileRule[] = [
  {
    profile: {
      id: "wheelchair-seated",
      label: "Mobility-restricted / wheelchair users",
      description: "Clothing shaped for seated posture, with pressure-conscious seams and easy seated dressing.",
    },
    test: (i) =>
      i.mobilityLevel === "wheelchair-or-seated" ||
      (i.needs ?? []).some((n) => /wheelchair/i.test(n)),
  },
  {
    profile: {
      id: "sensory-sensitive",
      label: "Sensory-sensitive users",
      description: "Soft, tag-free fabrics and flat seams that reduce irritation and overstimulation.",
    },
    test: (i) =>
      (i.sensoryNeeds ?? []).some((n) => !/no sensory/i.test(n)) ||
      (i.needs ?? []).some((n) => /sensory|autism/i.test(n)),
  },
  {
    profile: {
      id: "limited-hand-mobility",
      label: "Limited hand mobility users",
      description: "Fastenings that don't require fine pinching or twisting motions.",
    },
    test: (i) => (i.needs ?? []).some((n) => /dexterity|arthritis|parkinson|fine motor/i.test(n)),
  },
  {
    profile: {
      id: "one-handed-dressing",
      label: "One-handed dressing users",
      description: "Garments designed to be put on and fastened using only one hand.",
    },
    test: (i) =>
      (i.needs ?? []).some((n) => /one-handed/i.test(n)) ||
      (i.closurePreference ?? []).some((c) => /magnetic|slip-on/i.test(c)),
  },
  {
    profile: {
      id: "elderly-easy-wear",
      label: "Elderly users needing easy-wear clothing",
      description: "Familiar, comfortable silhouettes with fastenings that stay simple day to day.",
    },
    test: (i) =>
      i.targetGroup === "elderly" ||
      i.ageRange === "60-74" ||
      i.ageRange === "75-plus" ||
      (i.needs ?? []).some((n) => /elderly|age-related/i.test(n)),
  },
  {
    profile: {
      id: "caregiver-assisted",
      label: "Caregiver-assisted dressing users",
      description: "Open-back and drop-front designs that make assisted dressing faster and gentler.",
    },
    test: (i) => i.caregiverInvolvement === "caregiver-assisted",
  },
  {
    profile: {
      id: "seated-fit",
      label: "Users needing seated-fit clothing",
      description: "Cuts that sit cleanly while seated for most of the day.",
    },
    test: (i) => i.mobilityLevel === "wheelchair-or-seated" || i.mobilityLevel === "some-difficulty",
  },
  {
    profile: {
      id: "lightweight-breathable",
      label: "Users needing lightweight or breathable clothing",
      description: "Soft, breathable fabrics chosen for comfort over a full day of wear.",
    },
    test: (i) =>
      (i.fabricComfortNeeds ?? []).some((n) => /breathable|lightweight|soft/i.test(n)) ||
      (i.sensoryNeeds ?? []).some((n) => /soft/i.test(n)),
  },
  {
    profile: {
      id: "style-focused",
      label: "Users seeking minimalist, formal, casual or stylish adaptive fashion",
      description: "Adaptive features built into looks that don't read as medical or clinical.",
    },
    test: (i) => (i.styles ?? []).length > 0,
  },
];

/**
 * Maps the shopper's self-selected answers onto practical adaptive clothing
 * profiles for shopping purposes only. This never diagnoses a condition —
 * it just groups people who picked similar functional needs so we can
 * narrow down clothing, the same way a stylist would ask follow-up
 * questions rather than asking "what is wrong with you?"
 */
export function classifyAdaptiveProfiles(
  input: RecommendationInput
): AdaptiveClothingProfile[] {
  return PROFILE_RULES.filter((rule) => rule.test(input)).map((rule) => rule.profile);
}

// --- "Beats basic search" summary -----------------------------------------

export function buildMatchSummary(input: RecommendationInput): string {
  const parts: string[] = [];

  if (input.needs?.length) {
    parts.push(`${input.needs.slice(0, 2).join(" and ").toLowerCase()} needs`);
  }
  if (input.mobilityLevel === "wheelchair-or-seated") {
    parts.push("seated comfort needs");
  } else if (input.mobilityLevel === "some-difficulty") {
    parts.push("everyday mobility needs");
  }
  if (input.location) parts.push(`${input.location} availability`);
  if (input.styles?.length) {
    parts.push(`${input.styles.slice(0, 2).join(" and ").toLowerCase()} style`);
  }
  if (input.budget) parts.push(`your ${input.budget.toLowerCase()} budget`);

  if (parts.length === 0) {
    return "These are the closest individual adaptive clothing matches we could find in the catalog.";
  }
  return `Based on your ${parts.join(", ")}, these exact items are the best matches — not just a generic brand list.`;
}

// --- Core recommendation scoring -------------------------------------------

function scoreProducts(
  input: RecommendationInput,
  openEndedTerms: string[]
): RecommendationResult[] {
  const needs = input.needs ?? [];
  const styles = input.styles ?? [];
  const closurePreference = input.closurePreference ?? [];
  const sensoryNeeds = (input.sensoryNeeds ?? []).filter((n) => !/no sensory/i.test(n));

  return products.map((product) => {
    const needsSatisfied: string[] = [];
    const preferencesSatisfied: string[] = [];
    const reasons: string[] = [];
    let score = 0;

    needs.forEach((need) => {
      if (
        product.disabilityNeeds.some((item) => matches(item, need)) ||
        product.bestFor.some((item) => matches(item, need)) ||
        product.adaptiveFeatures.some((item) => matches(item, need))
      ) {
        needsSatisfied.push(need);
        reasons.push(`Supports ${need.toLowerCase()}`);
        score += 2;
      }
    });

    closurePreference.forEach((pref) => {
      if (product.adaptiveFeatures.some((item) => matches(item, pref))) {
        preferencesSatisfied.push(pref);
        reasons.push(`Uses your preferred ${pref.toLowerCase()} closure`);
        score += 2;
      }
    });

    sensoryNeeds.forEach((need) => {
      if (product.sensoryFriendly || product.adaptiveFeatures.some((item) => matches(item, need))) {
        preferencesSatisfied.push(need);
        score += 1;
      }
    });

    styles.forEach((style) => {
      if (product.styleTags.some((item) => matches(item, style))) {
        preferencesSatisfied.push(style);
        reasons.push(`Matches a ${style.toLowerCase()} style`);
        score += 1;
      }
    });

    if (input.budget && budgetMatches(product.priceRange, input.budget)) {
      preferencesSatisfied.push(input.budget);
      reasons.push(`Fits the ${input.budget.toLowerCase()} budget`);
      score += 1;
    }

    if (openEndedTerms.length > 0) {
      const matchedTerms = openEndedTerms.filter((term) => searchableText(product).includes(term));
      if (matchedTerms.length > 0) {
        score += matchedTerms.length * 2;
        reasons.push(`Reflects what you shared about ${matchedTerms.slice(0, 3).join(", ")}`);
      }
    }

    const shipsToLocation = input.location
      ? (() => {
          const shipsTo = getProductShipsTo(product);
          if (shipsTo.includes(GLOBAL)) return true;
          const locationCandidates = expandShippingRegions([input.location]);
          return locationCandidates.some((country) => shipsTo.includes(country));
        })()
      : true;
    if (input.location && shipsToLocation) {
      reasons.push(`Ships to ${input.location}`);
    }

    return {
      product,
      score,
      reasons,
      itemClassification: classifyItem(product),
      needsSatisfied: Array.from(new Set(needsSatisfied)),
      preferencesSatisfied: Array.from(new Set(preferencesSatisfied)),
      unmetNeeds: needs.filter((need) => !needsSatisfied.includes(need)),
      isFallback: false,
      shipsToLocation,
      priceStatus: resolvePriceStatus(product),
    };
  });
}

function rankResults(results: RecommendationResult[], limit: number): RecommendationResult[] {
  return [...results]
    .sort((a, b) => {
      if (a.shipsToLocation !== b.shipsToLocation) return a.shipsToLocation ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return Number(b.product.linkType === "exact-product") - Number(a.product.linkType === "exact-product");
    })
    .slice(0, limit);
}

/**
 * Richer successor to recommendProducts(): scores the catalog against the
 * full set of strict operational inputs (needs, closures, sensory needs,
 * style, budget, location), and returns structured reasoning per item
 * (what it satisfies, what it doesn't, how it's classified). Falls back to
 * progressively broader criteria rather than ever returning an empty list,
 * marking fallback results so the UI can be honest about partial matches.
 */
export function recommendAdaptiveProducts(input: RecommendationInput): RecommendationResult[] {
  const limit = input.limit ?? 9;
  const openEndedTerms = parseOpenEndedTerms(input.openEndedNeed);
  const hasCriteria = Boolean(
    input.needs?.length ||
      input.styles?.length ||
      input.closurePreference?.length ||
      input.sensoryNeeds?.length ||
      input.budget ||
      openEndedTerms.length
  );

  const scored = scoreProducts(input, openEndedTerms);
  const matched = scored.filter((result) => result.score > 0 || !hasCriteria);
  if (matched.length > 0) return rankResults(matched, limit);

  // Fallback 1: drop closure/sensory/budget/free-text, keep needs + style.
  const relaxed = scoreProducts({ ...input, closurePreference: [], sensoryNeeds: [], budget: undefined, openEndedNeed: undefined }, []);
  const relaxedMatched = relaxed.filter((result) => result.score > 0);
  if (relaxedMatched.length > 0) {
    return rankResults(relaxedMatched, limit).map((result) => ({
      ...result,
      isFallback: true,
      unmetNeeds: input.needs ?? [],
    }));
  }

  // Fallback 2: no criteria matched anything — show the closest location-aware set.
  const broad = scoreProducts({ location: input.location, limit }, []);
  return rankResults(broad, limit).map((result) => ({
    ...result,
    isFallback: true,
    unmetNeeds: input.needs ?? [],
  }));
}
