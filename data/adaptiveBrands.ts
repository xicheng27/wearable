/**
 * Singapore adaptive-clothing seed directory.
 *
 * This is a separate, source-tracked dataset (distinct from the verified
 * product catalogue in data/products.ts). Entries are a mix of exact
 * products, brand/category-level listings, services, and local initiatives —
 * `listingType` records which, so the UI can label them honestly.
 *
 * Rules followed:
 * - No invented products, prices, images, or URLs.
 * - Where an exact product URL/image is unknown, `productUrl` falls back to
 *   the brand site and `imageUrl` is null (the card shows a clean placeholder).
 * - Prices/currency appear only where a real listing showed them.
 *
 * To expand later: add exact product URLs, imageUrl, sizes, colours and
 * stock status to each entry, and flip `listingType` to "product".
 */

import type { ImageMeta } from "./imageMeta";

export type ListingType = "product" | "category" | "service" | "initiative";

export interface AdaptiveBrand {
  id: string;
  name: string;
  country: string;
  website: string;
  singaporeAvailability: string;
  shippingNotes: string;
  categories: string[];
  adaptiveFocus: string[];
  notes: string;
  /** Accent colour for placeholder cards (presentation only). */
  accent: string;
}

export interface AdaptiveProduct {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  productType: string;
  gender: string;
  category: string;
  price?: string;
  currency?: string;
  productUrl: string;
  imageUrl?: string | null;
  /**
   * Copyright-gated image metadata. All current entries are placeholder-only
   * (imageUrl null) — populate this and set permissionStatus "approved" once a
   * brand grants permission or a licence/feed is in place. See data/imageMeta.ts.
   */
  imageMeta?: ImageMeta;
  singaporeAvailability: string;
  adaptiveFeatures: string[];
  bestFor: string[];
  closureType?: string;
  sourceNotes: string;
  /** Whether this is an exact SKU, a category listing, a service, or an initiative. */
  listingType: ListingType;
}

export const adaptiveBrands: AdaptiveBrand[] = [
  {
    id: "will-and-well",
    name: "Will & Well",
    country: "Singapore",
    website: "https://willandwell.com",
    singaporeAvailability: "Local Singapore brand",
    shippingNotes: "Free local delivery for minimum spend SGD 150.",
    categories: [
      "Men",
      "Women",
      "Unisex",
      "Accessories",
      "Jewellery",
      "Bags",
      "Games",
      "Collaborations",
      "Embroidery",
      "Gift Cards",
      "Workshops",
      "Bespoke Tailoring & Alterations",
    ],
    adaptiveFocus: [
      "inclusive clothing",
      "easy dressing",
      "adaptive tailoring",
      "functional fashion",
      "dignity",
      "independence",
    ],
    notes:
      "Singapore inclusive fashion label. Suitable for users who want local adaptive clothing, alterations, workshops, and stylish functional garments.",
    accent: "#1E6B52",
  },
  {
    id: "the-able-label",
    name: "The Able Label",
    country: "United Kingdom",
    website: "https://www.theablelabel.com",
    singaporeAvailability: "Ships to Singapore",
    shippingNotes:
      "Singapore delivery around 8–9 working days; shipping from about S$8, free shipping from about S$80.",
    categories: [
      "Coats & Jackets",
      "Shirts & Blouses",
      "Tops & T-shirts",
      "Knitwear",
      "Nightwear & Loungewear",
      "Underwear",
      "Trousers",
      "Skirts & Dresses",
      "Men's Shirts & Tops",
      "Men's Trousers & Shorts",
      "Men's Nightwear",
      "Socks & Slippers",
      "Shoes",
      "Jewellery",
      "Scarves",
      "Hats",
      "Wellbeing",
      "Daily Living Aids",
    ],
    adaptiveFocus: [
      "touch-and-close fastenings",
      "pull-on clothing",
      "sleeveless / easy-dressing designs",
      "arthritis-friendly clothing",
      "Parkinson's",
      "stroke",
      "Alzheimer's",
      "assisted dressing",
    ],
    notes:
      "Good for older adults, carers, and users who need discreet adaptive designs.",
    accent: "#3A4E8C",
  },
  {
    id: "june-adaptive",
    name: "June Adaptive",
    country: "Canada",
    website: "https://www.juneadaptive.com",
    singaporeAvailability: "Contact for international order",
    shippingNotes:
      "Standard shipping is US and Canada; international customers should contact the company.",
    categories: [
      "Women's Adaptive Tops",
      "Women's Adaptive Pants & Jeans",
      "Women's Adaptive Dresses",
      "Women's Adaptive Sleepwear",
      "Women's Footwear & Socks",
      "Men's Adaptive Tops",
      "Men's Adaptive Pants & Jeans",
      "Men's Adaptive Sleepwear",
      "Men's Footwear & Socks",
      "Kids' Adaptive Footwear & Socks",
    ],
    adaptiveFocus: [
      "open-back clothing",
      "side-opening pants",
      "wheelchair clothing",
      "assisted dressing",
      "arthritis",
      "paralysis",
      "Parkinson's",
      "multiple sclerosis",
      "Alzheimer's",
    ],
    notes:
      "Useful brand to display, but Singapore availability is contact-for-international-order, not direct shipping.",
    accent: "#8E3A4E",
  },
  {
    id: "jam-the-label",
    name: "JAM the Label",
    country: "Australia",
    website: "https://jamthelabel.com",
    singaporeAvailability: "Singapore SGD store available",
    shippingNotes:
      "Singapore currency/store option shown; free shipping on orders over SGD 150.",
    categories: [
      "Tops",
      "Bottoms",
      "Accessories",
      "Gift Cards",
      "Essentials Collection",
      "Capsule Collection 01",
      "Artist Collaborations",
      "Clearance",
      "Tag-Free Tops",
      "Yama Sensory Socks",
    ],
    adaptiveFocus: [
      "sensory friendly",
      "seated position",
      "easy closures",
      "prosthetic / medical device access",
      "assisted dressing",
      "energy conservation",
    ],
    notes:
      "Strong brand for younger, stylish adaptive fashion. Good for product-level cards.",
    accent: "#2A4E7E",
  },
  {
    id: "lotus-eldercare-leaf",
    name: "Lotus Eldercare Adaptive Fashion (LEAF)",
    country: "Singapore",
    website: "https://www.lotuseldercare.com.sg/index.php/l-e-a-f",
    singaporeAvailability: "Singapore-based initiative",
    shippingNotes: "Not a normal ecommerce store; contact for availability.",
    categories: [
      "Adaptive basics",
      "Elderly clothing",
      "Disabled-friendly clothing",
      "Bed-bound patient clothing (in development)",
    ],
    adaptiveFocus: [
      "elderly dressing",
      "local climate",
      "carers",
      "occupational therapist input",
      "bed-bound users",
    ],
    notes:
      "Add as a local initiative / resource card rather than an ecommerce product listing.",
    accent: "#6B5B2E",
  },
];

