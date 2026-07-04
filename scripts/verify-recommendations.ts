/**
 * Verification cases for the strict adaptive recommendation engine.
 *
 * Run with:  npm run verify:reco
 * (bundles this file with esbuild using the `@/` path alias, then runs it)
 *
 * These assert the HARD requirements of the matching engine:
 *  - clothing category is strict (Footwear never returns pants/tops)
 *  - country availability is strict for exact matches
 *  - wheelchair/seated, sensory and caregiver needs are strict for exact matches
 *  - clothing range is strict (womenswear never returns men-only items)
 *  - children/teen shopping only returns kids items
 *  - impossible strict combinations return an honest empty list, never
 *    unrelated substitutes
 */

import { getProductShipsTo, products } from "@/data/products";
import { expandShippingRegions, GLOBAL } from "@/lib/countries";
import {
  categoryFamilyFor,
  evaluateProductForInput,
  productInSelectedCategories,
  productMatchesGenderRange,
  recommendAdaptiveProducts,
} from "@/lib/recommendationEngine";
import {
  buildPassport,
  passportMustHaves,
  passportToRecommendationInput,
} from "@/lib/passport";
import type { Product, RecommendationResult } from "@/types";

let failures = 0;

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function blob(product: Product): string {
  return [
    product.name,
    product.clothingType,
    product.category,
    product.description,
    product.accessibilityExplanation,
    ...product.adaptiveFeatures,
    ...product.disabilityNeeds,
    ...product.bestFor,
    ...product.styleTags,
  ]
    .join(" ")
    .toLowerCase();
}

function shipsTo(product: Product, location: string): boolean {
  const regions = getProductShipsTo(product);
  if (regions.includes(GLOBAL)) return true;
  return expandShippingRegions([location]).some((c) => regions.includes(c));
}

function exact(results: RecommendationResult[]): RecommendationResult[] {
  return results.filter((r) => !r.isFallback);
}

console.log("1. Category normalization helper");
check("Shoes → footwear family", categoryFamilyFor("Shoes") === "footwear");
check("Sneakers → footwear family", categoryFamilyFor("Sneakers") === "footwear");
check("Pants → bottoms family", categoryFamilyFor("Pants") === "bottoms");
check("Trousers → bottoms family", categoryFamilyFor("Trousers") === "bottoms");
check("Jeans → bottoms family", categoryFamilyFor("Jeans") === "bottoms");
check("Tops → tops family", categoryFamilyFor("Tops") === "tops");
check("T-shirts → tops family", categoryFamilyFor("T-shirts") === "tops");
check("Skirts → dresses family", categoryFamilyFor("Skirts") === "dresses");
check("Outerwear → outerwear family", categoryFamilyFor("Outerwear") === "outerwear");
check("Coats → outerwear family", categoryFamilyFor("Coats") === "outerwear");
check("Bras → undergarments family", categoryFamilyFor("Bras") === "undergarments");
check("Socks → undergarments family", categoryFamilyFor("Socks") === "undergarments");

console.log("\n2. Selecting Shoes must not show pants/tops");
{
  const results = recommendAdaptiveProducts({ clothingTypes: ["Shoes"], limit: 9 });
  check("returns at least one result", results.length > 0);
  const offenders = results.filter(
    (r) => !productInSelectedCategories(r.product, ["Shoes"])
  );
  check(
    "every result (including fallbacks) is footwear",
    offenders.length === 0,
    offenders.map((r) => `${r.product.name} [${r.product.clothingType}]`).join(", ")
  );
  const sockLeak = results.filter((r) => /sock/i.test(r.product.clothingType));
  check(
    "socks (undergarments) never leak into a Shoes selection",
    sockLeak.length === 0,
    sockLeak.map((r) => r.product.name).join(", ")
  );
}

