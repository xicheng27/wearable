import { Brand } from "@/types";
import { brands } from "./brands";

export interface CategoryFeature {
  /** Label shown on chips and cards. */
  label: string;
  /** Lowercase keyword matched against brand adaptiveFeatures. */
  keyword: string;
}

export interface ClothingCategory {
  id: string;
  /** Card / page title, e.g. "Adaptive Pants". */
  name: string;
  /** Short noun for CTAs, e.g. "pants" -> "Explore pants". */
  noun: string;
  /** What adaptive needs this piece solves (card copy). */
  description: string;
  /** Longer intro for the category detail page. */
  longDescription: string;
  image: string;
  /** Key adaptive features; also the detail-page feature filters. */
  features: CategoryFeature[];
  /** brand.clothingTypes values that count as this category. */
  matchTypes: string[];
}

export const clothingCategories: ClothingCategory[] = [
  {
    id: "tops",
    name: "Adaptive Tops",
    noun: "tops",
    description: "Easy-on tops with open backs, front openings and one-handed dressing.",
    longDescription:
      "Tops are where most dressing struggles start — small buttons, tight necklines, hard-to-reach backs. Adaptive tops solve this with open-back designs for assisted dressing, magnetic plackets that close themselves, and cuts that work seated or standing.",
    image: "/images/cat-tops.svg",
    features: [
      { label: "Open-back", keyword: "open-back" },
      { label: "Magnetic closures", keyword: "magnetic" },
      { label: "One-handed dressing", keyword: "one-handed" },
      { label: "Front-opening", keyword: "front" },
      { label: "Tag-free", keyword: "tag-free" },
    ],
    matchTypes: ["Tops", "Cardigans"],
  },
  {
    id: "shirts",
    name: "Adaptive Shirts",
    noun: "shirts",
    description: "Smart shirts with magnetic buttons, Velcro cuffs and open-back options.",
    longDescription:
      "A crisp shirt shouldn't require fine motor skills. Adaptive shirts hide magnets behind classic button plackets, swap cuff buttons for Velcro, and offer open-back cuts that keep the front looking sharp while dressing happens from behind.",
    image: "/images/cat-shirts.svg",
    features: [
      { label: "Magnetic buttons", keyword: "magnetic" },
      { label: "Velcro cuffs", keyword: "velcro" },
      { label: "Open-back", keyword: "open-back" },
      { label: "Front-opening", keyword: "front" },
    ],
    matchTypes: ["Tops"],
  },
  {
    id: "tshirts",
    name: "Adaptive T-shirts",
    noun: "t-shirts",
    description: "Sensory-friendly tees with flat seams, tag-free labels and soft fabrics.",
    longDescription:
      "For sensory-sensitive wearers, an ordinary t-shirt can be a day-ruiner. Adaptive tees use printed labels instead of tags, flat or external seams, and soft, certified fabrics — comfort that disappears into the background.",
    image: "/images/cat-tshirts.svg",
    features: [
      { label: "Tag-free", keyword: "tag-free" },
      { label: "Flat seams", keyword: "flat" },
      { label: "Soft fabrics", keyword: "soft" },
      { label: "Easy pull-on", keyword: "pull-on" },
    ],
    matchTypes: ["Tops"],
  },
  {
    id: "jackets",
    name: "Adaptive Jackets",
    noun: "jackets",
    description: "Outerwear with magnetic zips, one-handed closures and seated cuts.",
    longDescription:
      "Jackets and coats are the hardest pieces to manage independently. Adaptive outerwear uses magnetic zipper closures you can start one-handed, longer pulls, and seated cuts that don't bunch at the waist in a wheelchair.",
    image: "/images/cat-jackets.svg",
    features: [
      { label: "Magnetic zips", keyword: "magnetic" },
      { label: "One-handed zips", keyword: "zipper" },
      { label: "Velcro closures", keyword: "velcro" },
      { label: "Seated cut", keyword: "seated" },
    ],
    matchTypes: ["Outerwear", "Blazers"],
  },
  {
    id: "pants",
    name: "Adaptive Pants",
    noun: "pants",
    description: "Seated-fit pants designed for comfort, easy dressing and wheelchair users.",
    longDescription:
      "Standard trousers are cut for standing. Adaptive pants are designed from the seated position up: higher back rise so nothing gaps, lower front rise so nothing digs, side openings for easy access, and waistbands that stretch instead of fight.",
    image: "/images/cat-pants.svg",
    features: [
      { label: "Seated fit", keyword: "seated" },
      { label: "High back rise", keyword: "back rise" },
      { label: "Low front rise", keyword: "front rise" },
      { label: "Elastic waistband", keyword: "elastic" },
      { label: "Side openings", keyword: "side-opening" },
      { label: "Easy pull tabs", keyword: "pull" },
    ],
    matchTypes: ["Trousers", "Jeans"],
  },
  {
    id: "jeans",
    name: "Adaptive Jeans",
    noun: "jeans",
    description: "Classic denim with seated cuts, magnetic flies and adjustable hems.",
    longDescription:
      "Everyone deserves a great pair of jeans. Adaptive denim keeps the classic look while adding seated-fit cuts, magnetic flies instead of stiff buttons, adjustable hems for orthotics or AFOs, and reinforced seams where braces rub.",
    image: "/images/cat-jeans.svg",
    features: [
      { label: "Seated fit", keyword: "seated" },
      { label: "High back rise", keyword: "back rise" },
      { label: "Magnetic fly", keyword: "magnetic" },
      { label: "Adjustable hems", keyword: "hem" },
      { label: "Side openings", keyword: "side-opening" },
    ],
    matchTypes: ["Jeans"],
  },
  {
    id: "dresses",
    name: "Adaptive Dresses & Skirts",
    noun: "dresses",
    description: "Dresses with open backs, front fastenings and easy pull-on designs.",
    longDescription:
      "Adaptive dresses and skirts put the fastenings where you can reach them — at the front or fully open at the back for assisted dressing — with seated-friendly lengths and soft waists that stay comfortable all day.",
    image: "/images/cat-dresses.svg",
    features: [
      { label: "Open-back", keyword: "open-back" },
      { label: "Front fastenings", keyword: "front" },
      { label: "Seated fit", keyword: "seated" },
      { label: "Easy pull-on", keyword: "pull-on" },
    ],
    matchTypes: ["Dresses", "Skirts"],
  },
  {
    id: "shoes",
    name: "Adaptive Shoes",
    noun: "shoes",
    description: "Easy-entry, wide-fit and slip-on footwear — no laces, no struggle.",
    longDescription:
      "Footwear is the most requested adaptive category. Easy-entry shoes open wide and close themselves, wide and extra-wide fits accommodate orthotics and swelling, and slip-on designs remove fastenings entirely.",
    image: "/images/cat-shoes.svg",
    features: [
      { label: "Easy-entry", keyword: "easy-entry" },
      { label: "Wide fit", keyword: "wide" },
      { label: "Slip-on", keyword: "slip-on" },
      { label: "Easy fastenings", keyword: "adjustable" },
    ],
    matchTypes: ["Footwear"],
  },
  {
    id: "underwear",
    name: "Adaptive Underwear & Basics",
    noun: "basics",
    description: "Seam-free basics, tag-free comfort and catheter-friendly designs.",
    longDescription:
      "The layer closest to your skin matters most. Adaptive basics use seam-free knits and tag-free waistbands for sensory comfort, easy pull-on shapes for independence, and discreet access designs for catheter and PEG users.",
    image: "/images/cat-underwear.svg",
    features: [
      { label: "Tag-free", keyword: "tag-free" },
      { label: "Flat seams", keyword: "flat" },
      { label: "Easy pull-on", keyword: "pull-on" },
      { label: "Catheter access", keyword: "catheter" },
    ],
    matchTypes: ["Underwear", "Socks", "Nightwear"],
  },
  {
    id: "formal",
    name: "Formal Adaptive Wear",
    noun: "formal wear",
    description: "Tailoring and occasionwear with seated cuts and reachable fastenings.",
    longDescription:
      "Big days deserve sharp clothes that work with your body. Formal adaptive wear brings seated-fit tailoring, front-placed fastenings, magnetic shirt plackets and wheelchair-friendly cuts to suits, blazers and occasionwear.",
    image: "/images/cat-formal.svg",
    features: [
      { label: "Seated-fit tailoring", keyword: "seated" },
      { label: "High back rise", keyword: "back rise" },
      { label: "Front fastenings", keyword: "front" },
      { label: "Magnetic buttons", keyword: "magnetic" },
    ],
    matchTypes: ["Formal wear", "Blazers"],
  },
  {
    id: "sportswear",
    name: "Adaptive Sportswear",
    noun: "sportswear",
    description: "Activewear with pull-on waistbands, flat seams and easy zips.",
    longDescription:
      "Movement should never be limited by clothing. Adaptive activewear pairs stretchy pull-on waistbands with flat seams that don't chafe, easy zippers you can grip, and fits that work for seated sports and standing workouts alike.",
    image: "/images/cat-sportswear.svg",
    features: [
      { label: "Pull-on waistbands", keyword: "pull-on" },
      { label: "Flat seams", keyword: "flat" },
      { label: "Easy zippers", keyword: "zipper" },
      { label: "Sensory-friendly", keyword: "sensory" },
    ],
    matchTypes: ["Activewear", "Swimwear"],
  },
  {
    id: "accessories",
    name: "Socks & Accessories",
    noun: "accessories",
    description: "Seamless socks and easy-grip accessories for sensitive feet and hands.",
    longDescription:
      "Small pieces, big difference. Seamless socks protect sensitive and diabetic feet, easy-grip designs help with limited dexterity, and sensory-friendly finishes keep all-day comfort.",
    image: "/images/cat-accessories.svg",
    features: [
      { label: "Seamless", keyword: "flat" },
      { label: "Sensory-friendly", keyword: "sensory" },
      { label: "Easy grip", keyword: "pull" },
    ],
    matchTypes: ["Socks"],
  },
];

export function getCategoryById(id: string): ClothingCategory | undefined {
  return clothingCategories.find((c) => c.id === id);
}

/** Brands that stock this category. */
export function brandsForCategory(category: ClothingCategory): Brand[] {
  return brands.filter((b) =>
    b.clothingTypes.some((t) => category.matchTypes.includes(t))
  );
}

/** Brand's adaptive features relevant to this category. */
export function categoryFeaturesOfBrand(
  category: ClothingCategory,
  brand: Brand
): string[] {
  return brand.adaptiveFeatures.filter((f) =>
    category.features.some((cf) => f.toLowerCase().includes(cf.keyword))
  );
}

/** Free-text search over categories (name, copy, features). */
export function searchCategories(query: string): ClothingCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return clothingCategories;
  return clothingCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.noun.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.features.some((f) => f.label.toLowerCase().includes(q)) ||
      c.matchTypes.some((t) => t.toLowerCase().includes(q))
  );
}

/** Quiz "What are you shopping for?" options, mapped to categories. */
export const quizClothingOptions: { label: string; categoryId: string }[] =
  clothingCategories.map((c) => ({
    label: c.name.replace("Adaptive ", "").replace(" Adaptive", ""),
    categoryId: c.id,
  }));
