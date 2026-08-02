import type { Product } from "@/types";

/**
 * Turns a product's raw adaptive-feature tags into a concise, non-repetitive
 * "How it helps" list, and maps recognised mechanisms to illustrative diagrams.
 *
 * The catalogue sync sometimes emits generic tags ("Adaptive dressing",
 * "Assisted dressing design") alongside specific ones ("Open-back design",
 * "Magnetic closures"). Showing both makes every product read the same. Here we
 * drop the generics whenever a specific feature already explains the item, and
 * cap the list so product pages stay readable.
 */

const GENERIC_FEATURES = new Set(
  [
    "adaptive dressing",
    "assisted dressing design",
    "adaptive",
    "accessible clothing",
    "adaptive design",
    "easy dressing",
    "adaptive clothing",
  ].map((s) => s.toLowerCase())
);

/** Consolidate features: de-duplicate, drop generics when specifics exist, cap. */
export function consolidateFeatures(features: string[], max = 5): string[] {
  const seen = new Set<string>();
  const specific: string[] = [];
  const generic: string[] = [];
  for (const raw of features) {
    const label = raw.trim();
    const key = label.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    (GENERIC_FEATURES.has(key) ? generic : specific).push(label);
  }
  // Prefer specific features; only fall back to generic if nothing specific.
  return (specific.length ? specific : generic).slice(0, max);
}

/** Plain-language explanation of a specific adaptive feature. */
export function explainFeature(feature: string): string {
  const value = feature.toLowerCase();
  if (value.includes("magnetic")) return "Magnets can reduce the need to line up and push small buttons.";
  if (value.includes("open-back") || value.includes("open back")) return "The back opening can make assisted dressing easier, especially while seated or lying down.";
  if (value.includes("seated")) return "The cut is designed to sit more comfortably while using a wheelchair or sitting for long periods.";
  if (value.includes("side")) return "Side openings can reduce bending, pulling, or stepping into clothing.";
  if (value.includes("snap")) return "Snap fasteners can be quicker and easier to close than small buttons.";
  if (value.includes("zip")) return "Zip access can make openings larger and easier to manage.";
  if (value.includes("velcro") || value.includes("touch")) return "Touch-and-close fasteners can be easier than buttons for limited dexterity.";
  if (value.includes("sensory") || value.includes("seam") || value.includes("tag")) return "Softer finishes may reduce scratching, rubbing, or sensory discomfort.";
  if (value.includes("wide") || value.includes("afo") || value.includes("orthotic")) return "Extra room can help with braces, orthotics, swelling, or easier shoe entry.";
  if (value.includes("pull-on") || value.includes("elastic")) return "A pull-on or elastic waist removes fiddly closures for faster dressing.";
  return "This feature is intended to make dressing, comfort, or access easier.";
}

export type MechanismId =
  | "open-back"
  | "magnetic"
  | "side-opening"
  | "seated-rise"
  | "touch-close"
  | "afo-wide";

const MECHANISM_RULES: Array<[MechanismId, RegExp]> = [
  ["open-back", /open[- ]?back|back overlap|back opening/i],
  ["magnetic", /magnet/i],
  ["side-opening", /side[- ]?(?:open|zip|access|fasten)|drop[- ]?front/i],
  ["seated-rise", /seated|wheelchair|raised back|higher back/i],
  ["touch-close", /velcro|touch[- ]?and[- ]?close|hook and loop|snap/i],
  ["afo-wide", /afo|orthotic|wide opening|wide fit|extra depth|removable insole/i],
];

/** Up to `max` distinct illustrative diagrams a product's features map to. */
export function diagramsForProduct(product: Product, max = 3): MechanismId[] {
  const text = [
    ...product.adaptiveFeatures,
    ...(product.closureTypes ?? []),
    product.name,
  ]
    .join(" ")
    .toLowerCase();
  const ids: MechanismId[] = [];
  for (const [id, pattern] of MECHANISM_RULES) {
    if (pattern.test(text) && !ids.includes(id)) ids.push(id);
    if (ids.length >= max) break;
  }
  return ids;
}
