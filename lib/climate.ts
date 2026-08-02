import type { Product } from "@/types";

/**
 * Evidence-based climate suitability for a hot, humid tropical climate
 * (Singapore: ~23–33°C year round, high humidity — see ACAR 2023).
 *
 * Rules (deliberately conservative — never infer a positive claim from a
 * product NAME alone):
 *   • "high"    → explicit breathable/lightweight/cooling/linen evidence from
 *                 material composition, climate tags or the official
 *                 description, PLUS warm-weather construction (short sleeve,
 *                 sleeveless, shorts, open back or loose fit).
 *   • "medium"  → cotton, or a single warm-weather signal (short sleeve alone,
 *                 or one breathable/light claim) without the full picture.
 *   • "low"     → clearly warm/heavy garments: fleece, wool, flannel, puffer,
 *                 down, thermal, quilted, sweaters, heavy hoodies, winter boots.
 *   • "unknown" → no reliable evidence either way (stays unknown, never guessed).
 *
 * The stored `evidence` strings let the UI explain "why it suits Singapore"
 * (or why it was hidden) instead of asserting an unbacked badge.
 */

export type ClimateSuitability = "high" | "medium" | "low" | "unknown";

export interface ClimateAssessment {
  suitability: ClimateSuitability;
  /** Recognised climate tags, e.g. ["linen", "short-sleeve"]. */
  tags: string[];
  /** Human-readable evidence used for the verdict. */
  evidence: string[];
}

/** Clearly warm/heavy signals → low suitability for a tropical climate. */
const WARM_HEAVY =
  /\b(fleece|wool|merino|cashmere|flannel|sherpa|shearling|down|puffer|parka|thermal|insulat(?:ed|ing)|quilt(?:ed)?|padded|sweater|jumper|sweatshirt|beanie|snow ?boot|winter ?boot|ski\b|corduroy|velvet)\b/i;

/** Explicit positive material/claim evidence (breathable / light / cooling). */
const COOL_EVIDENCE =
  /\b(linen|chambray|seersucker|mesh|bamboo|eyelet|breathable|lightweight|light-weight|cooling|moisture[- ]?wicking|moisture[- ]?managing|quick[- ]?dry|ventilat(?:ed|ing)|airflow|uv[- ]?protect|sun[- ]?protect)\b/i;

/** Warm-weather garment construction. */
const WARM_CONSTRUCTION =
  /\b(short[- ]?sleeve|sleeveless|shorts|tank|cami|open[- ]?back|loose[- ]?fit|relaxed[- ]?fit)\b/i;

const COTTON = /\bcotton\b/i;

/** Tags we surface in the UI when the evidence text mentions them. */
const TAG_PATTERNS: Array<[string, RegExp]> = [
  ["linen", /\blinen\b/i],
  ["breathable", /\bbreathable\b/i],
  ["lightweight", /\blight[- ]?weight\b/i],
  ["cooling", /\bcooling\b/i],
  ["moisture-managing", /\bmoisture[- ]?(?:wicking|managing)\b/i],
  ["short-sleeve", /\bshort[- ]?sleeve\b/i],
  ["sleeveless", /\bsleeveless\b/i],
  ["shorts", /\bshorts\b/i],
  ["loose-fit", /\bloose[- ]?fit|relaxed[- ]?fit\b/i],
  ["mesh", /\bmesh\b/i],
  ["fleece", /\bfleece\b/i],
  ["wool", /\bwool|merino\b/i],
  ["flannel", /\bflannel\b/i],
  ["winter", /\b(puffer|parka|thermal|snow ?boot|winter ?boot|down)\b/i],
];

/** Official material text for a product, if any was captured. */
function materialText(product: Product): string {
  const parts = [
    product.materialComposition,
    ...(product.materials ?? []),
    ...(product.climateTags ?? []),
    product.sleeveLength,
  ].filter((v): v is string => Boolean(v));
  return parts.join(" ").toLowerCase();
}

/**
 * Assess a product's suitability for a hot, humid climate using only
 * evidence — never the product name alone for a positive verdict.
 */
export function assessClimate(product: Product): ClimateAssessment {
  // If the catalogue already carries an explicit verdict, trust it.
  if (product.climateSuitability && product.climateSuitability !== "unknown") {
    return {
      suitability: product.climateSuitability,
      tags: product.climateTags ?? [],
      evidence: product.climateEvidence ?? ["Verified during catalogue sync."],
    };
  }

  const material = materialText(product);
  const officialText = `${material} ${product.description ?? ""}`.toLowerCase();
  const nameAndType = `${product.name} ${product.clothingType}`.toLowerCase();
  const evidence: string[] = [];

  // LOW: clearly warm/heavy. Safe to infer from name/type/material because it
  // is a negative (never a positive "good for hot weather") classification.
  const warmHit = `${nameAndType} ${material}`.match(WARM_HEAVY);
  if (warmHit) {
    evidence.push(`Warm/heavy garment signal: "${warmHit[0]}".`);
    return { suitability: "low", tags: collectTags(`${nameAndType} ${material}`), evidence };
  }

  // Positive evidence must come from official material/claim text (not the name).
  const coolHit = officialText.match(COOL_EVIDENCE);
  const cottonHit = officialText.match(COTTON);
  // Construction can be read from structured fields or the official description.
  const constructionHit = `${material} ${product.description ?? ""} ${product.sleeveLength ?? ""}`
    .toLowerCase()
    .match(WARM_CONSTRUCTION);

  if (coolHit && constructionHit) {
    evidence.push(`Breathable/light material evidence: "${coolHit[0]}".`);
    evidence.push(`Warm-weather construction: "${constructionHit[0]}".`);
    return { suitability: "high", tags: collectTags(officialText), evidence };
  }

  if (coolHit) {
    evidence.push(`Breathable/light material evidence: "${coolHit[0]}".`);
    return { suitability: "medium", tags: collectTags(officialText), evidence };
  }
  if (constructionHit) {
    evidence.push(`Warm-weather construction: "${constructionHit[0]}".`);
    return { suitability: "medium", tags: collectTags(officialText), evidence };
  }
  if (cottonHit) {
    evidence.push("Cotton fabric (moderate breathability; no cooling evidence).");
    return { suitability: "medium", tags: collectTags(officialText), evidence };
  }

  return { suitability: "unknown", tags: [], evidence: [] };
}

function collectTags(text: string): string[] {
  const tags: string[] = [];
  for (const [tag, pattern] of TAG_PATTERNS) {
    if (pattern.test(text)) tags.push(tag);
  }
  return Array.from(new Set(tags));
}

/**
 * A "Hot-humid suitable" badge is shown ONLY when the evidence supports a
 * high verdict — never from a name or a guess.
 */
export function hasHotHumidBadge(product: Product): boolean {
  return assessClimate(product).suitability === "high";
}

/** Order used for Singapore-default sorting: high → medium → unknown → low. */
export const CLIMATE_RANK: Record<ClimateSuitability, number> = {
  high: 0,
  medium: 1,
  unknown: 2,
  low: 3,
};

/**
 * Whether a product should be HIDDEN from Singapore hot-&-humid default
 * results. Low-suitability (warm/winter) items are hidden unless the shopper
 * has explicitly opted into outerwear / "show all climates".
 */
export function hiddenInHotHumidDefault(product: Product): boolean {
  return assessClimate(product).suitability === "low";
}
