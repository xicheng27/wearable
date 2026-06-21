import type {
  BudgetRange,
  CaregiverInvolvement,
  DressingDifficulty,
  MobilityLevel,
  TargetGroup,
} from "@/types";

// The quiz's location step uses shipping regions rather than full country
// names, so map those directly to a default display currency.
export const shippingLocationCurrency: Record<string, string> = {
  USA: "USD",
  Canada: "CAD",
  UK: "GBP",
  EU: "EUR",
  Australia: "AUD",
};

export function deriveMobilityLevel(needs: string[]): MobilityLevel {
  const lower = needs.map((need) => need.toLowerCase());
  if (lower.some((need) => need.includes("wheelchair"))) return "wheelchair-or-seated";
  if (lower.some((need) => need.includes("mobility"))) return "some-difficulty";
  return "full-mobility";
}

export function deriveBudgetRange(label: string): BudgetRange | undefined {
  const value = label.toLowerCase();
  if (value.includes("budget")) return "budget";
  if (value.includes("mid")) return "mid-range";
  if (value.includes("premium")) return "premium";
  if (value.includes("no limit")) return "no-limit";
  return undefined;
}

/** Caregivers shop on someone else's behalf; everyone else dresses themselves. */
export function deriveCaregiverInvolvement(
  targetGroup?: TargetGroup
): CaregiverInvolvement {
  return targetGroup === "caregiver" ? "caregiver-assisted" : "self-dressing";
}

/**
 * A rough, self-reported difficulty level for dressing — not a clinical
 * assessment. Used only to weight how much an adaptive feature matters,
 * derived from the needs and closures the shopper already selected.
 */
export function deriveDressingDifficulty(
  needs: string[],
  closurePreference: string[]
): DressingDifficulty {
  const lowerNeeds = needs.map((need) => need.toLowerCase());
  const highSignal = ["wheelchair", "limb difference", "neurological", "stroke", "parkinson"];
  if (lowerNeeds.some((need) => highSignal.some((signal) => need.includes(signal)))) {
    return "high";
  }

  const lowerClosures = closurePreference.map((value) => value.toLowerCase());
  const adaptiveClosureSignal = lowerClosures.some(
    (value) =>
      value.includes("magnetic") || value.includes("velcro") || value.includes("slip-on")
  );
  if (adaptiveClosureSignal || lowerNeeds.some((need) => need.includes("fine motor") || need.includes("mobility impairment"))) {
    return "moderate";
  }

  return "low";
}
