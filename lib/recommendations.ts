import type { Product } from "@/types";
import { getBrandName } from "@/data/products";
import { GLOBAL_LOCATION } from "@/lib/countries";
import { getProductShipsTo, productShipsTo } from "@/lib/shipping";
import { parsePrice } from "@/lib/currency";

export type RecommendationInput = {
  targetGroup?: string | string[];
  bodyNeeds?: string[];
  country?: string;
  stylePreference?: string[];
  ageRange?: string;
  personalityType?: string[];
  budgetRange?: string;
  closureTypes?: string[];
  sensoryNeeds?: string[];
  mobilityNeeds?: string[];
  clothingTypes?: string[];
  availabilityPreference?: string;
  openEndedNeed?: string;
  limit?: number;
};

export type RecommendationProductMetadata = {
  productName: string;
  brand: string;
  category: string;
  price: string;
  currency: string;
  countriesAvailable: string[];
  productUrl: string;
  imageUrl: string | null;
  targetGroups: string[];
  suitableAgeRanges: string[];
  styleTags: string[];
  personalityTags: string[];
  adaptiveFeatures: string[];
  closureTypes: string[];
  mobilityNeeds: string[];
  sensoryNeeds: string[];
  careEase: string[];
  reasonWhyRelevant: string;
};

export type ProductRecommendation = {
  product: Product;
  metadata: RecommendationProductMetadata;
  score: number;
  reasons: string[];
  scoreBreakdown: Record<string, number>;
};

const SCORE_WEIGHTS = {
  mainPhysicalNeed: 30,
  countryAvailability: 20,
  stylePreference: 15,
  targetGroup: 12,
  budgetRange: 10,
  closureType: 10,
  ageRange: 10,
  sensoryNeed: 10,
  mobilityNeed: 10,
  clothingType: 8,
  shoppingPreference: 6,
  personalityType: 5,
  openEndedNeed: 4,
  exactProductLink: 3,
} as const;

const ignoredOpenEndedWords = new Set([
  "about",
  "after",
  "also",
  "and",
  "because",
  "clothes",
  "clothing",
  "could",
  "easy",
  "for",
  "from",
  "have",
  "into",
  "need",
  "that",
  "the",
  "their",
  "them",
  "this",
  "want",
  "wear",
  "while",
  "with",
  "would",
]);

