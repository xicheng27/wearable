import type { BodyZone, Garment, Persona } from "@/components/quiz/BodyModel";
import { GLOBAL } from "@/lib/countries";

/* --------------------------- Answer model -------------------------------- */

export type Answers = Record<string, string[]>;

export interface QuizModelState {
  persona: Persona;
  seated: boolean;
  zones: BodyZone[];
  garments: Garment[];
  accents: {
    soft?: boolean;
    oneHanded?: boolean;
    brace?: boolean;
    medical?: boolean;
    style?: boolean;
  };
}

/* ------------------------------ Step 1: who ------------------------------ */

export const whoOptions = [
  { value: "Myself", icon: "self" },
  { value: "Child or teen", icon: "child" },
  { value: "Older adult", icon: "older" },
  { value: "Someone I care for", icon: "care" },
];

export function personaFor(who?: string): Persona {
  if (!who) return "adult";
  if (who.includes("Child")) return "teen";
  if (who.includes("Older")) return "older";
  if (who.includes("care")) return "care";
  return "adult";
}

/* ---------------------------- Step 2: country ---------------------------- */

export const countryOptions = [
  "Singapore",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Other country",
  GLOBAL,
];

/* --------------------------- Step 3: clothing ---------------------------- */

export const clothingOptions = [
  "Tops",
  "Bottoms",
  "Dresses / one-piece",
  "Outerwear",
  "Underwear / base layers",
  "Footwear",
  "Not sure, show me suitable options",
];

// Map the friendly clothing label to terms the catalogue/engine understands.
const CLOTHING_TO_CATALOG: Record<string, string> = {
  Tops: "Tops",
  Bottoms: "Pants",
  "Dresses / one-piece": "Dresses",
  Outerwear: "Jackets",
  "Underwear / base layers": "Undergarments",
  Footwear: "Shoes",
};

// Map the friendly clothing label to an avatar garment overlay.
const CLOTHING_TO_GARMENT: Record<string, Garment> = {
  Tops: "top",
  Bottoms: "bottoms",
  "Dresses / one-piece": "dress",
  Outerwear: "outerwear",
  "Underwear / base layers": "baselayer",
  Footwear: "footwear",
};

// A short chip label for each selected clothing type.
const CLOTHING_CHIP: Record<string, string> = {
  Tops: "Tops",
  Bottoms: "Bottoms",
  "Dresses / one-piece": "Dresses",
  Outerwear: "Outerwear",
  "Underwear / base layers": "Base layers",
  Footwear: "Footwear",
};

/* ----------------------------- Step 4: help ------------------------------ */

export const helpOptions: { value: string; icon: string; zones: BodyZone[] }[] = [
  { value: "Seated or wheelchair comfort", icon: "seated", zones: ["hips", "waist"] },
  { value: "Easier dressing", icon: "dressing", zones: ["chest", "waist"] },
  { value: "One-handed dressing", icon: "hand", zones: ["hands", "arms"] },
  { value: "Caregiver-assisted dressing", icon: "caregiver", zones: ["chest", "shoulders"] },
  { value: "Shoulder or arm movement", icon: "shoulder", zones: ["shoulders", "arms"] },
  { value: "Sensory or skin comfort", icon: "sensory", zones: ["skin"] },
  { value: "Medical or body-zone access", icon: "medical", zones: ["waist", "chest"] },
  { value: "AFO / brace / footwear accommodation", icon: "brace", zones: ["feet", "legs"] },
  { value: "I mainly care about style and fit", icon: "style", zones: [] },
];

const hasHelp = (a: Answers, key: string) =>
  (a.help ?? []).some((h) => h.includes(key));

/* ------------------------- Step 5: body fit map -------------------------- */

export interface BodyIssue {
  id: string;
  label: string;
}
export interface BodyZoneGroup {
  zone: BodyZone;
  title: string;
  issues: BodyIssue[];
}

