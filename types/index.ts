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

export interface Product {
  id: string;
  name: string;
  brandId: string;
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
  sizes: string[];
  genderFit: string[];
  sensoryFriendly: boolean;
  seatedFit: boolean;
  oneHandedDressing: boolean;
  featured: boolean;
  productUrl: string;
  linkType: "exact-product" | "brand-page-only";
  sourceVerifiedAt?: string;
}

// --- User profile / target group segmentation ---

/** Who the shopper is shopping for — drives tone, defaults and recommendations. */
export type TargetGroup = "elderly" | "disability" | "caregiver";

export type AgeRange = "under-40" | "40-59" | "60-74" | "75-plus";

export type MobilityLevel = "full-mobility" | "some-difficulty" | "wheelchair-or-seated";

export type BudgetRange = "budget" | "mid-range" | "premium" | "no-limit";

/** How much difficulty a shopper has with dressing day-to-day — a derived severity level, not a diagnosis. */
export type DressingDifficulty = "low" | "moderate" | "high";

/** Where the clothing will mostly be worn — used to weight style and practicality. */
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
  targetGroup?: TargetGroup;
  ageRange?: AgeRange;
  stylePreference?: string[];
  personalityType?: string;
  bodyNeeds?: string[];
  /** Literal closures/fastenings the shopper prefers (e.g. "Magnetic buttons"). */
  closurePreference?: string[];
  /** Derived difficulty level — distinct from closurePreference, which is the literal fastening type. */
  dressingDifficulty?: DressingDifficulty;
  mobilityLevel?: MobilityLevel;
  sensoryNeeds?: string[];
  fabricComfortNeeds?: string[];
  lifestyleSetting?: LifestyleSetting;
  caregiverInvolvement?: CaregiverInvolvement;
  budgetRange?: BudgetRange;
  location?: string;
  preferredCurrency?: string;
}

/**
 * A practical, self-selected adaptive clothing profile (e.g. "Wheelchair users").
 * This is a shopping/sizing categorization the user opts into themselves —
 * never a medical diagnosis.
 */
export interface AdaptiveClothingProfile {
  id: string;
  label: string;
  description: string;
}

export type PriceStatus = "known" | "unknown";

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
  limit?: number;
}

/** A single recommended item plus the structured reasoning behind the match. */
export interface RecommendationResult {
  product: Product;
  score: number;
  reasons: string[];
  /** Adaptive clothing function tags (e.g. "Seated-fit jeans", "Magnetic closure shirt"). */
  itemClassification: string[];
  needsSatisfied: string[];
  preferencesSatisfied: string[];
  unmetNeeds: string[];
  /** True when this result came from a broadened search because nothing matched all criteria. */
  isFallback: boolean;
  shipsToLocation: boolean;
  priceStatus: PriceStatus;
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
}
