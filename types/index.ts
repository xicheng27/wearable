export interface StoreLocation {
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  type: "flagship" | "stockist" | "online-only";
}

export interface ShippingInfo {
  countries: string[];
  freeShippingThreshold?: number;
  currency: string;
  estimatedDays: string;
  returnsPolicy: string;
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  logo: string;
  heroColor: string;
  image: string;
  adaptiveFeatures: string[];
  disabilityTypes: string[];
  clothingTypes: string[];
  styleTags: string[];
  whoItSuits: string[];
  locations: StoreLocation[];
  shipping: ShippingInfo;
  website: string;
  priceRange: string;
  country: string;
  featured: boolean;
  founded?: number;
  certifications: string[];
}

export type ProductAvailability = {
  online: boolean;
  inStore: boolean;
  countries: string[];
  note: string;
};

// --- Community verification (future-ready structure) -----------------------

/**
 * Tags wearers and caregivers will be able to confirm on a product once
 * community reporting ships. The data structure exists now so products and
 * the UI are ready; no reports are fabricated in the meantime.
 */
export type CommunityVerificationTag =
  | "worked-for-wheelchair"
  | "easy-one-handed"
  | "caregiver-friendly"
  | "sensory-friendly"
  | "afo-orthotic-friendly"
  | "ships-as-listed"
  | "size-runs-small"
  | "size-runs-large"
  | "not-actually-adaptive"
  | "returns-easy"
  | "returns-difficult";

export interface CommunityVerificationReport {
  tag: CommunityVerificationTag;
  /** Number of wearers/caregivers who confirmed this. */
  count: number;
  lastReportedAt?: string;
  /** When this report was last verified/moderated. */
  lastVerifiedAt?: string;
  /** Moderation state — only "approved" reports should ever render. */
  moderationStatus?: "pending" | "approved" | "rejected";
}

export interface Product {
  id: string;
  name: string;
  productName?: string;
  brandId: string;
  brand?: string;
  clothingType: string;
  category: string;
  priceRange: string;
  price: string;
  currency: string;
  imageUrl: string;
  imageAlt: string;
  // Product images are displayed for identification, accessibility reference,
  // recommendation, and shopping comparison. ProductImage falls back if a URL
  // is missing or broken; permissionStatus is retained as a provenance note.
  imageSource?: string;
  imageLicenseType?:
    | "brand-permission"
    | "affiliate-feed"
    | "press-kit"
    | "own-photo"
    | "licensed-stock"
    | "identification-reference"
    | "placeholder";
  attributionText?: string;
  permissionStatus?: "approved" | "pending" | "needs-review";
  sourcePageUrl?: string;
  lastVerifiedDate?: string;
  description: string;
  accessibilityExplanation: string;
  adaptiveFeatures: string[];
  disabilityNeeds: string[];
  bestFor: string[];
  styleTags: string[];
  availability: ProductAvailability;
  shipsTo?: string[];
  countriesAvailable?: string[];
  sizes: string[];
  genderFit: string[];
  targetGroups?: string[];
  suitableAgeRanges?: string[];
  personalityTags?: string[];
  closureTypes?: string[];
  mobilityNeeds?: string[];
  sensoryNeeds?: string[];
  careEase?: string[];
  reasonWhyRelevant?: string;
  sensoryFriendly: boolean;
  seatedFit: boolean;
  oneHandedDressing: boolean;
  featured: boolean;
  productUrl: string;
  linkType: "exact-product" | "brand-page-only";
  sourceVerifiedAt?: string;
  /** Community fit reports (empty until community verification ships). */
  communityVerifications?: CommunityVerificationReport[];

  // --- Optional structured adaptive metadata -------------------------------
  // When present these are treated as explicit evidence (higher confidence
  // than anything inferred from description text). Absent fields simply fall
  // back to the existing derived matching.
  /** Canonical garment family, e.g. "footwear", "bottoms", "tops". */
  categoryNormalized?: string;
  /** "online" | "in-store" | "both" — richer than the availability booleans. */
  availabilityMode?: "online" | "in-store" | "both";
  /** e.g. ["tag-free", "flat seams", "soft cotton"]. */
  sensoryAttributes?: string[];
  /** e.g. ["open back", "side zip", "assisted dressing loops"]. */
  caregiverFeatures?: string[];
  /** e.g. ["AFO clearance", "wide opening", "removable insole"]. */
  orthoticCompatibility?: string[];
  /** e.g. ["abdomen", "chest port", "leg"]. */
  medicalAccessZones?: string[];
  /** Brand's stated return policy for this item, shown pre-purchase. */
  returnsNote?: string;
  /** URLs or names of the sources the adaptive claims were verified against. */
  evidenceSources?: string[];
}