console.log("\n3. Selecting Singapore: exact matches must ship to Singapore");
{
  const results = recommendAdaptiveProducts({ location: "Singapore", limit: 9 });
  const offenders = exact(results).filter((r) => !shipsTo(r.product, "Singapore"));
  check(
    "every exact match ships to / is available in Singapore",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
  const mislabelled = results.filter(
    (r) => r.shipsToLocation !== shipsTo(r.product, "Singapore")
  );
  check("shipsToLocation flag is honest on every card", mislabelled.length === 0);
}

console.log("\n4. Wheelchair/seated: exact matches must support seated fit");
{
  const results = recommendAdaptiveProducts({
    mobilityLevel: "wheelchair-or-seated",
    needs: ["Wheelchair or seated comfort", "Seated fit"],
    limit: 9,
  });
  const offenders = exact(results).filter(
    (r) => !(r.product.seatedFit || /wheelchair|seated/.test(blob(r.product)))
  );
  check(
    "no generic non-seated product appears as an exact match",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
}

console.log("\n5. Sensory needs: exact matches must be sensory-friendly");
{
  const results = recommendAdaptiveProducts({
    sensoryNeeds: ["Soft, tag-free fabrics"],
    needs: ["Sensory discomfort"],
    limit: 9,
  });
  const pattern =
    /tag-free|tag free|tagless|seamless|flat seam|soft|low-friction|low friction|non-irritating|sensory/;
  const offenders = exact(results).filter(
    (r) => !(r.product.sensoryFriendly || pattern.test(blob(r.product)))
  );
  check(
    "no non-sensory item appears as an exact match",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
}

console.log("\n6. Caregiver-assisted: exact matches must support assisted dressing");
{
  const results = recommendAdaptiveProducts({
    caregiverInvolvement: "caregiver-assisted",
    limit: 9,
  });
  const pattern =
    /open-back|open back|back opening|back-opening|side opening|side-opening|side fasten|drop-front|drop front|wrap|assisted|caregiver/;
  const offenders = exact(results).filter((r) => !pattern.test(blob(r.product)));
  check(
    "every exact match has open-back / side-opening / assisted-dressing features",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
}

console.log(
  "\n6a. Caregiver profile that skipped the closures question still gets exact matches"
);
{
  // The quiz auto-adds "Open-back design" to closurePreference for caregiver
  // profiles. It is not a closure type — it must not activate an
  // unsatisfiable closure requirement that hides every product.
  const results = recommendAdaptiveProducts({
    caregiverInvolvement: "caregiver-assisted",
    closurePreference: ["Open-back design"],
    limit: 9,
  });
  check("exact matches exist", exact(results).length > 0);
  const closureUnmet = results.some((r) =>
    r.unmetNeeds.includes("Your preferred closure type")
  );
  check("closure requirement is not activated by feature hints", !closureUnmet);
  // A real closure choice still filters strictly.
  const magnetic = recommendAdaptiveProducts({
    closurePreference: ["Magnetic closures"],
    limit: 9,
  });
  const offenders = exact(magnetic).filter((r) => !/magnetic/.test(blob(r.product)));
  check(
    "a recognized closure preference still filters strictly",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
}

console.log("\n6b. AFO/orthotic needs: exact matches must accommodate them");
{
  const results = recommendAdaptiveProducts({
    clothingTypes: ["Shoes"],
    needs: ["Orthotics and AFOs"],
    limit: 9,
  });
  const pattern =
    /\bafo\b|orthotic|prosthetic|brace|wide opening|extra depth|wide fit|adjustable width|removable insole|limb difference/;
  const offenders = exact(results).filter((r) => !pattern.test(blob(r.product)));
  check(
    "every exact match accommodates AFOs/orthotics",
    offenders.length === 0,
    offenders.map((r) => r.product.name).join(", ")
  );
  const wrongCat = results.filter((r) => !productInSelectedCategories(r.product, ["Shoes"]));
  check("AFO results stay within footwear", wrongCat.length === 0);
}

console.log("\n7. Womenswear must never show men-only items");
{
  const results = recommendAdaptiveProducts({ genderRange: "womenswear", limit: 9 });
  const offenders = results.filter((r) => {
    const fits = r.product.genderFit.map((f) => f.toLowerCase());
    return !fits.some((f) => /women|unisex|neutral/.test(f));
  });
  check(
    "every result (including fallbacks) fits women or is unisex",
    offenders.length === 0,
    offenders.map((r) => `${r.product.name} [${r.product.genderFit.join("/")}]`).join(", ")
  );
}

console.log("\n8. Menswear must never show women-only items");
{
  const results = recommendAdaptiveProducts({ genderRange: "menswear", limit: 9 });
  const offenders = results.filter((r) => {
    const fits = r.product.genderFit.map((f) => f.toLowerCase());
    return !fits.some((f) => /\bmen\b|^men$|unisex|neutral/.test(f));
  });
  check("every result fits men or is unisex", offenders.length === 0);
}

console.log("\n9. Children/teen shopping shows kids items only");
{
  const results = recommendAdaptiveProducts({ childrenTeen: true, limit: 9 });
  const offenders = results.filter(
    (r) => !r.product.genderFit.some((f) => /kid|child|teen|youth|junior/i.test(f))
  );
  check(
    "every result is a kids/teen item",
    offenders.length === 0,
    offenders.map((r) => `${r.product.name} [${r.product.genderFit.join("/")}]`).join(", ")
  );
}

console.log("\n10. Impossible strict combinations return an honest empty list");
{
  // A category no product should belong to under a kids-only restriction —
  // if the catalogue ever gains kids formal gowns this stays valid because
  // any non-empty result must still satisfy both strict filters.
  const results = recommendAdaptiveProducts({
    clothingTypes: ["Shoes"],
    genderRange: "womenswear",
    childrenTeen: true,
    limit: 9,
  });
  const violating = results.filter(
    (r) =>
      !productInSelectedCategories(r.product, ["Shoes"]) ||
      !productMatchesGenderRange(r.product, "womenswear", true)
  );
  check(
    "strict filters are never silently dropped to fill the page",
    violating.length === 0,
    violating.map((r) => r.product.name).join(", ")
  );
}

console.log("\n11. Gender range helper unit checks");
{
  const mk = (fits: string[]) => ({ genderFit: fits }) as unknown as Product;
  check("women item passes womenswear", productMatchesGenderRange(mk(["Women"]), "womenswear"));
  check("unisex item passes womenswear", productMatchesGenderRange(mk(["Unisex"]), "womenswear"));
  check("men-only item fails womenswear", !productMatchesGenderRange(mk(["Men"]), "womenswear"));
  check("men item passes menswear", productMatchesGenderRange(mk(["Men"]), "menswear"));
  check("women-only item fails menswear", !productMatchesGenderRange(mk(["Women"]), "menswear"));
  check(
    "multi-fit (women+men) passes gender-neutral",
    productMatchesGenderRange(mk(["Women", "Men"]), "gender_neutral")
  );
  check(
    "women-only fails gender-neutral",
    !productMatchesGenderRange(mk(["Women"]), "gender_neutral")
  );
  check("kids item passes children/teen", productMatchesGenderRange(mk(["Kids"]), undefined, true));
  check(
    "adult unisex fails children/teen",
    !productMatchesGenderRange(mk(["Unisex"]), undefined, true)
  );
}

console.log("\n12. Confidence & Truth Card data on every result");
{
  const results = recommendAdaptiveProducts({
    location: "Singapore",
    mobilityLevel: "wheelchair-or-seated",
    needs: ["Wheelchair or seated comfort"],
    clothingTypes: ["Pants"],
    limit: 9,
  });
  check("results exist", results.length > 0);
  check(
    "every result carries a confidence level",
    results.every((r) => ["high", "medium", "low"].includes(r.confidence))
  );
  check(
    "every result carries check-before-buying guidance",
    results.every((r) => r.checkBeforeBuying.length > 0)
  );
  const fallbacks = results.filter((r) => r.isFallback);
  check(
    "fallbacks are never high confidence",
    fallbacks.every((r) => r.confidence === "low")
  );
  const exactHigh = exact(results).filter((r) => r.confidence === "high");
  check(
    "high-confidence exact matches link to the exact product",
    exactHigh.every((r) => r.product.linkType === "exact-product")
  );
}

console.log("\n13. Passport → evaluator agrees with the quiz engine");
{
  const passport = buildPassport({
    who: ["Myself"],
    country: ["Singapore"],
    clothing: ["Bottoms"],
    help: ["Seated or wheelchair comfort", "Caregiver-assisted dressing"],
    dressingIndependence: ["A caregiver dresses me"],
    range: ["Female"],
    budget: ["Mid-range"],
  });
  const input = passportToRecommendationInput(passport);
  check("passport input keeps location", input.location === "Singapore");
  check("passport input keeps category", (input.clothingTypes ?? []).includes("Pants"));
  check("passport input keeps range", input.genderRange === "womenswear");
  check(
    "passport input keeps caregiver need",
    input.caregiverInvolvement === "caregiver-assisted"
  );

  // Choosing caregiver-assisted dressing as a need must activate the
  // caregiver hard requirement even when the follow-up question was skipped.
  const helpOnly = buildPassport({ help: ["Caregiver-assisted dressing"] });
  check(
    "caregiver help selection alone activates the caregiver requirement",
    passportToRecommendationInput(helpOnly).caregiverInvolvement === "caregiver-assisted"
  );

  const must = passportMustHaves(passport);
  check(
    "must-haves name category, location, range, seated and caregiver",
    ["pants", "Singapore", "Womenswear", "Seated", "Caregiver"].every((k) =>
      must.some((m) => m.toLowerCase().includes(k.toLowerCase()))
    ),
    must.join(" | ")
  );

  // Every exact match from the engine must also pass the standalone evaluator
  // (used by the browse-page passport filter), so the two never disagree.
  const engineResults = recommendAdaptiveProducts(input);
  const engineExact = exact(engineResults);
  const disagreement = engineExact.filter(
    (r) => !evaluateProductForInput(r.product, input).meetsAllNeeds
  );
  check(
    "browse-page evaluator accepts every quiz exact match",
    disagreement.length === 0,
    disagreement.map((r) => r.product.name).join(", ")
  );

  // And the evaluator must reject items that violate the passport's strict
  // category — e.g. any shoe.
  const shoe = products.find((p) => /shoe/i.test(p.clothingType));
  if (shoe) {
    const evaluation = evaluateProductForInput(shoe, input);
    check(
      "evaluator rejects a shoe for a pants-only passport",
      !evaluation.meetsAllNeeds &&
        evaluation.unmetNeeds.includes("Your selected clothing type")
    );
  }
}

console.log(
  failures === 0
    ? "\nAll recommendation verification cases passed."
    : `\n${failures} verification case(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
