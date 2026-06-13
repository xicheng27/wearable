export type AdaptiveBrand = {
  id: string;
  name: string;
  country: string;
  website: string;
  singaporeAvailability: string;
  shippingNotes: string;
  categories: string[];
  adaptiveFocus: string[];
  notes: string;
};

export type AdaptiveProduct = {
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
  singaporeAvailability: string;
  adaptiveFeatures: string[];
  bestFor: string[];
  closureType?: string;
  sourceNotes: string;
};

export const adaptiveBrands: AdaptiveBrand[] = [
  {
    id: "will-and-well",
    name: "Will & Well",
    country: "Singapore",
    website: "https://willandwell.com/",
    singaporeAvailability: "Local Singapore brand",
    shippingNotes: "Free local delivery for minimum spend SGD150",
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
  },
  {
    id: "the-able-label",
    name: "The Able Label",
    country: "United Kingdom",
    website: "https://www.theablelabel.com/",
    singaporeAvailability: "Ships to Singapore",
    shippingNotes:
      "Singapore delivery listed as around 8-9 working days; shipping from about S$8 and free shipping from about S$80",
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
      "sleeveless/easy-dressing designs",
      "arthritis-friendly clothing",
      "Parkinson's",
      "stroke",
      "Alzheimer's",
      "assisted dressing",
    ],
    notes:
      "Good for older adults, carers, and users who need discreet adaptive designs.",
  },
  {
    id: "june-adaptive",
    name: "June Adaptive",
    country: "Canada",
    website: "https://www.juneadaptive.com/",
    singaporeAvailability: "Contact brand for international orders",
    shippingNotes:
      "Website states standard shipping is US and Canada; international customers should contact the company",
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
      "Useful brand to display but mark Singapore availability as \"contact for international order,\" not direct shipping.",
  },
  {
    id: "jam-the-label",
    name: "JAM the Label",
    country: "Australia",
    website: "https://jamthelabel.com/",
    singaporeAvailability: "Singapore SGD store available",
    shippingNotes:
      "Singapore currency/store option shown; free shipping on orders over SGD150",
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
      "prosthetic/medical device access",
      "assisted dressing",
      "energy conservation",
    ],
    notes:
      "Strong brand for younger/stylish adaptive fashion. Good for product-level cards.",
  },
  {
    id: "lotus-eldercare-leaf",
    name: "Lotus Eldercare Adaptive Fashion / LEAF",
    country: "Singapore",
    website: "https://www.lotuseldercare.com.sg/index.php/l-e-a-f",
    singaporeAvailability: "Singapore-based initiative",
    shippingNotes: "Not a normal ecommerce store; contact for availability",
    categories: [
      "Adaptive basics",
      "Elderly clothing",
      "Disabled-friendly clothing",
      "Bed-bound patient clothing in development",
    ],
    adaptiveFocus: [
      "elderly dressing",
      "local climate",
      "carers",
      "occupational therapist input",
      "bed-bound users",
    ],
    notes:
      "Add as a local initiative/resource card rather than ecommerce product listing.",
  },
];

// Product records stay empty until exact, verifiable product-level sources are supplied.
export const adaptiveProducts: AdaptiveProduct[] = [];
