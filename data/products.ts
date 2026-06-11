import { Brand } from "@/types";
import { brands, QuizAnswers } from "./brands";
import { clothingCategories, quizClothingOptions } from "./categories";

export interface Product {
  id: string;
  name: string;
  brandId: string;
  /** Display clothing type, e.g. "Polo shirt". */
  clothingType: string;
  /** Clothing category id (data/categories.ts). */
  categoryId: string;
  priceRange: string;
  /** Local illustration tile (always present; also the fallback). */
  image: string;
  /** Verified remote listing photo from the brand, when available. */
  imageUrl?: string;
  /** Verified link to the exact product page, when available. */
  productUrl?: string;
  description: string;
  /** Plain-language accessibility explanation for the detail page. */
  accessibilityNote: string;
  adaptiveFeatures: string[];
  /** Disability / accessibility needs this item serves. */
  bestFor: string[];
  styleTags: string[];
  gender: "Men" | "Women" | "Unisex";
  sizes: string[];
  availability: ("Online" | "In stores")[];
  featured?: boolean;
}

const S = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const products: Product[] = [
  {
    id: "tommy-magnetic-polo",
    name: "Magnetic Button Polo Shirt",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Polo shirt",
    categoryId: "shirts",
    priceRange: "$$",
    image: "/images/prod-tommy-magnetic-polo.svg",
    imageUrl:
      "https://shoptommy.scene7.com/is/image/ShopTommy/78J9182_XLG_FNT",
    productUrl:
      "https://usa.tommy.com/en/tommy-adaptive/mens-adaptive/tops/classic-stretch-polo/78J9182-XLG.html",
    description:
      "The iconic Tommy polo with hidden magnets behind the placket — it looks buttoned, but closes itself in seconds.",
    accessibilityNote:
      "Magnets are sewn behind classic buttons, so the polo fastens with a single press — no pinching, twisting or fine grip needed. The placket lies flat and stays put all day.",
    adaptiveFeatures: ["Magnetic closures", "One-handed dressing", "Easy-care cotton"],
    bestFor: ["One-handed dressing", "Limited dexterity", "Arthritis"],
    styleTags: ["Casual", "Smart casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "tommy-seated-chinos",
    name: "Seated-Fit Chino Pants",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Chinos",
    categoryId: "pants",
    priceRange: "$$",
    image: "/images/prod-tommy-seated-chinos.svg",
    imageUrl:
      "https://shoptommy.scene7.com/is/image/ShopTommy/7T00417_615_main",
    productUrl:
      "https://usa.tommy.com/en/tommy-adaptive/mens-adaptive/bottoms/seated-fit-classic-chino/78D1836-SPN.html",
    description:
      "Classic chinos re-cut for sitting: higher back rise, lower front rise and a velcro-adjustable waist.",
    accessibilityNote:
      "The seated cut keeps the waistband level when you're sitting — no gap at the back, no pressure at the front — and side velcro tabs adjust the fit without a belt.",
    adaptiveFeatures: ["Seated fit", "Velcro waist tabs", "Side-opening"],
    bestFor: ["Wheelchair users", "Seated comfort"],
    styleTags: ["Smart casual", "Clean / minimal", "Old money"],
    gender: "Men",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "tommy-magnetic-jacket",
    name: "Magnetic Zip Hooded Jacket",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Jacket",
    categoryId: "jackets",
    priceRange: "$$",
    image: "/images/prod-tommy-magnetic-jacket.svg",
    description:
      "A water-repellent hooded jacket whose zipper self-aligns with magnets — start it one-handed, every time.",
    accessibilityNote:
      "The magnetic zipper base snaps into alignment on its own, removing the hardest part of zipping a jacket. An extended pull works with a closed fist or weak grip.",
    adaptiveFeatures: ["Magnetic zipper", "One-handed dressing", "Extended pulls"],
    bestFor: ["One-handed dressing", "Fine motor difficulties", "Stroke survivors"],
    styleTags: ["Casual", "Sporty", "Streetwear"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "tommy-wrap-dress",
    name: "Magnetic Wrap Dress",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Dress",
    categoryId: "dresses",
    priceRange: "$$",
    image: "/images/prod-tommy-wrap-dress.svg",
    description:
      "A jersey wrap dress that fastens with concealed magnets and skips the fiddly ties.",
    accessibilityNote:
      "The wrap silhouette opens fully flat for easy dressing — seated or assisted — and magnets replace ties and hooks entirely.",
    adaptiveFeatures: ["Magnetic closures", "Opens fully flat", "Soft jersey"],
    bestFor: ["Limited dexterity", "Seated dressing", "Carer-assisted dressing"],
    styleTags: ["Clean / minimal", "Smart casual"],
    gender: "Women",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "iz-seated-jeans",
    name: "Seated-Fit Jeans",
    brandId: "iz-adaptive",
    clothingType: "Jeans",
    categoryId: "jeans",
    priceRange: "$$$",
    image: "/images/prod-iz-seated-jeans.svg",
    imageUrl:
      "https://izadaptive.com/cdn/shop/files/MPT035_GC_jeans_Black__0342_0046.jpg?v=1769662388",
    productUrl:
      "https://izadaptive.com/products/game-changer-seamless-back-jeans-for-men",
    description:
      "IZ's signature jeans, patterned entirely from the seated position — the gold standard of wheelchair denim.",
    accessibilityNote:
      "A high back rise and low front rise keep coverage and comfort while seated, with no back pockets to cause pressure sores and flat inner seams that never dig in.",
    adaptiveFeatures: ["Seated fit", "High back rise", "No back pockets", "Flat seams"],
    bestFor: ["Wheelchair users", "Pressure-sore prevention", "Spinal cord injuries"],
    styleTags: ["Casual", "Clean / minimal", "Vintage"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "iz-seated-blazer",
    name: "Seated-Fit Blazer",
    brandId: "iz-adaptive",
    clothingType: "Blazer",
    categoryId: "formal",
    priceRange: "$$$",
    image: "/images/prod-iz-seated-blazer.svg",
    description:
      "A tailored blazer cropped at the back and cut for arm reach — boardroom-sharp from a seated position.",
    accessibilityNote:
      "The back is shortened so fabric doesn't bunch against the chair, shoulders are cut for pushing wheels, and the front buttons sit where seated arms can actually reach.",
    adaptiveFeatures: ["Seated-fit tailoring", "Shortened back", "Reach-friendly buttons"],
    bestFor: ["Wheelchair users", "Professional wear", "Seated comfort"],
    styleTags: ["Formal", "Old money", "Smart casual"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "iz-wrap-skirt",
    name: "Easy Wrap Skirt",
    brandId: "iz-adaptive",
    clothingType: "Skirt",
    categoryId: "dresses",
    priceRange: "$$$",
    image: "/images/prod-iz-wrap-skirt.svg",
    description:
      "A polished wrap skirt that lays completely flat, then fastens at the front with easy-reach closures.",
    accessibilityNote:
      "Because the skirt opens fully flat, it can be dressed seated or lying down without lifting hips; the closure sits at the front where it's visible and reachable.",
    adaptiveFeatures: ["Opens fully flat", "Front-placed fastenings", "Seated length"],
    bestFor: ["Wheelchair users", "Seated dressing", "Carer-assisted dressing"],
    styleTags: ["Formal", "Old money", "Clean / minimal"],
    gender: "Women",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "iz-dress-pants",
    name: "Front-Fastening Dress Pants",
    brandId: "iz-adaptive",
    clothingType: "Dress pants",
    categoryId: "pants",
    priceRange: "$$$",
    image: "/images/prod-iz-dress-pants.svg",
    description:
      "Sharp dress pants with a seated cut and fastenings moved to the front where you can reach them.",
    accessibilityNote:
      "All closures sit front and centre — no reaching behind — with an elasticated back waist and a cut that keeps the crease straight while seated.",
    adaptiveFeatures: ["Seated fit", "Front-placed fastenings", "Elasticated waistband"],
    bestFor: ["Wheelchair users", "Professional wear", "Limited reach"],
    styleTags: ["Formal", "Smart casual", "Old money"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "zappos-nike-flyease",
    name: "Nike FlyEase Easy-Entry Sneakers",
    brandId: "zappos-adaptive",
    clothingType: "Sneakers",
    categoryId: "shoes",
    priceRange: "$$",
    image: "/images/prod-zappos-nike-flyease.svg",
    imageUrl:
      "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8ec2a797-0b0c-4b29-b1b8-9204b901a803/NIKE+GO+FLYEASE.png",
    productUrl:
      "https://www.nike.com/t/go-flyease-womens-easy-on-off-shoes-LGmqKx",
    description:
      "Nike's hands-free FlyEase system: step in, the heel folds closed behind you. No hands, no laces.",
    accessibilityNote:
      "The collapsible heel lets you step in standing or seated and the shoe snaps itself shut — genuinely hands-free entry, with Nike performance underneath.",
    adaptiveFeatures: ["Hands-free entry", "Easy-entry", "No-tie design"],
    bestFor: ["One-handed dressing", "Limited dexterity", "Limited reach"],
    styleTags: ["Sporty", "Streetwear", "Casual"],
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    availability: ["Online"],
    featured: true,
  },
  {
    id: "zappos-slipon-sneakers",
    name: "Wide-Fit Slip-On Sneakers",
    brandId: "zappos-adaptive",
    clothingType: "Sneakers",
    categoryId: "shoes",
    priceRange: "$",
    image: "/images/prod-zappos-slipon-sneakers.svg",
    imageUrl:
      "https://m.media-amazon.com/images/I/714J8RVCV8L._SX700_.jpg",
    productUrl:
      "https://www.zappos.com/p/womens-skechers-performance-go-walk-flex-dacey-hands-free-slip-ins/product/9930275",
    description:
      "Stretchy slip-on sneakers in wide and extra-wide fits — kind to orthotics, swelling and AFOs.",
    accessibilityNote:
      "A wide stretch opening and removable insole make room for orthotics and swelling, and there are no fastenings to manage at all.",
    adaptiveFeatures: ["Slip-on", "Wide fit", "Removable insole"],
    bestFor: ["Diabetes foot care", "Orthotic users", "Elderly dressers"],
    styleTags: ["Casual", "Sporty"],
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL", "2XL"],
    availability: ["Online"],
  },
  {
    id: "zappos-sensory-tee",
    name: "Sensory-Friendly Crew T-shirt",
    brandId: "zappos-adaptive",
    clothingType: "T-shirt",
    categoryId: "tshirts",
    priceRange: "$",
    image: "/images/prod-zappos-sensory-tee.svg",
    description:
      "A buttery-soft crew tee with printed labels, flat seams and nothing that scratches, rubs or rustles.",
    accessibilityNote:
      "Labels are printed, not sewn; seams are flat-locked and shoulder seams are smooth — designed with and for sensory-sensitive wearers.",
    adaptiveFeatures: ["Tag-free", "Flat seams", "Sensory-friendly fabric"],
    bestFor: ["Sensory sensitivity", "Autism spectrum", "Everyday comfort"],
    styleTags: ["Casual", "Clean / minimal", "Sporty"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
    featured: true,
  },
  {
    id: "zappos-seamless-socks",
    name: "Seamless Diabetic Socks",
    brandId: "zappos-adaptive",
    clothingType: "Socks",
    categoryId: "accessories",
    priceRange: "$",
    image: "/images/prod-zappos-seamless-socks.svg",
    description:
      "Non-binding, truly seamless socks that protect sensitive and diabetic feet without sliding down.",
    accessibilityNote:
      "A linked toe removes the seam entirely and the non-binding cuff keeps circulation free — essential for diabetic and neuropathic feet.",
    adaptiveFeatures: ["Seamless toe", "Non-binding cuff", "Sensory-friendly"],
    bestFor: ["Diabetes foot care", "Sensory sensitivity", "Neuropathy"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    availability: ["Online"],
  },
  {
    id: "zappos-pullon-joggers",
    name: "Easy Pull-On Joggers",
    brandId: "zappos-adaptive",
    clothingType: "Joggers",
    categoryId: "sportswear",
    priceRange: "$",
    image: "/images/prod-zappos-pullon-joggers.svg",
    description:
      "Soft fleece joggers with a wide elastic waist and grab-friendly loops — on in one motion.",
    accessibilityNote:
      "The wide waistband stretches over hips without a fastener in sight, and discreet loops give weak grips something to pull against.",
    adaptiveFeatures: ["Easy pull-on", "Elastic waistband", "Pull loops"],
    bestFor: ["Limited dexterity", "Elderly dressers", "Everyday comfort"],
    styleTags: ["Sporty", "Casual", "Streetwear"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "able2wear-openback-top",
    name: "Open-Back Jersey Top",
    brandId: "able2wear",
    clothingType: "Top",
    categoryId: "tops",
    priceRange: "$$",
    image: "/images/prod-able2wear-openback-top.svg",
    description:
      "A soft jersey top that overlaps at the back — dignified assisted dressing without lifting arms overhead.",
    accessibilityNote:
      "The back panels overlap generously so the top goes on from the front without raising arms — invisible from the front, invaluable for carers.",
    adaptiveFeatures: ["Open-back", "Assisted dressing", "Soft jersey"],
    bestFor: ["Carer-assisted dressing", "Stroke survivors", "Limited arm mobility"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Women",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "able2wear-side-trousers",
    name: "Side-Opening Trousers",
    brandId: "able2wear",
    clothingType: "Trousers",
    categoryId: "pants",
    priceRange: "$$",
    image: "/images/prod-able2wear-side-trousers.svg",
    description:
      "Smart everyday trousers that open fully down each side for catheter access and seated dressing.",
    accessibilityNote:
      "Full-length side zips mean the trousers can be fitted without standing, and give discreet access for catheter and PEG care.",
    adaptiveFeatures: ["Side-opening", "Catheter access", "Elasticated waistband"],
    bestFor: ["Catheter users", "Wheelchair users", "Carer-assisted dressing"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "able2wear-openback-cardigan",
    name: "Open-Back Cardigan",
    brandId: "able2wear",
    clothingType: "Cardigan",
    categoryId: "tops",
    priceRange: "$$",
    image: "/images/prod-able2wear-openback-cardigan.svg",
    description:
      "A warm, classic cardigan with a discreet open back — easy warmth for wheelchair users and care settings.",
    accessibilityNote:
      "Goes on from the front like a jacket and overlaps behind, so there's no wrestling sleeves behind the back — while looking like any other cardigan.",
    adaptiveFeatures: ["Open-back", "Front-opening", "Machine washable"],
    bestFor: ["Care home residents", "Limited arm mobility", "Carer-assisted dressing"],
    styleTags: ["Casual", "Vintage", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "able2wear-nightdress",
    name: "Iona Open-Back Nightie",
    brandId: "able2wear",
    clothingType: "Nightwear",
    categoryId: "underwear",
    priceRange: "$$",
    image: "/images/prod-able2wear-nightdress.svg",
    productUrl:
      "https://able2wear.co.uk/product/iona-nightie-full-back-and-shoulder-opening/",
    description:
      "Able2Wear's Iona nightie with full back and shoulder openings — comfort and dignity through the night.",
    accessibilityNote:
      "Full back and shoulder openings mean dressing happens flat or seated with no overhead pulling, and night-time care doesn't require undressing.",
    adaptiveFeatures: ["Open-back", "Shoulder openings", "Soft brushed fabric"],
    bestFor: ["Care home residents", "Post-surgery recovery", "Carer-assisted dressing"],
    styleTags: ["Clean / minimal"],
    gender: "Women",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "magnaready-dress-shirt",
    name: "Magnetic Dress Shirt",
    brandId: "magnaready",
    clothingType: "Dress shirt",
    categoryId: "shirts",
    priceRange: "$$",
    image: "/images/prod-magnaready-dress-shirt.svg",
    imageUrl:
      "https://magnaready.com/cdn/shop/files/long-sleeve-white-ryan-dress-shirt-magnetic-closures-adaptive-clothing-comfort-style_3.jpg?v=1756660643&width=2048",
    productUrl:
      "https://magnaready.com/products/long-sleeve-white-ryan-dress-shirt-with-magnetic-closures",
    description:
      "The original magnetically infused dress shirt — boardroom crisp, fastened in five seconds flat.",
    accessibilityNote:
      "Every button is backed by a hidden magnet, so the shirt closes with a press of the placket. Cuffs close the same way — no helper, no struggle, no compromise on looks.",
    adaptiveFeatures: ["Magnetic closures", "One-handed dressing", "Stay-flat placket"],
    bestFor: ["Parkinson's", "Arthritis", "One-handed dressing", "Professional wear"],
    styleTags: ["Formal", "Smart casual", "Old money", "Clean / minimal"],
    gender: "Men",
    sizes: S,
    availability: ["Online"],
    featured: true,
  },
  {
    id: "magnaready-stretch-blouse",
    name: "Magnetic Stretch Blouse",
    brandId: "magnaready",
    clothingType: "Blouse",
    categoryId: "tops",
    priceRange: "$$",
    image: "/images/prod-magnaready-stretch-blouse.svg",
    description:
      "A polished stretch blouse with magnetic closures and easy-care fabric that shrugs off wrinkles.",
    accessibilityNote:
      "Magnets do the buttoning while four-way stretch makes sleeves and shoulders forgiving for stiff or painful joints.",
    adaptiveFeatures: ["Magnetic closures", "Stretch fit", "Easy-care fabric"],
    bestFor: ["Arthritis", "Limited dexterity", "Professional wear"],
    styleTags: ["Smart casual", "Formal", "Clean / minimal"],
    gender: "Women",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "billy-zip-hightops",
    name: "Zip-Around High Top Sneakers",
    brandId: "billy-footwear",
    clothingType: "Sneakers",
    categoryId: "shoes",
    priceRange: "$$",
    image: "/images/prod-billy-zip-hightops.svg",
    imageUrl:
      "https://billyfootwear.com/cdn/shop/files/BK23300-004_side_2048x2048_bddd2f5a-fcb6-4236-bc9f-75f6d682a446.jpg?v=1756110917",
    productUrl:
      "https://billyfootwear.com/products/black-white-billy-classic-lace-high-tops",
    description:
      "The cult-favourite high top that unzips all the way around — the whole shoe folds open flat.",
    accessibilityNote:
      "One zipper runs from heel to toe, so the upper folds completely open and your foot drops in — no forcing, perfect with AFOs. Zip back and you're done; laces are just for looks.",
    adaptiveFeatures: ["Zip-around entry", "Lay-open design", "AFO-friendly"],
    bestFor: ["AFO / orthotic users", "Wheelchair users", "One-handed dressing"],
    styleTags: ["Streetwear", "Casual", "Sporty"],
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL", "2XL"],
    availability: ["Online"],
    featured: true,
  },
  {
    id: "billy-zip-lowtops",
    name: "Classic Zip Low Top Sneakers",
    brandId: "billy-footwear",
    clothingType: "Sneakers",
    categoryId: "shoes",
    priceRange: "$$",
    image: "/images/prod-billy-zip-lowtops.svg",
    description:
      "Everyday low tops with the same fold-flat zip entry, in wide fits and clean colourways.",
    accessibilityNote:
      "The zip-around upper opens the whole shoe for easy foot placement, and wide-fit options leave room for orthotics and swelling.",
    adaptiveFeatures: ["Zip-around entry", "Wide fit", "One-handed zipper pull"],
    bestFor: ["Orthotic users", "Limited dexterity", "Everyday comfort"],
    styleTags: ["Casual", "Streetwear", "Clean / minimal"],
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL", "2XL"],
    availability: ["Online"],
  },
  {
    id: "abl-wheelchair-jeans",
    name: "Wheelchair Jeans",
    brandId: "abl-denim",
    clothingType: "Jeans",
    categoryId: "jeans",
    priceRange: "$$",
    image: "/images/prod-abl-wheelchair-jeans.svg",
    description:
      "LA-made premium denim with a seated cut and long side zippers for genuinely easy dressing.",
    accessibilityNote:
      "Extra-long side zippers open the waist wide for seated dressing and catheter access, while the high back rise keeps you covered at the push rim.",
    adaptiveFeatures: ["Seated fit", "High back rise", "Side-opening zippers"],
    bestFor: ["Wheelchair users", "Catheter users", "Seated comfort"],
    styleTags: ["Casual", "Streetwear", "Vintage"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
    featured: true,
  },
  {
    id: "abl-soft-jeans",
    name: "Soft Sensory Jeans",
    brandId: "abl-denim",
    clothingType: "Jeans",
    categoryId: "jeans",
    priceRange: "$$",
    image: "/images/prod-abl-soft-jeans.svg",
    description:
      "Real-look denim in an ultra-soft knit, developed with OTs for people who can't stand stiff jeans.",
    accessibilityNote:
      "The fabric is a brushed stretch knit that looks like rigid denim but feels like sweatpants — tag-free waistband, flat seams, zero break-in.",
    adaptiveFeatures: ["Soft sensory denim", "Tag-free waistband", "Flat seams"],
    bestFor: ["Sensory sensitivity", "Autism spectrum", "Everyday comfort"],
    styleTags: ["Casual", "Streetwear", "Vintage"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "slick-chicks-underwear",
    name: "Side-Fastening Adaptive Underwear",
    brandId: "slick-chicks",
    clothingType: "Underwear",
    categoryId: "underwear",
    priceRange: "$",
    image: "/images/prod-slick-chicks-underwear.svg",
    imageUrl:
      "https://slickchicksonline.com/cdn/shop/files/12.8.19_Ecomm_Shoot0118_1200x630.jpg?v=1735914880",
    productUrl:
      "https://slickchicksonline.com/products/brief",
    description:
      "Patented briefs that fasten at the hips — on and off without standing, lifting or balancing.",
    accessibilityNote:
      "Hook-and-eye side panels open completely, so underwear changes happen seated or lying down, independently or with care — a small design change that restores real dignity.",
    adaptiveFeatures: ["Side-fastening", "One-handed dressing", "Tag-free"],
    bestFor: ["Wheelchair users", "Post-surgery recovery", "Catheter users"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Women",
    sizes: S,
    availability: ["Online"],
    featured: true,
  },
  {
    id: "will-well-magnetic-shirt",
    name: "Magnetic Closure Shirt",
    brandId: "will-well",
    clothingType: "Shirt",
    categoryId: "shirts",
    priceRange: "$$",
    image: "/images/prod-will-well-magnetic-shirt.svg",
    description:
      "Will & Well's breathable everyday shirt with hidden magnetic closures — designed in and for Singapore's climate.",
    accessibilityNote:
      "Magnets replace every button, the fabric is lightweight and breathable for tropical heat, and adjustable straps fine-tune the fit without re-dressing.",
    adaptiveFeatures: ["Magnetic closures", "Breathable fabric", "Adjustable straps"],
    bestFor: ["Limited dexterity", "One-handed dressing", "Hot-climate comfort"],
    styleTags: ["Clean / minimal", "Casual", "Smart casual"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "leaf-breathable-top",
    name: "Breathable Easy-Dressing Top",
    brandId: "leaf-adaptive",
    clothingType: "Top",
    categoryId: "tops",
    priceRange: "$",
    image: "/images/prod-leaf-breathable-top.svg",
    description:
      "LEAF's airy adaptive top, co-designed with occupational therapists for elderly dressers in the tropics.",
    accessibilityNote:
      "Wide openings and an assisted-dressing cut make this easy to put on with or without help, in fabric chosen for hot, humid days.",
    adaptiveFeatures: ["Easy-dressing design", "Breathable fabric", "Assisted dressing"],
    bestFor: ["Elderly dressers", "Carer-assisted dressing", "Hot-climate comfort"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online", "In stores"],
  },
  {
    id: "werable-buckle-dress",
    name: "Easy-Grip Buckle Wrap Shirt Dress",
    brandId: "werable",
    clothingType: "Shirt dress",
    categoryId: "dresses",
    priceRange: "$$$",
    image: "/images/prod-werable-buckle-dress.svg",
    description:
      "Werable's signature wrap shirt dress, fastened with an easy-grip buckle and designed for one-handed dressing.",
    accessibilityNote:
      "The wrap construction lays open flat and closes with a single easy-grip buckle, so the entire dress can be put on and fastened with one hand — designer fashion with the adaptation built invisibly in.",
    adaptiveFeatures: ["Easy-grip buckle", "One-handed dressing", "Opens fully flat"],
    bestFor: ["One-handed dressing", "Limb differences", "Stroke survivors"],
    styleTags: ["Clean / minimal", "Formal", "Smart casual", "Swedish style"],
    gender: "Women",
    sizes: S,
    availability: ["Online", "In stores"],
    featured: true,
  },
  {
    id: "dawn-magnetic-polo",
    name: "Magnetic Polo Tee",
    brandId: "dawn-adaptive",
    clothingType: "Polo shirt",
    categoryId: "shirts",
    priceRange: "$",
    image: "/images/prod-dawn-magnetic-polo.svg",
    description:
      "Dawn Adaptive's affordable magnetic polo — easy independent dressing without the premium price tag.",
    accessibilityNote:
      "Magnetic closures make the placket self-fastening, at a social-enterprise price point that keeps adaptive dressing accessible.",
    adaptiveFeatures: ["Magnetic closures", "Easy independent dressing", "Lightweight fabric"],
    bestFor: ["Limited dexterity", "Budget shoppers", "Independent dressing"],
    styleTags: ["Casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "able-label-velcro-shirt",
    name: "Velcro-Fastening Shirt",
    brandId: "the-able-label",
    clothingType: "Shirt",
    categoryId: "shirts",
    priceRange: "$$",
    image: "/images/prod-able-label-velcro-shirt.svg",
    description:
      "The Able Label's quality British shirt with discreet touch-close Velcro® behind classic buttons.",
    accessibilityNote:
      "Touch-close Velcro® hides behind sewn-on buttons, so the shirt looks completely classic but closes in one smooth press — made for restricted movement and limited finger dexterity.",
    adaptiveFeatures: ["Velcro fastenings", "Discreet adaptive design", "One-handed dressing"],
    bestFor: ["Arthritis", "Limited dexterity", "Stroke survivors"],
    styleTags: ["Casual", "Smart casual", "Vintage"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
  },
  {
    id: "joe-bella-carezips",
    name: "CareZips Side-Zip Pants",
    brandId: "joe-bella",
    clothingType: "Pants",
    categoryId: "pants",
    priceRange: "$$",
    image: "/images/prod-joe-bella-carezips.svg",
    description:
      "Joe & Bella's patented CareZips® pants with three strategic zippers for fast, dignified dressing and care.",
    accessibilityNote:
      "Three zippers — two side, one front — open the pants almost completely, making dressing, toileting and care dramatically easier while looking like everyday chinos.",
    adaptiveFeatures: ["Side-zipper access", "Easy dressing", "Carer-friendly design"],
    bestFor: ["Carer-assisted dressing", "Elderly dressers", "Wheelchair users"],
    styleTags: ["Casual", "Smart casual", "Clean / minimal"],
    gender: "Unisex",
    sizes: S,
    availability: ["Online"],
    featured: true,
  },
  {
    id: "silverts-openback-dress",
    name: "Open-Back Adaptive Dress",
    brandId: "silverts",
    clothingType: "Dress",
    categoryId: "dresses",
    priceRange: "$",
    image: "/images/prod-silverts-openback-dress.svg",
    description:
      "Silverts' classic open-back dress for assisted dressing — a care-setting staple since the brand's earliest days.",
    accessibilityNote:
      "The back overlap opens fully for dressing without standing or lifting arms, while the front stays a complete, classic dress — the original assisted-dressing design.",
    adaptiveFeatures: ["Open-back", "Assisted dressing", "Easy-care fabric"],
    bestFor: ["Care home residents", "Carer-assisted dressing", "Elderly dressers"],
    styleTags: ["Casual", "Vintage"],
    gender: "Women",
    sizes: S,
    availability: ["Online"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBrandOfProduct(product: Product): Brand {
  return brands.find((b) => b.id === product.brandId)!;
}

export function productsOfBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId);
}

export function productsInCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export interface ProductFilterParams {
  query?: string;
  category?: string;
  brand?: string;
  need?: string;
  feature?: string;
  style?: string;
  budget?: string;
  size?: string;
  gender?: string;
  availability?: string;
  location?: string;
}

const norm = (s: string) => s.toLowerCase();

export function searchProducts(params: ProductFilterParams): Product[] {
  let results = [...products];

  if (params.query) {
    const q = norm(params.query);
    const words = q.split(/\s+/).filter(Boolean);
    results = results.filter((p) => {
      const brand = getBrandOfProduct(p);
      const category = clothingCategories.find((c) => c.id === p.categoryId);
      const haystack = norm(
        [
          p.name,
          brand.name,
          p.clothingType,
          category?.name ?? "",
          category?.noun ?? "",
          ...p.adaptiveFeatures,
          ...p.bestFor,
          ...p.styleTags,
        ].join(" ")
      );
      return words.every((w) => haystack.includes(w));
    });
  }

  if (params.category) {
    results = results.filter((p) => p.categoryId === params.category);
  }
  if (params.brand) {
    results = results.filter((p) => p.brandId === params.brand);
  }
  if (params.need) {
    const n = norm(params.need).split(" ")[0];
    results = results.filter(
      (p) =>
        p.bestFor.some((b) => norm(b).includes(n)) ||
        getBrandOfProduct(p).disabilityTypes.some((d) => norm(d).includes(n))
    );
  }
  if (params.feature) {
    const f = norm(params.feature);
    results = results.filter((p) =>
      p.adaptiveFeatures.some((a) => norm(a).includes(f))
    );
  }
  if (params.style) {
    const st = norm(params.style);
    results = results.filter((p) => p.styleTags.some((s) => norm(s).includes(st)));
  }
  if (params.budget) {
    results = results.filter((p) => p.priceRange === params.budget);
  }
  if (params.size) {
    results = results.filter((p) => p.sizes.includes(params.size!));
  }
  if (params.gender) {
    results = results.filter(
      (p) => p.gender === params.gender || p.gender === "Unisex"
    );
  }
  if (params.availability) {
    results = results.filter((p) =>
      p.availability.includes(params.availability as "Online" | "In stores")
    );
  }
  if (params.location) {
    const co = norm(params.location);
    results = results.filter((p) =>
      getBrandOfProduct(p).shipping.countries.some((c) => {
        const shipped = norm(c);
        return shipped === "worldwide" || shipped.includes(co);
      })
    );
  }

  return results;
}

export interface ProductMatch {
  product: Product;
  percent: number | null;
  stylePercent: number | null;
  reasons: string[];
}

const fasteningKeywords: Record<string, { keyword: string; reason: string }> = {
  "Magnetic buttons": { keyword: "magnetic", reason: "Magnetic closures" },
  Velcro: { keyword: "velcro", reason: "Velcro fastenings" },
  "Easy zippers": { keyword: "zip", reason: "Easy zip entry" },
  "Slip-on / no fastenings": { keyword: "slip-on", reason: "Slip-on design" },
};

/**
 * Scores one product against quiz answers. Mirrors the brand scorer but acts
 * on product-level fields; skipped questions are excluded from the denominator.
 */
export function scoreProduct(product: Product, answers: QuizAnswers): ProductMatch {
  const brand = getBrandOfProduct(product);
  const reasons: string[] = [];
  let weightTotal = 0;
  let weightedScore = 0;

  const component = (weight: number, fraction: number) => {
    weightTotal += weight;
    weightedScore += weight * fraction;
  };
  const hasFeature = (kw: string) =>
    product.adaptiveFeatures.some((f) => norm(f).includes(kw));

  if (answers.needs.length > 0) {
    const matched = answers.needs.filter((n) => {
      const key = norm(n).split(" ")[0];
      return (
        product.bestFor.some((b) => norm(b).includes(key)) ||
        brand.disabilityTypes.some((d) => norm(d).includes(key))
      );
    });
    component(30, matched.length / answers.needs.length);
    if (matched.length > 0) reasons.push(`Made for ${norm(matched[0])}`);
  }

  if (answers.seated && answers.seated.startsWith("Yes")) {
    const has = hasFeature("seated") || hasFeature("back rise");
    component(10, has ? 1 : 0);
    if (has) reasons.push("Seated-fit cut");
  }

  const sensory = answers.sensory.filter((s) => s !== "No sensory preferences");
  if (sensory.length > 0) {
    const has =
      hasFeature("sensory") || hasFeature("tag-free") || hasFeature("flat") || hasFeature("soft");
    component(10, has ? 1 : 0);
    if (has) reasons.push("Sensory-friendly finish");
  }

  const fastenings = answers.fastenings.filter((f) => f !== "No preference");
  if (fastenings.length > 0) {
    const matched = fastenings.filter((f) => {
      const def = fasteningKeywords[f];
      return def ? hasFeature(def.keyword) : false;
    });
    component(15, matched.length / fastenings.length);
    matched.slice(0, 2).forEach((f) => reasons.push(fasteningKeywords[f].reason));
  }

  if (answers.clothing.length > 0) {
    const wantedCategories = answers.clothing
      .map((label) => quizClothingOptions.find((o) => o.label === label)?.categoryId)
      .filter(Boolean) as string[];
    const inWanted = wantedCategories.includes(product.categoryId);
    component(10, inWanted ? 1 : 0);
    if (inWanted) reasons.push(`${product.clothingType} — what you're shopping for`);
  }

  if (answers.location) {
    const ships = brand.shipping.countries.some(
      (c) => norm(c) === "worldwide" || norm(c).includes(norm(answers.location!))
    );
    component(15, ships ? 1 : 0);
    if (ships) reasons.push(`Ships to ${answers.location}`);
  }

  if (answers.budget && answers.budget !== "No limit") {
    const sym = answers.budget.split(" ")[0];
    const fits = product.priceRange === sym;
    component(5, fits ? 1 : 0);
    if (fits) reasons.push("Within your budget");
  }

  let stylePercent: number | null = null;
  if (answers.styles.length > 0) {
    const matched = answers.styles.filter((s) => product.styleTags.includes(s));
    stylePercent = Math.round((matched.length / answers.styles.length) * 100);
    component(15, matched.length / answers.styles.length);
    if (matched.length > 0) reasons.push(`Matches your ${norm(matched[0])} style`);
  }

  const percent =
    weightTotal === 0 ? null : Math.round((weightedScore / weightTotal) * 100);

  if (reasons.length === 0) {
    reasons.push(`${brand.name} community favourite`);
  }

  return { product, percent, stylePercent, reasons };
}

/** Ranks the whole catalogue for quiz answers, best first. */
export function matchProducts(answers: QuizAnswers): ProductMatch[] {
  return products
    .map((p) => scoreProduct(p, answers))
    .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0));
}

/** Similar items: same category first, then shared features — other brands preferred. */
export function similarProducts(product: Product, count = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.categoryId === product.categoryId) score += 4;
      if (p.brandId !== product.brandId) score += 2;
      score += p.adaptiveFeatures.filter((f) =>
        product.adaptiveFeatures.some((pf) => norm(pf) === norm(f))
      ).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ p }) => p);
}
