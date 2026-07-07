import type { BodyZone, Garment, Persona } from "@/components/quiz/BodyModel";
import { GLOBAL } from "@/lib/countries";

/* --------------------------- Answer model -------------------------------- */

export type Answers = Record<string, string[]>;

export interface QuizModelState {
  persona: Persona;
  seated: boolean;
  zones: BodyZone[];
  garments: Garment[];
  /** Active aesthetic style id driving the avatar transformation. */
  style?: string;
  /** Whether a supportive helper figure should appear (assisted dressing). */
  helper: boolean;
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

/** Inclusive escape hatch shown across multi-select steps. */
export const NOT_LISTED = "Something else / not listed";
/** Body-map issue id for the same escape hatch. */
export const NOT_LISTED_ISSUE = "nl-custom";

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
  { value: NOT_LISTED, icon: "more", zones: [] },
];

/** Whether the shopper flagged a need that isn't in our preset lists. */
export function hasNotListed(a: Answers): boolean {
  const inAny = Object.entries(a).some(
    ([key, values]) => key !== "bodyIssues" && (values ?? []).includes(NOT_LISTED)
  );
  return inAny || (a.bodyIssues ?? []).includes(NOT_LISTED_ISSUE);
}

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
  NOT_LISTED,
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
  NOT_LISTED,
];

export const fabricFeelOptions = [
  "Soft",
  "Breathable",
  "Stretchy",
  "Lightweight",
  "Smooth",
];

export const medicalAreaOptions = ["Chest", "Abdomen", "Arm", "Waist", "Leg", NOT_LISTED];

export const medicalAccessOptions = [
  "Port access",
  "Tube access",
  "Ostomy access",
  "Easy examination access",
  "Privacy-friendly openings",
  NOT_LISTED,
];

export const braceOptions = [
  "AFO",
  "Ankle brace",
  "Leg brace",
  "Swelling",
  "Orthotics",
  NOT_LISTED,
];

export const footwearOptions = [
  "Wide opening",
  "Adjustable straps",
  "Removable insole",
  "Stable sole",
  "Easy fastening",
  NOT_LISTED,
];

/* ----------------------------- Step: style ------------------------------- */

export const styleOptions = [
  "Old money",
  "Clean",
  "Chic",
  "Streetwear",
  "Minimal",
  "Sporty",
  "Formal",
  "Y2K",
  "Soft / cozy",
  "Elegant",
  "Casual",
  "Modest",
  "Trendy",
];

/** Normalise a style label to a stable id used by the avatar + tags. */
export function styleId(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s*\/\s*/g, " ")
    .trim()
    .replace(/[^a-z0-9]+/g, "-");
}

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

/* --------------------------- Example need chips --------------------------- */

/**
 * One-tap examples on the conversational first screen. Each chip pre-fills
 * the matching functional need (and clothing type when it implies one), so
 * shoppers can start from a familiar phrase instead of a blank form.
 */
export interface ExampleChip {
  label: string;
  set: Record<string, string[]>;
}

export const exampleChips: ExampleChip[] = [
  {
    label: "Seated-fit pants",
    set: { help: ["Seated or wheelchair comfort"], clothing: ["Bottoms"] },
  },
  {
    label: "Easy shoes",
    set: { help: ["Easier dressing"], clothing: ["Footwear"] },
  },
  {
    label: "Sensory-friendly tops",
    set: { help: ["Sensory or skin comfort"], clothing: ["Tops"] },
  },
  {
    label: "Caregiver-assisted dressing",
    set: { help: ["Caregiver-assisted dressing"] },
  },
  {
    label: "One-handed dressing",
    set: { help: ["One-handed dressing"] },
  },
  {
    label: "AFO-friendly footwear",
    set: { help: ["AFO / brace / footwear accommodation"], clothing: ["Footwear"] },
  },
  {
    label: "Post-surgery access",
    set: { help: ["Medical or body-zone access"] },
  },
];

/* ------------------------------- Steps ----------------------------------- */

export type StepType = "single" | "multi" | "bodymap" | "country" | "grouped";

/** A labelled option group inside a grouped step (keeps screens compact). */
export interface StepGroup {
  key: string;
  title: string;
  subtitle?: string;
  options: string[];
  single?: boolean;
  /** Hide this group when its trigger answers aren't present. */
  active?: (a: Answers) => boolean;
}

export interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  options?: string[];
  /** Labelled sections for "grouped" steps. */
  groups?: StepGroup[];
  optional?: boolean;
  /** Show the optional free-text box on this step. */
  freeText?: boolean;
  /** Show the one-tap example chips on this step. */
  showExampleChips?: boolean;
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

// The flow is deliberately compact: 6 core screens plus up to 5 follow-up
// screens that only appear when the shopper's own answers make them relevant
// (progressive disclosure). Worst case is 11 screens; a typical path is 7–8.
export const steps: Step[] = [
  {
    id: "help",
    title: "What would make getting dressed feel easier?",
    subtitle:
      "Pick what matters, tap an example, or say it in your own words — no diagnosis needed, ever.",
    type: "multi",
    options: helpOptions.map((o) => o.value),
    freeText: true,
    showExampleChips: true,
    active: () => true,
  },
  {
    id: "whoWhere",
    title: "Who is this for, and where do you shop?",
    subtitle:
      "We tailor fit and tone to the wearer, and use your region for availability, shipping and currency.",
    type: "grouped",
    groups: [
      {
        key: "who",
        title: "Who will wear the clothing?",
        options: whoOptions.map((o) => o.value),
        single: true,
      },
      {
        key: "country",
        title: "Your shopping region",
        options: countryOptions,
        single: true,
      },
    ],
    active: () => true,
  },
  {
    id: "clothing",
    title: "What clothing are you looking for?",
    subtitle:
      "Pick anything that applies — results stay strictly within what you choose here.",
    type: "multi",
    options: clothingOptions,
    active: () => true,
  },
  {
    id: "bodymap",
    title: "Tap where clothing needs to work better.",
    subtitle:
      "Optional — select a body area, then the issues that fit. The model highlights as you go.",
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
    id: "dressing",
    title: "How should dressing work?",
    subtitle: "These become strong signals for dressing independence and access.",
    type: "grouped",
    groups: [
      {
        key: "closures",
        title: "Which closures are easiest?",
        options: closureOptions,
      },
      {
        key: "dressingIndependence",
        title: "How does dressing usually happen?",
        subtitle: "This tells us whether to prioritise self-dressing or caregiver access.",
        options: dressingIndependenceOptions,
        single: true,
      },
      {
        key: "dressingExtra",
        title: "Anything else about dressing? (optional)",
        options: dressingExtraOptions,
      },
    ],
    active: dressingActive,
  },
  {
    id: "sensory",
    title: "What makes clothing feel good — or bad — on your skin?",
    subtitle: "We'll steer away from what irritates and lean toward what feels right.",
    type: "grouped",
    groups: [
      {
        key: "sensoryAvoid",
        title: "Clothing should avoid",
        options: sensoryAvoidOptions,
      },
      {
        key: "fabricFeel",
        title: "Preferred fabric feel",
        options: fabricFeelOptions,
      },
    ],
    active: sensoryActive,
  },
  {
    id: "medical",
    title: "Where does clothing need to give access?",
    subtitle:
      "This stays private and is only used to find the right openings. Skip anything you'd rather not share.",
    type: "grouped",
    optional: true,
    groups: [
      {
        key: "medicalArea",
        title: "Which area needs access?",
        options: medicalAreaOptions,
      },
      {
        key: "medicalAccess",
        title: "What type of access matters?",
        options: medicalAccessOptions,
      },
    ],
    active: medicalActive,
  },
  {
    id: "support",
    title: "Braces, supports and footwear",
    subtitle: "We'll make room for supports and match closures to how your feet move.",
    type: "grouped",
    groups: [
      {
        key: "brace",
        title: "What needs extra space?",
        options: braceOptions,
        active: braceActive,
      },
      {
        key: "footwear",
        title: "Preferred footwear features",
        options: footwearOptions,
        active: footwearActive,
      },
    ],
    active: (a) => braceActive(a) || footwearActive(a),
  },
  {
    id: "style",
    title: "What should your outfit say before you even speak?",
    subtitle: "Style refines your results — it never overrides your functional needs.",
    type: "multi",
    optional: true,
    options: styleOptions,
    active: () => true,
  },
  {
    id: "rangeBudget",
    title: "Clothing range and budget",
    subtitle:
      "A recommendation filter for sizing and ranking — not an identity judgement. Functional needs still come first.",
    type: "grouped",
    groups: [
      {
        key: "range",
        title: "Which clothing range should we prioritise?",
        options: rangeOptions,
        single: true,
      },
      {
        key: "budget",
        title: "What price range should we respect?",
        subtitle: "Prices change on official sites, so this is a guide for ranking.",
        options: budgetOptions,
        single: true,
      },
    ],
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
  if (currentStepId === "support") {
    zones.add("feet");
    zones.add("legs");
  }
  if (currentStepId === "medical") {
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
  if (currentStepId === "sensory") {
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

  // The most recently selected style drives the avatar's look.
  const styles = a.style ?? [];
  const activeStyle = styles.length ? styleId(styles[styles.length - 1]) : undefined;

  const helper = isAssistedDressing(a);

  return { persona, seated, zones: Array.from(zones), garments, style: activeStyle, helper, accents };
}

/** True when the profile involves caregiver / assisted dressing. */
export function isAssistedDressing(a: Answers): boolean {
  if (hasHelp(a, "Caregiver")) return true;
  const di = a.dressingIndependence?.[0] ?? "";
  return /caregiver|with some help|with help/i.test(di);
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

/* ----------------------------- Fit signals -------------------------------- */

/**
 * A fit signal is one prioritised matching dimension shown in the live
 * profile mirror: a short chip label, the body zones it lights up on the
 * fit map (max 3 rendered), and a one-line explanation of what the engine
 * is doing with it.
 */
export interface FitSignal {
  id: string;
  label: string;
  zones: BodyZone[];
  detail: string;
}

/**
 * Derives the ordered list of active fit signals from the answers so far.
 * Order is priority order — the card shows the first few and folds the rest
 * behind a "+N more" toggle (progressive disclosure).
 */
export function fitSignals(a: Answers): FitSignal[] {
  const out: FitSignal[] = [];
  const bi = a.bodyIssues ?? [];
  const zoneOf = (id: string) => ISSUE_ZONE[id];

  const seated =
    hasHelp(a, "Seated") ||
    (a.seated ?? []).length > 0 ||
    bi.some((id) => ["hi-rise", "hi-pull", "hi-fit", "hi-pressure", "wa-seated"].includes(id));
  if (seated)
    out.push({
      id: "seated",
      label: "Seated fit",
      zones: ["hips", "waist"],
      detail: "Prioritising seated comfort",
    });

  if (
    hasHelp(a, "One-handed") ||
    bi.includes("ha-onehand") ||
    (a.dressingExtra ?? []).some((d) => d.includes("One-handed"))
  )
    out.push({
      id: "onehand",
      label: "One-handed dressing",
      zones: ["hands", "arms"],
      detail: "Prioritising one-handed dressing",
    });

  if (
    hasHelp(a, "Easier dressing") ||
    bi.some((id) => ["ha-buttons", "ha-zips"].includes(id)) ||
    (a.closures ?? []).some((c) => c !== NOT_LISTED)
  )
    out.push({
      id: "closures",
      label: "Easy closures",
      zones: ["hands"],
      detail: "Avoiding small fasteners",
    });

  if (
    hasHelp(a, "Shoulder") ||
    bi.some((id) => zoneOf(id) === "shoulders" || zoneOf(id) === "arms")
  )
    out.push({
      id: "shoulder",
      label: "Shoulder & arm ease",
      zones: ["shoulders", "arms"],
      detail: "Prioritising easy arm movement",
    });

  if (sensoryActive(a) || (a.fabricFeel ?? []).length > 0)
    out.push({
      id: "sensory",
      label: "Sensory comfort",
      zones: ["skin"],
      detail: "Checking sensory-friendly materials",
    });

  if (medicalActive(a))
    out.push({
      id: "medical",
      label: "Medical access",
      zones: ["waist", "chest"],
      detail: "Prioritising medical-access openings",
    });

  if (braceActive(a))
    out.push({
      id: "brace",
      label: "AFO / orthotics",
      zones: ["feet", "legs"],
      detail: "Making room for braces and orthotics",
    });

  if (isAssistedDressing(a))
    out.push({
      id: "assisted",
      label: "Assisted dressing",
      zones: ["chest", "shoulders"],
      detail: "Looking for caregiver-assisted dressing features",
    });

  // Finer body-map signals not already covered above.
  if (bi.some((id) => zoneOf(id) === "chest") && !medicalActive(a))
    out.push({
      id: "chest",
      label: "Chest access",
      zones: ["chest"],
      detail: "Prioritising front and chest openings",
    });
  if (bi.includes("wa-band") && !seated)
    out.push({
      id: "waist",
      label: "Waist comfort",
      zones: ["waist"],
      detail: "Reducing waistband pressure",
    });
  if (bi.some((id) => zoneOf(id) === "legs") && !braceActive(a))
    out.push({
      id: "legs",
      label: "Leg access",
      zones: ["legs"],
      detail: "Prioritising easier leg access",
    });
  if (
    !braceActive(a) &&
    (bi.some((id) => zoneOf(id) === "feet") || (a.footwear ?? []).some((f) => f !== NOT_LISTED))
  )
    out.push({
      id: "footwear",
      label: "Easy footwear",
      zones: ["feet"],
      detail: "Prioritising easy-on footwear",
    });

  const styles = a.style ?? [];
  if (styles.length)
    out.push({
      id: "style",
      label: `Style: ${styles[styles.length - 1]}`,
      zones: [],
      detail: "Balancing style with your fit needs",
    });

  return out;
}

/* --------------------------- Live profile chips -------------------------- */

export function profileChips(a: Answers): string[] {
  const chips: string[] = [];
  const who = a.who?.[0];
  if (who) chips.push(personaChipLabel(who));
  if (a.country?.[0] && a.country[0] !== GLOBAL) {
    chips.push(
      a.country[0] === "Other country"
        ? "Shopping region: Other"
        : `Shopping region: ${a.country[0]}`
    );
  } else if (a.country?.[0] === GLOBAL) {
    chips.push("Shopping region: Global");
  }
  (a.clothing ?? []).forEach((c) => {
    if (c.startsWith("Not sure")) chips.push("Looking for: Not sure");
    else if (CLOTHING_CHIP[c]) chips.push(`Looking for: ${CLOTHING_CHIP[c]}`);
  });
  if (hasHelp(a, "Seated")) chips.push("Seated fit");
  if (hasHelp(a, "One-handed")) chips.push("One-handed dressing");
  if (isAssistedDressing(a)) chips.push("Assisted dressing");
  if (hasHelp(a, "Shoulder")) chips.push("Shoulder / arm ease");
  (a.closures ?? [])
    .filter((c) => c !== NOT_LISTED)
    .forEach((c) => chips.push(c));
  if ((a.fabricFeel ?? []).includes("Soft") || (a.bodyIssues ?? []).includes("sk-soft"))
    chips.push("Soft fabric");
  if ((a.bodyIssues ?? []).includes("wa-band")) chips.push("Waist pressure");
  if (medicalActive(a)) chips.push("Body-zone access");
  if (braceActive(a)) chips.push("Brace / AFO space");
  (a.style ?? []).slice(-2).forEach((s) => chips.push(`Style: ${s}`));
  if (a.range?.[0]) chips.push(`Range: ${rangeChipLabel(a.range[0])}`);
  if (a.budget?.[0] && a.budget[0] !== "No preference") chips.push(`Budget: ${a.budget[0]}`);
  if (hasNotListed(a)) chips.push("Custom need added");
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

export function buildResultParams(
  a: Answers,
  otherNeeds: string,
  customNeed = ""
): URLSearchParams {
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
  if (country && country !== "Other country" && country !== GLOBAL) {
    p.set("location", country);
  }

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

  // closures / features ("Something else / not listed" is captured separately
  // via the custom-need field, so it must not feed the closure hard filter)
  const features: string[] = [...(a.closures ?? []).filter((c) => c !== NOT_LISTED)];
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
  // Picking "Caregiver-assisted dressing" as a need must activate the
  // caregiver hard requirement even if the how-dressing-happens follow-up
  // was skipped.
  else if (hasHelp(a, "Caregiver")) p.set("dressingMethod", "caregiver_often");

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

  // Custom / "not listed" need — kept private; only a soft flag + free text.
  const custom = customNeed.trim();
  if (custom) p.set("custom", custom);
  if (custom || hasNotListed(a)) p.set("customflag", "1");

  return p;
}

function uniqueZones(issueIds: string[]): string[] {
  return Array.from(new Set(issueIds.map((id) => ISSUE_ZONE[id]).filter(Boolean)));
}

export { ISSUE_ZONE, hasHelp, sensoryActive, medicalActive, braceActive, footwearActive };