export const bodyZoneGroups: BodyZoneGroup[] = [
  {
    zone: "shoulders",
    title: "Shoulders",
    issues: [
      { id: "sh-lift", label: "Shoulders are hard to lift" },
      { id: "sh-tight", label: "Tight sleeves are uncomfortable" },
      { id: "sh-overhead", label: "Overhead dressing is difficult" },
    ],
  },
  {
    zone: "arms",
    title: "Arms",
    issues: [
      { id: "ar-sleeves", label: "Sleeves are hard to put on" },
      { id: "ar-restrict", label: "Arm movement feels restricted" },
      { id: "ar-access", label: "Need easier access around the arm" },
    ],
  },
  {
    zone: "hands",
    title: "Hands",
    issues: [
      { id: "ha-buttons", label: "Buttons are hard to use" },
      { id: "ha-zips", label: "Zips are hard to grip" },
      { id: "ha-onehand", label: "One-handed dressing is needed" },
    ],
  },
  {
    zone: "chest",
    title: "Chest",
    issues: [
      { id: "ch-front", label: "Need front opening" },
      { id: "ch-access", label: "Need chest-area access" },
      { id: "ch-tight", label: "Tight chest fit is uncomfortable" },
    ],
  },
  {
    zone: "waist",
    title: "Waist / abdomen",
    issues: [
      { id: "wa-band", label: "Waistband causes pressure" },
      { id: "wa-abdomen", label: "Abdomen needs access" },
      { id: "wa-device", label: "Medical device / tube / port access needed" },
      { id: "wa-seated", label: "Seated waist feels uncomfortable" },
    ],
  },
  {
    zone: "hips",
    title: "Hips / seated area",
    issues: [
      { id: "hi-rise", label: "Back rise is too low when seated" },
      { id: "hi-pull", label: "Fabric pulls when sitting" },
      { id: "hi-fit", label: "Need seated-friendly fit" },
      { id: "hi-pressure", label: "Need pressure reduction" },
    ],
  },
  {
    zone: "legs",
    title: "Legs",
    issues: [
      { id: "le-pull", label: "Pants are hard to pull on" },
      { id: "le-access", label: "Need easier leg access" },
      { id: "le-brace", label: "Braces or supports need space" },
    ],
  },
  {
    zone: "feet",
    title: "Feet",
    issues: [
      { id: "fe-afo", label: "Need space for AFO or brace" },
      { id: "fe-swell", label: "Feet swell during the day" },
      { id: "fe-close", label: "Need easy closures" },
      { id: "fe-wide", label: "Need wide opening footwear" },
    ],
  },
  {
    zone: "skin",
    title: "Skin / full body comfort",
    issues: [
      { id: "sk-seams", label: "Sensitive to seams" },
      { id: "sk-tags", label: "Sensitive to tags" },
      { id: "sk-scratch", label: "Scratchy fabric is uncomfortable" },
      { id: "sk-heat", label: "Heat buildup is uncomfortable" },
      { id: "sk-soft", label: "Need soft / breathable fabric" },
    ],
  },
];

const ISSUE_ZONE: Record<string, BodyZone> = Object.fromEntries(
  bodyZoneGroups.flatMap((g) => g.issues.map((i) => [i.id, g.zone]))
);

/* ---------------------- Conditional follow-up options -------------------- */

export const seatedOptions = [
  "Higher back rise",
  "Comfortable seated waistband",
  "Pressure reduction",
  "Easier transfer movement",
  "Designed mainly for seated posture",
];

export const closureOptions = [
  "Magnetic closures",
  "Velcro",
  "Large zipper pulls",
  "Elastic",
  "Snap buttons",
  "No fasteners",
];

export const dressingIndependenceOptions = [
  "I dress independently",
  "I dress with some help",
  "A caregiver dresses me",
];

export const dressingExtraOptions = [
  "One-handed dressing is important",
  "I prefer front-opening clothing",
];

