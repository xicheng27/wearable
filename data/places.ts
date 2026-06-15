export type PlaceCategory = "flagship" | "stockist" | "alterations" | "online";

export interface MapPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  brandId?: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  tags: string[];
}

export type MapRegionId = "global" | "north-america" | "europe";

export interface MapRegion {
  id: MapRegionId;
  label: string;
  shortLabel: string;
  description: string;
}

export const mapRegions: MapRegion[] = [
  {
    id: "global",
    label: "Global view",
    shortLabel: "Global",
    description: "See every location currently listed in the directory.",
  },
  {
    id: "north-america",
    label: "North America",
    shortLabel: "North America",
    description: "Stores, studios and online services across the USA and Canada.",
  },
  {
    id: "europe",
    label: "Europe",
    shortLabel: "Europe",
    description: "Adaptive fashion locations currently listed across the UK and Europe.",
  },
];

export const categoryLabels: Record<PlaceCategory, string> = {
  flagship: "Flagship store",
  stockist: "Stockist",
  alterations: "Alteration service",
  online: "Online-only brand",
};

export const mapFilters = [
  "Wheelchair-friendly",
  "Sensory-friendly",
  "Magnetic closures",
  "Easy-entry footwear",
  "Local stores",
  "Online-only",
] as const;

// Sample dataset. Coordinates are real; alteration services are
// illustrative examples until partner data is connected.
export const mapPlaces: MapPlace[] = [
  {
    id: "tommy-nyc",
    name: "Tommy Hilfiger Fifth Avenue",
    category: "flagship",
    brandId: "tommy-hilfiger-adaptive",
    address: "681 Fifth Avenue",
    city: "New York, NY",
    country: "USA",
    lat: 40.7625,
    lng: -73.9745,
    tags: ["Wheelchair-friendly", "Magnetic closures"],
  },
  {
    id: "tommy-london",
    name: "Tommy Hilfiger Oxford Street",
    category: "flagship",
    brandId: "tommy-hilfiger-adaptive",
    address: "190 Oxford Street",
    city: "London",
    country: "UK",
    lat: 51.5152,
    lng: -0.1419,
    tags: ["Wheelchair-friendly", "Magnetic closures"],
  },
  {
    id: "tommy-amsterdam",
    name: "Tommy Hilfiger Amsterdam",
    category: "flagship",
    brandId: "tommy-hilfiger-adaptive",
    address: "Kalverstraat 20",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3702,
    lng: 4.8952,
    tags: ["Wheelchair-friendly", "Magnetic closures"],
  },
  {
    id: "iz-toronto",
    name: "IZ Adaptive Studio",
    category: "flagship",
    brandId: "iz-adaptive",
    address: "55 Mill Street, Building 74",
    city: "Toronto, ON",
    country: "Canada",
    lat: 43.6503,
    lng: -79.3596,
    tags: ["Wheelchair-friendly", "Sensory-friendly"],
  },
  {
    id: "zappos-online",
    name: "Zappos Adaptive",
    category: "online",
    brandId: "zappos-adaptive",
    address: "Ships from Las Vegas, NV",
    city: "Las Vegas, NV",
    country: "USA",
    lat: 36.1716,
    lng: -115.1391,
    tags: ["Easy-entry footwear", "Sensory-friendly", "Online-only"],
  },
  {
    id: "able2wear-manchester",
    name: "Able2Wear Showroom",
    category: "flagship",
    brandId: "able2wear",
    address: "Unit 4, Parkway Business Centre",
    city: "Manchester",
    country: "UK",
    lat: 53.4808,
    lng: -2.2426,
    tags: ["Wheelchair-friendly", "Sensory-friendly"],
  },
  {
    id: "able2wear-london",
    name: "Able2Wear Stockist – Millfield",
    category: "stockist",
    brandId: "able2wear",
    address: "22 Millfield Lane",
    city: "London",
    country: "UK",
    lat: 51.5661,
    lng: -0.1468,
    tags: ["Wheelchair-friendly"],
  },
  {
    id: "alter-brooklyn",
    name: "Adaptive Alterations Studio",
    category: "alterations",
    address: "148 Bedford Avenue",
    city: "Brooklyn, NY",
    country: "USA",
    lat: 40.6782,
    lng: -73.9442,
    tags: ["Wheelchair-friendly", "Magnetic closures"],
  },
  {
    id: "alter-london",
    name: "SewAble Tailoring",
    category: "alterations",
    address: "12 Columbia Road",
    city: "London",
    country: "UK",
    lat: 51.5293,
    lng: -0.069,
    tags: ["Sensory-friendly", "Wheelchair-friendly"],
  },
];

export function filterPlaces(places: MapPlace[], active: string[]): MapPlace[] {
  if (active.length === 0) return places;
  return places.filter((p) =>
    active.every((f) => {
      if (f === "Local stores") return p.category !== "online";
      if (f === "Online-only") return p.category === "online";
      return p.tags.includes(f);
    })
  );
}

export function regionForPlace(place: MapPlace): Exclude<MapRegionId, "global"> {
  return ["USA", "Canada", "Mexico"].includes(place.country)
    ? "north-america"
    : "europe";
}

export function filterPlacesByRegion(
  places: MapPlace[],
  region: MapRegionId
): MapPlace[] {
  if (region === "global") return places;
  return places.filter((place) => regionForPlace(place) === region);
}

export function regionForCoordinates({ lat, lng }: { lat: number; lng: number }): MapRegionId {
  if (lng >= -170 && lng <= -45 && lat >= 5 && lat <= 85) {
    return "north-america";
  }
  if (lng >= -25 && lng <= 45 && lat >= 30 && lat <= 72) {
    return "europe";
  }
  return "global";
}

/** Great-circle distance in kilometres. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
