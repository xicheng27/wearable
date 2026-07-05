import type { Product, RecommendationInput } from "@/types";
import { getProductShipsTo } from "@/data/products";
import { GLOBAL, expandShippingRegions } from "@/lib/countries";

/**
 * Public demo report scenarios (/results/demo/[scenario]).
 *
 * Each scenario is a realistic sample profile fed through the REAL
 * recommendation engine at render time — nothing on a demo page is
 * hand-picked, so the pages double as living proof that the matching is
 * data-driven and the hard filters actually hold.
 */

export interface DemoScenario {
  slug: string;
  title: string;
  /** One-sentence realistic persona, written respectfully. */
  persona: string;
  /** Rows for the profile summary card. */
  profile: { label: string; value: string }[];
  /** Non-negotiable requirements shown as chips (mirror the engine input). */
  hardFilters: string[];
  input: RecommendationInput;
  metaDescription: string;
}

export const demoScenarios: DemoScenario[] = [
  {
    slug: "afo-footwear-singapore",
    title: "AFO-friendly footwear in Singapore",
    persona:
      "An adult in Singapore who wears an AFO (ankle-foot orthosis) and needs shoes with real clearance for it — not just any 'adaptive' shoe.",
    profile: [
      { label: "Shopping for", value: "Myself" },
      { label: "Location", value: "Singapore" },
      { label: "Looking for", value: "Footwear only" },
      { label: "Key need", value: "AFO / orthotic clearance" },
      { label: "Also matters", value: "Easy fastening, wide opening" },
    ],
    hardFilters: ["Footwear only", "Available in Singapore", "AFO / orthotic space"],
    input: {
      location: "Singapore",
      clothingTypes: ["Shoes"],
      needs: ["Orthotics and AFOs"],
      limit: 6,
    },
    metaDescription:
      "A live demo of AFO-friendly footwear matching for Singapore — strict category and orthotic-clearance filters, honest gaps included.",
  },
  {
    slug: "wheelchair-seated-pants",
    title: "Seated-fit pants for a wheelchair user",
    persona:
      "A full-time wheelchair user in Singapore who wants pants that are cut for sitting — higher back rise, no bunching, no pressure points.",
    profile: [
      { label: "Shopping for", value: "Myself" },
      { label: "Location", value: "Singapore" },
      { label: "Looking for", value: "Pants only" },
      { label: "Key need", value: "Wheelchair / seated fit" },
      { label: "Also matters", value: "Comfortable seated waistband" },
    ],
    hardFilters: ["Pants only", "Available in Singapore", "Seated / wheelchair fit"],
    input: {
      location: "Singapore",
      clothingTypes: ["Pants"],
      mobilityLevel: "wheelchair-or-seated",
      needs: ["Wheelchair or seated comfort", "Seated fit"],
      limit: 6,
    },
    metaDescription:
      "A live demo of seated-fit pants matching for wheelchair users — only bottoms, only seated-friendly cuts, ranked by real product data.",
  },
  {
    slug: "dexterity-friendly-tops",
    title: "Easy-fastening tops for limited hand dexterity",
    persona:
      "Someone in the United States with arthritis in both hands who wants tops they can fasten independently — magnets and easy grips, not fiddly buttons.",
    profile: [
      { label: "Shopping for", value: "Myself" },
      { label: "Location", value: "United States" },
      { label: "Looking for", value: "Tops only" },
      { label: "Key need", value: "Limited hand dexterity" },
      { label: "Preferred closures", value: "Magnetic, easy-grip" },
    ],
    hardFilters: ["Tops only", "Available in the United States", "Easy closures for limited dexterity"],
    input: {
      location: "United States",
      clothingTypes: ["Tops"],
      needs: ["Limited hand dexterity", "Arthritis"],
      closurePreference: ["Magnetic closures"],
      limit: 6,
    },
    metaDescription:
      "A live demo of dexterity-friendly tops matching — magnetic and easy-grip closures enforced as hard requirements, not styling notes.",
  },
  {
    slug: "sensory-everyday",
    title: "Sensory-friendly everyday clothing",
    persona:
      "A young adult in the United Kingdom with strong skin sensitivity who needs soft, tag-free everyday clothes — seams and labels genuinely matter.",
    profile: [
      { label: "Shopping for", value: "Myself" },
      { label: "Location", value: "United Kingdom" },
      { label: "Looking for", value: "Everyday clothing (any category)" },
      { label: "Key need", value: "Sensory comfort" },
      { label: "Avoids", value: "Tags, rough seams, scratchy fabric" },
    ],
    hardFilters: ["Available in the United Kingdom", "Sensory-friendly fabric"],
    input: {
      location: "United Kingdom",
      needs: ["Sensory discomfort"],
      sensoryNeeds: ["Soft, tag-free fabrics", "Flat seams"],
      fabricComfortNeeds: ["Soft, tag-free fabrics"],
      limit: 6,
    },
    metaDescription:
      "A live demo of sensory-friendly matching — soft, tag-free, flat-seam evidence required before anything is called a match.",
  },
  {
    slug: "caregiver-older-adult",
    title: "Caregiver shopping for an older adult",
    persona:
      "A daughter in Singapore shopping for her 82-year-old father, who she helps dress each morning — easy access matters more than fashion.",
    profile: [
      { label: "Shopping for", value: "A parent (older adult)" },
      { label: "Location", value: "Singapore" },
      { label: "Looking for", value: "Tops only" },
      { label: "Key need", value: "Caregiver-assisted dressing" },
      { label: "Also matters", value: "Simple, comfortable, safe" },
    ],
    hardFilters: ["Tops only", "Available in Singapore", "Assisted-dressing access"],
    input: {
      location: "Singapore",
      clothingTypes: ["Tops"],
      targetGroup: "elderly",
      ageRange: "75-plus",
      caregiverInvolvement: "caregiver-assisted",
      dressingMethod: "caregiver_often",
      needs: [],
      limit: 6,
    },
    metaDescription:
      "A live demo of caregiver-aware matching for an older adult — open backs, easy access and wording written for the person helping.",
  },
];