// --- User profile / target group segmentation ---

/** Who the shopper is shopping for. This drives tone, defaults and recommendations. */
export type TargetGroup = "elderly" | "disability" | "caregiver";

export type UserType = "self" | "family" | "child" | "patient" | "other";

export type AgeRange =
  | "under_18"
  | "18_30"
  | "31_50"
  | "51_65"
  | "65_plus"
  | "under-40"
  | "40-59"
  | "60-74"
  | "75-plus";

export type MobilityLevel =
  | "independent"
  | "support"
  | "mostly_seated"
  | "wheelchair"
  | "bedridden"
  | "prefer_not_say"
  | "full-mobility"
  | "some-difficulty"
  | "wheelchair-or-seated";

export type DressingMethod =
  | "independent"
  | "slow_independent"
  | "occasional_help"
  | "caregiver_often"
  | "fully_caregiver";

export type GenderStylePreference =
  | "womenswear"
  | "menswear"
  | "gender_neutral"
  | "children_teen"
  | "no_preference";

export type BudgetRange =
  | "budget"
  | "mid_range"
  | "mid-range"
  | "premium"
  | "no_preference"
  | "no-limit";

/** How much difficulty a shopper has with dressing day to day. */
export type DressingDifficulty = "low" | "moderate" | "high";

/** Where the clothing will mostly be worn. */
export type LifestyleSetting =
  | "school"
  | "work"
  | "home"
  | "outdoor"
  | "formal-event"
  | "daily-wear";

/** Whether the shopper dresses themselves or is assisted by a caregiver. */
export type CaregiverInvolvement = "self-dressing" | "caregiver-assisted";

/** Structured tags collected from the onboarding quiz, persisted per visitor. */
export interface UserProfile {
  userType?: UserType;
  targetGroup?: TargetGroup;
  ageRange?: AgeRange;
  country?: string;
  location?: string;
  preferredCurrency?: string;
  mobilityLevel?: MobilityLevel;
  dressingMethod?: DressingMethod;
  mainChallenges?: string[];
  bodyNeeds?: string[];
  clothingCategories?: string[];
  requiredFeatures?: string[];
  genderStylePreference?: GenderStylePreference;
  personalityVibe?: string[];
  stylePreference?: string[];
  personalityType?: string;
  budget?: BudgetRange;
  budgetRange?: BudgetRange;
  sensoryNeeds?: string[];
  closurePreference?: string[];
  dressingDifficulty?: DressingDifficulty;
  fabricComfortNeeds?: string[];
  lifestyleSetting?: LifestyleSetting;
  caregiverInvolvement?: CaregiverInvolvement;
}

/**
 * A practical, self-selected adaptive clothing profile (e.g. "Wheelchair users").
 * This is a shopping/sizing categorization the user opts into themselves,
 * never a medical diagnosis.
 */
export interface AdaptiveClothingProfile {
  id: string;
  label: string;
  description: string;
}

export type PriceStatus = "known" | "unknown";

/**
 * How sure we are that a product really meets the shopper's needs, separate
 * from whether it matched:
 *  - high: every active need is confirmed by explicit product data (tags,
 *    flags, listed features) and availability is clear
 *  - medium: it matches, but some evidence was inferred from descriptions
 *    or some information (price, exact link) is incomplete
 *  - low: it misses a need, or key details can't be verified
 */
export type ConfidenceLevel = "high" | "medium" | "low";

// --- Adaptive Fit Passport --------------------------------------------------

/**
 * The reusable profile a shopper builds once (via the quiz) and uses across
 * the whole site — results, browsing, saved items and future updates.
 *
 * The raw quiz answers are the single source of truth; everything shown in
 * the passport UI and every recommendation input is derived from them, so
 * editing the passport is editing the answers (no retake needed). Stored
 * only on the shopper's device.
 */
