import { Product, ProductSearchParams } from "@/types";
import { brands } from "@/data/brands";
import { verifiedProducts } from "@/data/verifiedProducts";

const originalProducts: Product[] = [
  {
    id: "tommy-adaptive-magnetic-polo",
    name: "Classic Stretch Magnetic Polo",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Tops",
    category: "shirts",
    priceRange: "$50-$100",
    price: "35.70",
    currency: "USD",
    imageUrl:
      "https://shoptommy.scene7.com/is/image/ShopTommy/78J9182_XLG_FNT",
    imageAlt: "Tommy Hilfiger Classic Stretch Polo in navy",
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
      "https://usa.tommy.com/en/classic-stretch-polo/78J9182.html",
    linkType: "exact-product",
  },
  {
    id: "tommy-adaptive-seated-chinos",
    name: "Adaptive Seated-Fit Chinos",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Pants",
    category: "pants",
    priceRange: "$75-$125",
    price: "53.70",
    currency: "USD",
    imageUrl:
      "https://shoptommy.scene7.com/is/image/ShopTommy/7T00417_615_main",
    imageAlt: "Tommy Hilfiger Seated Fit Classic Chino in red",
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
    productUrl:
      "https://usa.tommy.com/en/seated-fit-classic-chino/78D1836.html",
    linkType: "exact-product",
  },
  {
    id: "tommy-adaptive-sensory-tee",
    name: "Sensory Tommy Jeans T-Shirt",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Tops",
    category: "tops",
    priceRange: "$25-$50",
    price: "24.75",
    currency: "USD",
    imageUrl: null,
    imageAlt: "Exact Tommy Hilfiger Sensory Friendly Adaptive T-Shirt image unavailable",
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
    productUrl:
      "https://usa.tommy.com/en/tommy-adaptive/mens-adaptive/tops/sensory-tommy-jeans-t-shirt/7T00417-615.html",
    linkType: "exact-product",
  },
  {
    id: "iz-game-changer-seamless-jeans",
    name: "Game Changer Seamless Back Jeans",
    brandId: "iz-adaptive",
    clothingType: "Jeans",
    category: "jeans",
    priceRange: "$75-$125",
    price: "99.00",
    currency: "CAD",
    imageUrl:
      "https://izadaptive.com/cdn/shop/files/MPT035_GC_jeans_Black__0342_0046.jpg?v=1769662388",
    imageAlt: "IZ Adaptive Men's Game Changer Seamless Back Jeans",
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
      "https://izadaptive.com/products/game-changer-seamless-back-jeans-for-men",
    linkType: "exact-product",
  },
  {
    id: "iz-game-changer-seamless-back-chinos",
    name: "Game Changer Seamless Back Chinos",
    brandId: "iz-adaptive",
    clothingType: "Pants",
    category: "pants",
    priceRange: "$100-$150",
    price: "89.00",
    currency: "CAD",
    imageUrl:
      "https://izadaptive.com/cdn/shop/files/IZ_Adaptive_Game_Changer_Chinos_for_men_tan_front.jpg?v=1769663723",
    imageAlt: "IZ Adaptive Men's Game Changer Seamless Back Chinos in tan",
    description:
      "Seated-fit chinos with a seamless back, longer leg and accessible front pockets.",
    accessibilityExplanation:
      "The seamless back reduces pressure points while the seated rise and longer leg are shaped for wheelchair posture.",
    adaptiveFeatures: ["Seamless back", "Seated fit", "Accessible front pockets"],
    disabilityNeeds: ["Wheelchair users", "Pressure care", "Limited mobility"],
    bestFor: ["Professional seated wear", "Pressure-sensitive skin"],
    styleTags: ["Smart casual", "Professional", "Classic"],
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
    productUrl:
      "https://izadaptive.com/products/game-changer-seamless-back-chinos-for-men",
    linkType: "exact-product",
  },
  {
    id: "zappos-adaptive-easy-entry-sneakers",
    name: "SKECHERS Go Walk Flex Dacey Hands Free Slip-Ins",
    brandId: "zappos-adaptive",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$50-$100",
    price: "69.30",
    currency: "USD",
    imageUrl:
      "https://m.media-amazon.com/images/I/714J8RVCV8L._SX700_.jpg",
    imageAlt: "SKECHERS Go Walk Flex Dacey Hands Free Slip-Ins",
    description:
      "A hands-free walking shoe with a molded heel panel and cushioned slip-in construction.",
    accessibilityExplanation:
      "The hands-free heel lets many wearers step into the shoe without bending down or using their hands.",
    adaptiveFeatures: ["Hands-free entry", "Molded heel panel", "Cushioned insole"],
    disabilityNeeds: ["Limited mobility", "Limited dexterity", "One-handed dressing"],
    bestFor: ["Hands-free shoe changes", "Limited reach or dexterity"],
    styleTags: ["Sporty", "Casual", "Everyday"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA"],
      note: "Online marketplace availability varies by style",
    },
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    genderFit: ["Women"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl:
      "https://www.zappos.com/p/womens-skechers-performance-go-walk-flex-dacey-hands-free-slip-ins/product/9930275",
    linkType: "exact-product",
  },
  {
    id: "zappos-see-kai-run-dean-adapt-ii",
    name: "See Kai Run Dean Adapt II",
    brandId: "zappos-adaptive",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$50-$100",
    price: "49.99",
    currency: "USD",
    imageUrl:
      "https://m.media-amazon.com/images/I/71YDq8YloCL._SX700_.jpg",
    imageAlt: "See Kai Run Dean Adapt II adaptive children's shoes",
    description:
      "An adaptive children's sneaker with a wide opening and removable sockliner.",
    accessibilityExplanation:
      "The extra-wide opening and adjustable straps make it easier to fit orthotics and reduce the dexterity needed for shoe changes.",
    adaptiveFeatures: ["Wide opening", "Adjustable straps", "Removable sockliner"],
    disabilityNeeds: ["Orthotics", "Limited dexterity", "Limited mobility"],
    bestFor: ["Children using orthotics", "Easier assisted dressing"],
    styleTags: ["Casual", "Sporty", "Everyday"],
    availability: {
      online: true,
      inStore: false,
      countries: ["USA"],
      note: "Online marketplace availability varies by style",
    },
    sizes: ["8", "9", "10", "11", "12", "13"],
    genderFit: ["Kids"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: false,
    productUrl:
      "https://www.zappos.com/p/see-kai-run-dean-adapt-ii-toddler-little-kid/product/9954985",
    linkType: "exact-product",
  },
  {
    id: "abl-denim-wheelchair-jeans",
    name: "ABL Denim Wheelchair Jeans",
    brandId: "abl-denim",
    clothingType: "Jeans",
    category: "jeans",
    priceRange: "$75-$125",
    price: "92.00",
    currency: "USD",
    imageUrl: null,
    imageAlt: "Exact ABL Denim product image unavailable",
    description:
      "Adaptive denim cut higher in the back and lower in the front for a comfortable seated profile.",
    accessibilityExplanation:
      "The wheelchair-specific rise helps prevent the waistband from digging in or slipping down while seated, with easier dressing details at the waist.",
    adaptiveFeatures: ["Seated fit", "High back rise", "Easy dressing waistband"],
    disabilityNeeds: ["Wheelchair users", "Limited mobility", "Sensory sensitivity"],
    bestFor: ["Wheelchair users", "Comfortable everyday denim"],
    styleTags: ["Denim", "Casual", "Classic"],
    availability: {
      online: false,
      inStore: false,
      countries: ["USA"],
      note: "ABL Denim has closed; this is its archived official price.",
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    genderFit: ["Women", "Men"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: true,
    featured: true,
    productUrl: "https://abldenim.com/",
    linkType: "brand-page-only",
  },
  {
    id: "billy-classic-lace-high-tops",
    name: "Black/White BILLY Classic Lace High",
    brandId: "billy-footwear",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$50-$100",
    price: "55.00",
    currency: "USD",
    imageUrl:
      "https://billyfootwear.com/cdn/shop/files/BK23300-004_side_2048x2048_bddd2f5a-fcb6-4236-bc9f-75f6d682a446.jpg?v=1756110917",
    imageAlt: "Black and white BILLY Classic Lace High shoes",
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
    productUrl:
      "https://billyfootwear.com/products/black-white-billy-classic-lace-high-tops",
    linkType: "exact-product",
  },
  {
    id: "billy-goat-afo-shoes",
    name: "BILLY Goat AFO-Friendly Shoes",
    brandId: "billy-footwear",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$75-$125",
    price: "150.00",
    currency: "USD",
    imageUrl:
      "https://billyfootwear.com/cdn/shop/files/BM23157-021_Side_2048x2048_ad776ea7-4ecc-4992-a51d-31f00ac9440f.jpg?v=1748458556",
    imageAlt: "Men's Charcoal BILLY Goat AFO-friendly shoes",
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
    linkType: "exact-product",
  },
  {
    id: "magnaready-ryan-dress-shirt",
    name: "Long Sleeve White Ryan Dress Shirt",
    brandId: "magnaready",
    clothingType: "Shirts",
    category: "formalwear",
    priceRange: "$50-$100",
    price: "74.99",
    currency: "USD",
    imageUrl:
      "https://magnaready.com/cdn/shop/files/long-sleeve-white-ryan-dress-shirt-magnetic-closures-adaptive-clothing-comfort-style_3.jpg?v=1756660643&width=2048",
    imageAlt: "MagnaReady Long Sleeve White Ryan Dress Shirt",
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
      "https://magnaready.com/products/long-sleeve-white-ryan-dress-shirt-with-magnetic-closures",
    linkType: "exact-product",
  },
  {
    id: "magnaready-burgundy-ryan-shirt",
    name: "Short Sleeve Burgundy Ryan Spread Collar Shirt",
    brandId: "magnaready",
    clothingType: "Shirts",
    category: "formalwear",
    priceRange: "$50-$100",
    price: "34.99",
    currency: "USD",
    imageUrl:
      "https://magnaready.com/cdn/shop/files/short-sleeve-burgundy-micro-check-ryan-spread-collar-cotton-shirt-magnetic-closures-adaptive-clothing_1.jpg?v=1756661145&width=2048",
    imageAlt: "MagnaReady Burgundy Ryan Spread Collar Shirt",
    description:
      "A short-sleeve micro-check cotton shirt with concealed magnetic closures.",
    accessibilityExplanation:
      "Concealed magnetic closures replace small buttons while preserving the look of a conventional spread-collar shirt.",
    adaptiveFeatures: ["Magnetic closures", "Spread collar", "Short sleeves"],
    disabilityNeeds: ["Limited dexterity", "Parkinson's", "One-handed dressing"],
    bestFor: ["Smart-casual dressing", "Independent dressing"],
    styleTags: ["Smart casual", "Classic", "Professional"],
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
    productUrl:
      "https://magnaready.com/products/burgundy-ryan-spread-collar-shirt",
    linkType: "exact-product",
  },
  {
    id: "slick-chicks-adaptive-brief",
    name: "Slick Chicks Brief Panty",
    brandId: "slick-chicks",
    clothingType: "Underwear",
    category: "underwear",
    priceRange: "$25-$50",
    price: "26.00",
    currency: "USD",
    imageUrl:
      "https://slickchicksonline.com/cdn/shop/files/12.8.19_Ecomm_Shoot0118_1200x630.jpg?v=1735914880",
    imageAlt: "Slick Chicks Brief Panty with side fasteners",
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
    linkType: "exact-product",
  },
  {
    id: "slick-chicks-leakproof-underwear",
    name: "Adaptive Leakproof Underwear",
    brandId: "slick-chicks",
    clothingType: "Underwear",
    category: "underwear",
    priceRange: "$25-$50",
    price: "39.00",
    currency: "USD",
    imageUrl:
      "https://slickchicksonline.com/cdn/shop/files/7H1A3994_1200x630.jpg?v=1735916603",
    imageAlt: "Slick Chicks Leakproof Underwear",
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
    linkType: "exact-product",
  },
  {
    id: "nike-go-flyease",
    name: "Nike Go FlyEase Women's Easy On/Off Shoes",
    brandId: "nike-flyease",
    clothingType: "Shoes",
    category: "shoes",
    priceRange: "$100-$150",
    price: "94.97",
    currency: "USD",
    imageUrl:
      "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8ec2a797-0b0c-4b29-b1b8-9204b901a803/NIKE+GO+FLYEASE.png",
    imageAlt: "Nike Go FlyEase Women's Easy On/Off Shoes",
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
    genderFit: ["Women"],
    sensoryFriendly: false,
    seatedFit: false,
    oneHandedDressing: true,
    featured: true,
    productUrl:
      "https://www.nike.com/t/go-flyease-womens-easy-on-off-shoes-LGmqKx",
    linkType: "exact-product",
  },
  {
    id: "able2wear-iona-nightie",
    name: "Iona Nightie with Full Back and Shoulder Opening",
    brandId: "able2wear",
    clothingType: "Nightwear",
    category: "nightwear",
    priceRange: "$50-$100",
    price: "39.96",
    currency: "GBP",
    imageUrl: null,
    imageAlt: "Exact Able2Wear Iona Nightie product image unavailable",
    description:
      "A nightie with full back and shoulder openings for easier assisted dressing.",
    accessibilityExplanation:
      "The full back and shoulder opening reduces lifting and twisting during assisted dressing while maintaining front coverage.",
    adaptiveFeatures: ["Full back opening", "Shoulder opening", "Assisted dressing"],
    disabilityNeeds: ["Limited mobility", "Stroke recovery", "Care support"],
    bestFor: ["Assisted night-time dressing", "Reduced shoulder movement"],
    styleTags: ["Nightwear", "Classic", "Comfort"],
    availability: {
      online: true,
      inStore: false,
      countries: ["UK", "Ireland", "EU"],
      note: "Available online from Able2Wear",
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    genderFit: ["Women"],
    sensoryFriendly: false,
    seatedFit: true,
    oneHandedDressing: false,
    featured: false,
    productUrl:
      "https://able2wear.co.uk/product/iona-nightie-full-back-and-shoulder-opening/",
    linkType: "exact-product",
  },
  {
    id: "able2wear-drop-front-jersey-trousers",
    name: "Drop Front Jersey Wheelchair Trousers",
    brandId: "able2wear",
    clothingType: "Pants",
    category: "pants",
    priceRange: "$50-$100",
    price: "57.00",
    currency: "GBP",
    imageUrl: null,
    imageAlt: "Exact Able2Wear Drop Front Jersey Wheelchair Trousers image unavailable",
    description:
      "Jersey wheelchair trousers with a drop-front opening for dressing and personal care access.",
    accessibilityExplanation:
      "The drop-front construction opens the waist more fully, reducing the need to lift and pull fabric during seated or assisted dressing.",
    adaptiveFeatures: ["Drop-front opening", "Wheelchair fit", "Easy-care jersey"],
    disabilityNeeds: ["Catheter users", "Limited mobility", "Assisted dressing"],
    bestFor: ["Wheelchair dressing", "Personal care access"],
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
    productUrl:
      "https://able2wear.co.uk/product/drop-front-jersey-wheelchair-trousers/",
    linkType: "exact-product",
  },
  {
    id: "tommy-adaptive-zip-front-dress",
    name: "Slim Fit Classic 1985 Polo Dress",
    brandId: "tommy-hilfiger-adaptive",
    clothingType: "Dresses",
    category: "dresses",
    priceRange: "$100-$150",
    price: "59.70",
    currency: "USD",
    imageUrl:
      "https://shoptommy.scene7.com/is/image/ShopTommy/WW45817_ZF0_main",
    imageAlt: "Tommy Hilfiger Slim Fit Classic 1985 Polo Dress",
    description:
      "A classic polo dress with an adaptive magnetic front placket.",
    accessibilityExplanation:
      "The magnetic placket reduces the fine-motor work needed to fasten the polo neckline while preserving a classic silhouette.",
    adaptiveFeatures: ["Magnetic front placket", "Easy neckline", "Stretch fabric"],
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
    productUrl:
      "https://usa.tommy.com/en/tommy-adaptive/womens-adaptive/dresses-skirts/slim-fit-classic-1985-polo-dress/WW45817-ZF0.html",
    linkType: "exact-product",
  },
];

const originalUrls = new Set(originalProducts.map((product) => product.productUrl));

const combinedProducts: Product[] = [
  ...originalProducts,
  ...verifiedProducts.filter((product) => !originalUrls.has(product.productUrl)),
];

function mixProductsByBrand(items: Product[]) {
  const grouped = brands.map((brand) =>
    items.filter((product) => product.brandId === brand.id)
  );
  const mixed: Product[] = [];
  const longest = Math.max(...grouped.map((group) => group.length));

  for (let index = 0; index < longest; index += 1) {
    grouped.forEach((group) => {
      if (group[index]) mixed.push(group[index]);
    });
  }

  return mixed;
}

export const products = mixProductsByBrand(combinedProducts);

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
  }).sort(
    (a, b) =>
      Number(b.linkType === "exact-product") -
      Number(a.linkType === "exact-product")
  );
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
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.candidate.linkType === "exact-product") -
          Number(a.candidate.linkType === "exact-product")
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function recommendProducts(params: {
  needs?: string[];
  styles?: string[];
  budget?: string;
  openEndedNeed?: string;
  limit?: number;
}) {
  const ignoredWords = new Set([
    "about", "after", "also", "and", "because", "clothes", "clothing",
    "could", "easy", "for", "from", "have", "into", "need", "that",
    "the", "their", "them", "this", "want", "while", "with", "would",
  ]);
  const openEndedTerms =
    (params.openEndedNeed ?? "")
      .toLowerCase()
      .match(/[a-z0-9'-]+/g)
      ?.filter((term) => term.length > 2 && !ignoredWords.has(term))
      .slice(0, 20) ?? [];

  return products
    .map((product) => {
      const reasons: string[] = [];
      const needs = params.needs ?? [];
      const styles = params.styles ?? [];
      let score = 0;

      needs.forEach((need) => {
        if (
          product.disabilityNeeds.some((item) => matches(item, need)) ||
          product.bestFor.some((item) => matches(item, need)) ||
          product.adaptiveFeatures.some((item) => matches(item, need))
        ) {
          reasons.push(`Supports ${need.toLowerCase()}`);
          score += 2;
        }
      });
      styles.forEach((style) => {
        if (product.styleTags.some((item) => matches(item, style))) {
          reasons.push(`Matches a ${style.toLowerCase()} style`);
          score += 1;
        }
      });
      if (params.budget && budgetMatches(product.priceRange, params.budget)) {
        reasons.push(`Fits the ${params.budget.toLowerCase()} budget`);
        score += 1;
      }

      if (openEndedTerms.length > 0) {
        const searchable = [
          product.name,
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
        const matchedTerms = openEndedTerms.filter((term) =>
          searchable.includes(term)
        );

        if (matchedTerms.length > 0) {
          score += matchedTerms.length * 2;
          reasons.push(
            `Reflects what you shared about ${matchedTerms.slice(0, 3).join(", ")}`
          );
        }
      }

      return { product, reasons, score };
    })
    .filter(
      (result) =>
        result.score > 0 ||
        (!params.needs?.length &&
          !params.styles?.length &&
          openEndedTerms.length === 0)
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.product.linkType === "exact-product") -
          Number(a.product.linkType === "exact-product")
    )
    .slice(0, params.limit ?? 6);
}