export const adaptiveCatalog: AdaptiveProduct[] = [
  // ─── Will & Well ───────────────────────────────────────────────
  {
    id: "ww-midi-front-zip-dress",
    brandId: "will-and-well",
    brandName: "Will & Well",
    name: "Midi Sleeveless Dress with Front Zip",
    productType: "Dress",
    gender: "Women",
    category: "Dresses",
    productUrl: "https://willandwell.com",
    imageUrl: null,
    singaporeAvailability: "Local Singapore brand",
    adaptiveFeatures: [
      "Front zipper from collar to hip",
      "Easier dressing",
      "Discreet accessibility",
    ],
    bestFor: ["Limited arm mobility", "Assisted dressing", "Stylish accessible dresses"],
    closureType: "Front zip",
    sourceNotes:
      "Known Will & Well product; brand site used as the link. A third-party listing (The Golden Concepts) showed SGD 87 — not confirmed on the brand site, so price is left unset.",
    listingType: "product",
  },
  {
    id: "ww-inclusive-collection",
    brandId: "will-and-well",
    brandName: "Will & Well",
    name: "Adaptive / Inclusive Clothing Collection",
    productType: "Collection",
    gender: "Unisex",
    category: "Adaptive clothing",
    productUrl: "https://willandwell.com",
    imageUrl: null,
    singaporeAvailability: "Local Singapore brand",
    adaptiveFeatures: [
      "Adaptive tailoring",
      "Accessible closures",
      "Functional garment adjustments",
    ],
    bestFor: [
      "Wheelchair users",
      "Elderly users",
      "Disabled users",
      "People with dressing difficulties",
    ],
    sourceNotes: "Category-level listing; not a single SKU.",
    listingType: "category",
  },
  {
    id: "ww-bespoke-tailoring",
    brandId: "will-and-well",
    brandName: "Will & Well",
    name: "Bespoke Tailoring & Alterations",
    productType: "Service",
    gender: "Unisex",
    category: "Tailoring / Alterations",
    productUrl: "https://willandwell.com",
    imageUrl: null,
    singaporeAvailability: "Local Singapore service",
    adaptiveFeatures: [
      "Personalised garment modification",
      "Adaptive fit",
      "Custom accessibility changes",
    ],
    bestFor: ["Users who cannot find ready-made adaptive clothing"],
    sourceNotes: "Service listing, not a normal product.",
    listingType: "service",
  },

  // ─── The Able Label ────────────────────────────────────────────
  {
    id: "tal-touch-close-tops",
    brandId: "the-able-label",
    brandName: "The Able Label",
    name: "Touch & Close Tops / Shirts",
    productType: "Tops",
    gender: "Women / Men",
    category: "Shirts & Tops",
    productUrl: "https://www.theablelabel.com",
    imageUrl: null,
    singaporeAvailability: "Ships to Singapore",
    adaptiveFeatures: [
      "Touch-and-close fastening",
      "Easier self-dressing",
      "Easier assisted dressing",
    ],
    bestFor: ["Arthritis", "Reduced dexterity", "Parkinson's", "Stroke recovery"],
    closureType: "Touch and close",
    sourceNotes: "Category-level product listing.",
    listingType: "category",
  },
  {
    id: "tal-pull-on-trousers",
    brandId: "the-able-label",
    brandName: "The Able Label",
    name: "Pull-On Trousers",
    productType: "Trousers",
    gender: "Women / Men",
    category: "Trousers",
    productUrl: "https://www.theablelabel.com",
    imageUrl: null,
    singaporeAvailability: "Ships to Singapore",
    adaptiveFeatures: ["Pull-on waist", "No fiddly buttons", "Comfort fit"],
    bestFor: ["Elderly users", "Arthritis", "Reduced hand strength", "Assisted dressing"],
    closureType: "Pull-on",
    sourceNotes: "Category-level listing.",
    listingType: "category",
  },
  {
    id: "tal-nightwear-loungewear",
    brandId: "the-able-label",
    brandName: "The Able Label",
    name: "Adaptive Nightwear & Loungewear",
    productType: "Nightwear",
    gender: "Women / Men",
    category: "Nightwear & Loungewear",
    productUrl: "https://www.theablelabel.com",
    imageUrl: null,
    singaporeAvailability: "Ships to Singapore",
    adaptiveFeatures: ["Soft fabrics", "Easy-dressing cuts", "Comfort-first design"],
    bestFor: ["Elderly users", "Carers", "Post-surgery", "Care-home use"],
    sourceNotes: "Category-level listing.",
    listingType: "category",
  },
  {
    id: "tal-underwear",
    brandId: "the-able-label",
    brandName: "The Able Label",
    name: "Adaptive Underwear",
    productType: "Underwear",
    gender: "Women / Men",
    category: "Underwear",
    productUrl: "https://www.theablelabel.com",
    imageUrl: null,
    singaporeAvailability: "Ships to Singapore",
    adaptiveFeatures: ["Easier changing", "Comfort-focused design"],
    bestFor: ["Assisted dressing", "Elderly users", "Limited mobility"],
    sourceNotes: "Category-level listing.",
    listingType: "category",
  },
  {
    id: "tal-socks-slippers",
    brandId: "the-able-label",
    brandName: "The Able Label",
    name: "Adaptive Socks & Slippers",
    productType: "Socks / Slippers",
    gender: "Unisex",
    category: "Footwear & Socks",
    productUrl: "https://www.theablelabel.com",
    imageUrl: null,
    singaporeAvailability: "Ships to Singapore",
    adaptiveFeatures: ["Easier foot access", "Comfort", "Safer daily wear"],
    bestFor: ["Elderly users", "Reduced mobility", "Fall-risk users"],
    sourceNotes: "Category-level listing.",
    listingType: "category",
  },

  // ─── June Adaptive ─────────────────────────────────────────────
  {
    id: "june-mens-side-opening-jeans",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Men's Easy-On Side-Opening Jeans",
    productType: "Jeans",
    gender: "Men",
    category: "Pants & Jeans",
    price: "54.99",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Side opening", "Adjustable waist", "Easy-on design"],
    bestFor: ["Wheelchair users", "Assisted dressing", "Limited mobility"],
    closureType: "Side opening / Velcro adjustable waist",
    sourceNotes: "Listed as a customer favourite on June Adaptive.",
    listingType: "product",
  },
  {
    id: "june-mens-back-opening-polo",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Men's Adaptive Back-Opening Knit Polo Shirt",
    productType: "Polo Shirt",
    gender: "Men",
    category: "Tops",
    price: "54.99",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Back opening", "Snap closure", "Assisted dressing"],
    bestFor: ["Carers", "Elderly users", "Limited arm mobility"],
    closureType: "Back-opening snap closure",
    sourceNotes: "Listed as a customer favourite on June Adaptive.",
    listingType: "product",
  },
  {
    id: "june-womens-open-back-shirt",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Women's Easy-Access Open-Back Snap Closure Shirt",
    productType: "Shirt",
    gender: "Women",
    category: "Tops",
    price: "From 39.99",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Open back", "Snap closure", "Easy assisted dressing"],
    bestFor: ["Carers", "Elderly users", "Reduced shoulder/arm mobility"],
    closureType: "Open-back snap closure",
    sourceNotes: "Listed as a customer favourite on June Adaptive.",
    listingType: "product",
  },
  {
    id: "june-womens-back-overlap-pants",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Women's Back-Overlap Assisted Dressing Adaptive Knit Pants",
    productType: "Pants",
    gender: "Women",
    category: "Pants",
    price: "53.00",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Back-overlap design", "Assisted dressing", "Easy dressing"],
    bestFor: ["Wheelchair users", "Carers", "Limited mobility"],
    closureType: "Back-overlap",
    sourceNotes: "Listed as a customer favourite on June Adaptive.",
    listingType: "product",
  },
  {
    id: "june-mens-ls-back-opening-polo",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Men's Adaptive Long Sleeve Back-Opening Polo Shirt",
    productType: "Long Sleeve Polo",
    gender: "Men",
    category: "Tops",
    price: "64.99",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Long sleeve", "Back opening", "Snap closure"],
    bestFor: ["Assisted dressing", "Carers", "Elderly users"],
    closureType: "Back-opening snap closure",
    sourceNotes: "Listed as a customer favourite on June Adaptive.",
    listingType: "product",
  },
  {
    id: "june-anti-slip-socks",
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    name: "Anti-Slip Socks",
    productType: "Socks",
    gender: "Unisex",
    category: "Footwear & Socks",
    price: "40.00",
    currency: "CAD",
    productUrl: "https://www.juneadaptive.com",
    imageUrl: null,
    singaporeAvailability: "Contact for international order",
    adaptiveFeatures: ["Anti-slip grip", "Safer walking", "Easy daily use"],
    bestFor: ["Elderly users", "Fall-risk users", "Hospital or home use"],
    sourceNotes: "Listed as a customer-favourite item on June Adaptive.",
    listingType: "product",
  },

  // ─── JAM the Label ─────────────────────────────────────────────
  {
    id: "jam-side-access-cargo",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "Side Access Cargo Pants",
    productType: "Cargo Pants",
    gender: "Unisex",
    category: "Bottoms",
    price: "101.00",
    currency: "SGD",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: [
      "Side access",
      "Seated-friendly",
      "Easier access to prosthetics or medical devices",
    ],
    bestFor: ["Wheelchair users", "Seated users", "Prosthetic users", "Side access"],
    closureType: "Side access",
    sourceNotes: "Highlighted product on JAM the Label.",
    listingType: "product",
  },
  {
    id: "jam-zip-access-jumper",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "Zip Access Jumper",
    productType: "Jumper",
    gender: "Unisex",
    category: "Tops",
    price: "110.00",
    currency: "SGD",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: ["Zip access", "Easier dressing", "Medical / prosthetic access"],
    bestFor: ["Assisted dressing", "Energy conservation", "Reduced mobility"],
    closureType: "Zip access",
    sourceNotes: "Highlighted product on JAM the Label.",
    listingType: "product",
  },
  {
    id: "jam-high-waisted-pant",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "High Waisted Pant 2.0",
    productType: "Pants",
    gender: "Unisex / Women",
    category: "Bottoms",
    price: "97.00",
    currency: "SGD",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: ["High waist", "Seated comfort", "Soft fit"],
    bestFor: ["Seated users", "Wheelchair users", "Sensory comfort"],
    sourceNotes: "Highlighted product on JAM the Label.",
    listingType: "product",
  },
  {
    id: "jam-femme-linen-shirt",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "Femme Linen Shirt",
    productType: "Linen Shirt",
    gender: "Femme",
    category: "Tops",
    price: "From 83.00",
    currency: "SGD",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: ["Easy-wear shirt", "Soft fabric", "Adaptive everyday styling"],
    bestFor: ["Sensory-friendly dressing", "Everyday adaptive fashion"],
    sourceNotes: "Highlighted product on JAM the Label.",
    listingType: "product",
  },
  {
    id: "jam-masc-linen-shirt",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "Masc. Linen Shirt",
    productType: "Linen Shirt",
    gender: "Masc",
    category: "Tops",
    price: "92.00",
    currency: "SGD",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: ["Easy-wear shirt", "Soft fabric", "Adaptive everyday styling"],
    bestFor: ["Sensory-friendly dressing", "Everyday adaptive fashion"],
    sourceNotes: "Highlighted product on JAM the Label.",
    listingType: "product",
  },
  {
    id: "jam-yama-sensory-socks",
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    name: "Yama Sensory Socks",
    productType: "Socks",
    gender: "Unisex",
    category: "Accessories / Socks",
    productUrl: "https://jamthelabel.com",
    imageUrl: null,
    singaporeAvailability: "Singapore SGD store available",
    adaptiveFeatures: ["Sensory-friendly", "Soft feel", "Reduced irritation"],
    bestFor: ["Sensory sensitivity", "Neurodivergent users", "Daily comfort"],
    sourceNotes: "Listed as a JAM category / collection.",
    listingType: "category",
  },

  // ─── Lotus Eldercare (LEAF) ────────────────────────────────────
  {
    id: "leaf-adaptive-basics",
    brandId: "lotus-eldercare-leaf",
    brandName: "Lotus Eldercare Adaptive Fashion (LEAF)",
    name: "Adaptive Basics for Elderly or Disabled Users",
    productType: "Adaptive Basics",
    gender: "Unisex",
    category: "Elderly Clothing",
    productUrl: "https://www.lotuseldercare.com.sg/index.php/l-e-a-f",
    imageUrl: null,
    singaporeAvailability: "Singapore-based initiative",
    adaptiveFeatures: ["Local climate suitability", "Easier dressing", "Functional design"],
    bestFor: ["Elderly users", "Disabled users", "Carers"],
    sourceNotes:
      "Initiative-level listing. Not shown as an ecommerce SKU — contact the initiative for availability.",
    listingType: "initiative",
  },
  {
    id: "leaf-bed-bound-clothing",
    brandId: "lotus-eldercare-leaf",
    brandName: "Lotus Eldercare Adaptive Fashion (LEAF)",
    name: "Bed-Bound Patient Clothing",
    productType: "Bed-Bound Clothing",
    gender: "Unisex",
    category: "Care Clothing",
    productUrl: "https://www.lotuseldercare.com.sg/index.php/l-e-a-f",
    imageUrl: null,
    singaporeAvailability: "Singapore-based initiative / in development",
    adaptiveFeatures: ["Easier changing in bed", "Carer-friendly", "Patient comfort"],
    bestFor: ["Bed-bound patients", "Carers", "Home care", "Eldercare"],
    sourceNotes: "Mentioned as a planned / developing clothing direction.",
    listingType: "initiative",
  },
];

