import type { PriceStatus, Product } from "@/types";

/**
 * Pricing is read from the static catalog today (data/products.ts /
 * data/verifiedProducts.ts), which is hand- or scrape-verified at a point in
 * time rather than live. This module is the single place a future live
 * pricing API (brand product feeds, a price-comparison API, etc.) would plug
 * in — call sites should depend on `resolvePriceStatus`/`getLivePrice`
 * rather than reading `product.price` directly, so swapping in a real
 * provider later doesn't require touching the UI.
 */

export interface LivePriceResult {
  status: PriceStatus;
  amount?: number;
  currency?: string;
  fetchedAt?: string;
}

/**
 * Placeholder for a future live pricing lookup. No live pricing API is
 * connected yet, so this always reports "unknown" rather than inventing a
 * price. Replace the body with a real fetch once a provider is available;
 * the return shape is already what callers expect.
 */
export function getLivePrice(_productId: string): LivePriceResult {
  return { status: "unknown" };
}

/** Whether the catalog already has a usable price for this product. */
export function resolvePriceStatus(product: Pick<Product, "price">): PriceStatus {
  return product.price && product.price.trim().length > 0 ? "known" : "unknown";
}
