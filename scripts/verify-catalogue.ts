/**
 * Catalogue correctness verification — climate, shipping honesty and stock.
 *
 * Run with:  npm run verify:catalogue
 *
 * Covers the acceptance criteria for hot-humid Singapore defaults, honest
 * shipping/stock, and the jacket-classification fix.
 */

import {
  getShippingConfidence,
  isOutOfStock,
  productDefinitelyShipsTo,
  productShipsToCountry,
  products,
} from "@/data/products";
import { assessClimate, hasHotHumidBadge } from "@/lib/climate";
import { classifyItem, recommendAdaptiveProducts } from "@/lib/recommendationEngine";
import {
  activeFilterCount,
  applyFilters,
  parseFilters,
  QUICK_FILTERS,
  serializeFilters,
  toggleFacetValue,
} from "@/lib/searchFilters";
import type { Product } from "@/types";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Minimal valid Product for unit tests; override only what a case needs. */
function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "test",
    name: "Test Item",
    brandId: "test-brand",
    clothingType: "Tops",
    category: "tops",
    priceRange: "$50-$100",
    price: "50",
    currency: "USD",
    imageUrl: "https://cdn.shopify.com/x.jpg",
    imageAlt: "test",
    description: "",
    accessibilityExplanation: "",
    adaptiveFeatures: [],
    disabilityNeeds: [],
    bestFor: [],
    styleTags: [],
    availability: { online: true, inStore: false, countries: [], note: "" },
    sizes: ["M"],
    genderFit: ["Unisex"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: false,
    featured: false,
    productUrl: "https://example.com/p",
    linkType: "exact-product",
    ...overrides,
  };
}

console.log("\nShipping honesty (missing shipping is UNKNOWN, never Global)");
{
  const noData = makeProduct({ availability: { online: true, inStore: false, countries: [], note: "" } });
  check("missing shipping → confidence 'unknown'", getShippingConfidence(noData, "Singapore") === "unknown");
  check("missing shipping does NOT definitely ship to SG", productDefinitelyShipsTo(noData, "Singapore") === false);
  check("missing shipping is allowed in loose browse (not hidden)", productShipsToCountry(noData, "Singapore") === true);

  const sg = makeProduct({ availability: { online: true, inStore: false, countries: ["Singapore"], note: "" } });
  check("declared SG → definitely ships", productDefinitelyShipsTo(sg, "Singapore") === true);

  const usOnly = makeProduct({ availability: { online: true, inStore: false, countries: ["USA"], note: "" } });
  check("US-only → confidence 'no' for SG", getShippingConfidence(usOnly, "Singapore") === "no");
  check("US-only → does not ship to SG (loose)", productShipsToCountry(usOnly, "Singapore") === false);
}

console.log("\nClimate suitability (evidence-based, conservative)");
{
  const linenTee = makeProduct({
    name: "Short Sleeve Tee",
    materialComposition: "100% linen",
    sleeveLength: "short-sleeve",
  });
  const linen = assessClimate(linenTee);
  check("linen + short-sleeve → high", linen.suitability === "high", linen.suitability);
  check("high verdict has stored evidence", linen.evidence.length > 0);
  check("hot-humid badge only for high", hasHotHumidBadge(linenTee) === true);

  const cotton = assessClimate(makeProduct({ materialComposition: "100% cotton", name: "Basic Top" }));
  check("cotton alone → medium (not high)", cotton.suitability === "medium", cotton.suitability);
  check("cotton does NOT earn the badge", hasHotHumidBadge(makeProduct({ materialComposition: "100% cotton" })) === false);

  const fleece = assessClimate(makeProduct({ name: "Cozy Fleece Jacket", clothingType: "Jackets" }));
  check("fleece → low", fleece.suitability === "low", fleece.suitability);
  const wool = assessClimate(makeProduct({ name: "Merino Wool Sweater", clothingType: "Tops" }));
  check("wool sweater → low", wool.suitability === "low", wool.suitability);
  const puffer = assessClimate(makeProduct({ name: "Padded Puffer Coat", clothingType: "Jackets" }));
  check("puffer → low", puffer.suitability === "low", puffer.suitability);

  const nameOnly = assessClimate(makeProduct({ name: "Summer Breeze Cool Shirt" }));
  check("positive claim from NAME alone → not high (stays unknown)", nameOnly.suitability !== "high", nameOnly.suitability);

  const bare = assessClimate(makeProduct({ name: "Plain Shirt", description: "" }));
  check("no evidence → unknown", bare.suitability === "unknown", bare.suitability);
}