export const sensoryAvoidOptions = [
  "Tags",
  "Rough seams",
  "Tight elastic",
  "Scratchy fabric",
  "Heat buildup",
  "Heavy fabric",
];

export const fabricFeelOptions = [
  "Soft",
  "Breathable",
  "Stretchy",
  "Lightweight",
  "Smooth",
];

export const medicalAreaOptions = ["Chest", "Abdomen", "Arm", "Waist", "Leg"];

export const medicalAccessOptions = [
  "Port access",
  "Tube access",
  "Ostomy access",
  "Easy examination access",
  "Privacy-friendly openings",
];

export const braceOptions = [
  "AFO",
  "Ankle brace",
  "Leg brace",
  "Swelling",
  "Orthotics",
];

export const footwearOptions = [
  "Wide opening",
  "Adjustable straps",
  "Removable insole",
  "Stable sole",
  "Easy fastening",
];

/* ----------------------------- Step: style ------------------------------- */

export const styleOptions = [
  "Minimal",
  "Streetwear",
  "Smart casual",
  "Formal",
  "Sporty",
  "Feminine",
  "Masculine",
  "Neutral",
  "Modest",
  "Youthful",
  "Mature",
];

export const rangeOptions = [
  "Female",
  "Male",
  "Gender-neutral / unisex",
  "Prefer not to say",
];

export const budgetOptions = [
  "Budget",
  "Mid-range",
  "Premium",
  "No preference",
];

export const shoppingOptions = [
  "New only",
  "Open to resale",
  "Prefer local brands",
  "Okay with international shipping",
  "Need easy returns",
  "Need discreet / privacy-friendly design",
];

/* ------------------------------- Steps ----------------------------------- */

export type StepType = "single" | "multi" | "bodymap" | "country";

export interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  options?: string[];
  optional?: boolean;
  /** Whether this step should be shown given current answers (skip logic). */
  active: (a: Answers) => boolean;
}

const dressingActive = (a: Answers) =>
  hasHelp(a, "Easier dressing") ||
  hasHelp(a, "One-handed") ||
  hasHelp(a, "Caregiver") ||
  (a.bodyIssues ?? []).some((id) => ["ha-buttons", "ha-zips", "ha-onehand"].includes(id));

const sensoryActive = (a: Answers) =>
  hasHelp(a, "Sensory") ||
  (a.bodyIssues ?? []).some((id) => ISSUE_ZONE[id] === "skin");

const medicalActive = (a: Answers) =>
  hasHelp(a, "Medical") ||
  (a.bodyIssues ?? []).some((id) => ["wa-device", "wa-abdomen", "ch-access"].includes(id));

const braceActive = (a: Answers) =>
  hasHelp(a, "AFO") ||
  (a.bodyIssues ?? []).some((id) => ["le-brace", "fe-afo"].includes(id));

const footwearActive = (a: Answers) =>
  braceActive(a) ||
  (a.clothing ?? []).some((c) => c.includes("Footwear")) ||
  (a.bodyIssues ?? []).some((id) => ISSUE_ZONE[id] === "feet");

