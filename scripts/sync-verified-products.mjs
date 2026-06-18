import { writeFile } from "node:fs/promises";

const feeds = [
  {
    brandId: "june-adaptive",
    brandName: "June Adaptive",
    baseUrl: "https://www.juneadaptive.com",
    feedUrl: "https://www.juneadaptive.com/products.json?limit=250",
    currency: "CAD",
    countries: ["Canada", "USA"],
    availability:
      "Official June Adaptive product page. Contact the brand for international delivery.",
  },
  {
    brandId: "iz-adaptive",
    brandName: "IZ Adaptive",
    baseUrl: "https://izadaptive.com",
    feedUrl: "https://izadaptive.com/products.json?limit=250",
    currency: "CAD",
    countries: ["Canada", "USA", "UK", "EU", "Australia", "Worldwide"],
    availability: "Available online from IZ Adaptive with international shipping.",
  },
  {
    brandId: "jam-the-label",
    brandName: "JAM the Label",
    baseUrl: "https://jamthelabel.com",
    feedUrl: "https://jamthelabel.com/products.json?limit=250",
    currency: "SGD",
    countries: ["Singapore", "Australia", "Worldwide"],
    availability:
      "Official JAM the Label product page. Singapore SGD storefront available.",
  },
  {
    brandId: "will-and-well",
    brandName: "Will & Well",
    baseUrl: "https://willandwell.com",
    feedUrl: "https://willandwell.com/products.json?limit=250",
    currency: "SGD",
    countries: ["Singapore"],
    availability: "Available from Singapore-based Will & Well.",
  },
  {
    brandId: "magnaready",
    brandName: "MagnaReady",
    baseUrl: "https://magnaready.com",
    feedUrl: "https://magnaready.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA", "Canada"],
    availability: "Available online from the official MagnaReady store.",
  },
  {
    brandId: "billy-footwear",
    brandName: "BILLY Footwear",
    baseUrl: "https://billyfootwear.com",
    feedUrl: "https://billyfootwear.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA", "Canada", "Australia"],
    availability: "Available online from the official BILLY Footwear store.",
    excludedTags: ["zero_inventory"],
  },
  {
    brandId: "no-limbits",
    brandName: "No Limbits",
    baseUrl: "https://no-limbits.com",
    feedUrl: "https://no-limbits.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA"],
    availability: "Available online from the official No Limbits store.",
  },
  {
    brandId: "slick-chicks",
    brandName: "Slick Chicks",
    baseUrl: "https://slickchicksonline.com",
    feedUrl: "https://slickchicksonline.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA", "Canada", "Worldwide"],
    availability: "Available online from the official Slick Chicks store.",
  },
  {
    brandId: "silverts",
    brandName: "Silvert's",
    baseUrl: "https://www.silverts.com",
    feedUrl: "https://www.silverts.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA", "Canada", "Worldwide"],
    availability: "Available online from the official Silvert's store.",
  },
  {
    brandId: "joe-and-bella",
    brandName: "Joe & Bella",
    baseUrl: "https://joeandbella.com",
    feedUrl: "https://joeandbella.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA"],
    availability: "Available online from the official Joe & Bella store.",
  },
  {
    brandId: "the-able-label",
    brandName: "The Able Label",
    baseUrl: "https://www.theablelabel.com",
    feedUrl: "https://www.theablelabel.com/products.json?limit=250",
    currency: "GBP",
    countries: ["UK", "EU", "Singapore", "Worldwide"],
    availability: "Available online from the official The Able Label store.",
  },
  {
    brandId: "buck-and-buck",
    brandName: "Buck & Buck",
    baseUrl: "https://www.buckandbuck.com",
    feedUrl: "https://www.buckandbuck.com/products.json?limit=250",
    currency: "USD",
    countries: ["USA", "Canada"],
    availability: "Available online from the official Buck & Buck store.",
  },
];