export interface AdaptiveFitPassport {
  version: 1;
  createdAt: string;
  updatedAt: string;
  /** Raw quiz answers keyed by question (who, country, clothing, help, ...). */
  answers: Record<string, string[]>;
  /** Free-text description of needs from the first quiz screen. */
  otherNeeds?: string;
  /** Free-text "not listed" need. */
  customNeed?: string;
}

/** Strict operational input to the adaptive recommendation engine. */
export interface RecommendationInput {
  targetGroup?: TargetGroup;
  ageRange?: AgeRange;
  needs?: string[];
  styles?: string[];
  budget?: string;
  openEndedNeed?: string;
  location?: string;
  mobilityLevel?: MobilityLevel;
  dressingDifficulty?: DressingDifficulty;
  sensoryNeeds?: string[];
  closurePreference?: string[];
  fabricComfortNeeds?: string[];
  lifestyleSetting?: LifestyleSetting;
  caregiverInvolvement?: CaregiverInvolvement;
  clothingTypes?: string[];
  /** Strict clothing range filter: womenswear | menswear | gender_neutral. */
  genderRange?: string;
  /** Strict: shopping for a child or teen — only kids/teen items may be shown. */
  childrenTeen?: boolean;
  /** Body areas the shopper flagged on the body map (zone titles). */
  bodyZones?: string[];
  /** Personality / vibe tags — soft ranking signal only. */
  personalityVibe?: string[];
  /** Specific medical access needs (soft detail; the hard filter uses needs). */
  medicalAccessNeeds?: string[];
  /** Specific AFO/orthotic needs (soft detail; the hard filter uses needs). */
  orthoticAccessNeeds?: string[];
  dressingMethod?: DressingMethod;
  limit?: number;
}

/** A single recommended item plus the structured reasoning behind the match. */
export interface RecommendationResult {
  product: Product;
  score: number;
  reasons: string[];
  /** Adaptive clothing function tags (e.g. "Seated-fit jeans", "Magnetic closure shirt"). */
  itemClassification: string[];
  /** Hard accessibility requirements this item satisfies (human-readable labels). */
  needsSatisfied: string[];
  /** Soft preferences this item satisfies (style, budget, lifestyle, etc.). */
  preferencesSatisfied: string[];
  /** Active hard requirements this item does NOT meet; only populated for fallbacks. */
  unmetNeeds: string[];
  /** True when this result failed one or more hard requirements and is shown as a closest alternative. */
  isFallback: boolean;
  shipsToLocation: boolean;
  priceStatus: PriceStatus;
  /** Plain-language sentence explaining why this item was shown. */
  explanation: string;
  /** Country availability label (e.g. "Available in Singapore"). */
  availabilityLabel?: string;
  /** How verifiable the match is (explicit data vs inferred from text). */
  confidence: ConfidenceLevel;
  /** Plain-language notes explaining the confidence level. */
  confidenceNotes: string[];
  /** Honest pre-purchase checks: fit, shipping, returns, missing data. */
  checkBeforeBuying: string[];
}

/** A single product evaluated against a passport/input outside the quiz flow. */
export interface ProductNeedsEvaluation {
  /** True when every active hard requirement (incl. category/range/location) passes. */
  meetsAllNeeds: boolean;
  /** Hard requirements the product does not meet. */
  unmetNeeds: string[];
  confidence: ConfidenceLevel;
  matchesCategory: boolean;
  matchesRange: boolean;
  shipsToSelectedLocation: boolean;
}

export interface ProductSearchParams {
  query?: string;
  clothingType?: string;
  brand?: string;
  disabilityNeed?: string;
  adaptiveFeature?: string;
  style?: string;
  budget?: string;
  size?: string;
  genderFit?: string;
  availability?: string;
  location?: string;
  sensoryFriendly?: boolean;
  seatedFit?: boolean;
  oneHandedDressing?: boolean;
  easyClosures?: boolean;
  wheelchairFriendly?: boolean;
  limitedDexterity?: boolean;
  prostheticAccess?: boolean;
  dressingDifficulty?: string;
}