export const steps: Step[] = [
  {
    id: "who",
    title: "Who are we helping today?",
    subtitle: "We tailor fit and tone to the person who'll wear the clothing.",
    type: "single",
    options: whoOptions.map((o) => o.value),
    active: () => true,
  },
  {
    id: "country",
    title: "Where are you shopping from?",
    subtitle: "This sets availability, shipping, currency and how we rank items.",
    type: "country",
    options: countryOptions,
    active: () => true,
  },
  {
    id: "clothing",
    title: "What clothing are you looking for?",
    subtitle: "Pick anything that applies — this shapes the rest of the questions.",
    type: "multi",
    options: clothingOptions,
    active: () => true,
  },
  {
    id: "help",
    title: "What should the clothing help with?",
    subtitle: "Choose all that matter. This is the heart of your adaptive profile.",
    type: "multi",
    options: helpOptions.map((o) => o.value),
    active: () => true,
  },
  {
    id: "bodymap",
    title: "Tap where clothing needs to work better.",
    subtitle: "Select a body area, then the issues that fit. The model highlights as you go.",
    type: "bodymap",
    optional: true,
    active: () => true,
  },
  {
    id: "seated",
    title: "Seated comfort — what matters most?",
    subtitle: "We'll prioritise seated-first cuts that hold up all day.",
    type: "multi",
    options: seatedOptions,
    active: (a) =>
      hasHelp(a, "Seated") ||
      (a.bodyIssues ?? []).some((id) => ["hi-rise", "hi-pull", "hi-fit", "hi-pressure", "wa-seated"].includes(id)),
  },
  {
    id: "closures",
    title: "Which closures are easiest for you?",
    subtitle: "These become strong signals for dressing independence.",
    type: "multi",
    options: closureOptions,
    active: dressingActive,
  },
  {
    id: "dressingIndependence",
    title: "How does dressing usually happen?",
    subtitle: "This tells us whether to prioritise self-dressing or caregiver access.",
    type: "single",
    options: dressingIndependenceOptions,
    active: dressingActive,
  },
  {
    id: "dressingExtra",
    title: "Anything else about dressing?",
    subtitle: "Optional — pick what's true for you.",
    type: "multi",
    optional: true,
    options: dressingExtraOptions,
    active: dressingActive,
  },
  {
    id: "sensoryAvoid",
    title: "What should clothing avoid?",
    subtitle: "We'll steer away from these against the skin.",
    type: "multi",
    options: sensoryAvoidOptions,
    active: sensoryActive,
  },
  {
    id: "fabricFeel",
    title: "What fabric feel do you prefer?",
    subtitle: "We'll lean toward fabrics that feel right.",
    type: "multi",
    options: fabricFeelOptions,
    active: sensoryActive,
  },
  {
    id: "medicalArea",
    title: "Which area needs access?",
    subtitle: "This stays private and is only used to find the right openings.",
    type: "multi",
    optional: true,
    options: medicalAreaOptions,
    active: medicalActive,
  },
  {
    id: "medicalAccess",
    title: "What type of access matters?",
    subtitle: "Choose what's relevant. You can skip anything you'd rather not share.",
    type: "multi",
    optional: true,
    options: medicalAccessOptions,
    active: medicalActive,
  },
  {
    id: "brace",
    title: "What needs extra space?",
    subtitle: "We'll make room for supports and accommodate swelling.",
    type: "multi",
    options: braceOptions,
    active: braceActive,
  },
  {
    id: "footwear",
    title: "Preferred footwear features",
    subtitle: "We'll match closures and openings to how your feet move.",
    type: "multi",
    options: footwearOptions,
    active: footwearActive,
  },
  {
    id: "style",
    title: "What should the clothes feel like, stylistically?",
    subtitle: "Style refines your results — it never overrides your functional needs.",
    type: "multi",
    optional: true,
    options: styleOptions,
    active: () => true,
  },
  {
    id: "range",
    title: "Which clothing range should we prioritise?",
    subtitle: "A recommendation filter for sizing and ranking — not an identity judgement. Functional needs still come first.",
    type: "single",
    optional: true,
    options: rangeOptions,
    active: () => true,
  },
  {
    id: "budget",
    title: "What budget should we keep in mind?",
    subtitle: "Prices change on official sites, so this is a guide for ranking.",
    type: "single",
    options: budgetOptions,
    active: () => true,
  },
  {
    id: "shopping",
    title: "Any shopping preferences?",
    subtitle: "These fine-tune ranking — they won't repeat your country choice.",
    type: "multi",
    optional: true,
    options: shoppingOptions,
    active: () => true,
  },
];

export function activeSteps(a: Answers): Step[] {
  return steps.filter((s) => s.active(a));
}

/* ----------------------- Model state from answers ------------------------ */

