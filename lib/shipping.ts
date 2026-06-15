import { Product } from "@/types";
import { GLOBAL_LOCATION } from "@/lib/countries";

const aliases: Record<string, string> = {
  america: "United States",
  britain: "United Kingdom",
  england: "United Kingdom",
  singapore: "Singapore",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  usa: "United States",
  "u.s.a.": "United States",
  us: "United States",
  "united states of america": "United States",
  worldwide: GLOBAL_LOCATION,
  international: GLOBAL_LOCATION,
};

const euCountries = new Set([
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
]);

export function normalizeCountryName(value: string) {
  const trimmed = value.trim();
  return aliases[trimmed.toLowerCase()] ?? trimmed;
}

export function getProductShipsTo(product: Product) {
  const destinations =
    product.shipsTo?.length
      ? product.shipsTo
      : product.availability.countries?.length
        ? product.availability.countries
        : [GLOBAL_LOCATION];

  return destinations.map(normalizeCountryName);
}

export function productShipsTo(product: Product, selectedCountry: string) {
  if (!selectedCountry || selectedCountry === GLOBAL_LOCATION) return true;

  const destinations = getProductShipsTo(product);
  if (destinations.includes(GLOBAL_LOCATION)) return true;
  if (destinations.includes(selectedCountry)) return true;
  if (destinations.some((destination) => destination.toLowerCase() === "eu")) {
    return euCountries.has(selectedCountry);
  }
  return false;
}

export function filterProductsForCountry(
  products: Product[],
  selectedCountry: string
) {
  return products.filter((product) => productShipsTo(product, selectedCountry));
}

export function productShippingLabel(
  product: Product,
  selectedCountry: string
) {
  const destinations = getProductShipsTo(product);
  if (destinations.includes(GLOBAL_LOCATION)) return "Available globally";
  if (selectedCountry && selectedCountry !== GLOBAL_LOCATION) {
    return `Ships to ${selectedCountry}`;
  }
  return "Regional availability";
}