const excludedTerms = [
  "gift card",
  "insurance",
  "consultation",
  "workshop",
  "embroidery:",
  "tote",
  "zip puller",
  "blanket",
  "game",
  "jewellery",
  "necklace",
  "earring",
  "bracelet",
  "bag",
  "alteration",
  "tailoring service",
  "sticker",
  "trucker cap",
  "bucket hat",
  "beanie",
  "bundle",
  "cover",
  "protector",
  "keyring",
  "key ring",
  "scarf",
  "permit",
  "blue badge",
];

const excludedTypes = [
  "gift card",
  "gift cards",
  "insurance",
  "services",
  "workshops",
  "jewellery",
  "games",
  "bags",
  "bag",
  "embroidery",
  "aids & accessories",
  "accessories",
  "hats",
  "wellbeing",
  "daily living aids",
  "homeware",
];

const MIN_IMAGE_EDGE = 800;

function isWearableFashionProduct(product) {
  const title = String(product.title ?? "").toLowerCase();
  const type = String(product.product_type ?? "").toLowerCase();
  const tags = Array.isArray(product.tags)
    ? product.tags.join(" ").toLowerCase()
    : String(product.tags ?? "").toLowerCase();
  const value = `${title} ${type} ${tags}`;

  return /\b(shoes?|boots?|slippers?|sneakers?|footwear|socks?|stockings?|underwear|briefs?|boxers?|pant(y|ies)|bras?|nightgown|pajamas?|pyjamas?|sleepwear|nightshirt|robe|dress(es)?|skirt|jumpsuit|overalls?|jeans?|denim|shorts?|pants?|trousers?|leggings?|sweatpants?|bottoms?|joggers?|jackets?|coats?|bomber|outerwear|cape|poncho|raincoat|shirts?|blouses?|polos?|tops?|tees?|t-shirts?|undershirts?|rash guard|swim|tankini|tank top|camisoles?|cami|sweaters?|hoodies?|jumpers?|pullovers?|sweatshirts?|cardigans?|shawl|muu muu|kaftan|gown|slip|sandal)\b/.test(
    value
  );
}

function selectProductImage(product) {
  const images = (product.images ?? []).filter(
    (image) =>
      image?.src &&
      Number(image.width) >= MIN_IMAGE_EDGE &&
      Number(image.height) >= MIN_IMAGE_EDGE
  );

  // Preserve the official featured image when it is large enough. Otherwise,
  // use the first full-resolution image from the same product listing.
  return images[0] ?? null;
}

const featureRules = [
  [/magnetic|magsnap/i, "Magnetic closures"],
  [/open[- ]back|back overlap|back-overlap/i, "Open-back design"],
  [/side access|side[- ]opening/i, "Side access"],
  [/seated|wheelchair|game changer|seamless back/i, "Seated fit"],
  [/easy[- ]on|easy[- ]dress|easy dressing|effortless dressing|self-dressing/i, "Easy dressing"],
  [/adaptive|accessible clothing|assisted dressing/i, "Adaptive dressing"],
  [/snap closure|snap fasten/i, "Snap closures"],
  [/zip access|easy[- ]zip|front zip|zipper/i, "Zip access"],
  [/pull[- ]on|elastic waist|elasticated waist/i, "Pull-on waist"],
  [/sensory|tag[- ]free/i, "Sensory-friendly"],
  [/seamless toe|flat seam|seamless design/i, "Seamless construction"],
  [/anti[- ]slip|non[- ]slip/i, "Anti-slip grip"],
  [/wide fit|extra wide|edema|swollen feet/i, "Extra-wide fit"],
  [/prosthetic/i, "Prosthetic access"],
  [/medical device|catheter|port access/i, "Medical-device access"],
  [/hanger loop|hangloops/i, "Dressing loops"],
  [/touch[- ]and[- ]close|velcro|hook and loop/i, "Touch-and-close fastening"],
  [/wrap/i, "Wrap opening"],
  [/drawstring/i, "Drawstring adjustment"],
  [/afo|orthotic|leg brace|knee brace/i, "Orthotic-friendly fit"],
  [/wrap zipper|full wrap|short wrap|zip-around|zip around/i, "Wraparound zipper"],
  [/removable insole|removable sockliner/i, "Removable insoles"],
  [/limited dexterity|one or more hands|hand dexterity/i, "Limited-dexterity design"],
  [/flatlock/i, "Flat seams"],
  [/fidget/i, "Built-in sensory tools"],
  [/detachable sleeve|detachable strap|removable sleeve|removable strap/i, "Detachable components"],
  [/raised back waist|higher back|high back/i, "Raised back waist"],
  [/lowered front|low front/i, "Lower front rise"],
  [/leakproof|incontinence/i, "Leak-resistant construction"],
  [/compression/i, "Gentle compression"],
  [/easy touch|easytouch/i, "Easy-touch closure"],
  [/assisted/i, "Assisted dressing design"],
];

