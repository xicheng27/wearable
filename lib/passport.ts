import {
  budgetOptions,
  buildResultParams,
  clothingOptions,
  closureOptions,
  countryOptions,
  dressingIndependenceOptions,
  fabricFeelOptions,
  footwearOptions,
  braceOptions,
  helpOptions,
  medicalAccessOptions,
  medicalAreaOptions,
  rangeOptions,
  seatedOptions,
  sensoryAvoidOptions,
  styleOptions,
  whoOptions,
  bodyZoneGroups,
  isAssistedDressing,
  type Answers,
} from "@/lib/quiz/config";
import { parseResultParams, type SearchParamsRecord } from "@/lib/quiz/resultsInput";
import { GLOBAL } from "@/lib/countries";
import type { AdaptiveFitPassport, RecommendationInput } from "@/types";

/**
 * The Adaptive Fit Passport: one reusable, on-device profile derived from
 * the quiz answers. The answers are the single source of truth — the
 * summary sections, the "must-have" hard requirements, the results URL and
 * the recommendation input are all derived from them, so editing the
 * passport is editing the answers and everything downstream stays in sync.
 */

export const PASSPORT_VERSION = 1 as const;

export function buildPassport(
  answers: Answers,
  otherNeeds = "",
  customNeed = "",
  previous?: AdaptiveFitPassport | null
): AdaptiveFitPassport {
  const now = new Date().toISOString();
  return {
    version: PASSPORT_VERSION,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
    answers,
    otherNeeds: otherNeeds.trim() || undefined,
    customNeed: customNeed.trim() || undefined,
  };
}

export function isValidPassport(value: unknown): value is AdaptiveFitPassport {
  if (!value || typeof value !== "object") return false;
  const p = value as AdaptiveFitPassport;
  return p.version === PASSPORT_VERSION && !!p.answers && typeof p.answers === "object";
}

/* ------------------------- Derived: results params ------------------------ */

/** Regenerate the quiz-results URL params from the stored answers. */
export function passportToResultParams(passport: AdaptiveFitPassport): URLSearchParams {
  return buildResultParams(
    passport.answers,
    passport.otherNeeds ?? "",
    passport.customNeed ?? ""
  );
}

export function passportResultsHref(passport: AdaptiveFitPassport): string {
  return `/quiz/results?${passportToResultParams(passport).toString()}`;
}

/** The exact same strict input the quiz-results page would compute. */
export function passportToRecommendationInput(
  passport: AdaptiveFitPassport
): RecommendationInput {
  const record: SearchParamsRecord = {};
  passportToResultParams(passport).forEach((value, key) => {
    record[key] = value;
  });
  return parseResultParams(record).input;
}

/* --------------------------- Derived: sections ---------------------------- */

export interface PassportSection {
  id: string;
  title: string;
  items: string[];
}

const ISSUE_LABELS: Record<string, string> = Object.fromEntries(
  bodyZoneGroups.flatMap((group) => group.issues.map((issue) => [issue.id, issue.label]))
);

const ISSUE_ZONE_TITLE: Record<string, string> = Object.fromEntries(
  bodyZoneGroups.flatMap((group) => group.issues.map((issue) => [issue.id, group.title]))
);

function list(answers: Answers, key: string): string[] {
  return (answers[key] ?? []).filter((v) => !/not listed/i.test(v));
}

/**
 * The passport's readable sections. Empty sections are omitted so the
 * passport only shows what the person actually shared.
 */
export function passportSections(passport: AdaptiveFitPassport): PassportSection[] {
  const a = passport.answers;
  const country = a.country?.[0];

  const fitNeeds = [
    ...list(a, "clothing").map((c) => (c.startsWith("Not sure") ? "Open to any category" : c)),
    ...list(a, "seated"),
    ...list(a, "brace"),
    ...list(a, "footwear"),
  ];

  const dressing = [
    ...list(a, "help").filter((h) =>
      /dressing|one-handed|caregiver|shoulder|easier/i.test(h)
    ),
    ...list(a, "closures"),
    ...list(a, "dressingIndependence"),
    ...list(a, "dressingExtra"),
  ];
  if (isAssistedDressing(a) && !dressing.some((d) => /caregiver/i.test(d))) {
    dressing.push("Caregiver-assisted dressing");
  }

  const bodyZones = Array.from(
    new Set((a.bodyIssues ?? []).map((id) => ISSUE_ZONE_TITLE[id]).filter(Boolean))
  );
  const bodyDetails = (a.bodyIssues ?? [])
    .map((id) => ISSUE_LABELS[id])
    .filter(Boolean)
    .slice(0, 6);

  const sensory = [
    ...list(a, "sensoryAvoid").map((s) => `Avoid: ${s.toLowerCase()}`),
    ...list(a, "fabricFeel").map((f) => `Prefers: ${f.toLowerCase()} fabric`),
  ];

  const medical = [...list(a, "medicalArea"), ...list(a, "medicalAccess")];

  const style = [
    ...list(a, "style"),
    ...(a.range?.[0] && !a.range[0].startsWith("Prefer") ? [`Range: ${a.range[0]}`] : []),
    ...(a.budget?.[0] && a.budget[0] !== "No preference" ? [`Budget: ${a.budget[0]}`] : []),
  ];

  const freeText = [passport.otherNeeds, passport.customNeed].filter(
    (t): t is string => Boolean(t)
  );

  const sections: PassportSection[] = [
    { id: "fit", title: "Fit needs", items: fitNeeds },
    { id: "dressing", title: "Dressing support", items: Array.from(new Set(dressing)) },
    { id: "zones", title: "Body zones", items: [...bodyZones, ...bodyDetails] },
    { id: "sensory", title: "Sensory comfort", items: sensory },
    { id: "medical", title: "Medical access", items: medical },
    {
      id: "location",
      title: "Location",
      items: country
        ? [country === GLOBAL ? "Shopping globally" : `Shopping from ${country}`]
        : [],
    },
    { id: "style", title: "Style", items: style },
    { id: "words", title: "In their words", items: freeText },
  ];

  return sections.filter((section) => section.items.length > 0);
}

