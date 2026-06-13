import { Brand } from "@/types";

export const brands: Brand[] = [
  {
    id: "tommy-hilfiger-adaptive",
    name: "Tommy Hilfiger Adaptive",
    tagline: "Inclusive fashion without compromise",
    description:
      "Tommy Hilfiger Adaptive is a line of clothing designed for people with disabilities, featuring magnetic closures, adjustable hems, and seated fits — all with the same iconic Tommy style.",
    longDescription:
      "Launched in 2016, Tommy Hilfiger Adaptive was one of the first major fashion labels to commit fully to inclusive design. The collection covers everything from jeans and polos to outerwear, each piece engineered so that dressing is easier — not just possible. Magnetic zipper closures replace fiddly buttons, one-handed cuffs allow independent dressing, and seated fits ensure trousers lie correctly for wheelchair users. The range is available in Tommy's flagship stores across North America and Europe as well as online, with extended sizing from XS to 3XL.",
    logo: "TH",
    heroColor: "#C41230",
    image: "/images/brand-tommy-hilfiger-adaptive.svg",
    adaptiveFeatures: [
      "Magnetic button closures",
      "One-handed zipper pulls",
      "Velcro cuff closures",
      "Seated fit cut",
      "Open-back shirt options",
      "Adjustable hems",
      "Reinforced seams for bracing",
      "Side-opening trousers",
    ],
    disabilityTypes: [
      "Mobility impairments",
      "Fine motor difficulties",
      "Wheelchair users",
      "Limb differences",
      "Spinal cord injuries",
      "Multiple sclerosis",
    ],
    clothingTypes: [
      "Tops",
      "Jeans",
      "Outerwear",
      "Dresses",
      "Activewear",
      "Swimwear",
    ],
    styleTags: ["Casual", "Streetwear", "Smart casual", "Clean / minimal", "Sporty"],
    whoItSuits: [
      "Wheelchair users who need seated-fit cuts",
      "People with limited hand dexterity",
      "One-handed dressers",
      "Those using prosthetics or orthotics",
      "Carers assisting someone to dress",
    ],
    locations: [
      {
        name: "Tommy Hilfiger Fifth Avenue Flagship",
        address: "681 Fifth Avenue",
        city: "New York, NY",
        country: "USA",
        phone: "+1 212-888-0100",
        type: "flagship",
      },
      {
        name: "Tommy Hilfiger Oxford Street",
        address: "190 Oxford Street",
        city: "London",
        country: "UK",
        type: "flagship",
      },
      {
        name: "Tommy Hilfiger Amsterdam",
        address: "Kalverstraat 20",
        city: "Amsterdam",
        country: "Netherlands",
        type: "flagship",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK", "EU", "Australia"],
      freeShippingThreshold: 100,
      currency: "USD",
      estimatedDays: "3–7 business days",
      returnsPolicy:
        "Free returns within 30 days. Items must be unworn with original tags attached.",
    },
    website: "https://usa.tommy.com/en/tommy-adaptive",
    priceRange: "$$",
    country: "USA",
    featured: true,
    founded: 2016,
    certifications: ["Disability Confident (UK)", "ADA Compliant Design"],
  },
  {
    id: "iz-adaptive",
    name: "IZ Adaptive",
    tagline: "Stylish adaptive clothing for real life",
    description:
      "IZ Adaptive is a Canadian brand creating sophisticated, fashion-forward clothing designed specifically for wheelchair users and people with limited mobility.",
    longDescription:
      "Founded in Toronto by Izzy Camilleri — a costume designer who began adapting clothes for a documentary subject with ALS — IZ Adaptive has grown into one of the most celebrated adaptive fashion labels in the world. Every piece is designed from the seated position up: back rises are higher, front rises shorter, legs don't pool around the footrest, and fastenings sit at the front for easy reach. The collections span casual to formal wear, meaning IZ customers can find looks for every occasion. The brand ships globally and has been featured in Vogue and The New York Times.",
    logo: "IZ",
    heroColor: "#2C2C2C",
    image: "/images/brand-iz-adaptive.svg",
    adaptiveFeatures: [
      "High back rise",
      "Low front rise",
      "Front-placed fastenings",
      "No back pockets (reduces pressure sores)",
      "Flat inner seams",
      "Elasticated waistbands",
      "Wider seat room",
      "Shorter front hem",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Mobility impairments",
      "Spinal cord injuries",
      "ALS / motor neuron disease",
      "Muscular dystrophy",
      "Cerebral palsy",
    ],
    clothingTypes: [
      "Tops",
      "Trousers",
      "Skirts",
      "Dresses",
      "Blazers",
      "Outerwear",
      "Formal wear",
    ],
    styleTags: ["Formal", "Old money", "Smart casual", "Clean / minimal", "Swedish style"],
    whoItSuits: [
      "Full-time wheelchair users",
      "Part-time wheelchair users",
      "People who spend extended time seated",
      "Those with pressure sore concerns",
      "Anyone wanting professional / formal adaptive wear",
    ],
    locations: [
      {
        name: "IZ Adaptive Studio Toronto",
        address: "55 Mill Street, Building 74",
        city: "Toronto, ON",
        country: "Canada",
        phone: "+1 416-555-0192",
        type: "flagship",
      },
    ],
    shipping: {
      countries: ["Canada", "USA", "UK", "EU", "Australia", "Worldwide"],
      freeShippingThreshold: 150,
      currency: "CAD",
      estimatedDays: "5–10 business days international",
      returnsPolicy:
        "Returns accepted within 14 days. Final sale items are non-returnable.",
    },
    website: "https://www.izadaptive.com",
    priceRange: "$$$",
    country: "Canada",
    featured: true,
    founded: 2009,
    certifications: ["Rick Hansen Foundation Accessibility Certified"],
  },
  {
    id: "zappos-adaptive",
    name: "Zappos Adaptive",
    tagline: "The widest adaptive range, delivered fast",
    description:
      "Zappos Adaptive is Amazon-backed Zappos' dedicated section for adaptive clothing and footwear, curating hundreds of products from multiple brands with fast, free shipping.",
    longDescription:
      "Zappos Adaptive launched in 2017 as part of Zappos' commitment to inclusive fashion. Rather than a single brand, it's a curated marketplace bringing together adaptive products from dozens of labels — including their own private-label finds. The footwear selection is particularly strong, with easy-entry shoes, wide-fit options, and shoe-horn-free designs. The clothing range covers sensory-friendly garments, easy-on tops, adapted workwear, and more. All products ship free with next-day options, and returns are free for 365 days — a massive win for adaptive shoppers who often need to try multiple sizes.",
    logo: "ZA",
    heroColor: "#0064AF",
    image: "/images/brand-zappos-adaptive.svg",
    adaptiveFeatures: [
      "Easy-entry footwear",
      "Wide-fit shoes",
      "Slip-on designs",
      "Sensory-friendly fabrics",
      "Tag-free garments",
      "Flat seams",
      "Easy pull-on waistbands",
      "Adjustable features",
    ],
    disabilityTypes: [
      "Sensory processing differences",
      "Autism spectrum",
      "Mobility impairments",
      "Limb differences",
      "Diabetes (foot care)",
      "Elderly / age-related needs",
      "Visual impairments",
    ],
    clothingTypes: [
      "Footwear",
      "Tops",
      "Trousers",
      "Underwear",
      "Socks",
      "Activewear",
      "Nightwear",
    ],
    styleTags: ["Casual", "Sporty", "Streetwear", "Vintage"],
    whoItSuits: [
      "Sensory-sensitive individuals",
      "People needing wide or orthopaedic footwear",
      "Those with diabetes needing specialist footwear",
      "Anyone needing a broad selection in one place",
      "Shoppers who rely on easy returns",
    ],
    locations: [
      {
        name: "Zappos HQ (Las Vegas)",
        address: "400 Stewart Avenue",
        city: "Las Vegas, NV",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada"],
      freeShippingThreshold: 0,
      currency: "USD",
      estimatedDays: "1–2 business days (free expedited)",
      returnsPolicy: "Free returns for 365 days. No questions asked.",
    },
    website: "https://www.zappos.com/e/adaptive",
    priceRange: "$–$$$",
    country: "USA",
    featured: true,
    founded: 2017,
    certifications: ["Amazon Disability Employment Award"],
  },
  {
    id: "able2wear",
    name: "Able2Wear",
    tagline: "UK-designed adaptive clothing with dignity at its core",
    description:
      "Able2Wear is a UK-based specialist in adaptive clothing for adults with physical disabilities, offering open-back garments, side-opening trousers, and discreetly adapted everyday wear.",
    longDescription:
      "Able2Wear was founded in the UK with a single mission: to create clothing that gives people with physical disabilities the dignity of independent dressing without looking 'medical'. Their range spans open-back tops and cardigans, side-opening trousers for easy catheter and PEG access, and fully front-opening shirts. Fabrics are chosen for comfort — soft cottons, stretch blends, and easy-care polyesters that survive hospital and care-home washing cycles. The brand works closely with occupational therapists to refine each design, and their sizing charts include seated and standing measurements. UK delivery is next-day and they ship to Europe and beyond.",
    logo: "A2",
    heroColor: "#4A1D96",
    image: "/images/brand-able2wear.svg",
    adaptiveFeatures: [
      "Open-back garments",
      "Side-opening trousers",
      "Front-opening shirts",
      "PEG access panels",
      "Catheter-friendly designs",
      "Soft, stretch fabrics",
      "Easy-care machine washable",
      "Invisible adaptations",
    ],
    disabilityTypes: [
      "Stroke survivors",
      "Parkinson's disease",
      "Dementia",
      "Wheelchair users",
      "PEG / feeding tube users",
      "Catheter users",
      "Hemiplegia / hemiparesis",
      "Elderly with limited mobility",
    ],
    clothingTypes: [
      "Tops",
      "Cardigans",
      "Trousers",
      "Skirts",
      "Nightwear",
      "Underwear",
      "Footwear",
    ],
    styleTags: ["Casual", "Clean / minimal", "Vintage", "Swedish style"],
    whoItSuits: [
      "Stroke survivors rebuilding independence",
      "People with Parkinson's or tremors",
      "Care home residents",
      "Individuals with PEG or catheter needs",
      "Occupational therapy patients",
      "Carers seeking easier assisted dressing",
    ],
    locations: [
      {
        name: "Able2Wear Showroom",
        address: "Unit 4, Parkway Business Centre",
        city: "Manchester",
        country: "UK",
        phone: "+44 161 555 0234",
        type: "flagship",
      },
      {
        name: "Able2Wear London Stockist – Millfield",
        address: "22 Millfield Lane",
        city: "London",
        country: "UK",
        type: "stockist",
      },
    ],
    shipping: {
      countries: ["UK", "Ireland", "EU", "Australia", "Canada"],
      freeShippingThreshold: 50,
      currency: "GBP",
      estimatedDays: "1–3 business days UK, 5–10 days international",
      returnsPolicy:
        "Free UK returns within 28 days. Items must be unworn. Exchange service available.",
    },
    website: "https://www.able2wear.co.uk",
    priceRange: "$$",
    country: "UK",
    featured: true,
    founded: 2003,
    certifications: [
      "Disability Confident Employer",
      "OT-approved designs",
      "BS 8300 Accessible Design",
    ],
  },
  {
    id: "abl-denim",
    name: "ABL Denim",
    tagline: "Adaptive denim designed for seated comfort",
    description:
      "ABL Denim creates adaptive jeans shaped for wheelchair users and people who need easier dressing details.",
    longDescription:
      "ABL Denim focuses on familiar everyday denim with changes that matter in a seated position, including a higher back rise, a lower front rise and easier waist access. The result is clothing that looks like mainstream fashion while reducing common fit and comfort problems for wheelchair users.",
    logo: "ABL",
    heroColor: "#24405C",
    image: "/images/category-jeans.svg",
    adaptiveFeatures: [
      "Seated fit cut",
      "High back rise",
      "Low front rise",
      "Easy dressing waistband",
      "Reduced pressure points",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Mobility impairments",
      "Fine motor difficulties",
      "Sensory processing differences",
    ],
    clothingTypes: ["Jeans", "Trousers"],
    styleTags: ["Casual", "Classic", "Everyday"],
    whoItSuits: [
      "Wheelchair users seeking everyday denim",
      "People who need easier waist access",
      "Wearers sensitive to bulky seams and pressure points",
    ],
    locations: [],
    shipping: {
      countries: ["USA"],
      currency: "USD",
      estimatedDays: "Check current retailer availability",
      returnsPolicy: "Returns depend on the current retail partner.",
    },
    website: "https://www.foundla.org/new/abl-denim/",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2010,
    certifications: [],
  },
  {
    id: "billy-footwear",
    name: "BILLY Footwear",
    tagline: "Fashionable shoes that open all the way",
    description:
      "BILLY Footwear makes zip-opening shoes designed for easier entry, including AFO-friendly and extra-wide styles.",
    longDescription:
      "BILLY Footwear combines mainstream sneaker styling with wraparound and short-wrap zipper systems that expose more of the footbed. Many styles include removable insoles and width options, making the range useful for people who wear braces, orthotics or prosthetics.",
    logo: "BF",
    heroColor: "#E0583E",
    image: "/images/category-shoes.svg",
    adaptiveFeatures: [
      "Wraparound zipper",
      "Wide shoe opening",
      "Removable insoles",
      "AFO-friendly styles",
      "Extra-wide options",
    ],
    disabilityTypes: [
      "Mobility impairments",
      "Fine motor difficulties",
      "Limb differences",
      "Cerebral palsy",
      "Orthotic users",
    ],
    clothingTypes: ["Footwear"],
    styleTags: ["Casual", "Sporty", "Streetwear"],
    whoItSuits: [
      "People who use AFOs or orthotics",
      "Wearers with limited reach or dexterity",
      "Anyone needing a wider shoe opening",
    ],
    locations: [
      {
        name: "Selected footwear stockists",
        address: "Use the official store locator",
        city: "Multiple locations",
        country: "USA",
        type: "stockist",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK"],
      freeShippingThreshold: 150,
      currency: "USD",
      estimatedDays: "Varies by destination",
      returnsPolicy: "See the official website for current return terms.",
    },
    website: "https://billyfootwear.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2015,
    certifications: ["HSA/FSA eligible styles"],
  },
  {
    id: "magnaready",
    name: "MagnaReady",
    tagline: "Classic clothing with magnetic closures",
    description:
      "MagnaReady designs shirts, polos and pants with hidden magnetic fasteners for stress-free dressing.",
    longDescription:
      "MagnaReady preserves the appearance of classic menswear while replacing difficult buttons with patented magnetic closures. Its clothing is designed for people living with Parkinson's, arthritis, neuropathy, ALS, stroke-related mobility changes and other fine-motor challenges.",
    logo: "MR",
    heroColor: "#4B5D67",
    image: "/images/category-formal.svg",
    adaptiveFeatures: [
      "Magnetic closures",
      "Easy-open cuffs",
      "Magnetic fly",
      "Wrinkle-resistant fabric",
      "One-handed dressing",
    ],
    disabilityTypes: [
      "Parkinson's disease",
      "Arthritis",
      "Fine motor difficulties",
      "Stroke survivors",
      "One-handed dressers",
    ],
    clothingTypes: ["Shirts", "Tops", "Trousers", "Formal wear"],
    styleTags: ["Formal", "Professional", "Classic", "Smart casual"],
    whoItSuits: [
      "People with tremors or arthritis",
      "One-handed dressers",
      "Anyone seeking conventional-looking adaptive formalwear",
    ],
    locations: [],
    shipping: {
      countries: ["USA", "Canada"],
      currency: "USD",
      estimatedDays: "Varies by destination",
      returnsPolicy: "See the official website for current return terms.",
    },
    website: "https://magnaready.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2012,
    certifications: ["HSA/FSA eligible products"],
  },
  {
    id: "slick-chicks",
    name: "Slick Chicks",
    tagline: "Adaptive underwear for easier dressing",
    description:
      "Slick Chicks creates side-fastening underwear and apparel for independent, seated or assisted dressing.",
    longDescription:
      "Slick Chicks uses patented side-fastening designs so underwear can open fully instead of being pulled over the feet and legs. The approach supports people with limited mobility or dexterity, wheelchair users, post-surgery recovery and assisted dressing.",
    logo: "SC",
    heroColor: "#A95076",
    image: "/images/category-underwear.svg",
    adaptiveFeatures: [
      "Side fastenings",
      "Fully opening underwear",
      "Seated dressing",
      "Soft stretch fabric",
      "Leakproof options",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Mobility impairments",
      "Fine motor difficulties",
      "Post-surgery recovery",
    ],
    clothingTypes: ["Underwear", "Activewear"],
    styleTags: ["Everyday", "Minimal", "Comfort"],
    whoItSuits: [
      "People dressing from a seated or lying position",
      "Wearers with limited hand dexterity",
      "People who use assisted dressing",
    ],
    locations: [
      {
        name: "Selected retail partners",
        address: "Check the official website",
        city: "Multiple locations",
        country: "USA",
        type: "stockist",
      },
    ],
    shipping: {
      countries: ["USA", "Canada"],
      currency: "USD",
      estimatedDays: "Varies by destination",
      returnsPolicy: "See the official website for current return terms.",
    },
    website: "https://slickchicksonline.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2014,
    certifications: [],
  },
  {
    id: "nike-flyease",
    name: "Nike FlyEase",
    tagline: "Easy-on footwear built for movement",
    description:
      "Nike FlyEase and EasyOn footwear uses hands-free and simplified entry systems across athletic and lifestyle shoes.",
    longDescription:
      "Nike FlyEase technologies are designed to make footwear quicker and easier to put on and take off. The Go FlyEase uses a bi-stable hinge and tensioner for hands-free entry, while other EasyOn styles use flexible heels, zippers or simplified closures.",
    logo: "NIKE",
    heroColor: "#111111",
    image: "/images/category-shoes.svg",
    adaptiveFeatures: [
      "Hands-free entry",
      "Hinged heel",
      "Easy-on design",
      "No-lace options",
      "Flexible openings",
    ],
    disabilityTypes: [
      "Mobility impairments",
      "Fine motor difficulties",
      "One-handed dressers",
      "Limb differences",
    ],
    clothingTypes: ["Footwear"],
    styleTags: ["Sporty", "Streetwear", "Modern"],
    whoItSuits: [
      "People with limited reach or dexterity",
      "Wearers who prefer hands-free shoe changes",
      "Anyone seeking athletic adaptive footwear",
    ],
    locations: [
      {
        name: "Nike stores and selected retailers",
        address: "Use the official Nike store locator",
        city: "Multiple locations",
        country: "Worldwide",
        type: "stockist",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK", "EU", "Australia"],
      currency: "USD",
      estimatedDays: "Varies by market",
      returnsPolicy: "See Nike for current regional return terms.",
    },
    website: "https://www.nike.com/easyon",
    priceRange: "$$-$$$",
    country: "USA",
    featured: false,
    founded: 2015,
    certifications: [],
  },
];

export const disabilityCategories = [
  { id: "wheelchair", label: "Wheelchair Users", icon: "♿", count: 4 },
  { id: "limb-difference", label: "Limb Differences", icon: "🦾", count: 3 },
  { id: "sensory", label: "Sensory Processing", icon: "🌟", count: 2 },
  { id: "fine-motor", label: "Fine Motor Difficulties", icon: "🤲", count: 3 },
  { id: "neurological", label: "Neurological Conditions", icon: "🧠", count: 3 },
  { id: "chronic-pain", label: "Chronic Pain", icon: "💙", count: 2 },
  { id: "visual", label: "Visual Impairments", icon: "👁", count: 1 },
  { id: "elderly", label: "Age-Related Needs", icon: "🏡", count: 2 },
];

export const disabilityOptionsList = [
  "Wheelchair users",
  "Mobility impairments",
  "Limb differences",
  "Sensory processing",
  "Fine motor difficulties",
  "Neurological conditions",
  "Stroke survivors",
  "Parkinson's disease",
  "Autism spectrum",
  "Visual impairments",
  "Chronic pain",
  "Elderly / age-related",
];

export const shippingLocationsList = ["USA", "Canada", "UK", "EU", "Australia"];

export const adaptiveFeaturesList = [
  "Magnetic closures",
  "Velcro fastenings",
  "Open-back garments",
  "Side-opening",
  "Seated fit",
  "Sensory-friendly",
  "Easy-on footwear",
  "Tag-free",
  "One-handed dressing",
  "Catheter access",
];

export const clothingTypesList = [
  "Tops",
  "Trousers",
  "Dresses",
  "Outerwear",
  "Footwear",
  "Activewear",
  "Formal wear",
  "Nightwear",
  "Underwear",
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function searchBrands(params: {
  query?: string;
  disabilityType?: string;
  clothingType?: string;
  adaptiveFeature?: string;
  country?: string;
  priceRange?: string;
}): Brand[] {
  let results = [...brands];

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.adaptiveFeatures.some((f) => f.toLowerCase().includes(q)) ||
        b.disabilityTypes.some((d) => d.toLowerCase().includes(q))
    );
  }

  if (params.disabilityType) {
    const dt = params.disabilityType.toLowerCase();
    results = results.filter((b) =>
      b.disabilityTypes.some((d) => d.toLowerCase().includes(dt))
    );
  }

  if (params.clothingType) {
    const ct = params.clothingType.toLowerCase();
    results = results.filter((b) =>
      b.clothingTypes.some((c) => c.toLowerCase().includes(ct))
    );
  }

  if (params.adaptiveFeature) {
    const af = params.adaptiveFeature.toLowerCase();
    results = results.filter((b) =>
      b.adaptiveFeatures.some((f) => f.toLowerCase().includes(af))
    );
  }

  if (params.priceRange) {
    const pr = params.priceRange;
    // A brand with a spanning range (e.g. "$–$$$") matches any budget.
    results = results.filter(
      (b) => b.priceRange === pr || b.priceRange.includes("–")
    );
  }

  if (params.country) {
    const co = params.country.toLowerCase();
    results = results.filter((b) =>
      b.shipping.countries.some((c) => {
        const shipped = c.toLowerCase();
        return shipped === "worldwide" || shipped.includes(co);
      })
    );
  }

  return results;
}

export interface QuizAnswers {
  needs: string[];
  seated?: string;
  sensory: string[];
  fastenings: string[];
  clothing: string[];
  location?: string;
  styles: string[];
  budget?: string;
}

export interface BrandMatch {
  brand: Brand;
  /** Overall match 0–100, or null when the quiz was fully skipped. */
  percent: number | null;
  /** Style overlap 0–100, or null when no styles were chosen. */
  stylePercent: number | null;
  /** Human-readable reasons this brand fits. */
  reasons: string[];
}

const fasteningKeywords: Record<string, { keyword: string; reason: string }> = {
  "Magnetic buttons": { keyword: "magnetic", reason: "Magnetic closures" },
  Velcro: { keyword: "velcro", reason: "Velcro fastenings" },
  "Easy zippers": { keyword: "zipper", reason: "Easy zipper pulls" },
  "Slip-on / no fastenings": { keyword: "slip-on", reason: "Slip-on designs" },
};

function brandHasFeature(brand: Brand, keyword: string): boolean {
  const k = keyword.toLowerCase();
  return brand.adaptiveFeatures.some((f) => f.toLowerCase().includes(k));
}

/**
 * Scores a brand against quiz answers. Each answered question contributes a
 * weighted fraction; skipped questions are excluded so partial quizzes still
 * produce honest percentages.
 */
export function scoreBrand(brand: Brand, answers: QuizAnswers): BrandMatch {
  const reasons: string[] = [];
  let weightTotal = 0;
  let weightedScore = 0;

  function component(weight: number, fraction: number) {
    weightTotal += weight;
    weightedScore += weight * fraction;
  }

  if (answers.needs.length > 0) {
    const matched = answers.needs.filter((n) =>
      brand.disabilityTypes.some((d) => d.toLowerCase().includes(n.toLowerCase().split(" ")[0]))
    );
    component(30, matched.length / answers.needs.length);
    if (matched.length > 0) reasons.push(`Designed for ${matched[0].toLowerCase()}`);
  }

  if (answers.seated && answers.seated.startsWith("Yes")) {
    const has = brandHasFeature(brand, "seated") || brandHasFeature(brand, "back rise");
    component(10, has ? 1 : 0);
    if (has) reasons.push("Seated-fit cuts for wheelchair users");
  }

  const sensory = answers.sensory.filter((s) => s !== "No sensory preferences");
  if (sensory.length > 0) {
    const has =
      brandHasFeature(brand, "sensory") ||
      brandHasFeature(brand, "tag-free") ||
      brandHasFeature(brand, "flat") ||
      brandHasFeature(brand, "soft");
    component(10, has ? 1 : 0);
    if (has) reasons.push("Sensory-friendly fabrics & finishes");
  }

  const fastenings = answers.fastenings.filter((f) => f !== "No preference");
  if (fastenings.length > 0) {
    const matched = fastenings.filter((f) => {
      const def = fasteningKeywords[f];
      return def ? brandHasFeature(brand, def.keyword) : false;
    });
    component(15, matched.length / fastenings.length);
    matched.slice(0, 2).forEach((f) => reasons.push(fasteningKeywords[f].reason));
  }

  if (answers.clothing.length > 0) {
    const matched = answers.clothing.filter((c) =>
      brand.clothingTypes.some((t) => t.toLowerCase().includes(c.toLowerCase()))
    );
    component(10, matched.length / answers.clothing.length);
    if (matched.length > 0) reasons.push(`Stocks ${matched.slice(0, 2).join(" & ").toLowerCase()}`);
  }

  if (answers.location) {
    const ships = brand.shipping.countries.some(
      (c) => c.toLowerCase() === "worldwide" || c.toLowerCase().includes(answers.location!.toLowerCase())
    );
    component(15, ships ? 1 : 0);
    if (ships) reasons.push(`Ships to ${answers.location}`);
  }

  if (answers.budget && answers.budget !== "No limit") {
    const sym = answers.budget.split(" ")[0];
    const fits = brand.priceRange === sym || brand.priceRange.includes("–");
    component(5, fits ? 1 : 0);
    if (fits) reasons.push("Within your budget");
  }

  let stylePercent: number | null = null;
  if (answers.styles.length > 0) {
    const matched = answers.styles.filter((s) => brand.styleTags.includes(s));
    stylePercent = Math.round((matched.length / answers.styles.length) * 100);
    component(15, matched.length / answers.styles.length);
    if (matched.length > 0) reasons.push(`Matches your ${matched[0].toLowerCase()} style`);
  }

  const percent =
    weightTotal === 0 ? null : Math.round((weightedScore / weightTotal) * 100);

  if (reasons.length === 0) {
    reasons.push(`Trusted adaptive label from ${brand.country}`);
  }

  return { brand, percent, stylePercent, reasons };
}

/** Ranks all brands for a set of quiz answers, best match first. */
export function matchBrands(answers: QuizAnswers): BrandMatch[] {
  return brands
    .map((b) => scoreBrand(b, answers))
    .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0));
}