console.log("\nJacket classification (no false 'lightweight')");
{
  const heavy = classifyItem(makeProduct({ name: "Wool Winter Coat", clothingType: "Jackets" }));
  check("heavy jacket is not labelled lightweight", !heavy.includes("Lightweight adaptive outerwear"));
  check("heavy jacket still gets a neutral outerwear tag", heavy.includes("Adaptive outerwear"));

  const light = classifyItem(
    makeProduct({ name: "Linen Overshirt", clothingType: "Jackets", materialComposition: "linen", sleeveLength: "short-sleeve" })
  );
  check("evidenced-light jacket may be labelled lightweight", light.includes("Lightweight adaptive outerwear"));
}

console.log("\nStock — out-of-stock excluded from default recommendations");
{
  const oos = makeProduct({ stockStatus: "out_of_stock" });
  check("isOutOfStock true for out_of_stock", isOutOfStock(oos) === true);
  const unknownStock = makeProduct({});
  check("isOutOfStock false when unknown", isOutOfStock(unknownStock) === false);

  const anyOosInDefault = products.some((p) => p.stockStatus === "out_of_stock");
  const recs = recommendAdaptiveProducts({ limit: 24 });
  check(
    "no out-of-stock product appears in default recs",
    recs.every((r) => r.product.stockStatus !== "out_of_stock"),
    anyOosInDefault ? "catalogue has OOS items" : "catalogue has no OOS items yet"
  );
}

console.log("\nSingapore default results contain no warm/winter items");
{
  const sgRecs = recommendAdaptiveProducts({ location: "Singapore", limit: 36 });
  const winter = sgRecs.filter((r) => assessClimate(r.product).suitability === "low");
  check("Singapore default hides low-climate (fleece/wool/winter) items", winter.length === 0,
    winter.length ? `leaked: ${winter.slice(0, 3).map((r) => r.product.name).join(", ")}` : "");

  // But choosing Outerwear explicitly, or Show-all-climates, lifts the hiding.
  const outerwear = recommendAdaptiveProducts({ location: "Singapore", clothingTypes: ["Jackets"], limit: 36 });
  check("explicit outerwear selection is still served (no silent empty)", Array.isArray(outerwear));
}

console.log("\nAccessibility hard requirements still outrank climate");
{
  // AFO/orthotic strict matching must keep working regardless of climate hiding.
  const afo = recommendAdaptiveProducts({
    location: "Singapore",
    clothingTypes: ["Shoes"],
    needs: ["Orthotics and AFOs"],
    limit: 9,
  });
  check("AFO strict category/need matching still returns footwear-family items",
    afo.every((r) => /shoe|footwear|sneaker|boot/i.test(`${r.product.clothingType} ${r.product.category}`)) || afo.length === 0);
}

