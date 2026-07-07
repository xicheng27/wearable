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
  auditCatalog,
  detectMetadataWarnings,
  inferCategoryFromTitle,
  normalizeCategory,
  normalizeGenderFit,
  validateCategoryAgainstTitle,
} from "@/lib/productMetadata";
import { buildMatchReport } from "@/lib/matchReport";
import {
  buildPassport,
  passportMissingInfo,
  passportMustHaves,
  passportToMarkdown,
  passportToRecommendationInput,
} from "@/lib/passport";
import { buildAvatarAriaLabel } from "@/lib/avatar";
import {
  getMissingEvidenceFields,
  getUnmetHardRequirements,
  normalizeRequestedCategories,
  productMatchesRequestedCategory,
  productMeetsAccessibilityNeeds,
} from "@/lib/recommendationEngine";
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

console.log("\n14. Passport export & missing-info honesty");
{
  const passport = buildPassport(
    {
      who: ["Myself"],
      country: ["Singapore"],
      clothing: ["Bottoms"],
      help: ["Seated or wheelchair comfort"],
      range: ["Female"],
    },
    "waistbands that don't press"
  );
  const md = passportToMarkdown(passport);
  check("markdown has the passport title", md.includes("# Adaptive Fit Passport"));
  check("markdown lists must-haves", md.includes("## Must-have requirements"));
  check("markdown includes fit needs section", md.includes("## Fit needs"));
  check("markdown includes the free-text need", md.includes("waistbands that don't press"));
  check(
    "markdown carries the non-medical, device-only disclaimer",
    md.includes("not a medical record") && md.includes("own device")
  );
  const missing = passportMissingInfo(passport);
  check(
    "missing-info names style and budget (unspecified)",
    missing.includes("Style preference") && missing.includes("Budget")
  );
  check(
    "missing-info omits what was specified",
    !missing.includes("Shopping region") && !missing.includes("Clothing categories")
  );
}

console.log("\n15. Avatar aria-label includes highlighted zones");
{
  const label = buildAvatarAriaLabel(["feet", "hands", "hips"], {
    seated: true,
    helper: true,
  });
  check(
    "label names feet, hands and the seated area",
    /feet/.test(label) && /hands/.test(label) && /hips and seated area/.test(label)
  );
  check("label declares seated posture", /Seated posture/.test(label));
  check("label declares caregiver support", /Caregiver support/.test(label));
  const emptyLabel = buildAvatarAriaLabel([]);
  check(
    "empty state is described, not silent",
    /No areas highlighted yet/.test(emptyLabel)
  );
}

console.log("\n16. Named helper API agrees with the engine");
{
  const cats = normalizeRequestedCategories(["Shoes", "Not sure, show me suitable options"]);
  check("normalizeRequestedCategories maps Shoes → footwear", cats.join(",") === "footwear");
  const input = {
    location: "Singapore",
    mobilityLevel: "wheelchair-or-seated" as const,
    needs: ["Wheelchair or seated comfort"],
    clothingTypes: ["Pants"],
    limit: 9,
  };
  const results = recommendAdaptiveProducts(input);
  const exactOnes = exact(results);
  check(
    "productMeetsAccessibilityNeeds accepts every engine exact match",
    exactOnes.every((r) => productMeetsAccessibilityNeeds(r.product, input))
  );
  check(
    "getUnmetHardRequirements is empty for exact matches",
    exactOnes.every((r) => getUnmetHardRequirements(r.product, input).length === 0)
  );
  check(
    "productMatchesRequestedCategory holds for every result",
    results.every((r) =>
      productMatchesRequestedCategory(r.product, normalizeRequestedCategories(["Pants"]))
    )
  );
  const weakProduct = products.find(
    (p) => p.linkType === "brand-page-only" && !p.sourceVerifiedAt
  );
  if (weakProduct) {
    const evidence = getMissingEvidenceFields(weakProduct, input);
    check(
      "missing-evidence names the exact-link and verification gaps",
      evidence.includes("Exact product link") &&
        evidence.includes("Recent source verification")
    );
  }
}

console.log("\n17. Match-quality tiers are honest");
{
  const results = recommendAdaptiveProducts({
    location: "Singapore",
    mobilityLevel: "wheelchair-or-seated",
    needs: ["Wheelchair or seated comfort"],
    clothingTypes: ["Pants"],
    budget: "Under $50",
    styles: ["Formal"],
    limit: 9,
  });
  const exactTier = exact(results);
  check(
    "non-fallbacks are only exact or strong",
    exactTier.every((r) => r.matchQuality === "exact" || r.matchQuality === "strong")
  );
  check(
    "strong appears only when a style/budget preference is missed",
    exactTier
      .filter((r) => r.matchQuality === "strong")
      .every(
        (r) =>
          !(r.preferencesSatisfied.includes("Under $50") &&
            r.preferencesSatisfied.includes("Formal"))
      )
  );
  const fallbacks = results.filter((r) => r.isFallback);
  check(
    "fallbacks are only partial or alternative",
    fallbacks.every((r) => r.matchQuality === "partial" || r.matchQuality === "alternative")
  );
  check(
    "partial matches always ship to the selected country",
    fallbacks.filter((r) => r.matchQuality === "partial").every((r) => r.shipsToLocation)
  );
}

