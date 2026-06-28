/**
 * Builds the "Adaptive clothing signal map" shown at the top of the results
 * page. It reads like the user's adaptive clothing *stats* — a fit signature,
 * the top recommendation drivers, how results are weighted, and a profile
 * uniqueness score — rather than telling them what data is "missing".
 *
 * Percentages represent signal strength / profile relevance, never accuracy,
 * and are intentionally not 100% by default.
 */

export type SignalStrength = "High" | "Strong" | "Medium" | "Low";
export type SignalRole = "Primary" | "Supporting" | "Not a focus";

export interface SignalCategory {
  id: string;
  title: string;
  score: number;
  strength: SignalStrength;
  role: SignalRole;
  tags: string[];
  explanation: string;
}

export interface WeightSlice {
  label: string;
  pct: number;
}

export interface Uniqueness {
  score: number; // 0-100
  label: "Simple profile" | "Defined profile" | "Specific profile" | "Highly individual fit profile";
  tier: "Low" | "Medium" | "High" | "Very high";
  explanation: string;
}

export interface ShareableProfile {
  persona: string;
  topNeed: string;
  strongestSignal: string;
  styleDirection: string;
  shoppingFrom: string;
  keyTags: string[];
}

export interface SignalMap {
  categories: SignalCategory[];
  topSignals: SignalCategory[];
  fitSignature: { title: string; description: string };
  persona: string;
  uniqueness: Uniqueness;
  weighting: WeightSlice[];
  keyTags: string[];
  share: ShareableProfile;
}

type Raw = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(/[,~]/)
    .map((s) => {
      try {
        return decodeURIComponent(s).trim();
      } catch {
        return s.trim();
      }
    })
    .filter(Boolean);
}

interface SignalDef {
  test: RegExp;
  tag: string;
  weight: number;
}

function curve(sum: number): number {
  return Math.round(100 * (1 - Math.exp(-sum / 2.4)));
}

function strengthFor(pct: number): SignalStrength {
  if (pct >= 80) return "High";
  if (pct >= 60) return "Strong";
  if (pct >= 35) return "Medium";
  return "Low";
}

function roleFor(pct: number, signals: number): SignalRole {
  if (signals === 0) return "Not a focus";
  if (pct >= 60) return "Primary";
  return "Supporting";
}

function scoreCategory(
  id: string,
  title: string,
  blob: string,
  defs: SignalDef[],
  explmain: string
): SignalCategory {
  const tags: string[] = [];
  let sum = 0;
  defs.forEach((d) => {
    if (d.test.test(blob)) {
      sum += d.weight;
      tags.push(d.tag);
    }
  });
  const score = curve(sum);
  return {
    id,
    title,
    score,
    strength: strengthFor(score),
    role: roleFor(score, tags.length),
    tags,
    explanation: tags.length === 0 ? "Not a focus area for this profile." : explmain,
  };
}

const CATEGORY_NEED: Record<string, string> = {
  fit: "Seated comfort",
  access: "Easy dressing",
  sensory: "Soft, comfortable fabric",
  medical: "Body-zone access",
  orthotic: "Footwear & brace space",
};

const SIGNATURE: Record<string, { title: string; description: string }> = {
  fit: {
    title: "Seated Comfort Profile",
    description: "Your profile centres on seated-first fit and pressure-aware cuts.",
  },
  access: {
    title: "Easy Dressing Profile",
    description: "Your profile is built around fastenings and openings that make dressing easier.",
  },
  sensory: {
    title: "Sensory Comfort Profile",
    description: "Your profile leans toward soft, low-irritation, breathable fabrics.",
  },
  medical: {
    title: "Body-Zone Access Profile",
    description: "Your profile prioritises discreet openings for body-zone access.",
  },
  orthotic: {
    title: "Footwear Accommodation Profile",
    description: "Your profile makes room for braces, swelling and adaptive footwear.",
  },
  fashion: {
    title: "Style-Led Adaptive Profile",
    description: "Your profile is led by style and shopping fit, with adaptive comfort built in.",
  },
};

