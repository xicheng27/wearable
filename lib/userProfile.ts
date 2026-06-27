import type {
  BudgetRange,
  CaregiverInvolvement,
  DressingDifficulty,
  DressingMethod,
  GenderStylePreference,
  MobilityLevel,
  TargetGroup,
  UserType,
} from "@/types";

export const shippingLocationCurrency: Record<string, string> = {
  Singapore: "SGD",
  "United States": "USD",
  Canada: "USD",
  "United Kingdom": "EUR",
  Australia: "USD",
  Global: "USD",
};

export function deriveMobilityLevel(
  challenges: string[],
  explicit?: MobilityLevel
): MobilityLevel {
  if (explicit) return explicit;
  const lower = challenges.map((need) => need.toLowerCase());
  if (lower.some((need) => need.includes("wheelchair"))) return "wheelchair";
  if (lower.some((need) => need.includes("seated"))) return "mostly_seated";
  if (
    lower.some(
      (need) =>
        need.includes("bending") ||
        need.includes("mobility") ||
        need.includes("arthritis")
    )
  ) {
    return "support";
  }
  return "independent";
}

export function deriveBudgetRange(label: string): BudgetRange | undefined {
  const value = label.toLowerCase();
  if (value.includes("budget")) return "budget";
  if (value.includes("mid")) return "mid_range";
  if (value.includes("premium")) return "premium";
  if (value.includes("no preference") || value.includes("no limit")) {
    return "no_preference";
  }
  return undefined;
}

export function mapUserType(label?: string): UserType | undefined {
  const value = (label ?? "").toLowerCase();
  if (value.includes("myself")) return "self";
  if (value.includes("parent") || value.includes("family")) return "family";
  if (value.includes("child") || value.includes("teen")) return "child";
  if (value.includes("patient") || value.includes("client")) return "patient";
  if (value.includes("someone")) return "other";
  return undefined;
}

export function mapDressingMethod(label?: string): DressingMethod | undefined {
  const value = (label ?? "").toLowerCase();
  if (value.includes("fully")) return "fully_caregiver";
  if (value.includes("often")) return "caregiver_often";
  if (value.includes("occasional")) return "occasional_help";
  if (value.includes("slow")) return "slow_independent";
  if (value.includes("independently")) return "independent";
  return undefined;
}

export function mapGenderStylePreference(
  label?: string
): GenderStylePreference | undefined {
  const value = (label ?? "").toLowerCase();
  if (value.includes("women")) return "womenswear";
  if (value.includes("men")) return "menswear";
  if (value.includes("neutral")) return "gender_neutral";
  if (value.includes("children") || value.includes("teen")) return "children_teen";
  if (value.includes("no preference")) return "no_preference";
  return undefined;
}

/** Caregivers shop on someone else's behalf; everyone else defaults to self-dressing. */
export function deriveCaregiverInvolvement(
  targetGroup?: TargetGroup,
  dressingMethod?: DressingMethod
): CaregiverInvolvement {
  if (
    targetGroup === "caregiver" ||
    dressingMethod === "caregiver_often" ||
    dressingMethod === "fully_caregiver"
  ) {
    return "caregiver-assisted";
  }
  return "self-dressing";
}

/**
 * A rough, self-reported difficulty level for dressing, not a clinical
 * assessment. Used only to weight how much an adaptive feature matters.
 */
export function deriveDressingDifficulty(
  needs: string[],
  closurePreference: string[]
): DressingDifficulty {
  const lowerNeeds = needs.map((need) => need.toLowerCase());
  const highSignal = [
    "wheelchair",
    "limb difference",
    "neurological",
    "stroke",
    "parkinson",
    "caregiver",
    "bed",
  ];
  if (lowerNeeds.some((need) => highSignal.some((signal) => need.includes(signal)))) {
    return "high";
  }

  const lowerClosures = closurePreference.map((value) => value.toLowerCase());
  const adaptiveClosureSignal = lowerClosures.some(
    (value) =>
      value.includes("magnetic") ||
      value.includes("velcro") ||
      value.includes("slip-on") ||
      value.includes("side opening") ||
      value.includes("open-back")
  );
  if (
    adaptiveClosureSignal ||
    lowerNeeds.some(
      (need) => need.includes("fine motor") || need.includes("limited hand")
    )
  ) {
    return "moderate";
  }

  return "low";
}
