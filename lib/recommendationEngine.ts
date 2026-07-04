import { budgetMatches, getProductShipsTo, matches, products } from "@/data/products";
import { expandShippingRegions, GLOBAL } from "@/lib/countries";
import { resolvePriceStatus } from "@/lib/pricingProvider";
import type {
  AdaptiveClothingProfile,
  ConfidenceLevel,
  Product,
  ProductNeedsEvaluation,
  RecommendationInput,
  RecommendationResult,
} from "@/types";

/**
 * Adaptive recommendation engine.
 *
 * The defining idea of this file is the split between HARD REQUIREMENTS and
 * SOFT PREFERENCES (see the two clearly-marked sections below):
 *
 *   • HARD REQUIREMENTS are accessibility / availability constraints. They are
 *     treated as *filters*: a product that fails an active hard requirement is
 *     never shown as an exact match. Style, vibe and brand can never override
 *     them. (e.g. a wheelchair user must not get a generic product without
 *     seated-fit support; a sensory-sensitive user must not get a scratchy,
 *     tagged garment ranked first.)
 *
 *   • SOFT PREFERENCES are taste/economics constraints (style, budget,
 *     lifestyle, age). They only affect *ranking* among products that already
 *     pass the hard requirements — they never include or exclude an item.
 *
 * Only when too few products satisfy every hard requirement do we fall back to
 * the closest partial matches, and those are clearly flagged (`isFallback`)
 * with the specific requirements they miss (`unmetNeeds`), so the UI can be
 * honest rather than pretend a fallback is a perfect match.
 *
 * The existing catalog helpers (recommendProducts/searchProducts) are
 * untouched; this file only adds new, additive exports for the quiz results.
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

/**
 * Only the product's STRUCTURED adaptive data — listed features, stated
 * needs and fit fields — with free-form marketing description excluded.
 * A hard requirement satisfied against this text counts as explicit
 * evidence; one satisfied only against the full text is inferred, which
 * lowers confidence and adds a "check before buying" note.
 */