export function getDemoScenario(slug: string): DemoScenario | undefined {
  return demoScenarios.find((scenario) => scenario.slug === slug);
}

/* ----------------------------- Fit signals -------------------------------- */

/**
 * Six per-product "fit signal" scores (0–100), each derived from listed
 * product data with the evidence named right next to the number — never an
 * invented composite. Shown as labelled bars on the demo report.
 */
export interface FitSignal {
  id: string;
  label: string;
  score: number;
  evidence: string;
}

function blobOf(product: Product): string {
  return [
    product.clothingType,
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

export function fitSignals(product: Product, input: RecommendationInput): FitSignal[] {
  const blob = blobOf(product);
  const signals: FitSignal[] = [];

  // Mobility & seated fit
  if (product.seatedFit) {
    signals.push({
      id: "mobility",
      label: "Mobility & seated fit",
      score: 100,
      evidence: "Seated fit is listed by the brand",
    });
  } else if (/wheelchair|seated/.test(blob)) {
    signals.push({
      id: "mobility",
      label: "Mobility & seated fit",
      score: 75,
      evidence: "Seated use mentioned in the description",
    });
  } else {
    signals.push({
      id: "mobility",
      label: "Mobility & seated fit",
      score: 30,
      evidence: "No specific seated-fit evidence",
    });
  }

  // Dressing access
  if (product.oneHandedDressing) {
    signals.push({
      id: "access",
      label: "Dressing access",
      score: 100,
      evidence: "One-handed dressing is listed",
    });
  } else if (/magnetic|velcro|hook-and-loop|open-back|open back|side opening|side-opening|pull-on|pull on|hands-free|assisted/.test(blob)) {
    signals.push({
      id: "access",
      label: "Dressing access",
      score: 80,
      evidence: "Easy-access features listed",
    });
  } else if (/zip|elastic|snap/.test(blob)) {
    signals.push({
      id: "access",
      label: "Dressing access",
      score: 60,
      evidence: "Simple fastenings listed",
    });
  } else {
    signals.push({
      id: "access",
      label: "Dressing access",
      score: 30,
      evidence: "No specific access features listed",
    });
  }

  // Sensory comfort
  if (product.sensoryFriendly) {
    signals.push({
      id: "sensory",
      label: "Sensory comfort",
      score: 100,
      evidence: "Sensory-friendly is listed by the brand",
    });
  } else if (/tag-free|tagless|seamless|flat seam|soft|non-irritating/.test(blob)) {
    signals.push({
      id: "sensory",
      label: "Sensory comfort",
      score: 70,
      evidence: "Soft / tag-free qualities mentioned",
    });
  } else {
    signals.push({
      id: "sensory",
      label: "Sensory comfort",
      score: 35,
      evidence: "No sensory-comfort evidence",
    });
  }

  // Climate & fabric (relevant to warm, humid locations like Singapore)
  const warmClimate = /singapore|malaysia|thailand|indonesia|philippines/i.test(
    input.location ?? ""
  );
  if (/breathable|lightweight|bamboo|linen|moisture|cooling|airy/.test(blob)) {
    signals.push({
      id: "climate",
      label: "Climate & fabric",
      score: 85,
      evidence: "Breathable / lightweight fabric listed",
    });
  } else if (/fleece|thermal|wool|padded|insulated|heavy/.test(blob)) {
    signals.push({
      id: "climate",
      label: "Climate & fabric",
      score: warmClimate ? 25 : 60,
      evidence: warmClimate
        ? "Warm fabric — may be hot for this climate"
        : "Warm fabric listed",
    });
  } else {
    signals.push({
      id: "climate",
      label: "Climate & fabric",
      score: 55,
      evidence: "Fabric weight not specified",
    });
  }

  // Style fit
  const styles = input.styles ?? [];
  if (styles.length === 0) {
    signals.push({
      id: "style",
      label: "Style fit",
      score: 60,
      evidence: "No style preference set in this profile",
    });
  } else if (
    product.styleTags.some((tag) => styles.some((style) => tag.toLowerCase().includes(style.toLowerCase())))
  ) {
    signals.push({
      id: "style",
      label: "Style fit",
      score: 95,
      evidence: "Matches the preferred style tags",
    });
  } else {
    signals.push({
      id: "style",
      label: "Style fit",
      score: 45,
      evidence: "Different style than preferred",
    });
  }

  // Location & shipping
  const shipsTo = getProductShipsTo(product);
  if (!input.location) {
    signals.push({
      id: "location",
      label: "Location & shipping",
      score: 70,
      evidence: "No location set in this profile",
    });
  } else if (expandShippingRegions([input.location]).some((c) => shipsTo.includes(c))) {
    signals.push({
      id: "location",
      label: "Location & shipping",
      score: 100,
      evidence: `${input.location} is listed by the brand`,
    });
  } else if (shipsTo.includes(GLOBAL)) {
    signals.push({
      id: "location",
      label: "Location & shipping",
      score: 70,
      evidence: "Ships internationally — confirm delivery",
    });
  } else {
    signals.push({
      id: "location",
      label: "Location & shipping",
      score: 15,
      evidence: `Shipping to ${input.location} not listed`,
    });
  }

  return signals;
}
