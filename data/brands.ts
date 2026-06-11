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
    id: "magnaready",
    name: "MagnaReady",
    tagline: "Magnetic dressing, zero compromise",
    description:
      "MagnaReady pioneered magnetically infused dress shirts for people with limited dexterity — classic workwear looks that close themselves.",
    longDescription:
      "MagnaReady was founded by Maura Horton after her husband, an NC State football coach living with Parkinson's, struggled with shirt buttons on the road. The brand's patented magnetic plackets hide behind classic button fronts, so dress shirts and blouses look traditional but close in seconds with one hand. The range now spans dress shirts, stretch blouses and easy-care workwear staples, machine-washable and designed to lie flat all day.",
    logo: "MR",
    heroColor: "#1F4E79",
    image: "/images/brand-magnaready.svg",
    adaptiveFeatures: [
      "Magnetic button closures",
      "One-handed dressing",
      "Stay-flat plackets",
      "Easy-care fabrics",
      "Stretch fits",
    ],
    disabilityTypes: [
      "Parkinson's disease",
      "Arthritis",
      "Stroke survivors",
      "Fine motor difficulties",
      "Limb differences",
    ],
    clothingTypes: ["Tops", "Formal wear"],
    styleTags: ["Formal", "Smart casual", "Clean / minimal", "Old money"],
    whoItSuits: [
      "Professionals who need sharp workwear",
      "People with limited hand dexterity",
      "One-handed dressers",
      "Anyone with tremors or stiffness",
    ],
    locations: [
      {
        name: "MagnaReady (online)",
        address: "Ships from Providence, RI",
        city: "Providence, RI",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK", "EU"],
      freeShippingThreshold: 75,
      currency: "USD",
      estimatedDays: "3–6 business days",
      returnsPolicy: "Free returns within 30 days, unworn with tags.",
    },
    website: "https://www.magnaready.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2013,
    certifications: ["Arthritis Foundation Ease of Use"],
  },
  {
    id: "billy-footwear",
    name: "Billy Footwear",
    tagline: "Zip in, step out",
    description:
      "Billy Footwear makes universally designed sneakers with a zip-around entry: the whole shoe lays open flat, then zips shut one-handed.",
    longDescription:
      "Co-founded by Billy Price, who became paralyzed from the chest down in college, Billy Footwear builds sneakers around a single idea: the upper unzips all the way around, so the shoe folds completely open and your foot drops in without bending, pulling or wrestling. One zip closes the whole thing — laces are purely decorative. High tops, low tops, wide fits and kids' sizes keep the look mainstream and the function invisible.",
    logo: "BF",
    heroColor: "#C75B12",
    image: "/images/brand-billy-footwear.svg",
    adaptiveFeatures: [
      "Zip-around entry",
      "One-handed zipper pulls",
      "Easy-entry footwear",
      "Wide-fit options",
      "Lay-open flat design",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Cerebral palsy",
      "Limb differences",
      "AFO / orthotic users",
      "Fine motor difficulties",
    ],
    clothingTypes: ["Footwear"],
    styleTags: ["Casual", "Sporty", "Streetwear"],
    whoItSuits: [
      "AFO and orthotic wearers",
      "Seated dressers",
      "Anyone who can't reach or manage laces",
      "Kids and adults who love sneakers",
    ],
    locations: [
      {
        name: "Billy Footwear (online)",
        address: "Ships from Seattle, WA",
        city: "Seattle, WA",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK", "EU", "Australia"],
      freeShippingThreshold: 50,
      currency: "USD",
      estimatedDays: "2–5 business days",
      returnsPolicy: "Free returns within 30 days.",
    },
    website: "https://billyfootwear.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2015,
    certifications: [],
  },
  {
    id: "slick-chicks",
    name: "Slick Chicks",
    tagline: "Underwear that works with you",
    description:
      "Slick Chicks designs side-fastening adaptive underwear that can be put on and taken off without lifting your hips or standing up.",
    longDescription:
      "Slick Chicks started with a simple, overlooked problem: conventional underwear assumes you can stand, balance and pull. Their patented side-fastening briefs open and close at the hips, so they work seated, lying down, post-surgery or with a catheter — restoring privacy and independence in the most personal part of dressing. Soft, tag-free fabrics and flat seams keep them comfortable for all-day wear.",
    logo: "SC",
    heroColor: "#C2417F",
    image: "/images/brand-slick-chicks.svg",
    adaptiveFeatures: [
      "Side-fastening closures",
      "Velcro fastenings",
      "One-handed dressing",
      "Tag-free comfort",
      "Flat seams",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Mobility impairments",
      "Post-surgery recovery",
      "Arthritis",
      "Catheter users",
    ],
    clothingTypes: ["Underwear"],
    styleTags: ["Casual", "Clean / minimal"],
    whoItSuits: [
      "Seated dressers",
      "People recovering from surgery",
      "Catheter users",
      "Carers assisting with dressing",
    ],
    locations: [
      {
        name: "Slick Chicks (online)",
        address: "Ships from New York, NY",
        city: "New York, NY",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "UK"],
      freeShippingThreshold: 40,
      currency: "USD",
      estimatedDays: "3–7 business days",
      returnsPolicy: "Exchanges within 30 days on unopened items.",
    },
    website: "https://www.slickchicksonline.com",
    priceRange: "$",
    country: "USA",
    featured: false,
    founded: 2014,
    certifications: [],
  },
  {
    id: "abl-denim",
    name: "ABL Denim",
    tagline: "Premium denim, seated comfort",
    description:
      "ABL Denim crafts premium adaptive jeans in Los Angeles, with seated cuts, side-zip access and ultra-soft sensory-friendly denim.",
    longDescription:
      "ABL Denim believes great jeans are a right, not a luxury. Cut and sewn in Los Angeles, their denim comes in seated fits with higher back rises and longer side zippers for wheelchair users, plus an ultra-soft sensory line developed with occupational therapists for people with tactile sensitivity. Pockets move where they're useful, seams stay flat, and the wash looks like denim should.",
    logo: "AD",
    heroColor: "#34495E",
    image: "/images/brand-abl-denim.svg",
    adaptiveFeatures: [
      "Seated fit cut",
      "High back rise",
      "Side-opening zippers",
      "Soft sensory denim",
      "Tag-free waistband",
      "Flat seams",
    ],
    disabilityTypes: [
      "Wheelchair users",
      "Sensory processing",
      "Autism spectrum",
      "Mobility impairments",
    ],
    clothingTypes: ["Jeans", "Trousers"],
    styleTags: ["Casual", "Streetwear", "Vintage"],
    whoItSuits: [
      "Full-time wheelchair users who want real denim",
      "Sensory-sensitive denim lovers",
      "Anyone needing side-zip access",
    ],
    locations: [
      {
        name: "ABL Denim Studio (online)",
        address: "Ships from Los Angeles, CA",
        city: "Los Angeles, CA",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "EU", "Australia"],
      freeShippingThreshold: 100,
      currency: "USD",
      estimatedDays: "4–8 business days",
      returnsPolicy: "Returns within 21 days; custom hems final sale.",
    },
    website: "https://abldenim.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2013,
    certifications: ["OT-consulted sensory line"],
  },
  {
    id: "will-well",
    name: "Will & Well",
    tagline: "Dressing with ease, comfort and dignity",
    description:
      "Singapore's pioneering inclusive fashion label, using design thinking and technology to make fashionable apparel that's easier for everybody to wear.",
    longDescription:
      "Will & Well was founded in Singapore on a simple observation: many elements of modern clothing — buttons, back zippers, narrow openings — are inconvenient for people with disabilities. The label applies design thinking and technology to remove those barriers, with magnetic closures, pull-over constructions and adjustable straps built into clothing that looks like fashion first. Their pieces are designed for ease, comfort and dignity in daily dressing, for everybody.",
    logo: "WW",
    heroColor: "#1E6B52",
    image: "/images/brand-will-well.svg",
    adaptiveFeatures: [
      "Magnetic closures",
      "Pull-over designs",
      "Adjustable straps",
      "Easy-dressing patterns",
      "One-handed dressing",
    ],
    disabilityTypes: [
      "Mobility impairments",
      "Fine motor difficulties",
      "Wheelchair users",
      "Elderly / age-related needs",
    ],
    clothingTypes: ["Tops", "Dresses", "Trousers"],
    styleTags: ["Clean / minimal", "Casual", "Smart casual"],
    whoItSuits: [
      "People with limited mobility in a tropical climate",
      "One-handed dressers",
      "Anyone who finds buttons and back-zippers frustrating",
    ],
    locations: [
      {
        name: "Will & Well Studio",
        address: "Orchard Road area",
        city: "Singapore",
        country: "Singapore",
        type: "flagship",
      },
    ],
    shipping: {
      countries: ["Singapore", "Worldwide"],
      currency: "SGD",
      estimatedDays: "1–3 days Singapore, 7–14 international",
      returnsPolicy: "Exchanges within 14 days.",
    },
    website: "https://willandwell.com",
    priceRange: "$$",
    country: "Singapore",
    featured: false,
    founded: 2016,
    certifications: [],
  },
  {
    id: "leaf-adaptive",
    name: "LEAF – Lotus Eldercare Adaptive Fashion",
    tagline: "Adaptive fashion made for the tropics",
    description:
      "A Singapore adaptive clothing line founded by Dr Tan Jit Seng, designing fashionable adaptive clothes suited to a hot local climate.",
    longDescription:
      "LEAF is the brainchild of Dr Tan Jit Seng, who saw how few adaptive options existed for elderly and disabled people in Singapore — and how those that did exist were made for cooler foreign markets. LEAF collaborates with a fashion designer and dressmaker, and consults occupational therapists and caregivers, to create functional, fashionable clothing suited to the local climate, with designs in progress for bed-bound patients. LEAF sells via referral (phone or email) rather than an online shop, so limited product data is available.",
    logo: "LF",
    heroColor: "#4A6B2E",
    image: "/images/brand-leaf-adaptive.svg",
    adaptiveFeatures: [
      "Breathable tropical fabrics",
      "Easy-dressing designs",
      "Carer-assisted dressing",
      "OT-consulted patterns",
    ],
    disabilityTypes: [
      "Elderly / age-related needs",
      "Mobility impairments",
      "Bed-bound patients",
      "Dementia",
    ],
    clothingTypes: ["Tops", "Trousers", "Nightwear"],
    styleTags: ["Casual", "Clean / minimal"],
    whoItSuits: [
      "Elderly dressers in hot climates",
      "Care recipients and their caregivers",
      "Occupational therapy patients",
    ],
    locations: [
      {
        name: "Lotus Eldercare",
        address: "Toa Payoh",
        city: "Singapore",
        country: "Singapore",
        type: "flagship",
      },
    ],
    shipping: {
      countries: ["Singapore"],
      currency: "SGD",
      estimatedDays: "1–3 business days",
      returnsPolicy: "Contact for exchanges.",
    },
    website: "https://www.lotuseldercare.com.sg/index.php/l-e-a-f",
    priceRange: "$",
    country: "Singapore",
    featured: false,
    founded: 2018,
    certifications: ["OT-consulted designs"],
  },
  {
    id: "werable",
    name: "Werable",
    tagline: "Adaptive fashion, as desirable as any other",
    description:
      "Singapore designer label by Claudia Poh creating hands-free and one-handed dressing solutions that belong on a runway, not in a hospital.",
    longDescription:
      "Werable was founded by designer Claudia Poh to make adaptive clothing as desirable as any other branch of fashion. The label empowers people with limited mobility through hands-free dressing systems: magnet-fastened dresses, garments engineered for one-handed dressing, off-shoulder pieces that go on with a single hand, an easy-grip buckle wrap shirt dress and a transformable bolero. Every piece is fashion-first, with the adaptation worked invisibly into the design.",
    logo: "WE",
    heroColor: "#7A5C3A",
    image: "/images/brand-werable.svg",
    adaptiveFeatures: [
      "Magnet-fastened dresses",
      "One-handed dressing",
      "Hands-free dressing systems",
      "Easy-grip buckles",
      "Transformable designs",
    ],
    disabilityTypes: [
      "Limb differences",
      "Stroke survivors",
      "Fine motor difficulties",
      "Mobility impairments",
    ],
    clothingTypes: ["Dresses", "Tops", "Outerwear"],
    styleTags: ["Clean / minimal", "Formal", "Smart casual", "Swedish style"],
    whoItSuits: [
      "One-handed dressers who want designer fashion",
      "People with limited mobility",
      "Anyone tired of clinical-looking adaptive wear",
    ],
    locations: [
      {
        name: "Werable Studio",
        address: "Tanjong Pagar",
        city: "Singapore",
        country: "Singapore",
        type: "flagship",
      },
    ],
    shipping: {
      countries: ["Singapore", "Worldwide"],
      currency: "SGD",
      estimatedDays: "2–4 days Singapore, 7–14 international",
      returnsPolicy: "Returns within 14 days, unworn.",
    },
    website: "https://www.werable.co",
    priceRange: "$$$",
    country: "Singapore",
    featured: false,
    founded: 2020,
    certifications: [],
  },
  {
    id: "dawn-adaptive",
    name: "Dawn Adaptive",
    tagline: "Fashionable, comfortable, affordable",
    description:
      "Malaysia's first adaptive clothing brand and social enterprise — functional dressing solutions that ship across the region, including Singapore.",
    longDescription:
      "Dawn Adaptive is Malaysia's first adaptive clothing brand, run as a social enterprise dedicated to clothing that is fashionable, comfortable and affordable. The range solves real dressing difficulties — magnetic polo tees, wrap dresses and side-zipper pants designed with zippers, Velcro or magnets — for people with dressing difficulties or anyone who simply wants an easier way to get dressed and dress independently.",
    logo: "DA",
    heroColor: "#9C5A1E",
    image: "/images/brand-dawn-adaptive.svg",
    adaptiveFeatures: [
      "Magnetic closures",
      "Side-zipper pants",
      "Velcro fastenings",
      "Easy independent dressing",
    ],
    disabilityTypes: [
      "Mobility impairments",
      "Fine motor difficulties",
      "Elderly / age-related needs",
      "Wheelchair users",
    ],
    clothingTypes: ["Tops", "Dresses", "Trousers"],
    styleTags: ["Casual", "Clean / minimal"],
    whoItSuits: [
      "Budget-conscious adaptive shoppers",
      "Independent dressers in Southeast Asia",
      "Anyone wanting magnetic or side-zip everyday wear",
    ],
    locations: [
      {
        name: "Dawn Adaptive (online)",
        address: "Ships from Kuala Lumpur",
        city: "Kuala Lumpur",
        country: "Malaysia",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["Malaysia", "Singapore", "Worldwide"],
      currency: "MYR",
      estimatedDays: "3–7 business days regional",
      returnsPolicy: "Exchanges within 14 days.",
    },
    website: "https://dawnadaptive.com",
    priceRange: "$",
    country: "Malaysia",
    featured: false,
    founded: 2021,
    certifications: ["Social enterprise"],
  },
  {
    id: "the-able-label",
    name: "The Able Label",
    tagline: "Stylish dressing, made easier since 2014",
    description:
      "British adaptive fashion brand crafting high-quality garments with discreet adaptive designs and innovative fastenings for restricted movement.",
    longDescription:
      "The Able Label has been crafting adaptive wear in Britain since 2014, for people with restricted movement or limited finger dexterity. The emphasis is on quality fabrics and discreet adaptations: shirts, trousers and nightwear using touch-close Velcro® fastenings, pull-on styles and elasticated waistbands that make dressing easier without ever looking medical. The brand now offers improved international shipping, including to Singapore.",
    logo: "AL",
    heroColor: "#3A4E8C",
    image: "/images/brand-the-able-label.svg",
    adaptiveFeatures: [
      "Velcro fastenings",
      "Pull-on styles",
      "Elasticated waistbands",
      "Discreet adaptive designs",
      "One-handed dressing",
    ],
    disabilityTypes: [
      "Fine motor difficulties",
      "Arthritis",
      "Stroke survivors",
      "Parkinson's disease",
      "Elderly / age-related needs",
    ],
    clothingTypes: ["Tops", "Trousers", "Nightwear", "Dresses"],
    styleTags: ["Casual", "Clean / minimal", "Vintage", "Smart casual"],
    whoItSuits: [
      "People with limited finger dexterity",
      "Stroke survivors rebuilding independence",
      "Anyone wanting quality British-made adaptive wear",
    ],
    locations: [
      {
        name: "The Able Label (online)",
        address: "Ships from the UK",
        city: "Bath",
        country: "UK",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["UK", "EU", "Singapore", "Worldwide"],
      freeShippingThreshold: 60,
      currency: "GBP",
      estimatedDays: "1–3 days UK, 5–12 international",
      returnsPolicy: "Free UK returns within 30 days.",
    },
    website: "https://theablelabel.com",
    priceRange: "$$",
    country: "UK",
    featured: false,
    founded: 2014,
    certifications: [],
  },
  {
    id: "joe-bella",
    name: "Joe & Bella",
    tagline: "Getting dressed should never feel like a struggle",
    description:
      "Premium easy-dressing brand reimagining clothing for seniors and people with disabilities — styles that look like your favourites, with features that cooperate.",
    longDescription:
      "Joe & Bella began with the realization that feeling like yourself should be easy, no matter your age or ability — and that getting dressed should never feel like a struggle. Collaborating with top designers, the brand creates clothing that looks like your favourite pieces while quietly incorporating adaptive features: magnetic button shirts, the CareZips® side-zip pants, adaptive hoodies, magnetic cardigans, and compression and gripper socks.",
    logo: "JB",
    heroColor: "#5E3A6B",
    image: "/images/brand-joe-bella.svg",
    adaptiveFeatures: [
      "Magnetic closures",
      "Side-zipper pants",
      "Easy-dressing hoodies",
      "Gripper socks",
      "Carer-assisted designs",
    ],
    disabilityTypes: [
      "Elderly / age-related needs",
      "Mobility impairments",
      "Dementia",
      "Parkinson's disease",
      "Wheelchair users",
    ],
    clothingTypes: ["Tops", "Trousers", "Outerwear", "Socks"],
    styleTags: ["Casual", "Smart casual", "Clean / minimal"],
    whoItSuits: [
      "Seniors who want to keep their style",
      "Caregivers helping someone dress",
      "Anyone needing premium easy-dressing basics",
    ],
    locations: [
      {
        name: "Joe & Bella (online)",
        address: "Ships from Chicago, IL",
        city: "Chicago, IL",
        country: "USA",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "Singapore", "Worldwide"],
      freeShippingThreshold: 75,
      currency: "USD",
      estimatedDays: "3–6 business days US",
      returnsPolicy: "Free returns within 30 days.",
    },
    website: "https://joeandbella.com",
    priceRange: "$$",
    country: "USA",
    featured: false,
    founded: 2021,
    certifications: [],
  },
  {
    id: "silverts",
    name: "Silverts Adaptive Clothing & Footwear",
    tagline: "North America's adaptive original, since 1929",
    description:
      "One of North America's longest-running adaptive retailers, with easy-dressing clothing and footwear for men and women with lowered mobility.",
    longDescription:
      "Founded in 1929, Silverts is one of North America's longest-running adaptive clothing retailers. It designs and distributes adaptive clothing and footwear for men and women, providing easy dressing solutions for people living with lowered mobility: open-back tops and dresses for assisted dressing, magnetic closures, elastic and Velcro fastenings, adaptive pants and pajamas, and non-slip footwear with gripper socks. Ships internationally via its website.",
    logo: "SV",
    heroColor: "#42565C",
    image: "/images/brand-silverts.svg",
    adaptiveFeatures: [
      "Open-back garments",
      "Magnetic closures",
      "Velcro fastenings",
      "Elastic waistbands",
      "Non-slip footwear",
      "Gripper socks",
    ],
    disabilityTypes: [
      "Elderly / age-related needs",
      "Mobility impairments",
      "Wheelchair users",
      "Dementia",
      "Stroke survivors",
    ],
    clothingTypes: ["Tops", "Dresses", "Trousers", "Nightwear", "Footwear", "Socks"],
    styleTags: ["Casual", "Vintage", "Clean / minimal"],
    whoItSuits: [
      "Care home residents and their families",
      "Assisted dressers",
      "Anyone needing the widest adaptive basics range",
    ],
    locations: [
      {
        name: "Silverts (online)",
        address: "Ships from Toronto / Buffalo",
        city: "Toronto, ON",
        country: "Canada",
        type: "online-only",
      },
    ],
    shipping: {
      countries: ["USA", "Canada", "Singapore", "Worldwide"],
      freeShippingThreshold: 100,
      currency: "USD",
      estimatedDays: "3–8 business days",
      returnsPolicy: "Returns within 60 days.",
    },
    website: "https://www.silverts.com",
    priceRange: "$",
    country: "Canada",
    featured: false,
    founded: 1929,
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

export const shippingLocationsList = ["USA", "Canada", "UK", "EU", "Australia", "Singapore"];

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