function toList(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function includesMatch(values: string[], query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return false;
  return values.some((value) => {
    const normalizedValue = normalize(value);
    return (
      normalizedValue.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedValue)
    );
  });
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function inferClosureTypes(product: Product) {
  const text = [
    product.name,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
  ]
    .join(" ")
    .toLowerCase();
  const closures: string[] = [];
  if (/magnetic/.test(text)) closures.push("Magnetic closures");
  if (/velcro|touch-and-close|touch close|easy-touch|hook-and-loop/.test(text)) {
    closures.push("Velcro / touch closures");
  }
  if (/snap/.test(text)) closures.push("Snap closures");
  if (/zip|zipper/.test(text)) closures.push("Zip access");
  if (/pull-on|elastic waist|elasticated/.test(text)) closures.push("Pull-on");
  if (/open-back|back opening|wrap back/.test(text)) closures.push("Open-back");
  if (/side opening|side-access|side access|side closure/.test(text)) {
    closures.push("Side opening");
  }
  if (/hands-free|slip-in|slip on/.test(text)) closures.push("Hands-free entry");
  return unique(closures);
}

function inferTargetGroups(product: Product) {
  const text = [
    product.name,
    product.description,
    product.accessibilityExplanation,
    ...product.disabilityNeeds,
    ...product.bestFor,
    ...product.genderFit,
  ]
    .join(" ")
    .toLowerCase();
  const groups: string[] = [];
  if (/kid|child|children|toddler/.test(text)) groups.push("Child");
  if (/senior|elderly|older adult|arthritis|parkinson|caregiver|assisted/.test(text)) {
    groups.push("Parent", "Caregiver", "Older adult");
  }
  if (/assisted|caregiver|open-back|back opening|bed|lying/.test(text)) {
    groups.push("Caregiver");
  }
  groups.push("Me", "Friend");
  return unique(groups);
}

function inferAgeRanges(product: Product) {
  const text = [
    product.name,
    product.description,
    ...product.disabilityNeeds,
    ...product.bestFor,
    ...product.genderFit,
  ]
    .join(" ")
    .toLowerCase();
  const ranges: string[] = [];
  if (/kid|child|children|toddler/.test(text)) ranges.push("Children");
  if (/senior|elderly|older adult|arthritis|parkinson|stroke|alzheimer/.test(text)) {
    ranges.push("Older adults");
  }
  if (!ranges.includes("Children")) ranges.push("Adults");
  return unique(ranges);
}

function inferMobilityNeeds(product: Product) {
  const text = [
    product.name,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
  ]
    .join(" ")
    .toLowerCase();
  const needs: string[] = [];
  if (/wheelchair|seated|sitting/.test(text) || product.seatedFit) {
    needs.push("Wheelchair-friendly", "Seated fit");
  }
  if (/limited mobility|bend|reach|hands-free|slip-in|easy shoes/.test(text)) {
    needs.push("Limited mobility");
  }
  if (/one-handed|dexterity|arthritis|parkinson|tremor|magnetic|velcro|snap/.test(text)) {
    needs.push("Limited dexterity", "One-handed dressing");
  }
  if (/prosthetic|orthotic|afo|brace|limb difference|wide opening/.test(text)) {
    needs.push("Prosthetic-friendly", "Orthotics / AFOs");
  }
  return unique(needs);
}

function inferSensoryNeeds(product: Product) {
  const text = [
    product.name,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
  ]
    .join(" ")
    .toLowerCase();
  const needs: string[] = [];
  if (product.sensoryFriendly || /sensory|autism|tag-free|tag free|flat seam|soft|low-irritation|skin sensitivity/.test(text)) {
    needs.push("Sensory-friendly", "Skin sensitivity");
  }
  if (/breathable|cotton|cooling|lightweight/.test(text)) needs.push("Breathable fabric");
  return unique(needs);
}

function inferCareEase(product: Product) {
  const text = [
    product.name,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
  ]
    .join(" ")
    .toLowerCase();
  const care: string[] = [];
  if (/assisted|caregiver|open-back|back opening|bed|lying/.test(text)) {
    care.push("Assisted dressing");
  }
  if (/easy dressing|easy access|pull-on|zip|snap|velcro|magnetic|hands-free/.test(text)) {
    care.push("Easier self-dressing");
  }
  if (/machine washable|washable|easy-care|easy care/.test(text)) {
    care.push("Easy care");
  }
  return unique(care);
}

function inferPersonalityTags(product: Product) {
  const tags = [...product.styleTags];
  const text = tags.join(" ").toLowerCase();
  if (/classic|smart|professional|formal/.test(text)) tags.push("Polished");
  if (/sport|active|sneaker/.test(text)) tags.push("Practical", "Active");
  if (/minimal|everyday|casual/.test(text)) tags.push("Low-key", "Comfort-first");
  if (/street|denim|modern/.test(text)) tags.push("Modern");
  return unique(tags);
}

export function getRecommendationMetadata(
  product: Product
): RecommendationProductMetadata {
  return {
    productName: product.productName ?? product.name,
    brand: product.brand ?? getBrandName(product.brandId),
    category: product.category,
    price: product.price,
    currency: product.currency,
    countriesAvailable:
      product.countriesAvailable ??
      product.shipsTo ??
      getProductShipsTo(product),
    productUrl: product.productUrl,
    imageUrl: product.imageUrl || null,
    targetGroups: product.targetGroups ?? inferTargetGroups(product),
    suitableAgeRanges: product.suitableAgeRanges ?? inferAgeRanges(product),
    styleTags: product.styleTags,
    personalityTags: product.personalityTags ?? inferPersonalityTags(product),
    adaptiveFeatures: product.adaptiveFeatures,
    closureTypes: product.closureTypes ?? inferClosureTypes(product),
    mobilityNeeds: product.mobilityNeeds ?? inferMobilityNeeds(product),
    sensoryNeeds: product.sensoryNeeds ?? inferSensoryNeeds(product),
    careEase: product.careEase ?? inferCareEase(product),
    reasonWhyRelevant:
      product.reasonWhyRelevant ??
      product.accessibilityExplanation ??
      product.description,
  };
}

function getSearchableValues(
  product: Product,
  metadata: RecommendationProductMetadata
) {
  return [
    metadata.productName,
    metadata.brand,
    product.clothingType,
    metadata.category,
    product.description,
    product.accessibilityExplanation,
    ...product.bestFor,
    ...product.disabilityNeeds,
    ...metadata.adaptiveFeatures,
    ...metadata.targetGroups,
    ...metadata.suitableAgeRanges,
    ...metadata.styleTags,
    ...metadata.personalityTags,
    ...metadata.closureTypes,
    ...metadata.mobilityNeeds,
    ...metadata.sensoryNeeds,
    ...metadata.careEase,
  ];
}

function budgetFits(product: Product, budgetRange?: string) {
  if (!budgetRange || /no limit/i.test(budgetRange)) return false;
  const price = parsePrice(product.price);
  const text = product.priceRange;
  if (/under \$?50/i.test(budgetRange)) {
    return (price !== null && price <= 50) || text === "$25-$50";
  }
  if (/\$?50-\$?100/i.test(budgetRange)) {
    return (
      (price !== null && price <= 100) ||
      ["$25-$50", "$50-$100"].includes(text)
    );
  }
  if (/\$?100-\$?150/i.test(budgetRange)) {
    return (
      (price !== null && price <= 150) ||
      ["$75-$125", "$100-$150"].includes(text)
    );
  }
  if (/\$?150\+/i.test(budgetRange)) return text === "$150+";
  return false;
}

function openEndedTerms(value?: string) {
  return (
    value
      ?.toLowerCase()
      .match(/[a-z0-9'-]+/g)
      ?.filter((term) => term.length > 2 && !ignoredOpenEndedWords.has(term))
      .slice(0, 20) ?? []
  );
}

function addScore(
  state: { score: number; reasons: string[]; scoreBreakdown: Record<string, number> },
  key: string,
  amount: number,
  reason: string
) {
  state.score += amount;
  state.scoreBreakdown[key] = (state.scoreBreakdown[key] ?? 0) + amount;
  if (!state.reasons.includes(reason)) state.reasons.push(reason);
}

export function scoreProductRecommendation(
  product: Product,
  input: RecommendationInput
): ProductRecommendation {
  const metadata = getRecommendationMetadata(product);
  const searchableValues = getSearchableValues(product, metadata);
  const state = { score: 0, reasons: [] as string[], scoreBreakdown: {} as Record<string, number> };

  const bodyNeeds = input.bodyNeeds ?? [];
  bodyNeeds.forEach((need, index) => {
    if (includesMatch(searchableValues, need)) {
      addScore(
        state,
        "bodyNeeds",
        index === 0
          ? SCORE_WEIGHTS.mainPhysicalNeed
          : Math.round(SCORE_WEIGHTS.mainPhysicalNeed * 0.65),
        `Matches your need for ${need.toLowerCase()}`
      );
    }
  });

  const country = input.country?.trim();
  if (country) {
    if (country === GLOBAL_LOCATION || productShipsTo(product, country)) {
      addScore(
        state,
        "countryAvailability",
        SCORE_WEIGHTS.countryAvailability,
        country === GLOBAL_LOCATION
          ? "Available to global shoppers"
          : `Available for shoppers in ${country}`
      );
    }
  }

  (input.stylePreference ?? []).forEach((style) => {
    if (includesMatch(metadata.styleTags, style)) {
      addScore(
        state,
        "stylePreference",
        SCORE_WEIGHTS.stylePreference,
        `Matches a ${style.toLowerCase()} style`
      );
    }
  });

  toList(input.targetGroup).forEach((target) => {
    if (includesMatch(metadata.targetGroups, target)) {
      addScore(
        state,
        "targetGroup",
        SCORE_WEIGHTS.targetGroup,
        `Suitable for ${target.toLowerCase()} shopping needs`
      );
    }
  });

  if (budgetFits(product, input.budgetRange)) {
    addScore(
      state,
      "budgetRange",
      SCORE_WEIGHTS.budgetRange,
      `Fits the ${input.budgetRange?.toLowerCase()} budget`
    );
  }

  (input.closureTypes ?? []).forEach((closure) => {
    if (includesMatch(metadata.closureTypes, closure) || includesMatch(metadata.adaptiveFeatures, closure)) {
      addScore(
        state,
        "closureType",
        SCORE_WEIGHTS.closureType,
        `Has ${closure.toLowerCase()}`
      );
    }
  });

  if (input.ageRange && includesMatch(metadata.suitableAgeRanges, input.ageRange)) {
    addScore(
      state,
      "ageRange",
      SCORE_WEIGHTS.ageRange,
      `Suitable for ${input.ageRange.toLowerCase()}`
    );
  }

  (input.sensoryNeeds ?? []).forEach((need) => {
    if (includesMatch(metadata.sensoryNeeds, need)) {
      addScore(
        state,
        "sensoryNeeds",
        SCORE_WEIGHTS.sensoryNeed,
        `Supports ${need.toLowerCase()}`
      );
    }
  });

  (input.mobilityNeeds ?? []).forEach((need) => {
    if (includesMatch(metadata.mobilityNeeds, need) || includesMatch(searchableValues, need)) {
      addScore(
        state,
        "mobilityNeeds",
        SCORE_WEIGHTS.mobilityNeed,
        `Supports ${need.toLowerCase()}`
      );
    }
  });

  (input.clothingTypes ?? []).forEach((type) => {
    if (
      includesMatch([product.clothingType, product.category, metadata.category], type) ||
      normalize(type) === "formal" && includesMatch(metadata.styleTags, "Formal")
    ) {
      addScore(
        state,
        "clothingType",
        SCORE_WEIGHTS.clothingType,
        `Matches ${type.toLowerCase()} clothing`
      );
    }
  });

  const availability = input.availabilityPreference?.toLowerCase() ?? "";
  if (availability.includes("in-store") && product.availability.inStore) {
    addScore(
      state,
      "shoppingPreference",
      SCORE_WEIGHTS.shoppingPreference,
      "Has in-store availability"
    );
  } else if (availability.includes("online") && product.availability.online) {
    addScore(
      state,
      "shoppingPreference",
      SCORE_WEIGHTS.shoppingPreference,
      "Available online"
    );
  }

  (input.personalityType ?? []).forEach((personality) => {
    if (includesMatch(metadata.personalityTags, personality)) {
      addScore(
        state,
        "personalityType",
        SCORE_WEIGHTS.personalityType,
        `Fits a ${personality.toLowerCase()} vibe`
      );
    }
  });

  const terms = openEndedTerms(input.openEndedNeed);
  if (terms.length > 0) {
    const searchableText = searchableValues.join(" ").toLowerCase();
    const matchedTerms = terms.filter((term) => searchableText.includes(term));
    if (matchedTerms.length > 0) {
      addScore(
        state,
        "openEndedNeed",
        Math.min(20, matchedTerms.length * SCORE_WEIGHTS.openEndedNeed),
        `Reflects what you shared about ${matchedTerms.slice(0, 3).join(", ")}`
      );
    }
  }

  if (product.linkType === "exact-product") {
    addScore(
      state,
      "exactProductLink",
      SCORE_WEIGHTS.exactProductLink,
      "Uses an exact product link"
    );
  }

  return {
    product,
    metadata,
    score: state.score,
    reasons: state.reasons,
    scoreBreakdown: state.scoreBreakdown,
  };
}

export function rankProductRecommendations(
  candidateProducts: Product[],
  input: RecommendationInput
) {
  return candidateProducts
    .map((product) => scoreProductRecommendation(product, input))
    .filter((recommendation) => {
      if (recommendation.score > 0) return true;
      return !(
        input.bodyNeeds?.length ||
        input.stylePreference?.length ||
        input.closureTypes?.length ||
        input.sensoryNeeds?.length ||
        input.mobilityNeeds?.length ||
        input.clothingTypes?.length ||
        input.openEndedNeed
      );
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.product.linkType === "exact-product") -
          Number(a.product.linkType === "exact-product") ||
        a.metadata.productName.localeCompare(b.metadata.productName)
    )
    .slice(0, input.limit ?? 12);
}
