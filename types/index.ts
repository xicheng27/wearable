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
}

// --- User profile / target group segmentation ---

/** Who the shopper is shopping for — drives tone, defaults and recommendations. */
export type TargetGroup = "elderly" | "disability" | "caregiver";

export type AgeRange = "under-40" | "40-59" | "60-74" | "75-plus";

export type MobilityLevel = "full-mobility" | "some-difficulty" | "wheelchair-or-seated";

export type BudgetRange = "budget" | "mid-range" | "premium" | "no-limit";

/** Structured tags collected from the onboarding quiz, persisted per visitor. */
export interface UserProfile {
  targetGroup?: TargetGroup;
  ageRange?: AgeRange;
  stylePreference?: string[];
  personalityType?: string;
  bodyNeeds?: string[];
  dressingDifficulty?: string[];
  mobilityLevel?: MobilityLevel;
  sensoryNeeds?: string[];
  budgetRange?: BudgetRange;
  location?: string;
  preferredCurrency?: string;
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