export function modelState(a: Answers, currentStepId: string): QuizModelState {
  const persona = personaFor(a.who?.[0]);
  const seated =
    hasHelp(a, "Seated") ||
    (a.bodyIssues ?? []).some((id) =>
      ["hi-rise", "hi-pull", "hi-fit", "hi-pressure", "wa-seated"].includes(id)
    );

  const zones = new Set<BodyZone>();

  // cumulative zones from selected body issues
  (a.bodyIssues ?? []).forEach((id) => {
    const z = ISSUE_ZONE[id];
    if (z) zones.add(z);
  });
  // zones implied by help selections
  (a.help ?? []).forEach((h) => {
    const opt = helpOptions.find((o) => h.includes(o.value.split(" ")[0]) || o.value === h);
    opt?.zones.forEach((z) => zones.add(z));
  });

  // emphasise the zone tied to the current step
  if (currentStepId === "brace" || currentStepId === "footwear") {
    zones.add("feet");
    zones.add("legs");
  }
  if (currentStepId === "medicalArea" || currentStepId === "medicalAccess") {
    (a.medicalArea ?? []).forEach((m) => {
      const map: Record<string, BodyZone> = {
        Chest: "chest",
        Abdomen: "waist",
        Arm: "arms",
        Waist: "waist",
        Leg: "legs",
      };
      if (map[m]) zones.add(map[m]);
    });
  }
  if ((currentStepId === "sensoryAvoid" || currentStepId === "fabricFeel")) {
    zones.add("skin");
  }

  const accents = {
    soft: sensoryActive(a) || (a.fabricFeel ?? []).length > 0,
    oneHanded:
      hasHelp(a, "One-handed") ||
      (a.bodyIssues ?? []).includes("ha-onehand") ||
      (a.closures ?? []).some((c) => c.includes("Magnetic")),
    brace: braceActive(a),
    medical: medicalActive(a),
    style: currentStepId === "style" || (a.style ?? []).length > 0,
  };

  const garments = deriveGarments(a);

  return { persona, seated, zones: Array.from(zones), garments, accents };
}

function deriveGarments(a: Answers): Garment[] {
  const chosen = a.clothing ?? [];
  if (chosen.length === 0) return [];
  if (chosen.some((c) => c.startsWith("Not sure"))) return ["notsure"];
  const garments = chosen
    .map((c) => CLOTHING_TO_GARMENT[c])
    .filter((g): g is Garment => Boolean(g));
  // If footwear is among them, also surface footwear emphasis last so it draws.
  return Array.from(new Set(garments));
}

/* --------------------------- Live profile chips -------------------------- */

export function profileChips(a: Answers): string[] {
  const chips: string[] = [];
  const who = a.who?.[0];
  if (who) chips.push(personaChipLabel(who));
  if (a.country?.[0] && a.country[0] !== GLOBAL) {
    chips.push(
      a.country[0] === "Other country"
        ? "Shopping from: Other"
        : `Shopping from ${a.country[0]}`
    );
  } else if (a.country?.[0] === GLOBAL) {
    chips.push("Global availability");
  }
  (a.clothing ?? []).forEach((c) => {
    if (c.startsWith("Not sure")) chips.push("Looking for: Not sure");
    else if (CLOTHING_CHIP[c]) chips.push(`Looking for: ${CLOTHING_CHIP[c]}`);
  });
  if (hasHelp(a, "Seated")) chips.push("Seated fit");
  if (hasHelp(a, "One-handed")) chips.push("One-handed dressing");
  if (hasHelp(a, "Caregiver")) chips.push("Caregiver access");
  if (hasHelp(a, "Shoulder")) chips.push("Shoulder / arm ease");
  (a.closures ?? []).forEach((c) => chips.push(c));
  if ((a.fabricFeel ?? []).includes("Soft") || (a.bodyIssues ?? []).includes("sk-soft"))
    chips.push("Soft fabric");
  if ((a.bodyIssues ?? []).includes("wa-band")) chips.push("Waist pressure");
  if (medicalActive(a)) chips.push("Body-zone access");
  if (braceActive(a)) chips.push("Brace / AFO space");
  (a.style ?? []).slice(0, 2).forEach((s) => chips.push(`${s} style`));
  if (a.range?.[0]) chips.push(`Range: ${rangeChipLabel(a.range[0])}`);
  if (a.budget?.[0] && a.budget[0] !== "No preference") chips.push(`Budget: ${a.budget[0]}`);
  return Array.from(new Set(chips)).slice(0, 16);
}