function structuredText(product: Product): string {
  return [
    product.clothingType,
    product.category,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
    ...(product.closureTypes ?? []),
    ...(product.mobilityNeeds ?? []),
    ...(product.sensoryNeeds ?? []),
    ...(product.careEase ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function anyMatch(values: string[], pattern: RegExp): boolean {
  return values.some((value) => pattern.test(value.toLowerCase()));
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
    tags.add("AFO-friendly footwear");
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

// =========================================================================
// HARD REQUIREMENTS — accessibility / availability filters
// =========================================================================
//
// Each rule is `active` only when the shopper actually selected the relevant
// need, and `satisfied` checks the product's existing fields. A product must
// satisfy EVERY active hard requirement to be an exact match. `label` is shown
// as a matched/unmet need; `reason` feeds the plain-language explanation.

interface HardRequirement {
  id: string;
  label: string;
  reason: string;
  active: (input: RecommendationInput) => boolean;
  satisfied: (product: Product, blob: string) => boolean;
}

const HARD_REQUIREMENTS: HardRequirement[] = [
  {
    id: "country",
    label: "Available in your country",
    reason: "is available where you are",
    active: (i) => Boolean(i.location),
    // satisfied is computed specially (needs the location), see shipsToLocation().
    satisfied: () => true,
  },
  {
    id: "wheelchair-seated",
    label: "Wheelchair / seated-fit",
    reason: "supports seated comfort",
    active: (i) =>
      i.mobilityLevel === "wheelchair-or-seated" ||
      anyMatch(i.needs ?? [], /wheelchair|seated/),
    satisfied: (p, blob) => p.seatedFit || /wheelchair|seated/.test(blob),
  },
  {
    id: "limited-hand-mobility",
    label: "Easy closures for limited hand movement",
    reason: "uses fasteners that are easy on the hands",
    active: (i) =>
      anyMatch(i.needs ?? [], /dexterity|arthritis|parkinson|fine motor|tremor|stroke|limited hand/),
    satisfied: (p, blob) =>
      p.oneHandedDressing ||
      /magnetic|velcro|hook-and-loop|elastic|pull-on|pull on|slip-on|slip on|easy-grip|easy grip|snap|one-handed|hands-free/.test(blob),
  },
  {
    id: "one-handed",
    label: "One-handed dressing support",
    reason: "can be put on with one hand",
    active: (i) =>
      anyMatch(i.needs ?? [], /one-handed|one handed/) ||
      anyMatch(i.closurePreference ?? [], /magnetic|slip-on|slip on/),
    satisfied: (p, blob) =>
      p.oneHandedDressing || /one-handed|one handed|magnetic|hands-free|pull-on|pull on/.test(blob),
  },
  {
    id: "caregiver-assisted",
    label: "Easy caregiver-assisted dressing",
    reason: "is easy to change with a caregiver's help",
    active: (i) => i.caregiverInvolvement === "caregiver-assisted",
    satisfied: (_p, blob) =>
      /open-back|open back|back opening|back-opening|side opening|side-opening|side fasten|drop-front|drop front|wrap|assisted|caregiver/.test(
        blob
      ),
  },
  {
    id: "sensory",
    label: "Sensory-friendly",
    reason: "is gentle on sensitive skin",
    active: (i) =>
      (i.sensoryNeeds ?? []).some((n) => !/no sensory/i.test(n)) ||
      anyMatch(i.needs ?? [], /sensory|autism|skin sensitivity/),
    satisfied: (p, blob) =>
      p.sensoryFriendly ||
      /tag-free|tag free|tagless|seamless|flat seam|soft|low-friction|low friction|non-irritating|sensory/.test(blob),
  },
  {
    id: "afo-orthotic",
    label: "AFO / orthotic / prosthetic accommodation",
    reason: "makes room for AFOs, braces or prosthetics",
    active: (i) =>
      anyMatch(i.needs ?? [], /\bafo\b|orthotic|prosthetic|leg brace|ankle brace/),
    satisfied: (_p, blob) =>
      /\bafo\b|orthotic|prosthetic|brace|wide opening|extra depth|wide fit|adjustable width|removable insole|limb difference/.test(
        blob
      ),
  },
  {
    id: "medical-access",
    label: "Medical device / body-zone access",
    reason: "gives access for medical or body-zone needs",
    active: (i) =>
      anyMatch(i.needs ?? [], /medical|post-surgery|surgery|\bport\b|\btube\b|ostomy|body-zone/) ||
      anyMatch(i.closurePreference ?? [], /port or tube|medical/),
    satisfied: (_p, blob) =>
      /port access|tube access|ostomy|medical|post-surgery|surgery|recovery|snap crotch|full-length opening|side opening|side-opening|drop-front|drop front|open-back|open back|easy access|abdominal access|examination/.test(
        blob
      ),
  },
  {
    id: "posture-fit",
    label: "Spinal / posture-aware fit",
    reason: "is shaped for spinal or posture support",
    active: (i) => anyMatch(i.needs ?? [], /scoliosis|spinal|posture|kyphosis/),
    satisfied: (_p, blob) =>
      /scoliosis|spinal|posture|back support|seated posture|torso support/.test(blob),
  },
  {
    id: "closure",
    label: "Your preferred closure type",
    reason: "has the closure type you prefer",
    active: (i) => (i.closurePreference ?? []).some((c) => !/no preference/i.test(c)),
    // satisfied is computed specially via closureSatisfied().
    satisfied: () => true,
  },
];

const CLOSURE_KEYWORDS: { test: RegExp; pattern: RegExp }[] = [
  { test: /magnetic/i, pattern: /magnetic/ },
  { test: /velcro/i, pattern: /velcro|hook-and-loop|touch close/ },
  { test: /zip/i, pattern: /zip|zipper/ },
  { test: /elastic/i, pattern: /elastic|pull-on|pull on/ },
  { test: /slip-on|slip on|no fastening/i, pattern: /slip-on|slip on|pull-on|pull on|elastic|hands-free/ },
];

/** Does the product offer at least one of the shopper's preferred closures? */
function closureSatisfied(blob: string, closurePreference: string[]): boolean {
  const wanted = closurePreference.filter((c) => !/no preference/i.test(c));
  if (wanted.length === 0) return true;
  return wanted.some((pref) =>
    CLOSURE_KEYWORDS.some((entry) => entry.test.test(pref) && entry.pattern.test(blob))
  );
}

/** Whether a product ships to the shopper's (region) location. */
function shipsToLocation(product: Product, location?: string): boolean {
  if (!location) return true;
  const shipsTo = getProductShipsTo(product);
  if (shipsTo.includes(GLOBAL)) return true;
  return expandShippingRegions([location]).some((country) => shipsTo.includes(country));
}

function isHardRequirementSatisfied(
  requirement: HardRequirement,
  product: Product,
  blob: string,
  input: RecommendationInput
): boolean {
  if (requirement.id === "country") return shipsToLocation(product, input.location);
  if (requirement.id === "closure") return closureSatisfied(blob, input.closurePreference ?? []);
  return requirement.satisfied(product, blob);
}

// =========================================================================
// CONFIDENCE — how verifiable a match is, separate from the match itself
// =========================================================================

interface ConfidenceInfo {
  level: ConfidenceLevel;
  notes: string[];
}

/**
 * high  = every active need confirmed by explicit product data AND clear
 *         availability AND an exact product link.
 * medium= matches, but some evidence was inferred from description text or
 *         some data (price, exact link) is incomplete.
 * low   = misses a need, or availability in the shopper's country can't be
 *         shown.
 */
function confidenceFor(opts: {
  activeCount: number;
  inferredLabels: string[];
  unmetCount: number;
  ships: boolean;
  hasLocation: boolean;
  exactLink: boolean;
  priceKnown: boolean;
}): ConfidenceInfo {
  const notes: string[] = [];

  if (opts.unmetCount > 0) {
    notes.push("Doesn't meet every need you selected — shown only as a closest alternative.");
    return { level: "low", notes };
  }
  if (opts.hasLocation && !opts.ships) {
    notes.push("Availability in your selected country isn't listed.");
    return { level: "low", notes };
  }

  if (opts.inferredLabels.length > 0) {
    notes.push(
      `${opts.inferredLabels.slice(0, 2).join(" and ")} ${
        opts.inferredLabels.length === 1 ? "was" : "were"
      } inferred from the product description rather than listed features.`
    );
  }
  if (!opts.exactLink) {
    notes.push("Links to the brand's page rather than the exact product.");
  }
  if (!opts.priceKnown) {
    notes.push("Price isn't verified.");
  }

  if (opts.activeCount === 0) {
    notes.unshift(
      "No access needs selected — confidence reflects how complete the product data is."
    );
    return { level: "medium", notes };
  }

  if (opts.inferredLabels.length === 0 && opts.exactLink) {
    notes.unshift("Every need you selected is confirmed by the brand's listed features.");
    return { level: "high", notes };
  }
  return { level: "medium", notes };
}

/** Honest pre-purchase checks: fit, shipping, returns, missing data. Max 4. */
function buildCheckBeforeBuying(opts: {
  product: Product;
  inferredLabels: string[];
  ships: boolean;
  hasLocation: boolean;
  location?: string;
  priceKnown: boolean;
  exactLink: boolean;
}): string[] {
  const checks: string[] = [];
  const shipsTo = getProductShipsTo(opts.product);
  const shipsOnlyViaGlobal =
    opts.hasLocation &&
    opts.ships &&
    shipsTo.includes(GLOBAL) &&
    !expandShippingRegions([opts.location!]).some((c) => shipsTo.includes(c));

  opts.inferredLabels.slice(0, 2).forEach((label) => {
    checks.push(
      `"${label}" was inferred from the description — confirm it with the brand before buying.`
    );
  });
  if (!opts.exactLink) {
    checks.push("The link opens the brand's page, not this exact item — confirm it there.");
  }
  if (!opts.priceKnown) {
    checks.push("No verified price on file — check the official site for current pricing.");
  }
  if (opts.hasLocation && !opts.ships) {
    checks.push(`Shipping to ${opts.location} isn't listed — check delivery options first.`);
  } else if (shipsOnlyViaGlobal) {
    checks.push(
      `Ships internationally — confirm delivery to ${opts.location}, costs and duties.`
    );
  }
  checks.push("Check the size guide and the brand's return policy before ordering.");
  return checks.slice(0, 4);
}

/**
 * Evaluate one product against a shopper's needs (e.g. their Adaptive Fit
 * Passport) outside the quiz-results flow — used by the browse-page passport
 * filter and the saved-items list. Category, clothing range and location are
 * included as hard requirements, exactly like the quiz results.
 */
export function evaluateProductForInput(
  product: Product,
  input: RecommendationInput
): ProductNeedsEvaluation {
  const blob = searchableText(product);
  const structured = structuredText(product);
  const activeHard = HARD_REQUIREMENTS.filter((req) => req.active(input));

  const unmetNeeds: string[] = [];
  const inferredLabels: string[] = [];
  activeHard.forEach((req) => {
    if (!isHardRequirementSatisfied(req, product, blob, input)) {
      unmetNeeds.push(req.label);
    } else if (
      req.id !== "country" &&
      !(req.id === "closure"
        ? closureSatisfied(structured, input.closurePreference ?? [])
        : req.satisfied(product, structured))
    ) {
      inferredLabels.push(req.label);
    }
  });

  const selectedCats = (input.clothingTypes ?? []).filter((c) => c && !/not sure/i.test(c));
  const matchesCategory =
    selectedCats.length === 0 || productInSelectedCategories(product, selectedCats);
  const matchesRange = productMatchesGenderRange(product, input.genderRange, input.childrenTeen);
  const ships = shipsToLocation(product, input.location);

  if (!matchesCategory) unmetNeeds.push("Your selected clothing type");
  if (!matchesRange) unmetNeeds.push("Your clothing range");

  const confidence = confidenceFor({
    activeCount: activeHard.length,
    inferredLabels,
    unmetCount: unmetNeeds.length,
    ships,
    hasLocation: Boolean(input.location),
    exactLink: product.linkType === "exact-product",
    priceKnown: resolvePriceStatus(product) === "known",
  });

  return {
    meetsAllNeeds: unmetNeeds.length === 0,
    unmetNeeds,
    confidence: confidence.level,
    matchesCategory,
    matchesRange,
    shipsToSelectedLocation: ships,
  };
}

// =========================================================================
// SOFT PREFERENCES — taste / economics, ranking only (never filter)
// =========================================================================

const LIFESTYLE_STYLE_HINTS: Record<string, RegExp> = {
  work: /professional|smart|classic|formal/,
  school: /casual|everyday|practical/,
  "formal-event": /formal|elegant|classic|professional/,
  outdoor: /sport|active|outdoor|practical/,
  home: /comfort|relaxed|soft|everyday/,
  "daily-wear": /everyday|casual|comfort/,
};

interface SoftScore {
  score: number;
  reasons: string[];
  preferencesSatisfied: string[];
}

/**
 * Scores soft preferences for a product that has ALREADY passed the hard
 * requirements. Returns additive points plus the human-readable matches —
 * this only influences ordering, never whether the product is shown.
 */
function scoreSoftPreferences(product: Product, input: RecommendationInput): SoftScore {
  const reasons: string[] = [];
  const preferencesSatisfied: string[] = [];
  let score = 0;

  (input.styles ?? []).forEach((style) => {
    if (product.styleTags.some((tag) => matches(tag, style))) {
      score += 3;
      preferencesSatisfied.push(style);
      reasons.push(`matches your ${style.toLowerCase()} style`);
    }
  });

  if (input.budget && budgetMatches(product.priceRange, input.budget)) {
    score += 2;
    preferencesSatisfied.push(input.budget);
    reasons.push(`fits your ${input.budget.toLowerCase()} budget`);
  }

  // Clothing range is enforced as a STRICT pre-filter before scoring (see
  // productMatchesGenderRange), so every candidate here already fits the
  // selected range. A small bonus still favours items made specifically for
  // that range over unisex ones.
  if (input.genderRange === "womenswear" || input.genderRange === "menswear") {
    const wanted = input.genderRange === "womenswear" ? /women/i : /\bmen\b/i;
    if ((product.genderFit ?? []).some((fit) => wanted.test(fit))) {
      score += 1;
      preferencesSatisfied.push("Your clothing range");
      reasons.push("is made for your selected clothing range");
    }
  }

  if (input.lifestyleSetting) {
    const hint = LIFESTYLE_STYLE_HINTS[input.lifestyleSetting];
    if (hint && product.styleTags.some((tag) => hint.test(tag.toLowerCase()))) {
      score += 1;
      reasons.push("suits where you'll wear it");
    }
  }

  if (
    (input.ageRange === "60-74" || input.ageRange === "75-plus" || input.targetGroup === "elderly") &&
    anyMatch([...product.bestFor, ...product.disabilityNeeds], /elder|age|senior|arthritis/)
  ) {
    score += 1;
  }

  // Prefer items with a verified exact-product link as a final tiebreak.
  if (product.linkType === "exact-product") score += 0.5;

  return { score, reasons, preferencesSatisfied: Array.from(new Set(preferencesSatisfied)) };
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

  if (input.mobilityLevel === "wheelchair-or-seated") {
    parts.push("seated comfort needs");
  } else if (input.mobilityLevel === "some-difficulty") {
    parts.push("everyday mobility needs");
  }
  if ((input.sensoryNeeds ?? []).some((n) => !/no sensory/i.test(n))) {
    parts.push("sensory comfort");
  }
  const closure = (input.closurePreference ?? []).find((c) => !/no preference/i.test(c));
  if (closure) parts.push(`${closure.toLowerCase()} closures`);
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

interface ScoredProduct {
  result: RecommendationResult;
  /** How many active hard requirements this product satisfies — used to rank fallbacks. */
  hardSatisfiedCount: number;
  /** Whether it satisfies every active hard requirement (an exact match). */
  isExactMatch: boolean;
}

function buildExplanation(
  satisfiedReasons: string[],
  preferenceReasons: string[],
  availabilityLabel: string | undefined,
  unmetLabels: string[],
  product: Product
): string {
  if (unmetLabels.length > 0) {
    const positives = [...satisfiedReasons, ...preferenceReasons];
    const positivePart = positives.length
      ? `it ${positives.slice(0, 3).join(", ")}`
      : `it is a ${product.styleTags[0]?.toLowerCase() ?? "comparable"} option`;
    return `Closest alternative — ${positivePart}, but it may not fully meet your ${unmetLabels
      .slice(0, 2)
      .join(" and ")
      .toLowerCase()} need.`;
  }

  const clauses = [...satisfiedReasons];
  if (availabilityLabel) {
    // Keep the country's original casing (e.g. "is available in USA").
    clauses.push(availabilityLabel.replace(/^Available/, "is available"));
  }
  clauses.push(...preferenceReasons);
  if (clauses.length === 0) {
    return `${product.adaptiveFeatures.slice(0, 2).join(" and ")} for everyday adaptive dressing.`;
  }
  return `Recommended because it ${clauses.slice(0, 4).join(", ")}.`;
}

/**
 * Scores one product against the full input, separating hard-requirement
 * results from soft-preference points. Always returns a structured result so
 * the caller can decide whether it is an exact match or a fallback.
 */
function scoreProduct(product: Product, input: RecommendationInput): ScoredProduct {
  const blob = searchableText(product);
  const structured = structuredText(product);
  const activeHard = HARD_REQUIREMENTS.filter((req) => req.active(input));

  const satisfiedLabels: string[] = [];
  const satisfiedReasons: string[] = [];
  const unmetLabels: string[] = [];
  const inferredLabels: string[] = [];
  let hardSatisfiedCount = 0;

  activeHard.forEach((req) => {
    if (isHardRequirementSatisfied(req, product, blob, input)) {
      hardSatisfiedCount += 1;
      if (req.id !== "country") {
        satisfiedLabels.push(req.label);
        satisfiedReasons.push(req.reason);
        // Satisfied against structured data => explicit; only against the
        // free-form description => inferred (lower confidence, extra check).
        const explicit =
          req.id === "closure"
            ? closureSatisfied(structured, input.closurePreference ?? [])
            : req.satisfied(product, structured);
        if (!explicit) inferredLabels.push(req.label);
      }
    } else {
      unmetLabels.push(req.label);
    }
  });

  const isExactMatch = unmetLabels.length === 0;
  const ships = shipsToLocation(product, input.location);
  const availabilityLabel = input.location
    ? ships
      ? `Available in ${input.location}`
      : `Ships outside ${input.location}`
    : undefined;

  const exactLink = product.linkType === "exact-product";
  const priceKnown = resolvePriceStatus(product) === "known";
  const confidence = confidenceFor({
    activeCount: activeHard.length,
    inferredLabels,
    unmetCount: unmetLabels.length,
    ships,
    hasLocation: Boolean(input.location),
    exactLink,
    priceKnown,
  });
  const checkBeforeBuying = buildCheckBeforeBuying({
    product,
    inferredLabels,
    ships,
    hasLocation: Boolean(input.location),
    location: input.location,
    priceKnown,
    exactLink,
  });

  // Soft preferences only contribute to ranking, never inclusion.
  const soft = scoreSoftPreferences(product, input);

  // Open-ended free text gives a small relevance nudge (soft).
  const openEndedTerms = parseOpenEndedTerms(input.openEndedNeed);
  let openEndedScore = 0;
  if (openEndedTerms.length > 0) {
    const matched = openEndedTerms.filter((term) => blob.includes(term));
    if (matched.length > 0) {
      openEndedScore = matched.length;
      soft.reasons.push(`reflects what you shared about ${matched.slice(0, 3).join(", ")}`);
    }
  }

  // Hard requirements dominate the score so exact matches always outrank
  // partial ones; soft points only break ties within a tier.
  const score = hardSatisfiedCount * 10 + soft.score + openEndedScore;

  const explanation = buildExplanation(
    satisfiedReasons,
    soft.reasons,
    availabilityLabel,
    unmetLabels,
    product
  );

  return {
    hardSatisfiedCount,
    isExactMatch,
    result: {
      product,
      score,
      reasons: [...satisfiedReasons, ...soft.reasons],
      itemClassification: classifyItem(product),
      needsSatisfied: satisfiedLabels,
      preferencesSatisfied: soft.preferencesSatisfied,
      unmetNeeds: [],
      isFallback: false,
      shipsToLocation: ships,
      priceStatus: resolvePriceStatus(product),
      explanation,
      availabilityLabel,
      confidence: confidence.level,
      confidenceNotes: confidence.notes,
      checkBeforeBuying,
    },
  };
}

function sortByQuality(a: ScoredProduct, b: ScoredProduct): number {
  if (a.result.shipsToLocation !== b.result.shipsToLocation) {
    return a.result.shipsToLocation ? -1 : 1;
  }
  if (b.hardSatisfiedCount !== a.hardSatisfiedCount) {
    return b.hardSatisfiedCount - a.hardSatisfiedCount;
  }
  if (b.result.score !== a.result.score) return b.result.score - a.result.score;
  return (
    Number(b.result.product.linkType === "exact-product") -
    Number(a.result.product.linkType === "exact-product")
  );
}

/**
 * Richer successor to recommendProducts(). Applies hard requirements as
 * filters first, ranks the survivors by soft preferences, and only if too few
 * exact matches exist appends clearly-labelled fallbacks (with their specific
 * unmet hard requirements) so the list is never empty and never dishonest.
 */
// --- Strict clothing-category filtering -----------------------------------
//
// The product-type question ("What are you looking for?") is a HARD category
// filter: if the shopper picks Footwear, only footwear may appear. Categories
// are matched by family so e.g. "Bottoms" covers pants, jeans and shorts.

const CATEGORY_FAMILIES: Record<string, RegExp> = {
  tops: /\b(top|tops|shirt|shirts|blouse|tee|t-shirt|polo|sweater|jumper|knit|tank|tunic|cami)\b/,
  bottoms:
    /\b(pant|pants|trouser|trousers|jean|jeans|short|shorts|legging|leggings|bottom|bottoms|chino|chinos|jogger|joggers|sweatpant|sweatpants|skort)\b/,
  dresses: /\b(dress|dresses|skirt|skirts|gown|jumpsuit|romper|one-piece|onepiece|overall|overalls|pinafore)\b/,
  outerwear:
    /\b(jacket|jackets|coat|coats|outerwear|hoodie|hoodies|parka|blazer|vest|gilet|windbreaker|raincoat|cardigan|poncho)\b/,
  undergarments:
    /\b(underwear|undergarment|undergarments|bra|bras|brief|briefs|boxer|boxers|base layer|baselayer|undershirt|lingerie|sock|socks|tights|hosiery)\b/,
  footwear:
    /\b(shoe|shoes|footwear|sneaker|sneakers|boot|boots|sandal|sandals|slipper|slippers|loafer|loafers|trainer|trainers|clog|clogs|moccasin)\b/,
};

/** Resolve a selected clothing term (e.g. "Pants", "Bottoms", "Shoes") to a family key. */
export function categoryFamilyFor(term: string): keyof typeof CATEGORY_FAMILIES | null {
  const t = term.toLowerCase();
  if (/under|base layer|baselayer|bra|sock/.test(t)) return "undergarments";
  if (/shoe|foot|sneaker|boot|sandal/.test(t)) return "footwear";
  if (/dress|skirt|one-?piece|gown|jumpsuit/.test(t)) return "dresses";
  if (/jacket|outerwear|coat|hoodie|blazer/.test(t)) return "outerwear";
  if (/pant|bottom|jean|trouser|short|legging/.test(t)) return "bottoms";
  if (/top|shirt|blouse|tee|polo|sweater/.test(t)) return "tops";
  return null;
}

// Workwear / formalwear is an occasion, not a garment shape: it matches the
// Formalwear catalogue type or a formal/professional style — while still
// respecting any specific garment type the shopper also selected.
const FORMAL_TERM = /\b(formal|formalwear|workwear|business|office)\b/i;
const FORMAL_PRODUCT = /\b(formal|formalwear|workwear|professional|business|smart|suit|blazer|office)\b/;

function productLooksFormal(product: Product): boolean {
  const hay = [product.clothingType, product.category, ...product.styleTags]
    .join(" ")
    .toLowerCase();
  return FORMAL_PRODUCT.test(hay);
}

/**
 * The garment families a product belongs to. Its own clothingType decides
 * first (a product typed "Socks" is undergarments even if the catalogue
 * shelves it under the "shoes" category); the category field is only a
 * fallback when the type isn't recognised.
 */
function productFamilies(product: Product): string[] {
  const byType = Object.keys(CATEGORY_FAMILIES).filter((fam) =>
    CATEGORY_FAMILIES[fam].test(product.clothingType.toLowerCase())
  );
  if (byType.length > 0) return byType;
  return Object.keys(CATEGORY_FAMILIES).filter((fam) =>
    CATEGORY_FAMILIES[fam].test(product.category.toLowerCase())
  );
}

/**
 * STRICT category normalization: does the product belong to at least one of
 * the selected clothing categories? Footwear only ever matches footwear,
 * bottoms only bottoms, and so on. Workwear/formalwear narrows to formal
 * pieces without overriding a selected garment type. An empty selection (or
 * "Not sure") applies no filter.
 */
export function productInSelectedCategories(product: Product, selected: string[]): boolean {
  const families = new Set<string>();
  let wantsFormal = false;
  selected.forEach((term) => {
    if (FORMAL_TERM.test(term)) {
      wantsFormal = true;
      return;
    }
    const fam = categoryFamilyFor(term);
    if (fam) families.add(fam);
  });

  const productFams = productFamilies(product);
  const inFamily =
    families.size === 0 || productFams.some((fam) => families.has(fam));

  if (wantsFormal) {
    // Formal + a garment type => that garment type, formal-leaning.
    // Formal alone => any formal piece.
    return families.size > 0 ? inFamily && productLooksFormal(product) : productLooksFormal(product);
  }
  return inFamily;
}

/**
 * STRICT clothing-range filter. Womenswear shows women/unisex, menswear shows
 * men/unisex, gender-neutral shows unisex (or clearly multi-fit) items, and
 * shopping for a child/teen shows kids items only. Never a ranking tweak —
 * a product that fails this is not shown at all.
 */
export function productMatchesGenderRange(
  product: Product,
  genderRange?: string,
  childrenTeen?: boolean
): boolean {
  const fits = (product.genderFit ?? []).map((f) => f.toLowerCase());
  if (childrenTeen) {
    return fits.some((f) => /kid|child|teen|youth|junior/.test(f));
  }
  if (!genderRange || /no_preference|prefer not/i.test(genderRange)) return true;
  const isUnisex = fits.some((f) => /unisex|neutral/.test(f));
  if (/women|female/i.test(genderRange)) {
    return isUnisex || fits.some((f) => /women/.test(f));
  }
  if (/gender_neutral|neutral|unisex/i.test(genderRange)) {
    // Unisex, or clearly multi-fit (made for both women and men).
    return (
      isUnisex ||
      (fits.some((f) => /women/.test(f)) && fits.some((f) => /\bmen\b|^men$/.test(f)))
    );
  }
  if (/\bmen\b|^men|male/i.test(genderRange)) {
    return isUnisex || fits.some((f) => /\bmen\b|^men$/.test(f) && !/women/.test(f));
  }
  return true;
}

export function recommendAdaptiveProducts(input: RecommendationInput): RecommendationResult[] {
  const limit = input.limit ?? 9;

  // STRICT pre-filters applied BEFORE any scoring: clothing category and
  // clothing range are hard requirements for exact matches AND fallbacks —
  // a shopper who picked Footwear/Womenswear never sees pants or men-only
  // items, not even as "closest alternatives". "Not sure" => no filter.
  const selectedCats = (input.clothingTypes ?? []).filter(
    (c) => c && !/not sure/i.test(c)
  );
  const candidates = products.filter(
    (p) =>
      (selectedCats.length === 0 || productInSelectedCategories(p, selectedCats)) &&
      productMatchesGenderRange(p, input.genderRange, input.childrenTeen)
  );

  // Nothing in the catalogue satisfies the strict category/range selection.
  // Return an empty list so the UI can show an honest empty state — never
  // silently substitute unrelated products.
  if (candidates.length === 0) return [];

  const scored = candidates.map((product) => scoreProduct(product, input));

  // 1. HARD FILTER: keep only products that satisfy every active requirement.
  const exact = scored.filter((s) => s.isExactMatch).sort(sortByQuality);

  if (exact.length >= limit) {
    return exact.slice(0, limit).map((s) => s.result);
  }

  // 2. FALLBACK: not enough exact matches — fill the rest with the closest
  // partial matches, ranked by how many hard requirements they still meet.
  const exactIds = new Set(exact.map((s) => s.result.product.id));
  const fallback = scored
    .filter((s) => !exactIds.has(s.result.product.id))
    .sort(sortByQuality)
    .slice(0, Math.max(0, limit - exact.length))
    .map((s) => {
      const blob = searchableText(s.result.product);
      const unmetNeeds = HARD_REQUIREMENTS.filter(
        (req) =>
          req.active(input) &&
          req.id !== "country" &&
          !isHardRequirementSatisfied(req, s.result.product, blob, input)
      ).map((req) => req.label);
      return {
        ...s,
        result: {
          ...s.result,
          isFallback: true,
          unmetNeeds,
          explanation: buildExplanation(
            s.result.reasons,
            [],
            s.result.availabilityLabel,
            unmetNeeds,
            s.result.product
          ),
        },
      };
    });

  return [...exact, ...fallback].map((s) => s.result);
}
