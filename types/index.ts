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
  description: string;
  accessibilityExplanation: string;
  adaptiveFeatures: string[];
  disabilityNeeds: string[];
  bestFor: string[];
  styleTags: string[];
  availability: ProductAvailability;
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