console.log("\n18. Brand variety without sacrificing needs");
{
  const results = recommendAdaptiveProducts({
    location: "United States",
    clothingTypes: ["Tops"],
    needs: ["Limited dexterity"],
    limit: 9,
  });
  const exactTier = exact(results);
  let maxRun = 1;
  let run = 1;
  for (let i = 1; i < exactTier.length; i++) {
    run = exactTier[i].product.brandId === exactTier[i - 1].product.brandId ? run + 1 : 1;
    maxRun = Math.max(maxRun, run);
  }
  check(
    `no 3+ same-brand run in exact matches (max run: ${maxRun})`,
    maxRun <= 2 || new Set(exactTier.map((r) => r.product.brandId)).size === 1
  );
  const pattern =
    /magnetic|velcro|hook-and-loop|elastic|pull-on|pull on|slip-on|slip on|easy-grip|easy grip|snap|one-handed|hands-free/;
  check(
    "variety never admits an item that misses the dexterity need",
    exactTier.every((r) => r.product.oneHandedDressing || pattern.test(blob(r.product)))
  );
}

console.log("\n19. Need-specific pre-purchase checks & magnet caution");
{
  const seated = recommendAdaptiveProducts({
    mobilityLevel: "wheelchair-or-seated",
    needs: ["Wheelchair or seated comfort"],
    clothingTypes: ["Pants"],
    limit: 9,
  });
  check(
    "wheelchair profiles get seated waistband advice",
    exact(seated).every((r) =>
      r.checkBeforeBuying.some((c) => /waistband and seat/i.test(c))
    )
  );
  const afo = recommendAdaptiveProducts({
    needs: ["Orthotics and AFOs"],
    clothingTypes: ["Shoes"],
    limit: 9,
  });
  check(
    "AFO profiles get depth/opening/insole advice",
    exact(afo).every((r) =>
      r.checkBeforeBuying.some((c) => /depth, opening width/i.test(c))
    )
  );
  const magneticResults = recommendAdaptiveProducts({
    closurePreference: ["Magnetic closures"],
    limit: 9,
  });
  check(
    "magnetic items carry the medical-device caution",
    exact(magneticResults)
      .filter((r) => /magnetic/.test(blob(r.product)))
      .every((r) => r.checkBeforeBuying.some((c) => /Magnetic closures may not be suitable/i.test(c)))
  );
}

console.log("\n20. Product metadata accuracy");
{
  // Title inference resolves the tricky adaptive-phrase cases correctly.
  check("shirt 'for Assisted Dressing' → tops",
    inferCategoryFromTitle("Women's Open-Back Knit Shirt for Assisted Dressing") === "tops");
  check("'Sweater Knit Dress' → dresses_skirts",
    inferCategoryFromTitle("Women's Open Back Sweater Knit Dress") === "dresses_skirts");
  check("'Dress Shirt' → tops (head noun wins)",
    inferCategoryFromTitle("Formal Velcro Dress Shirt") === "tops");
  check("'Front Closure Bra' → undergarments",
    inferCategoryFromTitle("Women's Easy Touch Front Closure Bra") === "undergarments");
  check("'Sleep Cape' is not footwear",
    inferCategoryFromTitle("Women's Easy On Cozy Sleep Cape") !== "footwear");
  check("'Adjustable Sneakers' → footwear",
    inferCategoryFromTitle("Extra-Wide Adjustable Sneakers") === "footwear");

  // The live catalog carries ZERO category-mismatch errors after the repair.
  const errors = auditCatalog(products, "error");
  check(
    `catalog has no category-mismatch errors (${errors.length})`,
    errors.length === 0,
    errors.slice(0, 3).map((e) => e.message).join(" | ")
  );

  // Every product resolves to a known normalized category (never "unknown").
  const unknowns = products.filter((p) => normalizeCategory(p) === "unknown");
  check(`every product has a known normalized category (${unknowns.length} unknown)`,
    unknowns.length === 0);

  // A deliberately mislabelled product is flagged by the validator.
  const bogus = {
    ...products[0],
    id: "bogus-test",
    name: "Adaptive Wide-Leg Pull-On Trousers",
    clothingType: "Dresses",
    category: "dresses",
    categoryNormalized: "dresses_skirts",
  };
  check("validateCategoryAgainstTitle flags pants mislabelled as a dress",
    validateCategoryAgainstTitle(bogus as never)?.severity === "error");
  check("detectMetadataWarnings surfaces that same error",
    detectMetadataWarnings(bogus as never).some((w) => w.severity === "error"));

  // Gender normalization maps onto the requested enum.
  check("genderFit ['Women'] → women",
    normalizeGenderFit({ genderFit: ["Women"] } as never) === "women");
  check("genderFit ['Women','Men'] → unisex",
    normalizeGenderFit({ genderFit: ["Women", "Men"] } as never) === "unisex");
}