export function buildSignalMap(raw: Raw): SignalMap {
  const help = list(raw.help);
  const needs = list(raw.needs);
  const features = [...list(raw.features), ...list(raw.fastenings)];
  const sensory = list(raw.sensory);
  const avoid = list(raw.avoid);
  const feel = list(raw.feel);
  const zones = list(raw.zones);
  const issues = list(raw.issues);
  const seated = list(raw.seated);
  const medarea = list(raw.medarea);
  const medaccess = list(raw.medaccess);
  const brace = list(raw.brace);
  const foot = list(raw.foot);
  const styles = [...list(raw.styles), ...list(raw.style)];
  const shopping = list(raw.shopping);
  const budget = list(raw.budget);
  const range = list(raw.range);
  const location = (list(raw.location)[0] ?? "").trim();

  const all = (...arr: string[][]) => arr.flat().join(" | ").toLowerCase();

  const fitBlob = all(help, needs, seated, zones, issues);
  const accessBlob = all(help, features, needs, issues);
  const sensoryBlob = all(help, sensory, avoid, feel, issues, zones);
  const medicalBlob = all(help, medarea, medaccess, issues, needs);
  const orthoticBlob = all(help, brace, foot, needs, issues, zones);
  const fashionBlob = all(styles, shopping, budget, range, [location]);

  const categories: SignalCategory[] = [
    scoreCategory("fit", "Fit & mobility", fitBlob, [
      { test: /seated|wheelchair/, tag: "seated_fit", weight: 2 },
      { test: /back rise|higher back/, tag: "higher_back_rise", weight: 1.4 },
      { test: /waist|abdomen|band/, tag: "waist_pressure", weight: 1.2 },
      { test: /pressure/, tag: "pressure_reduction", weight: 1.2 },
      { test: /transfer/, tag: "easy_transfer", weight: 1 },
      { test: /hips|pull|posture/, tag: "seated_posture", weight: 1 },
    ], "Seated-first fit and pressure-aware cuts drive your matches."),
    scoreCategory("access", "Access & dexterity", accessBlob, [
      { test: /one-handed|one handed/, tag: "one_handed", weight: 1.8 },
      { test: /magnetic/, tag: "magnetic_closure", weight: 1.5 },
      { test: /velcro|hook/, tag: "velcro", weight: 1 },
      { test: /zip|zipper/, tag: "easy_zip", weight: 1 },
      { test: /elastic|pull-on|no fastener/, tag: "easy_entry", weight: 1 },
      { test: /front opening|open-back|open back/, tag: "front_or_back_open", weight: 1.2 },
      { test: /dexterity|button/, tag: "low_dexterity", weight: 1 },
    ], "Fastenings and openings that make dressing easier rank highest."),
    scoreCategory("sensory", "Sensory & skin comfort", sensoryBlob, [
      { test: /soft|smooth/, tag: "soft_fabric", weight: 1.4 },
      { test: /tag/, tag: "tag_free", weight: 1 },
      { test: /seam/, tag: "flat_seams", weight: 1 },
      { test: /breathable|lightweight|heat/, tag: "breathable", weight: 1 },
      { test: /scratch|irritat/, tag: "low_irritation", weight: 1 },
      { test: /tight elastic|non-restrictive|loose/, tag: "relaxed_fit", weight: 0.8 },
    ], "Soft, low-irritation, breathable pieces are prioritised."),
    scoreCategory("medical", "Medical & body-zone access", medicalBlob, [
      { test: /port/, tag: "port_access", weight: 1.4 },
      { test: /tube/, tag: "tube_access", weight: 1.4 },
      { test: /ostomy/, tag: "ostomy_access", weight: 1.4 },
      { test: /examination|exam/, tag: "exam_access", weight: 1 },
      { test: /privacy|discreet/, tag: "privacy_openings", weight: 1 },
      { test: /chest|abdomen|waist|arm|leg|device|medical/, tag: "body_zone_access", weight: 1.2 },
    ], "Discreet openings for body-zone access are factored in."),
    scoreCategory("orthotic", "Orthotic / footwear accommodation", orthoticBlob, [
      { test: /afo/, tag: "afo_space", weight: 1.6 },
      { test: /brace/, tag: "brace_space", weight: 1.3 },
      { test: /swell/, tag: "swelling_room", weight: 1.1 },
      { test: /orthotic|insole/, tag: "orthotic_friendly", weight: 1 },
      { test: /wide opening/, tag: "wide_opening", weight: 1 },
      { test: /strap|fasten|stable sole/, tag: "adjustable_footwear", weight: 1 },
    ], "Room for supports and matched footwear closures are factored in."),
    scoreCategory("fashion", "Fashion identity & shopping context", fashionBlob, [
      { test: /old money|clean|chic|street|minimal|sporty|formal|y2k|soft|cozy|elegant|casual|modest|trendy/, tag: "style_direction", weight: 1.4 },
      { test: /budget|mid-range|premium/, tag: "budget_set", weight: 1 },
      { test: /female|male|unisex/, tag: "clothing_range", weight: 1 },
      { test: /local/, tag: "local_brands", weight: 0.8 },
      { test: /resale/, tag: "open_to_resale", weight: 0.6 },
      { test: /return/, tag: "easy_returns", weight: 0.6 },
      { test: location ? new RegExp(location.toLowerCase().replace(/[^a-z ]/g, "")) : / /, tag: "shipping_context", weight: 1 },
    ], "Style, range and shopping context refine ranking after needs are met."),
  ];

  const functional = categories.filter((c) => c.id !== "fashion");
  const functionalWithData = functional.filter((c) => c.tags.length > 0);

  // Top priority signals (anything with a signal), strongest first.
  const topSignals = [...categories]
    .filter((c) => c.tags.length > 0)
    .sort((a, b) => b.score - a.score);

  // Dominant functional category → fit signature.
  const dominantFunctional = [...functional].sort((a, b) => b.score - a.score)[0];
  let signatureKey = "fashion";
  if (functionalWithData.length >= 3) signatureKey = "mixed";
  else if (dominantFunctional && dominantFunctional.tags.length > 0)
    signatureKey = dominantFunctional.id;
  const fitSignature =
    signatureKey === "mixed"
      ? {
          title: "Mixed Access Profile",
          description: `Your profile combines ${functionalWithData.length} distinct functional needs across fit, access and comfort.`,
        }
      : SIGNATURE[signatureKey] ?? SIGNATURE.fashion;

  // Recommendation weighting — dynamic, normalised to 100%.
  const fnSignalCount = functional.reduce((n, c) => n + c.tags.length, 0);
  const zoneCount = new Set([...zones, ...issues]).size;
  const raw_weights: WeightSlice[] = [
    { label: "Functional needs", pct: 18 + fnSignalCount * 7 },
    { label: "Body-zone fit", pct: 6 + zoneCount * 4 },
    { label: "Country / shipping", pct: location ? 15 : 4 },
    { label: "Budget", pct: budget.length ? 10 : 3 },
    { label: "Style / range", pct: 6 + styles.length * 3 + (range.length ? 5 : 0) },
  ];
  const weighting = normaliseWeights(raw_weights);

  // Profile uniqueness — based on combination complexity (no fake population stats).
  const crossCategory = functionalWithData.length;
  const rareCombo =
    (categories.find((c) => c.id === "orthotic")!.tags.length > 0 &&
      categories.find((c) => c.id === "sensory")!.tags.length > 0) ||
    (categories.find((c) => c.id === "medical")!.tags.length > 0 &&
      categories.find((c) => c.id === "fit")!.tags.length > 0);
  const uniqScore = crossCategory * 2 + fnSignalCount + (rareCombo ? 3 : 0) + (styles.length ? 1 : 0);
  const uniqueness = buildUniqueness(uniqScore, topSignals);

  // Persona title.
  const persona = buildPersona(signatureKey, dominantFunctional, styles);

  // Privacy-safe key tags.
  const keyTags = privacySafeTags(categories);

  const strongest = topSignals[0] ?? categories[0];
  const topNeed = dominantFunctional && dominantFunctional.tags.length
    ? CATEGORY_NEED[dominantFunctional.id] ?? "Comfortable fit"
    : "Comfort & fit";

  const share: ShareableProfile = {
    persona,
    topNeed,
    strongestSignal: strongest.title,
    styleDirection: styles.length ? styles.slice(0, 2).join(" / ") : "Comfort-led",
    shoppingFrom: location || "Global",
    keyTags,
  };

  return {
    categories,
    topSignals,
    fitSignature,
    persona,
    uniqueness,
    weighting,
    keyTags,
    share,
  };
}