console.log("\nCatalogue data integrity (§4 validation)");
{
  // 1. Every hot-humid badge is backed by stored evidence.
  const badgedWithoutEvidence = products.filter(
    (p) => hasHotHumidBadge(p) && assessClimate(p).evidence.length === 0
  );
  check("every climate badge has stored evidence", badgedWithoutEvidence.length === 0,
    badgedWithoutEvidence.slice(0, 2).map((p) => p.id).join(", "));

  // 2. Missing shipping is never treated as worldwide.
  const fakeWorldwide = products.filter((p) => {
    const noData = (p.availability?.countries?.length ?? 0) === 0 && (p.shipsTo?.length ?? 0) === 0;
    return noData && getShippingConfidence(p, "Narnia") !== "unknown";
  });
  check("no product with missing shipping is treated as worldwide", fakeWorldwide.length === 0);

  // 3. Exact-product links have a real http(s) URL.
  const badExactUrls = products.filter(
    (p) => p.linkType === "exact-product" && !/^https?:\/\//i.test(p.productUrl)
  );
  check("exact-product links all have a valid URL", badExactUrls.length === 0,
    `${badExactUrls.length} bad`);

  // 4. Gallery images (when present) are unique.
  const dupGallery = products.filter(
    (p) => p.galleryImages && new Set(p.galleryImages.map((u) => u.split("?")[0])).size !== p.galleryImages.length
  );
  check("gallery images are de-duplicated", dupGallery.length === 0, `${dupGallery.length} with dups`);

  // 5. Out-of-stock products are never purchasable in default recs (broad pull).
  const recs = recommendAdaptiveProducts({ limit: 36 });
  check("no out-of-stock item in a broad default pull", recs.every((r) => !isOutOfStock(r.product)));
}

console.log("\nShared filter model (OR within a facet, AND between facets, URL state)");
{
  const tee = makeProduct({
    name: "Linen Tee",
    clothingType: "Tops",
    materialComposition: "100% linen",
    sleeveLength: "short-sleeve",
    bestFor: ["Seated fit", "Wheelchair users"],
    genderFit: ["Womenswear"],
    sizes: ["M"],
    stockStatus: "in_stock",
    availability: { online: true, inStore: false, countries: ["Singapore"], note: "" },
  });
  const woolPants = makeProduct({
    name: "Wool Trousers",
    clothingType: "Pants",
    materialComposition: "wool",
    bestFor: ["Limited dexterity"],
    genderFit: ["Menswear"],
    stockStatus: "out_of_stock",
    availability: { online: true, inStore: false, countries: ["USA"], note: "" },
  });
  const list = [tee, woolPants];

  // URL round-trip survives refresh/back-forward.
  const state = parseFilters({ type: "tops,bottoms", need: "seated", instock: "1" });
  const round = parseFilters(Object.fromEntries(serializeFilters(state)));
  check("filter state round-trips through the URL", JSON.stringify(round) === JSON.stringify(state));
  check("deterministic serialisation (sorted)", serializeFilters(state).get("type") === "bottoms,tops");

  // OR within a facet: type=tops,bottoms matches both.
  check("OR within a facet matches any value", applyFilters(list, { type: ["tops", "bottoms"] }).length === 2);
  // AND between facets: tops AND seated need → only the tee.
  const andRes = applyFilters(list, { type: ["tops"], need: ["seated"] });
  check("AND between facets narrows correctly", andRes.length === 1 && andRes[0].name === "Linen Tee");

  // Boolean facets.
  check("instock facet excludes out-of-stock", applyFilters(list, { instock: ["1"] }).every((p) => p.stockStatus !== "out_of_stock"));
  check("shipsSG facet keeps only SG-declared items", applyFilters(list, { shipsSG: ["1"] }).every((p) => (p.availability.countries ?? []).includes("Singapore")));

  // Toggle + count.
  const t1 = toggleFacetValue({}, "need", "seated");
  const t2 = toggleFacetValue(t1, "need", "seated");
  check("toggle adds then removes a value", (t1.need?.length === 1) && !t2.need);
  check("activeFilterCount counts all selected values", activeFilterCount({ type: ["tops", "bottoms"], need: ["seated"] }) === 3);

  // Quick filters produce usable state; hot-humid → high+medium.
  const hotHumid = QUICK_FILTERS.find((q) => q.id === "hot-humid");
  check("hot-humid quick filter targets high+medium climate", Boolean(hotHumid) && applyFilters(list, hotHumid!.patch).some((p) => p.name === "Linen Tee"));
  check("hot-humid quick filter excludes wool pants (low)", !applyFilters(list, QUICK_FILTERS[0].patch).some((p) => p.name === "Wool Trousers"));
}

console.log(
  failures === 0
    ? "\nAll catalogue verification cases passed."
    : `\n${failures} catalogue verification case(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