console.log("\n21. Strict category exactness uses corrected metadata");
{
  const footwear = exact(recommendAdaptiveProducts({ clothingTypes: ["Footwear"], limit: 12 }));
  check("footwear request → only footwear exact matches",
    footwear.length > 0 && footwear.every((r) => normalizeCategory(r.product) === "footwear"));

  const bottoms = exact(recommendAdaptiveProducts({ clothingTypes: ["Bottoms"], limit: 12 }));
  check("bottoms request → only bottoms exact matches",
    bottoms.length > 0 && bottoms.every((r) => normalizeCategory(r.product) === "bottoms"));

  const tops = exact(recommendAdaptiveProducts({ clothingTypes: ["Tops"], limit: 12 }));
  check("tops request → no footwear/bottoms leak",
    tops.every((r) => normalizeCategory(r.product) === "tops"));
}

console.log("\n22. AFO footwear, Singapore availability & gender range");
{
  const afo = exact(recommendAdaptiveProducts({
    location: "Singapore", clothingTypes: ["Footwear"],
    needs: ["Orthotics and AFOs"], limit: 9,
  }));
  check("SG + footwear + AFO → footwear only", afo.every((r) => normalizeCategory(r.product) === "footwear"));
  const afoEvidence = /afo|orthotic|prosthetic|brace|wide|extra depth|adjustable|removable insole/;
  check("SG AFO footwear all carry orthotic/adjustable evidence",
    afo.length > 0 && afo.every((r) => afoEvidence.test(blob(r.product))));
  check("SG exact matches all ship to Singapore",
    afo.every((r) => shipsTo(r.product, "Singapore")));

  const women = exact(recommendAdaptiveProducts({ clothingTypes: ["Tops"], genderRange: "womenswear", limit: 9 }));
  check("womenswear tops → women or unisex only",
    women.every((r) => productMatchesGenderRange(r.product, "womenswear")));
}

console.log("\n23. Impossible constraints stay honest");
{
  const impossible = recommendAdaptiveProducts({
    clothingTypes: ["Footwear"],
    needs: ["Medical device access"],
    caregiverInvolvement: "caregiver-assisted",
    sensoryNeeds: ["Tags", "Rough seams"],
    location: "Singapore",
    limit: 9,
  });
  // Any exact match must genuinely pass every hard requirement; the engine
  // never fills exacts with unrelated footwear.
  check("no exact match ever crosses out of footwear",
    exact(impossible).every((r) => normalizeCategory(r.product) === "footwear"));
  check("results shown are labelled honestly (fallbacks flagged)",
    impossible.every((r) => (r.isFallback ? r.unmetNeeds.length > 0 : r.unmetNeeds.length === 0)));
}

console.log("\n24. Score breakdown & dashboard math");
{
  const input = {
    location: "Singapore", clothingTypes: ["Footwear"],
    needs: ["Orthotics and AFOs"], styles: ["Minimal"], budget: "$50-$100", limit: 6,
  };
  const results = recommendAdaptiveProducts(input);
  const e = exact(results);
  check("exact matches score category 100%", e.every((r) => r.scoreBreakdown.category === 100));
  check("exact matches ship → location 100%", e.every((r) => r.scoreBreakdown.location === 100));
  check("every breakdown value is 0–100 or null",
    results.every((r) => Object.values(r.scoreBreakdown).every(
      (v) => v === null || (typeof v === "number" && v >= 0 && v <= 100))));
  check("matchScore is within 0–100", results.every((r) => r.matchScore >= 0 && r.matchScore <= 100));
  check("hardPassed never exceeds hardTotal", results.every((r) => r.hardPassed <= r.hardTotal));

  const report = buildMatchReport(results, input, {
    shoppingFor: "Older adult", clothing: ["Footwear"], styles: ["Minimal"], location: "Singapore",
  });
  check("report exposes non-negotiable hard filters", report.hardFilters.length >= 2);
  check("report includes a footwear-only hard filter",
    report.hardFilters.some((c) => /footwear/i.test(c)));
  check("report overall quality is a sane percentage",
    report.summary.overallQuality > 0 && report.summary.overallQuality <= 100);
  check("comparison table has a row per shown product (capped at 8)",
    report.comparison.length === Math.min(results.length, 8));
  check("score bars only contain applicable dimensions",
    report.bars.every((b) => b.value !== null));
}

console.log(
  failures === 0
    ? "\nAll recommendation verification cases passed."
    : `\n${failures} verification case(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
