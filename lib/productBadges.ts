import type { Product } from "@/types";
import { productShipsToCountry } from "@/data/products";
import { resolvePriceStatus } from "@/lib/pricingProvider";
import { GLOBAL } from "@/lib/countries";

/**
 * Trust / availability badges for a product card. Kept as a pure helper (no
 * JSX) so the same logic drives recommendation cards, browse cards and the
 * Singapore page, and stays unit-testable.
 *
 * These are deliberately the signals a shopper needs to judge whether a card is
 * actually buyable — verification status, whether it ships to Singapore, and
 * whether the price is known — not the adaptive "works for" tags, which the
 * cards already surface separately.
 */
export type ProductBadgeKind = "verified" | "warn" | "sg";

export interface ProductBadge {
  label: string;
  kind: ProductBadgeKind;
}

export function productTrustBadges(
  product: Product,
  country?: string | null
): ProductBadge[] {
  const badges: ProductBadge[] = [];

  // Verified exact product vs. a category/brand listing to check manually.
  if (product.linkType === "exact-product") {
    badges.push({ label: "Verified product", kind: "verified" });
  } else {
    badges.push({ label: "Category listing only", kind: "warn" });
  }

  // Singapore-first: surface the shipping signal for SG shoppers (and when no
  // region is set), rather than adding it to every card for every country.
  const singaporeContext = !country || country === GLOBAL || country === "Singapore";
  if (singaporeContext && productShipsToCountry(product, "Singapore")) {
    badges.push({ label: "Ships to Singapore", kind: "sg" });
  }

  // Never imply a price we don't actually have.
  if (resolvePriceStatus(product) === "unknown") {
    badges.push({ label: "Price unavailable", kind: "warn" });
  }

  return badges;
}