/** Who the passport is for, e.g. "Myself" / "Child or teen". */
export function passportWearer(passport: AdaptiveFitPassport): string | undefined {
  return passport.answers.who?.[0];
}

/* ---------------------- Derived: must-have requirements ------------------- */

/**
 * The passport's hard requirements in plain language — the constraints the
 * matching engine will never trade away for style or budget. Kept in sync
 * with the engine by deriving from the same recommendation input.
 */
export function passportMustHaves(passport: AdaptiveFitPassport): string[] {
  const input = passportToRecommendationInput(passport);
  const must: string[] = [];

  const cats = (input.clothingTypes ?? []).filter(Boolean);
  if (cats.length) must.push(`Only ${cats.join(" / ").toLowerCase()}`);
  if (input.location) must.push(`Available in ${input.location}`);
  if (input.childrenTeen) must.push("Kids / teen items only");
  else if (input.genderRange === "womenswear") must.push("Womenswear or unisex");
  else if (input.genderRange === "menswear") must.push("Menswear or unisex");
  else if (input.genderRange === "gender_neutral") must.push("Gender-neutral / unisex");
  if (input.mobilityLevel === "wheelchair-or-seated") must.push("Seated / wheelchair fit");
  if ((input.needs ?? []).some((n) => /one-handed/i.test(n))) must.push("One-handed dressing");
  if ((input.needs ?? []).some((n) => /dexterity|arthritis/i.test(n)))
    must.push("Easy closures for limited dexterity");
  if (input.caregiverInvolvement === "caregiver-assisted")
    must.push("Caregiver-assisted dressing access");
  if ((input.sensoryNeeds ?? []).some((n) => !/no sensory/i.test(n)))
    must.push("Sensory-friendly fabric");
  if ((input.needs ?? []).some((n) => /afo|orthotic|prosthetic/i.test(n)))
    must.push("AFO / orthotic / prosthetic space");
  if ((input.needs ?? []).some((n) => /medical|post-surgery|port|tube|ostomy/i.test(n)))
    must.push("Medical / body-zone access");
  return must;
}

/* ----------------------------- Edit structure ----------------------------- */

export interface PassportEditGroup {
  key: string;
  title: string;
  options: string[];
  single?: boolean;
}

export interface PassportEditSection {
  id: string;
  title: string;
  groups: PassportEditGroup[];
}

/**
 * Everything on the passport is editable without retaking the quiz. The
 * options come from the same quiz config, so an edited passport can produce
 * anything the quiz itself could.
 */
export const passportEditSections: PassportEditSection[] = [
  {
    id: "needs",
    title: "What clothing needs to do",
    groups: [
      { key: "help", title: "Functional needs", options: helpOptions.map((o) => o.value) },
    ],
  },
  {
    id: "whoWhere",
    title: "Who and where",
    groups: [
      { key: "who", title: "Who it's for", options: whoOptions.map((o) => o.value), single: true },
      { key: "country", title: "Shopping region", options: countryOptions, single: true },
    ],
  },
  {
    id: "fit",
    title: "Fit needs",
    groups: [
      { key: "clothing", title: "Clothing categories", options: clothingOptions },
      { key: "seated", title: "Seated comfort", options: seatedOptions },
      { key: "brace", title: "Braces & supports", options: braceOptions },
      { key: "footwear", title: "Footwear features", options: footwearOptions },
    ],
  },
  {
    id: "dressing",
    title: "Dressing support",
    groups: [
      { key: "closures", title: "Easiest closures", options: closureOptions },
      {
        key: "dressingIndependence",
        title: "How dressing happens",
        options: dressingIndependenceOptions,
        single: true,
      },
    ],
  },
  {
    id: "sensory",
    title: "Sensory comfort",
    groups: [
      { key: "sensoryAvoid", title: "Fabric should avoid", options: sensoryAvoidOptions },
      { key: "fabricFeel", title: "Preferred feel", options: fabricFeelOptions },
    ],
  },
  {
    id: "medical",
    title: "Medical access",
    groups: [
      { key: "medicalArea", title: "Area needing access", options: medicalAreaOptions },
      { key: "medicalAccess", title: "Type of access", options: medicalAccessOptions },
    ],
  },
  {
    id: "style",
    title: "Style & budget",
    groups: [
      { key: "style", title: "Style", options: styleOptions },
      { key: "range", title: "Clothing range", options: rangeOptions, single: true },
      { key: "budget", title: "Budget", options: budgetOptions, single: true },
    ],
  },
];
