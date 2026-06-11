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
  founded: number;
  certifications: string[];
}