function cleanText(html = "") {
  return (html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function compactName(title) {
  return title.split("|")[0].trim();
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function classify(title, productType, tags = "") {
  const type = productType.toLowerCase();
  const value = `${title} ${tags}`.toLowerCase();
  if (/\bshoes?\b|\bboots?\b|\bslippers?\b|\bsneakers?\b|\bfootwear\b/.test(value)) return ["Shoes", "shoes"];
  if (/\bsocks?\b|\bleg warmers?\b/.test(value)) return ["Socks", "shoes"];
  if (/\bunderwear\b|\bbriefs?\b|\bboxers?\b|\bbra\b/.test(value)) return ["Underwear", "underwear"];
  if (/\bnightgown\b|\bpajamas?\b|\bsleepwear\b/.test(value)) return ["Nightwear", "nightwear"];
  if (/\bdress\b(?!\s+shirt)|\bskirt\b|\bjumpsuit\b|\boveralls?\b/.test(value)) return ["Dresses", "dresses"];
  if (/\bjeans?\b|\bdenim pants?\b/.test(value)) return ["Jeans", "jeans"];
  if (/\bshorts?\b/.test(value)) return ["Shorts", "pants"];
  if (/\bpants?\b|\btrousers?\b|\bleggings?\b|\bsweatpants?\b|\bbottoms?\b|\bjoggers?\b/.test(value)) return ["Pants", "pants"];
  if (/\bjacket\b|\bcoat\b|\bbomber\b|\bouterwear\b|\bcape\b/.test(value)) return ["Jackets", "jackets"];
  if (/\bshirt\b|\bblouse\b|\bpolo\b/.test(value)) return ["Shirts", "shirts"];
  if (/\btop\b|\btee\b|\bt-shirt\b|\bundershirts?\b|\brash guard\b|\bswim tank\b|\btank top\b|\bcami\b|\bsweater\b|\bhoodie\b|\bjumper\b|\bpullover\b|\bsweatshirt\b/.test(value)) return ["Tops", "tops"];

  if (/footwear|shoe|boot|slipper/.test(type)) return ["Shoes", "shoes"];
  if (/sock/.test(type)) return ["Socks", "shoes"];
  if (/underwear|brief|bra/.test(type)) return ["Underwear", "underwear"];
  if (/nightgown|pajama|sleepwear/.test(type)) return ["Nightwear", "nightwear"];
  if (/dress/.test(type)) return ["Dresses", "dresses"];
  if (/jean/.test(type)) return ["Jeans", "jeans"];
  if (/short/.test(type) && !/short sleeve/.test(type)) return ["Shorts", "pants"];
  if (/pant|trouser|legging|bottom/.test(type)) return ["Pants", "pants"];
  if (/jacket|coat|outerwear|cape/.test(type)) return ["Jackets", "jackets"];
  if (/shirt|blouse|polo/.test(type)) return ["Shirts", "shirts"];
  if (/top|short sleeve|long sleeve|sweater|hoodie|jumper|sweat/.test(type)) {
    return ["Tops", "tops"];
  }

  return ["Clothing", "tops"];
}

function genderFit(text) {
  const value = text.toLowerCase();
  if (/women|women's|femme/.test(value)) return ["Women"];
  if (/men|men's|masc/.test(value)) return ["Men"];
  if (/kid|child|youth|boys|girls/.test(value)) return ["Kids"];
  return ["Unisex"];
}

function priceRange(price) {
  const amount = Number(price);
  if (amount < 50) return "$25-$50";
  if (amount <= 100) return "$50-$100";
  if (amount <= 150) return "$100-$150";
  return "$150+";
}

function sizesFor(product) {
  const sizeOption = product.options?.find((option) =>
    /size/i.test(option.name)
  );
  return sizeOption?.values?.filter(Boolean) ?? [];
}

function styleTags(text, clothingType) {
  const value = text.toLowerCase();
  const tags = [];
  if (/formal|blazer|twill|dress shirt/.test(value)) tags.push("Formal", "Professional");
  if (/denim|jean/.test(value)) tags.push("Denim", "Casual");
  if (/sport|active|hoodie|sweat|cargo/.test(value)) tags.push("Sporty", "Casual");
  if (/linen|knit|soft|lounge|pajama/.test(value)) tags.push("Comfort", "Everyday");
  if (/jacket|dress|shirt/.test(clothingType.toLowerCase())) tags.push("Smart casual");
  if (tags.length === 0) tags.push("Everyday", "Casual");
  return [...new Set(tags)].slice(0, 4);
}

function adaptiveNeeds(features, text) {
  const needs = [];
  if (features.includes("Seated fit")) needs.push("Wheelchair users", "Limited mobility");
  if (
    features.some((feature) =>
      ["Magnetic closures", "Snap closures", "Easy dressing", "Zip access", "Touch-and-close fastening"].includes(feature)
    )
  ) {
    needs.push("Limited dexterity", "Assisted dressing");
  }
  if (features.includes("Sensory-friendly") || features.includes("Seamless construction")) {
    needs.push("Sensory processing", "Skin sensitivity");
  }
  if (features.includes("Extra-wide fit")) needs.push("Edema", "Swollen feet");
  if (features.includes("Anti-slip grip")) needs.push("Fall prevention", "Limited mobility");
  if (
    features.includes("Prosthetic access") ||
    features.includes("Orthotic-friendly fit")
  ) {
    needs.push("Limb differences", "Prosthetic users", "Orthotics and AFOs");
  }
  if (features.includes("Limited-dexterity design")) {
    needs.push("Limited dexterity", "One-handed dressing");
  }
  if (
    features.includes("Built-in sensory tools") ||
    features.includes("Gentle compression") ||
    features.includes("Flat seams")
  ) {
    needs.push("Sensory processing", "Autism");
  }
  if (/arthritis|parkinson/i.test(text)) needs.push("Arthritis", "Parkinson's disease");
  return [...new Set(needs.length ? needs : ["Adaptive dressing", "Limited mobility"])];
}

function productRecord(product, feed) {
  const tags = Array.isArray(product.tags) ? product.tags.join(" ") : String(product.tags ?? "");
  const body = cleanText(product.body_html);
  const fullText = `${product.title} ${product.product_type ?? ""} ${tags} ${body}`;
  const features = featureRules
    .filter(([pattern]) => pattern.test(fullText))
    .map(([, feature]) => feature);
  if (features.length === 0) return null;

  let [clothingType, category] = classify(
    product.title,
    product.product_type ?? "",
    tags
  );
  if (feed.brandId === "billy-footwear") {
    clothingType = "Shoes";
    category = "shoes";
  }
  const price = product.variants?.[0]?.price;
  const description = body
    ? `${body.slice(0, 190).replace(/\s+\S*$/, "")}...`
    : `An individual adaptive ${clothingType.toLowerCase()} item from ${feed.brandName}.`;
  const needs = adaptiveNeeds(features, fullText);
  const exactName = compactName(product.title);
  const productImage = selectProductImage(product);
  if (!productImage) return null;

  return {
    id: `${feed.brandId}-${slug(product.handle)}`,
    name: exactName,
    brandId: feed.brandId,
    clothingType,
    category,
    priceRange: priceRange(price),
    price: price ? String(price) : "",
    currency: feed.currency,
    imageUrl: productImage.src,
    imageAlt: `${exactName} by ${feed.brandName}`,
    description,
    accessibilityExplanation: `The official listing identifies ${features
      .slice(0, 3)
      .join(", ")
      .toLowerCase()} as part of this item's adaptive design. Check the product page for complete fit and care details.`,
    adaptiveFeatures: features.slice(0, 5),
    disabilityNeeds: needs,
    bestFor: needs.slice(0, 3),
    styleTags: styleTags(fullText, clothingType),
    availability: {
      online: true,
      inStore: false,
      countries: feed.countries,
      note: feed.availability,
    },
    shipsTo: feed.countries,
    sizes: sizesFor(product),
    genderFit: genderFit(fullText),
    sensoryFriendly:
      features.includes("Sensory-friendly") ||
      features.includes("Seamless construction"),
    seatedFit: features.includes("Seated fit"),
    oneHandedDressing: features.some((feature) =>
      ["Magnetic closures", "Snap closures", "Zip access", "Touch-and-close fastening"].includes(feature)
    ),
    featured: false,
    productUrl: `${feed.baseUrl}/products/${product.handle}`,
    linkType: "exact-product",
    sourceVerifiedAt: "2026-06-18",
  };
}

async function fetchFeedProducts(feed) {
  const products = [];
  const pageSeparator = feed.feedUrl.includes("?") ? "&" : "?";
  for (let page = 1; page <= 20; page += 1) {
    const response = await fetch(`${feed.feedUrl}${pageSeparator}page=${page}`);
    if (!response.ok) {
      throw new Error(`${feed.brandName} feed failed: ${response.status}`);
    }
    const payload = await response.json();
    const pageProducts = payload.products ?? [];
    if (pageProducts.length === 0) break;
    products.push(...pageProducts);
  }
  return products;
}

async function main() {
  const allProducts = [];

  for (const feed of feeds) {
    const feedProducts = await fetchFeedProducts(feed);
    const candidates = feedProducts
      .filter((product) => {
        const title = product.title.toLowerCase();
        const type = String(product.product_type ?? "").toLowerCase();
        return (
          product.handle &&
          selectProductImage(product) &&
          isWearableFashionProduct(product) &&
          !excludedTerms.some((term) => title.includes(term)) &&
          !excludedTypes.includes(type) &&
          !(feed.excludedTags ?? []).some((tag) =>
            product.tags?.includes(tag)
          )
        );
      })
      .map((product) => productRecord(product, feed))
      .filter(Boolean);

    console.log(
      `${feed.brandName}: ${candidates.length} individual adaptive products from ${feedProducts.length} feed records`
    );
    allProducts.push(...candidates);
  }

  const duplicateIds = allProducts.filter(
    (product, index) =>
      allProducts.findIndex((candidate) => candidate.id === product.id) !== index
  );
  const duplicateUrls = allProducts.filter(
    (product, index) =>
      allProducts.findIndex(
        (candidate) => candidate.productUrl === product.productUrl
      ) !== index
  );
  const missingPrices = allProducts.filter(
    (product) => !product.price || !product.currency
  );
  const missingImages = allProducts.filter((product) => !product.imageUrl);
  if (
    allProducts.length < 700 ||
    duplicateIds.length ||
    duplicateUrls.length ||
    missingPrices.length ||
    missingImages.length
  ) {
    throw new Error(
      `Catalogue validation failed: ${allProducts.length} products, ` +
        `${duplicateIds.length} duplicate IDs, ${duplicateUrls.length} duplicate URLs, ` +
        `${missingPrices.length} missing exact prices, ` +
        `${missingImages.length} missing verified images`
    );
  }

  const output = `import { Product } from "@/types";

// Generated from official brand product feeds on 2026-06-18.
// Run \`node scripts/sync-verified-products.mjs\` to refresh verified URLs,
// images, prices and product availability.
export const verifiedProducts: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

  await writeFile(new URL("../data/verifiedProducts.ts", import.meta.url), output);
  console.log(`Wrote ${allProducts.length} verified individual products.`);
}

await main();