function normaliseWeights(slices: WeightSlice[]): WeightSlice[] {
  const total = slices.reduce((n, s) => n + s.pct, 0) || 1;
  const scaled = slices.map((s) => ({ label: s.label, pct: Math.round((s.pct / total) * 100) }));
  // Fix rounding drift onto the largest slice.
  const drift = 100 - scaled.reduce((n, s) => n + s.pct, 0);
  if (drift !== 0) {
    const largest = scaled.reduce((a, b) => (b.pct > a.pct ? b : a));
    largest.pct += drift;
  }
  return scaled;
}

function buildUniqueness(score: number, topSignals: SignalCategory[]): Uniqueness {
  let tier: Uniqueness["tier"];
  let label: Uniqueness["label"];
  let pct: number;
  if (score <= 2) {
    tier = "Low";
    label = "Simple profile";
    pct = 28 + score * 6;
  } else if (score <= 5) {
    tier = "Medium";
    label = "Defined profile";
    pct = 48 + (score - 2) * 5;
  } else if (score <= 9) {
    tier = "High";
    label = "Specific profile";
    pct = 66 + (score - 5) * 4;
  } else {
    tier = "Very high";
    label = "Highly individual fit profile";
    pct = Math.min(96, 84 + (score - 9) * 2);
  }
  const signalNames = topSignals.slice(0, 4).map((s) => s.title.toLowerCase());
  const explanation =
    topSignals.length === 0
      ? "A clean, style-led profile — a great starting point for adaptive pieces."
      : `This profile uses ${topSignals.length} recommendation signal${
          topSignals.length === 1 ? "" : "s"
        }${
          signalNames.length
            ? ` (${signalNames.join(", ")})`
            : ""
        }, making it more specific than a standard clothing search.`;
  return { score: pct, label, tier, explanation };
}