function personaChipLabel(who: string): string {
  if (who.includes("Child")) return "Child / teen";
  if (who.includes("Older")) return "Older adult";
  if (who.includes("care")) return "Care & support";
  return "Adult";
}

function rangeChipLabel(range: string): string {
  if (range.startsWith("Female")) return "Female";
  if (range.startsWith("Male")) return "Male";
  if (range.startsWith("Gender")) return "Unisex";
  return "Prefer not to say";
}

/* ----------------------- Build results query params ---------------------- */

export function buildResultParams(a: Answers, otherNeeds: string): URLSearchParams {
  const p = new URLSearchParams();
  const who = a.who?.[0] ?? "";
  const userType = who.includes("Child")
    ? "child"
    : who.includes("Older")
      ? "family"
      : who.includes("care")
        ? "patient"
        : "self";
  const targetGroup = who.includes("Older")
    ? "elderly"
    : who.includes("care")
      ? "caregiver"
      : "disability";
  p.set("userType", userType);
  p.set("targetGroup", targetGroup);

  const country = a.country?.[0];
  if (country && country !== "Other country") p.set("location", country);

  // clothing → catalogue terms
  const clothing = (a.clothing ?? [])
    .filter((c) => !c.startsWith("Not sure"))
    .map((c) => CLOTHING_TO_CATALOG[c] ?? c);
  if (clothing.length) p.set("clothing", clothing.join(","));

  // needs (drives hard requirements)
  const needs: string[] = [];
  if (hasHelp(a, "Seated")) needs.push("Wheelchair or seated comfort", "Seated fit");
  if (hasHelp(a, "One-handed")) needs.push("One-handed dressing");
  if (hasHelp(a, "Easier dressing")) needs.push("Limited hand dexterity");
  if (hasHelp(a, "Shoulder")) needs.push("Difficulty lifting arms");
  if (hasHelp(a, "Sensory")) needs.push("Sensory discomfort");
  if (hasHelp(a, "Medical")) needs.push("Medical device access");
  if (hasHelp(a, "AFO")) needs.push("Orthotics and AFOs", "Prosthetic users");
  // body issues add finer needs
  const bi = a.bodyIssues ?? [];
  if (bi.some((id) => ISSUE_ZONE[id] === "hips" || id === "wa-seated"))
    needs.push("Seated fit", "Wheelchair or seated comfort");
  if (bi.includes("wa-device")) needs.push("Medical device access");
  if (bi.some((id) => ISSUE_ZONE[id] === "skin")) needs.push("Sensory discomfort");
  if (bi.some((id) => ["ha-buttons", "ha-zips"].includes(id))) needs.push("Limited hand dexterity");
  if (bi.includes("ha-onehand")) needs.push("One-handed dressing");
  if (bi.some((id) => ["le-brace", "fe-afo"].includes(id))) needs.push("Orthotics and AFOs");
  if (needs.length) p.set("needs", Array.from(new Set(needs)).join(","));

  // closures / features
  const features: string[] = [...(a.closures ?? [])];
  if (hasHelp(a, "Medical") || bi.includes("wa-device"))
    features.push("Medical port or tube access");
  if (bi.includes("ch-front") || (a.dressingExtra ?? []).some((d) => d.includes("front")))
    features.push("Front opening");
  if (hasHelp(a, "Caregiver") || a.dressingIndependence?.[0]?.includes("caregiver"))
    features.push("Open-back design");
  if (features.length) {
    p.set("features", features.join(","));
    p.set("fastenings", features.join(","));
  }

  // sensory + fabric feel
  const sensory: string[] = [];
  (a.sensoryAvoid ?? []).forEach((s) => {
    if (s === "Tags") sensory.push("Soft, tag-free fabrics");
    if (s === "Rough seams") sensory.push("Flat seams");
    if (s === "Scratchy fabric") sensory.push("Soft, tag-free fabrics");
    if (s === "Heat buildup" || s === "Heavy fabric")
      sensory.push("Lightweight, breathable fabrics");
    if (s === "Tight elastic") sensory.push("Loose, non-restrictive fits");
  });
  (a.fabricFeel ?? []).forEach((f) => {
    if (f === "Soft" || f === "Smooth") sensory.push("Soft, tag-free fabrics");
    if (f === "Breathable" || f === "Lightweight")
      sensory.push("Lightweight, breathable fabrics");
    if (f === "Stretchy") sensory.push("Loose, non-restrictive fits");
  });
  if (bi.includes("sk-soft")) sensory.push("Soft, tag-free fabrics");
  if (sensory.length) p.set("sensory", Array.from(new Set(sensory)).join(","));

  // dressing method → caregiver involvement
  const di = a.dressingIndependence?.[0] ?? "";
  if (di.includes("caregiver")) p.set("dressingMethod", "fully_caregiver");
  else if (di.includes("some help")) p.set("dressingMethod", "occasional_help");
  else if (di.includes("independently")) p.set("dressingMethod", "independent");

  // mobility
  if (
    hasHelp(a, "Seated") ||
    bi.some((id) => ISSUE_ZONE[id] === "hips")
  ) {
    p.set("mobilityLevel", "wheelchair");
  }

  // style
  const style = a.style ?? [];
  if (style.length) {
    p.set("styles", style.join(","));
    p.set("style", style.join(","));
  }

  // clothing range (explicit answer wins; falls back to style cue)
  const range = a.range?.[0] ?? "";
  let genderStyle = "";
  if (range.startsWith("Female")) genderStyle = "womenswear";
  else if (range.startsWith("Male")) genderStyle = "menswear";
  else if (range.startsWith("Gender")) genderStyle = "gender_neutral";
  else if (!range && style.includes("Feminine")) genderStyle = "womenswear";
  else if (!range && style.includes("Masculine")) genderStyle = "menswear";
  else if (!range && style.includes("Neutral")) genderStyle = "gender_neutral";
  if (genderStyle) {
    p.set("genderStyle", genderStyle);
    p.set("genderRange", genderStyle);
  }
  if (range) p.set("range", rangeChipLabel(range));

  // budget
  if (a.budget?.[0] && a.budget[0] !== "No preference") p.set("budget", a.budget[0]);

  if (otherNeeds.trim()) p.set("otherNeeds", otherNeeds.trim());

  // raw answers for the signal map (kept compact, privacy-aware on share side)
  const raw = (k: string, list?: string[]) => {
    if (list && list.length) p.set(k, list.join("~"));
  };
  raw("help", a.help);
  raw("zones", uniqueZones(bi));
  raw("issues", bi);
  raw("seated", a.seated);
  raw("medarea", a.medicalArea);
  raw("medaccess", a.medicalAccess);
  raw("brace", a.brace);
  raw("foot", a.footwear);
  raw("avoid", a.sensoryAvoid);
  raw("feel", a.fabricFeel);
  raw("shopping", a.shopping);

  return p;
}

function uniqueZones(issueIds: string[]): string[] {
  return Array.from(new Set(issueIds.map((id) => ISSUE_ZONE[id]).filter(Boolean)));
}

export { ISSUE_ZONE, hasHelp, sensoryActive, medicalActive, braceActive, footwearActive };
