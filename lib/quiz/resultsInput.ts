import {
  deriveCaregiverInvolvement,
  deriveDressingDifficulty,
  deriveMobilityLevel,
} from "@/lib/userProfile";
import type {
  AgeRange,
  DressingMethod,
  LifestyleSetting,
  MobilityLevel,
  RecommendationInput,
  TargetGroup,
} from "@/types";

/**
 * Shared parsing of quiz-result query params into a strict
 * RecommendationInput. Used by the results page (from the URL) and by the
 * Adaptive Fit Passport (from params regenerated out of stored answers), so
 * both surfaces are guaranteed to interpret a profile identically.
 */

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function readList(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(",")
    .map((item) => {
      try {
        return decodeURIComponent(item).trim();
      } catch {
        return item.trim();
      }
    })
    .filter(Boolean);
}

export function readValue(value: string | string[] | undefined): string | undefined {
  return readList(value)[0];
}

function normalizeNeeds(
  rawNeeds: string[],
  sensory: string[],
  fastenings: string[],
  seated: string[],
  features: string[]
) {
  const needs = [...rawNeeds, ...features];

  if (seated.some((value) => value.toLowerCase().includes("yes"))) {
    needs.push("Wheelchair users", "Seated fit");
  }
  if (sensory.some((value) => !value.toLowerCase().includes("no sensory"))) {
    needs.push("Sensory processing");
  }
  if (fastenings.some((value) => value.toLowerCase().includes("magnetic"))) {
    needs.push("Magnetic closures", "One-handed dressing");
  }
  if (fastenings.some((value) => value.toLowerCase().includes("zipper"))) {
    needs.push("Easy entry");
  }

  [...rawNeeds, ...features].forEach((need) => {
    const value = need.toLowerCase();
    if (value.includes("easy shoes")) {
      needs.push("Hands-free entry", "Wide opening", "Limited mobility");
    }
    if (value.includes("sensory") || value.includes("seam") || value.includes("tag")) {
      needs.push("Sensory processing", "Skin sensitivity");
    }
    if (value.includes("wheelchair") || value.includes("seated")) {
      needs.push("Wheelchair users", "Seated fit");
    }
    if (value.includes("arthritis") || value.includes("dexterity")) {
      needs.push("Arthritis", "Limited dexterity");
    }
    if (value.includes("prosthetic")) {
      needs.push("Prosthetic users", "Orthotics and AFOs", "Limb differences");
    }
    if (value.includes("magnetic")) {
      needs.push("Magnetic closures", "One-handed dressing");
    }
  });

  return Array.from(new Set(needs));
}

function normalizeBudget(value: string | undefined) {
  const budget = value ?? "";
  if (["Under $50", "$50-$100", "$100-$150", "$150+"].includes(budget)) {
    return budget;
  }
  const lower = budget.toLowerCase();
  if (lower.includes("budget")) return "Under $50";
  if (lower.includes("mid")) return "$50-$100";
  if (lower.includes("premium")) return "$100-$150";
  return budget && !lower.includes("no") ? budget : undefined;
}

function normalizeMobility(value: string | undefined): MobilityLevel | undefined {
  if (!value) return undefined;
  if (value === "wheelchair") return "wheelchair-or-seated";
  if (value === "mostly_seated") return "wheelchair-or-seated";
  if (value === "support") return "some-difficulty";
  if (value === "independent") return "full-mobility";
  return value as MobilityLevel;
}

export interface QuizResultsData {
  input: RecommendationInput;
  needs: string[];
  clothing: string[];
  styles: string[];
  availability: string;
  otherNeeds: string;
  location?: string;
  childrenTeen: boolean;
}

export function parseResultParams(searchParams: SearchParamsRecord): QuizResultsData {
  const rawNeeds = readList(searchParams.needs);
  const features = readList(searchParams.features);
  const sensory = readList(searchParams.sensory);
  const fastenings = [
    ...readList(searchParams.fastenings),
    ...features.filter((feature) => /magnetic|velcro|zip|button|elastic|opening/i.test(feature)),
  ];
  const seated = readList(searchParams.seated);
  const needs = normalizeNeeds(rawNeeds, sensory, fastenings, seated, features);
  const styles = [...readList(searchParams.style), ...readList(searchParams.styles)];
  const budget = normalizeBudget(readValue(searchParams.budget));
  const clothing = readList(searchParams.clothing);
  const availability = readValue(searchParams.availability) ?? "";
  const otherNeeds = readList(searchParams.otherNeeds).join(", ").slice(0, 500);
  const location = readValue(searchParams.location);
  const targetGroup = (readValue(searchParams.targetGroup) ?? readValue(searchParams.forWhom)) as
    | TargetGroup
    | undefined;
  const ageRange = (readValue(searchParams.ageRange) ?? readValue(searchParams.ageGroup)) as
    | AgeRange
    | undefined;
  const lifestyleSetting = readValue(searchParams.lifestyleSetting) as LifestyleSetting | undefined;
  const genderRange = readValue(searchParams.genderRange) ?? readValue(searchParams.genderStyle);
  // Shopping for a child or teen restricts results to kids/teen items only.
  const childrenTeen =
    readValue(searchParams.userType) === "child" ||
    /children|child|teen|kids/i.test(readValue(searchParams.range) ?? "");
  const dressingMethod = readValue(searchParams.dressingMethod) as DressingMethod | undefined;
  const mobilityLevel =
    normalizeMobility(readValue(searchParams.mobilityLevel)) ??
    normalizeMobility(deriveMobilityLevel(needs));
  const fabricComfortNeeds = sensory.filter((value) =>
    /soft|lightweight|breathable|flat seams|tag/i.test(value)
  );
  // A custom "not listed" need: free text that softly matches product tags.
  const customNeed = readList(searchParams.custom).join(", ").slice(0, 500);
  const openEndedNeed = [otherNeeds, customNeed].filter(Boolean).join(". ");

  const input: RecommendationInput = {
    targetGroup,
    ageRange,
    needs,
    styles,
    budget,
    openEndedNeed,
    location,
    mobilityLevel,
    dressingDifficulty: deriveDressingDifficulty(needs, fastenings),
    sensoryNeeds: sensory,
    closurePreference: fastenings,
    fabricComfortNeeds,
    lifestyleSetting,
    caregiverInvolvement: deriveCaregiverInvolvement(targetGroup, dressingMethod),
    clothingTypes: clothing.filter((item) => item !== "Not sure"),
    genderRange,
    childrenTeen,
    limit: 9,
  };

  return {
    input,
    needs,
    clothing,
    styles,
    availability,
    otherNeeds,
    location,
    childrenTeen,
  };
}
