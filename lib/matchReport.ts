import type {
  MatchQuality,
  RecommendationInput,
  RecommendationResult,
  ScoreBreakdown,
} from "@/types";
import { getActiveHardRequirements } from "@/lib/recommendationEngine";
import {
  CATEGORY_DISPLAY,
  inferCategoryFromTitle,
  normalizeCategory,
} from "@/lib/productMetadata";
import { GLOBAL } from "@/lib/countries";

/**
 * Aggregates a set of recommendation results into the numbers behind the
 * results-page "Fit Match Report" dashboard. Pure and deterministic so the
 * dashboard math is unit-testable — every figure is derived from real match
 * state, never invented.
 */

export interface ReportBar {
  key: string;
  label: string;
  /** 0–100, or null when the dimension wasn't part of this profile. */
  value: number | null;
}

export interface ComparisonRow {
  id: string;
  name: string;
  category: string;
  breakdown: ScoreBreakdown;
  confidence: string;
  finalScore: number;
  matchQuality: MatchQuality;
}

export interface MatchReport {
  profile: { label: string; value: string }[];
  hardFilters: string[];
  summary: {
    overallQuality: number;
    hardPassed: number;
    hardTotal: number;
    softMatched: number;
    softTotal: number;
    confidenceLabel: string;
    exactCount: number;
    strongCount: number;
    alternativeCount: number;
    missingFields: number;
  };
  bars: ReportBar[];
  comparison: ComparisonRow[];
}

const CATEGORY_ONLY_LABEL: Record<string, string> = {
  footwear: "Footwear only",
  tops: "Tops only",
  bottoms: "Bottoms only",
  dresses_skirts: "Dresses / one-piece only",
  outerwear: "Outerwear only",
  undergarments: "Base layers only",
};

function rangeLabel(input: RecommendationInput): string | null {
  if (input.childrenTeen) return "Kids / teen";
  switch (input.genderRange) {
    case "womenswear": return "Women / unisex";
    case "menswear": return "Men / unisex";
    case "gender_neutral": return "Gender-neutral";
    default: return null;
  }
}

function dressingSupportLabel(input: RecommendationInput): string | null {
  if (input.caregiverInvolvement === "caregiver-assisted") return "Caregiver-assisted dressing";
  switch (input.dressingMethod) {
    case "independent": return "Dresses independently";
    case "slow_independent": return "Independent, takes time";
    case "occasional_help": return "Independent with some help";
    case "caregiver_often":
    case "fully_caregiver": return "Caregiver-assisted dressing";
    default: return null;
  }
}