/** Brand lookup by id. */
export function getAdaptiveBrand(id: string): AdaptiveBrand | undefined {
  return adaptiveBrands.find((b) => b.id === id);
}

/** Coarse clothing-type bucket for filtering (derived from product/category). */
export function clothingBucket(p: AdaptiveProduct): string {
  const t = `${p.productType} ${p.category}`.toLowerCase();
  if (/dress|skirt/.test(t)) return "Dresses & skirts";
  if (/sock|slipper|footwear|shoe/.test(t)) return "Socks & footwear";
  if (/nightwear|loungewear|sleep/.test(t)) return "Nightwear";
  if (/underwear/.test(t)) return "Underwear";
  if (/coat|jacket|jumper|knit/.test(t)) return "Outerwear & knitwear";
  if (/trouser|pant|jean|cargo|short|bottom/.test(t)) return "Trousers & bottoms";
  if (/top|shirt|polo|tee|blouse/.test(t)) return "Tops & shirts";
  if (/service|tailor|alter/.test(t)) return "Services";
  return "Collections & care";
}

const haystack = (p: AdaptiveProduct) =>
  `${p.adaptiveFeatures.join(" ")} ${p.bestFor.join(" ")} ${p.category} ${p.productType}`.toLowerCase();

export const adaptiveNeedMatchers: { label: string; test: (p: AdaptiveProduct) => boolean }[] = [
  { label: "Seated / wheelchair friendly", test: (p) => /wheelchair|seated/.test(haystack(p)) },
  { label: "Assisted dressing", test: (p) => /assisted dressing|carer/.test(haystack(p)) },
  { label: "Sensory-friendly", test: (p) => /sensory/.test(haystack(p)) },
  { label: "Arthritis / low dexterity", test: (p) => /arthritis|dexterity|hand strength/.test(haystack(p)) },
  { label: "Elderly", test: (p) => /elderly/.test(haystack(p)) },
  { label: "Limited mobility", test: (p) => /limited mobility|reduced mobility|paralysis/.test(haystack(p)) },
];
