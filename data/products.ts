import { Product, ProductSearchParams } from "@/types";
import { brands } from "@/data/brands";

export const products: Product[] = [
  {
    id: "tommy-adaptive-magnetic-polo",
    name: "Classic Stretch Magnetic Polo",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Tops",
    category: "shirts",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Navy polo shirt styled as an adaptive fashion piece",
    description:
      "A classic polo with a traditional look and concealed magnetic front closures.",
    accessibilityExplanation:
      "The magnetic placket reduces the fine-motor work required to align and fasten small buttons while keeping a familiar polo silhouette.",
    adaptiveFeatures: ["Magnetic closures", "Easy-open neckline", "Soft stretch fabric"],
    disabilityNeeds: ["Limited dexterity", "One-handed dressing", "Arthritis"],
    bestFor: ["One-handed dressing", "Limited hand dexterity"],
    styleTags: ["Classic", "Everyday", "Smart casual"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK", "EU"],
      note: "Online and selected Tommy Hilfiger stores",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Men", "Unisex"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl:
      "https://usa.tommy.com/en/tommy-adaptive/mens-adaptive/tops/polos",
  },
  {
    id: "tommy-adaptive-seated-chinos",
    name: "Adaptive Seated-Fit Chinos",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Pants",
    category: "pants",
    priceRange: "$75-$125",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Neutral tailored trousers displayed for an adaptive clothing catalog",
    description:
      "Polished chinos shaped for seated comfort with an adjustable waist and easier access.",
    accessibilityExplanation:
      "The seated cut adds coverage at the back and reduces excess fabric at the front, helping the trousers sit cleanly while using a wheelchair.",
    adaptiveFeatures: ["Seated fit", "Adjustable waist", "Easy-access closure"],
    disabilityNeeds: ["Wheelchair users", "Limited mobility", "Spinal cord injury"],
    bestFor: ["All-day seated comfort", "Wheelchair users"],
    styleTags: ["Smart casual", "Workwear", "Classic"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK", "EU"],
      note: "Online and selected Tommy Hilfiger stores",
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    genderFit: ["Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://usa.tommy.com/en/tommy-adaptive/mens-adaptive",
  },
  {
    id: "tommy-adaptive-sensory-tee",
    name: "Sensory-Friendly Logo T-Shirt",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Tops",
    category: "tops",
    priceRange: "$25-$50",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Soft cotton T-shirt on a neutral background",
    description:
      "A soft everyday tee with flat seams and a heat-transferred label to reduce irritation.",
    accessibilityExplanation:
      "Flat seams, soft fabric and a label-free neckline reduce common friction and scratching triggers for sensory-sensitive wearers.",
    adaptiveFeatures: ["Tag-free", "Flat seams", "Soft fabric"],
    disabilityNeeds: ["Sensory processing", "Autism", "Skin sensitivity"],
    bestFor: ["Sensory-sensitive wearers", "Low-irritation layering"],
    styleTags: ["Casual", "Minimal", "Everyday"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK", "EU"],
      note: "Online and selected Tommy Hilfiger stores",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men", "Unisex"],
    sensoryFriendly: true,
    seatedFit: false,
    oneHandedDressing: false,
    featured: false,
    productUrl: "https://usa.tommy.com/en/tommy-adaptive",
  },
  {
    id: "iz-game-changer-seamless-jeans",
    name: "Game Changer Seamless Back Jeans",
    brandId: "iz-adaptive",
    clothingType: "Jeans",
    category: "jeans",
    priceRange: "$75-$125",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Blue denim jeans photographed for a fashion catalog",
    description:
      "Wheelchair jeans designed from the seated position with a seamless back and accessible pockets.",
    accessibilityExplanation:
      "Removing bulky back seams and pockets helps reduce pressure points, while the higher back rise maintains coverage in a seated posture.",
    adaptiveFeatures: ["Seamless back", "High back rise", "Accessible front pockets"],
    disabilityNeeds: ["Wheelchair users", "Pressure care", "Limited mobility"],
    bestFor: ["Full-time wheelchair users", "Pressure-sensitive skin"],
    styleTags: ["Denim", "Everyday", "Modern"],
    availability: {
      online: true,
      inStore: false,
      countries: ["Canada", "USA", "UK", "EU", "Australia"],
      note: "Available online from IZ Adaptive",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: false,
    featured: true,
    productUrl:
      "https://izadaptive.com/collections/mens-adaptive-jeans-chinos-for-wheelchair-users",
  },
  {
    id: "iz-seated-fit-blazer",
    name: "Seated-Fit Tailored Blazer",
    brandId: "iz-adaptive",
    clothingType: "Jackets",
    category: "jackets",
    priceRange: "$150+",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Tailored dark blazer in a formal fashion setting",
    description:
      "A modern tailored layer with a shorter front hem and room through the seated back.",
    accessibilityExplanation:
      "The proportion is designed to lie neatly in a wheelchair without bunching at the lap, giving seated wearers a sharper formal silhouette.",
    adaptiveFeatures: ["Seated fit", "Shorter front hem", "Easy-reach fastening"],
    disabilityNeeds: ["Wheelchair users", "Limited mobility"],
    bestFor: ["Formal occasions", "Professional seated wear"],
    styleTags: ["Formal", "Professional", "Tailored"],
    availability: {
      online: true,
      inStore: false,
      countries: ["Canada", "USA", "UK", "EU", "Australia"],
      note: "Available online from IZ Adaptive",
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://izadaptive.com",
  },
  {
    id: "zappos-adaptive-easy-entry-sneakers",
    name: "Easy-Entry Everyday Sneakers",
    brandId: "zappos-adaptive",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Bright low-top sneaker photographed from the side",
    description:
      "A curated easy-entry sneaker option with a wide opening and simple adjustable closure.",
    accessibilityExplanation:
      "A wider opening reduces the need to point or force the foot into the shoe, while the closure can be adjusted with less pinching and pulling.",
    adaptiveFeatures: ["Easy entry", "Wide opening", "Adjustable closure"],
    disabilityNeeds: ["Limited mobility", "Limb differences", "Orthotics"],
    bestFor: ["Easy shoe changes", "AFO and orthotic wearers"],
    styleTags: ["Sporty", "Casual", "Everyday"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA"],
      note: "Online marketplace availability varies by style",
    },
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    genderFit: ["Women", "Men", "Unisex"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://www.zappos.com/c/adaptive",
  },
  {
    id: "zappos-sensory-friendly-hoodie",
    name: "Sensory-Friendly Everyday Hoodie",
    brandId: "zappos-adaptive",
    clothingType: "Tops",
    category: "tops",
    priceRange: "$25-$75",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Soft casual hoodie photographed against an urban background",
    description:
      "A soft, tag-free hoodie selected for low-friction seams and comfortable everyday layering.",
    accessibilityExplanation:
      "The soft interior, minimal labeling and simplified construction help reduce tactile distractions during longer wear.",
    adaptiveFeatures: ["Tag-free", "Soft fabric", "Flat seams"],
    disabilityNeeds: ["Sensory processing", "Autism", "Skin sensitivity"],
    bestFor: ["Sensory-friendly layering", "Relaxed daily wear"],
    styleTags: ["Casual", "Streetwear", "Relaxed"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA"],
      note: "Online marketplace availability varies by style",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men", "Unisex"],
    sensoryFriendly: true,
    seatedFit: false,
    oneHandedDressing: false,
    featured: false,
    productUrl: "https://www.zappos.com/c/adaptive",
  },
  {
    id: "abl-denim-wheelchair-jeans",
    name: "Wheelchair-Fit Adaptive Jeans",
    brandId: "abl-denim",
    clothingType: "Jeans",
    category: "jeans",
    priceRange: "$75-$125",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Folded blue jeans with visible denim texture",
    description:
      "Adaptive denim cut higher in the back and lower in the front for a comfortable seated profile.",
    accessibilityExplanation:
      "The wheelchair-specific rise helps prevent the waistband from digging in or slipping down while seated, with easier dressing details at the waist.",
    adaptiveFeatures: ["Seated fit", "High back rise", "Easy dressing waistband"],
    disabilityNeeds: ["Wheelchair users", "Limited mobility", "Sensory sensitivity"],
    bestFor: ["Wheelchair users", "Comfortable everyday denim"],
    styleTags: ["Denim", "Casual", "Classic"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA"],
      note: "Check current stock through ABL Denim retailers",
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://www.foundla.org/new/abl-denim/",
  },
  {
    id: "billy-classic-lace-high-tops",
    name: "Classic Lace Zip High Tops",
    brandId: "billy-footwear",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "High-top sneakers photographed outdoors",
    description:
      "Fashion high tops with a wraparound zipper that opens the upper and exposes the footbed.",
    accessibilityExplanation:
      "The zipper lets the shoe open much wider than a conventional sneaker, reducing the balance, reach and dexterity needed to put it on.",
    adaptiveFeatures: ["Wraparound zipper", "Wide opening", "Removable insoles"],
    disabilityNeeds: ["AFO users", "Limited dexterity", "Limited mobility"],
    bestFor: ["AFO wearers", "Independent shoe changes"],
    styleTags: ["Streetwear", "Casual", "Sporty"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK"],
      note: "Online and selected footwear stockists",
    },
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    genderFit: ["Women", "Men", "Unisex", "Kids"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://billyfootwear.com",
  },
  {
    id: "billy-goat-afo-shoes",
    name: "BILLY Goat AFO-Friendly Shoes",
    brandId: "billy-footwear",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$75-$125",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Neutral supportive sneaker shown from the side",
    description:
      "Supportive shoes developed for braces, orthotics and prosthetics with extra width options.",
    accessibilityExplanation:
      "The short-wrap zipper and removable insoles create more usable internal space for AFOs while keeping the shoe secure.",
    adaptiveFeatures: ["Short-wrap zipper", "AFO friendly", "Extra-wide options"],
    disabilityNeeds: ["Orthotics", "Limb differences", "Cerebral palsy"],
    bestFor: ["AFO and brace users", "Extra-wide footwear needs"],
    styleTags: ["Sporty", "Outdoor", "Everyday"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK"],
      note: "Online and selected footwear stockists",
    },
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13", "14"],
    genderFit: ["Men", "Unisex"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: false,
    productUrl:
      "https://billyfootwear.com/products/mens-charcoal-billy-goat-afo-friendly-shoes",
  },
  {
    id: "magnaready-ryan-dress-shirt",
    name: "Ryan Magnetic Dress Shirt",
    brandId: "magnaready",
    clothingType: "Shirts",
    category: "formalwear",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Light blue formal dress shirt on a hanger",
    description:
      "A traditional spread-collar shirt with hidden magnetic closures behind the button placket.",
    accessibilityExplanation:
      "Self-aligning magnets replace the repeated pinch-and-thread motion of buttons, making formal dressing more manageable with one hand or tremors.",
    adaptiveFeatures: ["Magnetic closures", "Wrinkle resistant", "Easy-open cuffs"],
    disabilityNeeds: ["Parkinson's", "Arthritis", "Limited dexterity"],
    bestFor: ["One-handed formal dressing", "Tremors and arthritis"],
    styleTags: ["Formal", "Professional", "Classic"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA", "Canada"],
      note: "Available online from MagnaReady",
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Men"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl:
      "https://magnaready.com/products/long-sleeve-light-blue-ryan-dress-shirt-with-magnetic-closures",
  },
  {
    id: "magnaready-magnetic-polo",
    name: "Magnetic Closure Performance Polo",
    brandId: "magnaready",
    clothingType: "Tops",
    category: "shirts",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1625910513413-5fc45e7c8da3?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Smart casual polo shirt photographed on a model",
    description:
      "A polished performance polo with magnetic fasteners and easy-care stretch fabric.",
    accessibilityExplanation:
      "The magnetic neckline can be opened and closed with less finger isolation, supporting more independent dressing.",
    adaptiveFeatures: ["Magnetic closures", "Stretch fabric", "Easy care"],
    disabilityNeeds: ["Limited dexterity", "Parkinson's", "One-handed dressing"],
    bestFor: ["Work and smart-casual wear", "Independent dressing"],
    styleTags: ["Smart casual", "Sporty", "Professional"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA", "Canada"],
      note: "Available online from MagnaReady",
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Men"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: false,
    productUrl: "https://magnaready.com/collections/shirts-and-polos",
  },
  {
    id: "slick-chicks-adaptive-brief",
    name: "Side-Fastening Adaptive Brief",
    brandId: "slick-chicks",
    clothingType: "Underwear",
    category: "underwear",
    priceRange: "$25-$50",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Soft neutral garments arranged for a comfort-focused apparel catalog",
    description:
      "Soft adaptive underwear with side fasteners for seated, standing or assisted dressing.",
    accessibilityExplanation:
      "Both sides open fully, so the brief can be positioned without stepping through leg openings and can support independent or assisted dressing.",
    adaptiveFeatures: ["Side fastenings", "Fully opening design", "Soft stretch fabric"],
    disabilityNeeds: ["Limited mobility", "Wheelchair users", "Post-surgery"],
    bestFor: ["Seated dressing", "Assisted dressing"],
    styleTags: ["Minimal", "Everyday", "Comfort"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada"],
      note: "Online and selected retail partners",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    genderFit: ["Women"],
    sensoryFriendly: true,
    seatedFit: true,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://slickchicksonline.com/products/brief",
  },
  {
    id: "slick-chicks-leakproof-underwear",
    name: "Adaptive Leakproof Underwear",
    brandId: "slick-chicks",
    clothingType: "Underwear",
    category: "underwear",
    priceRange: "$25-$50",
    image:
      "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Soft black apparel fabric photographed in a fashion studio",
    description:
      "Reusable leakproof underwear with side-fastening strips for easier changes.",
    accessibilityExplanation:
      "The fully opening sides support changes from a seated or lying position, while the absorbent layer adds discreet incontinence support.",
    adaptiveFeatures: ["Side fastenings", "Leakproof layer", "Seated dressing"],
    disabilityNeeds: ["Incontinence", "Limited dexterity", "Wheelchair users"],
    bestFor: ["Seated changes", "Dexterity challenges"],
    styleTags: ["Minimal", "Everyday", "Comfort"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA", "Canada"],
      note: "Available online from Slick Chicks",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Women"],
    sensoryFriendly: true,
    seatedFit: true,
    oneHandedDressing: true,
    featured: false,
    productUrl: "https://slickchicksonline.com/products/ui-underwear",
  },
  {
    id: "nike-go-flyease",
    name: "Go FlyEase Hands-Free Sneakers",
    brandId: "nike-flyease",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$100-$150",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern athletic sneakers photographed in a studio",
    description:
      "A hands-free sneaker with a hinged heel that opens for step-in entry and closes underfoot.",
    accessibilityExplanation:
      "The bi-stable hinge allows many wearers to put the shoe on and take it off without using their hands, bending deeply or tying laces.",
    adaptiveFeatures: ["Hands-free entry", "Hinged heel", "No laces"],
    disabilityNeeds: ["Limited mobility", "Limited dexterity", "One-handed dressing"],
    bestFor: ["Hands-free shoe changes", "Limited reach or dexterity"],
    styleTags: ["Sporty", "Streetwear", "Modern"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK", "EU", "Australia"],
      note: "Online and selected Nike stores; stock varies",
    },
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    genderFit: ["Women", "Men", "Unisex"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://www.nike.com/flyease/go-flyease",
  },
  {
    id: "able2wear-open-back-shirt",
    name: "Open-Back Assisted-Dressing Shirt",
    brandId: "able2wear",
    clothingType: "Shirts",
    category: "shirts",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Blue collared shirt photographed for a clothing catalog",
    description:
      "A discreet open-back shirt designed to simplify assisted dressing without sacrificing a conventional front.",
    accessibilityExplanation:
      "The back opens so the garment can be placed around the wearer with less shoulder lifting, twisting or standing transfer.",
    adaptiveFeatures: ["Open back", "Assisted dressing", "Discreet overlap"],
    disabilityNeeds: ["Limited mobility", "Stroke recovery", "Care support"],
    bestFor: ["Assisted dressing", "Reduced shoulder movement"],
    styleTags: ["Classic", "Everyday", "Smart casual"],
    availability: {
      online: true,
      inStore: false,
      countries: ["UK", "Ireland", "EU"],
      note: "Available online from Able2Wear",
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: false,
    featured: false,
    productUrl: "https://www.able2wear.co.uk",
  },
  {
    id: "able2wear-side-opening-trousers",
    name: "Side-Opening Adaptive Trousers",
    brandId: "able2wear",
    clothingType: "Pants",
    category: "pants",
    priceRange: "$50-$100",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Dark tailored trousers photographed for a fashion catalog",
    description:
      "Easy-care trousers with side openings for dressing, personal care and medical access.",
    accessibilityExplanation:
      "Long side openings reduce the need to pull fabric over the feet and hips, making dressing and catheter access easier.",
    adaptiveFeatures: ["Side opening", "Catheter access", "Easy-care fabric"],
    disabilityNeeds: ["Catheter users", "Limited mobility", "Assisted dressing"],
    bestFor: ["Personal care access", "Assisted dressing"],
    styleTags: ["Classic", "Everyday", "Care-ready"],
    availability: {
      online: true,
      inStore: false,
      countries: ["UK", "Ireland", "EU"],
      note: "Available online from Able2Wear",
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: false,
    featured: false,
    productUrl: "https://www.able2wear.co.uk",
  },
  {
    id: "tommy-adaptive-zip-front-dress",
    name: "Adaptive Zip-Front Shirt Dress",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Dresses",
    category: "dresses",
    priceRange: "$100-$150",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Elegant red dress photographed in a fashion boutique",
    description:
      "A polished shirt dress with an easier front opening and adjustable waist details.",
    accessibilityExplanation:
      "The front-opening construction and larger zipper pull reduce overhead dressing and make the garment easier to manage with limited reach or dexterity.",
    adaptiveFeatures: ["Easy front opening", "One-handed zipper pull", "Adjustable waist"],
    disabilityNeeds: ["Limited dexterity", "Limited mobility", "One-handed dressing"],
    bestFor: ["Easier dress changes", "Smart everyday occasions"],
    styleTags: ["Smart casual", "Classic", "Formal"],
    availability: {
      online: true,
      inStore: true,
      countries: ["USA", "Canada", "UK", "EU"],
      note: "Online and selected Tommy Hilfiger stores",
    },
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    genderFit: ["Women"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: false,
    productUrl: "https://usa.tommy.com/en/tommy-adaptive/womens-adaptive",
  },
];

export const clothingTypeOptions = [
  "Tops",
  "Shirts",
  "Pants",
  "Jeans",
  "Shoes",
  "Underwear",
  "Dresses",
  "Jackets",
  "Formalwear",
];

export const disabilityNeedOptions = [
  "Wheelchair users",
  "Limited mobility",
  "Limited dexterity",
  "One-handed dressing",
  "Sensory processing",
  "Autism",
  "Arthritis",
  "Parkinson's",
  "Orthotics",
  "Post-surgery",
];

export const adaptiveFeatureOptions = [
  "Magnetic closures",
  "Seated fit",
  "Easy entry",
  "Open back",
  "Side fastenings",
  "Tag-free",
  "Flat seams",
  "AFO friendly",
  "Hands-free entry",
  "Wide opening",
];

export const styleOptions = [
  "Everyday",
  "Casual",
  "Smart casual",
  "Professional",
  "Formal",
  "Sporty",
  "Streetwear",
  "Classic",
];

export const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "5",
  "7",
  "9",
  "11",
  "13",
];

export const fitOptions = ["Women", "Men", "Unisex", "Kids"];
export const budgetOptions = ["Under $50", "$50-$100", "$100-$150", "$150+"];
export const availabilityOptions = ["Online", "In store"];
export const locationOptions = ["USA", "Canada", "UK", "EU", "Australia"];

export const productCategories = [
  { slug: "tops", label: "Adaptive Tops", description: "Soft, easy-on layers and sensory-friendly essentials." },
  { slug: "shirts", label: "Adaptive Shirts", description: "Magnetic, open-back and easy-fastening shirts." },
  { slug: "pants", label: "Adaptive Pants", description: "Side-opening and seated-comfort trousers." },
  { slug: "jeans", label: "Wheelchair Jeans", description: "Denim designed around a seated body position." },
  { slug: "shoes", label: "Easy-Entry Shoes", description: "Hands-free, zip and AFO-friendly footwear." },
  { slug: "underwear", label: "Adaptive Underwear", description: "Side-opening foundations for easier dressing." },
  { slug: "dresses", label: "Adaptive Dresses", description: "Front-opening and easier-fastening dresses." },
  { slug: "jackets", label: "Adaptive Jackets", description: "Outer layers shaped for reach, comfort and movement." },
  { slug: "formalwear", label: "Formal Adaptive Wear", description: "Polished pieces for work and special occasions." },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByBrand(brandId: string): Product[] {
  return products.filter((product) => product.brandId === brandId);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((product) => {
    if (slug === "formalwear") {
      return (
        product.category === "formalwear" ||
        product.styleTags.includes("Formal") ||
        product.styleTags.includes("Professional")
      );
    }
    return (
      product.category === slug ||
      product.clothingType.toLowerCase() === slug
    );
  });
}

export function getBrandName(brandId: string): string {
  return brands.find((brand) => brand.id === brandId)?.name ?? brandId;
}

function matches(value: string, candidate: string) {
  return value.toLowerCase().includes(candidate.toLowerCase());
}

function budgetMatches(priceRange: string, budget: string) {
  if (budget === "Under $50") return priceRange === "$25-$50";
  if (budget === "$50-$100") return ["$25-$50", "$50-$100"].includes(priceRange);
  if (budget === "$100-$150") return ["$75-$125", "$100-$150"].includes(priceRange);
  if (budget === "$150+") return priceRange === "$150+";
  return true;
}

export function searchProducts(params: ProductSearchParams): Product[] {
  return products.filter((product) => {
    const brand = getBrandName(product.brandId);
    const searchable = [
      product.name,
      brand,
      product.clothingType,
      product.category,
      product.description,
      product.accessibilityExplanation,
      ...product.adaptiveFeatures,
      ...product.disabilityNeeds,
      ...product.bestFor,
      ...product.styleTags,
    ]
      .join(" ")
      .toLowerCase();

    if (params.query) {
      const terms = params.query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every((term) => searchable.includes(term))) return false;
    }
    if (
      params.clothingType &&
      !matches(product.clothingType, params.clothingType) &&
      !matches(product.category, params.clothingType) &&
      !(
        params.clothingType.toLowerCase().includes("formal") &&
        (product.styleTags.includes("Formal") ||
          product.styleTags.includes("Professional"))
      )
    ) {
      return false;
    }
    if (params.brand && !matches(brand, params.brand)) return false;
    if (
      params.disabilityNeed &&
      !product.disabilityNeeds.some((need) => matches(need, params.disabilityNeed!)) &&
      !product.bestFor.some((need) => matches(need, params.disabilityNeed!))
    ) {
      return false;
    }
    if (
      params.adaptiveFeature &&
      !product.adaptiveFeatures.some((feature) =>
        matches(feature, params.adaptiveFeature!)
      )
    ) {
      return false;
    }
    if (
      params.style &&
      !product.styleTags.some((style) => matches(style, params.style!))
    ) {
      return false;
    }
    if (params.budget && !budgetMatches(product.priceRange, params.budget)) return false;
    if (params.size && !product.sizes.includes(params.size)) return false;
    if (params.genderFit && !product.genderFit.includes(params.genderFit)) return false;
    if (params.availability === "Online" && !product.availability.online) return false;
    if (params.availability === "In store" && !product.availability.inStore) return false;
    if (
      params.location &&
      !product.availability.countries.some((country) =>
        matches(country, params.location!)
      )
    ) {
      return false;
    }
    if (params.sensoryFriendly && !product.sensoryFriendly) return false;
    if (params.seatedFit && !product.seatedFit) return false;
    if (params.oneHandedDressing && !product.oneHandedDressing) return false;
    return true;
  });
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.brandId !== product.brandId
    )
    .map((candidate) => {
      let score = 0;
      if (candidate.category === product.category) score += 4;
      if (candidate.clothingType === product.clothingType) score += 3;
      score += candidate.adaptiveFeatures.filter((feature) =>
        product.adaptiveFeatures.includes(feature)
      ).length * 2;
      score += candidate.disabilityNeeds.filter((need) =>
        product.disabilityNeeds.includes(need)
      ).length;
      score += candidate.styleTags.filter((style) =>
        product.styleTags.includes(style)
      ).length;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function recommendProducts(params: {
  needs?: string[];
  styles?: string[];
  budget?: string;
  limit?: number;
}) {
  return products
    .map((product) => {
      const reasons: string[] = [];
      const needs = params.needs ?? [];
      const styles = params.styles ?? [];

      needs.forEach((need) => {
        if (
          product.disabilityNeeds.some((item) => matches(item, need)) ||
          product.bestFor.some((item) => matches(item, need)) ||
          product.adaptiveFeatures.some((item) => matches(item, need))
        ) {
          reasons.push(`Supports ${need.toLowerCase()}`);
        }
      });
      styles.forEach((style) => {
        if (product.styleTags.some((item) => matches(item, style))) {
          reasons.push(`Matches a ${style.toLowerCase()} style`);
        }
      });
      if (params.budget && budgetMatches(product.priceRange, params.budget)) {
        reasons.push(`Fits the ${params.budget.toLowerCase()} budget`);
      }

      return { product, reasons, score: reasons.length };
    })
    .filter((result) => result.score > 0 || (!params.needs?.length && !params.styles?.length))
    .sort((a, b) => b.score - a.score)
    .slice(0, params.limit ?? 6);
}