function buildPersona(
  signatureKey: string,
  dominant: SignalCategory | undefined,
  styles: string[]
): string {
  const needNoun: Record<string, string> = {
    fit: "Seated",
    access: "Easy-Dressing",
    sensory: "Soft-Comfort",
    medical: "Discreet-Access",
    orthotic: "Footwear-First",
    mixed: "Mobility-First",
  };
  const styleNoun = (() => {
    const s = (styles[0] ?? "").toLowerCase();
    if (s.startsWith("old money")) return "Classicist";
    if (s.startsWith("clean")) return "Essentialist";
    if (s.startsWith("chic")) return "Stylist";
    if (s.startsWith("street")) return "Streetwear Profile";
    if (s.startsWith("minimal")) return "Minimalist";
    if (s.startsWith("sporty")) return "Athlete";
    if (s.startsWith("formal")) return "Refined Dresser";
    if (s.startsWith("y2k")) return "Trendsetter";
    if (s.startsWith("soft")) return "Comfort Seeker";
    if (s.startsWith("elegant")) return "Elegant";
    if (s.startsWith("casual")) return "Everyday Dresser";
    if (s.startsWith("modest")) return "Modest Dresser";
    if (s.startsWith("trendy")) return "Trendsetter";
    return "";
  })();

  const key = signatureKey === "fashion" ? "" : signatureKey;
  const noun = key ? needNoun[key] : "";
  if (!noun) {
    return styleNoun ? `The Adaptive ${styleNoun}` : "The Style-Led Adaptive Profile";
  }
  if (styleNoun) return `The ${noun} ${styleNoun}`;
  return `The ${noun} Profile`;
}

// Softens sensitive medical tags for any public/shareable surface.
function privacySafeTags(categories: SignalCategory[]): string[] {
  const sensitive: Record<string, string> = {
    port_access: "body-zone access",
    tube_access: "body-zone access",
    ostomy_access: "body-zone access",
    exam_access: "easy access",
    body_zone_access: "body-zone access",
    privacy_openings: "privacy-friendly openings",
  };
  const friendly: Record<string, string> = {
    seated_fit: "seated fit",
    higher_back_rise: "higher back rise",
    waist_pressure: "waist comfort",
    pressure_reduction: "pressure relief",
    one_handed: "one-handed dressing",
    magnetic_closure: "magnetic closures",
    easy_entry: "easy entry",
    easy_zip: "easy zips",
    front_or_back_open: "easy openings",
    soft_fabric: "soft fabric",
    tag_free: "tag-free",
    flat_seams: "flat seams",
    breathable: "breathable",
    afo_space: "footwear accommodation",
    brace_space: "brace space",
    wide_opening: "wide-opening footwear",
    style_direction: "style match",
    clothing_range: "clothing range",
  };
  const out: string[] = [];
  categories.forEach((c) => {
    if (c.id === "fashion") return;
    c.tags.forEach((t) => {
      const label = sensitive[t] ?? friendly[t];
      if (label && !out.includes(label)) out.push(label);
    });
  });
  return out.slice(0, 6);
}