function averageBar(results: RecommendationResult[], pick: (b: ScoreBreakdown) => number | null): number | null {
  const vals = results.map((r) => pick(r.scoreBreakdown)).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function confidenceLabelFor(avg: number): string {
  if (avg >= 85) return "High";
  if (avg >= 70) return "Medium-high";
  if (avg >= 55) return "Medium";
  return "Building";
}

/**
 * @param results   All shown results (exact + fallbacks), already ordered.
 * @param input     The strict recommendation input.
 * @param context   Human-readable profile facts parsed from the quiz.
 */
export function buildMatchReport(
  results: RecommendationResult[],
  input: RecommendationInput,
  context: {
    shoppingFor?: string;
    clothing: string[];
    styles: string[];
    location?: string;
  }
): MatchReport {
  const exact = results.filter((r) => r.matchQuality === "exact" || r.matchQuality === "strong");
  const alternatives = results.filter((r) => r.isFallback);
  // The "primary" set the top-line numbers describe: exact/strong if we have
  // them, otherwise the closest alternatives (so the report is never blank).
  const primary = exact.length > 0 ? exact : results;

  // ----- Profile summary -----
  const activeReqs = getActiveHardRequirements(input);
  const functional = activeReqs.filter((r) => r.id !== "country");
  const profile: { label: string; value: string }[] = [];
  if (context.shoppingFor) profile.push({ label: "Shopping for", value: context.shoppingFor });
  profile.push({ label: "Region", value: context.location && context.location !== GLOBAL ? context.location : "Global" });
  if (context.clothing.length) profile.push({ label: "Clothing needed", value: context.clothing.join(", ") });
  if (functional.length) profile.push({ label: "Main access need", value: functional[0].label });
  const dressing = dressingSupportLabel(input);
  if (dressing) profile.push({ label: "Dressing support", value: dressing });
  const range = rangeLabel(input);
  if (range) profile.push({ label: "Range", value: range });
  if (context.styles.length) profile.push({ label: "Style", value: context.styles.join(", ") });
  if (input.budget) profile.push({ label: "Budget", value: input.budget });

  // ----- Hard-filter chips (only genuinely hard constraints) -----
  const hardFilters: string[] = [];
  const catFamilies = new Set(
    context.clothing
      .map((c) => inferCategoryFromTitle(c))
      .filter((c) => c !== "unknown")
  );
  catFamilies.forEach((fam) => {
    const label = CATEGORY_ONLY_LABEL[fam];
    if (label) hardFilters.push(label);
  });
  if (context.location && context.location !== GLOBAL) {
    hardFilters.push(`${context.location} availability`);
  } else if (context.location === GLOBAL) {
    hardFilters.push("Global availability");
  }
  functional.forEach((r) => hardFilters.push(r.label));
  if (range) hardFilters.push(range);

  // ----- Summary cards -----
  const overallQuality =
    primary.length > 0
      ? Math.round(primary.reduce((a, r) => a + r.matchScore, 0) / primary.length)
      : 0;
  const best = primary[0];
  const avgConfidenceScore = averageBar(primary, (b) => b.confidence) ?? 0;
  const missingFields =
    primary.length > 0
      ? Math.round(primary.reduce((a, r) => a + r.missingData.length, 0) / primary.length)
      : 0;

  // ----- Score breakdown bars (averaged across the primary set) -----
  const bars: ReportBar[] = [
    { key: "category", label: "Category match", value: averageBar(primary, (b) => b.category) },
    { key: "accessibility", label: "Accessibility match", value: averageBar(primary, (b) => b.accessibility) },
    { key: "location", label: "Location availability", value: averageBar(primary, (b) => b.location) },
    { key: "dressing", label: "Dressing method match", value: averageBar(primary, (b) => b.dressing) },
    { key: "sensory", label: "Sensory comfort match", value: averageBar(primary, (b) => b.sensory) },
    { key: "range", label: "Range match", value: averageBar(primary, (b) => b.range) },
    { key: "style", label: "Style match", value: averageBar(primary, (b) => b.style) },
    { key: "budget", label: "Budget match", value: averageBar(primary, (b) => b.budget) },
    { key: "confidence", label: "Data confidence", value: averageBar(primary, (b) => b.confidence) },
  ].filter((bar) => bar.value !== null);

  // ----- Comparison table rows -----
  const comparison: ComparisonRow[] = results.slice(0, 8).map((r) => ({
    id: r.product.id,
    name: r.product.name,
    category: CATEGORY_DISPLAY[normalizeCategory(r.product) as keyof typeof CATEGORY_DISPLAY]?.label ?? "—",
    breakdown: r.scoreBreakdown,
    confidence: r.confidence,
    finalScore: r.matchScore,
    matchQuality: r.matchQuality,
  }));

  return {
    profile,
    hardFilters,
    summary: {
      overallQuality,
      hardPassed: best?.hardPassed ?? 0,
      hardTotal: best?.hardTotal ?? 0,
      softMatched: best?.softMatched ?? 0,
      softTotal: best?.softTotal ?? 0,
      confidenceLabel: confidenceLabelFor(avgConfidenceScore),
      exactCount: results.filter((r) => r.matchQuality === "exact").length,
      strongCount: results.filter((r) => r.matchQuality === "strong").length,
      alternativeCount: alternatives.length,
      missingFields,
    },
    bars,
    comparison,
  };
}
