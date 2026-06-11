/**
 * Generates the illustration tiles in public/images.
 * Each tile is a soft two-tone gradient scene with a minimal line-art glyph,
 * sized 800x520. Swap any file for a real photo (same name, .jpg/.webp) later.
 *
 * Run: node scripts/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const glyphs = {
  hanger: [
    { d: "M12 7a2.2 2.2 0 1 1 2.2-2.2" },
    { d: "M12 7 4.6 12.4a1.9 1.9 0 0 0 1.1 3.4h12.6a1.9 1.9 0 0 0 1.1-3.4L12 7z" },
  ],
  wheelchair: [
    { d: "M13.2 7.2v4.6h4.4l2.6 5.2" },
    { d: "M13.2 9.4h-2.4" },
    { circle: [10.8, 16.2, 4.4] },
    { circle: [18.8, 19.2, 1.5] },
    { circle: [13.2, 4.4, 1.7], fill: true },
  ],
  waves: [
    { d: "M4 8.5c2.7-2 5.3 2 8 0s5.3-2 8 0" },
    { d: "M4 13c2.7-2 5.3 2 8 0s5.3-2 8 0" },
    { d: "M4 17.5c2.7-2 5.3 2 8 0s5.3-2 8 0" },
  ],
  magnet: [
    { d: "M7 4v7a5 5 0 0 0 10 0V4" },
    { d: "M7 4h3.6v4.2H7z" },
    { d: "M13.4 4H17v4.2h-3.6z" },
  ],
  sneaker: [
    { d: "M3 15.4c0-1.2 1-2 2.4-2.2l3.2-3.4c2 1.8 3.8 2.7 6.4 3 2.8.3 6 1.3 6 3.1v1.3a.9.9 0 0 1-.9.9H3.9a.9.9 0 0 1-.9-.9z" },
    { d: "M9.6 11.4l1.4 1.4" },
    { d: "M11.6 9.7l1.4 1.4" },
    { d: "M3.4 18.4h17.2" },
  ],
  hand: [
    { d: "M8.6 12V6a1.4 1.4 0 0 1 2.8 0v5" },
    { d: "M11.4 11V4.8a1.4 1.4 0 0 1 2.8 0V11" },
    { d: "M14.2 11.2V6.4a1.4 1.4 0 0 1 2.8 0v6.8c0 3.8-2.4 6.4-6 6.4-3 0-4.5-1.5-6.2-4.6-.5-1-.3-1.9.5-2.4.7-.4 1.6-.2 2.2.6l1.1 1.4" },
  ],
  bowtie: [
    { d: "M4.5 8.6l5.5 3.4-5.5 3.4z" },
    { d: "M19.5 8.6 14 12l5.5 3.4z" },
    { d: "M10 10.2h4v3.6h-4z" },
  ],
  sun: [
    { circle: [12, 12, 3.4] },
    { d: "M12 4.2v2.2 M12 17.6v2.2 M4.2 12h2.2 M17.6 12h2.2 M6.5 6.5l1.6 1.6 M15.9 15.9l1.6 1.6 M17.5 6.5l-1.6 1.6 M8.1 15.9l-1.6 1.6" },
  ],
  diamond: [
    { d: "M7.6 4.5h8.8L21 9.4 12 19.8 3 9.4z" },
    { d: "M3 9.4h18 M12 19.8 8.6 9.4l1.9-4.9 M12 19.8l3.4-10.4-1.9-4.9" },
  ],
  cap: [
    { d: "M5 13.4a7 7 0 0 1 14 0v.8H5z" },
    { d: "M19 14.2c1.8 0 3 .9 3 2.1" },
    { d: "M12 6.4V5.2" },
  ],
  tie: [
    { d: "M10 4.4h4l-1 2.8 1.8 9L12 19.4l-2.8-3.2 1.8-9z" },
  ],
  tshirt: [
    { d: "M8.4 4.4 4 7.1l1.7 2.9 2-1.1v10.7h8.6V8.9l2 1.1L20 7.1l-4.4-2.7a3.6 3.6 0 0 1-7.2 0z" },
  ],
  bolt: [
    { d: "M13 3.4 5.6 13.6h4.9l-1 7 7.4-10.2H12z" },
  ],
  glasses: [
    { circle: [7.6, 13.8, 3] },
    { circle: [16.4, 13.8, 3] },
    { d: "M10.6 13.8h2.8 M4.6 13.4l-1.6-1.2 M19.4 13.4l1.6-1.2" },
  ],
  blazer: [
    { d: "M12 11.2 8.5 4.6h7z" },
    { d: "M5.4 19.6 8.5 4.6l3.5 6.6 3.5-6.6 3.1 15z" },
  ],
  shirt: [
    { d: "M8.4 4.4 4 7.1l1.7 2.9 2-1.1v10.7h8.6V8.9l2 1.1L20 7.1l-4.4-2.7a3.6 3.6 0 0 1-7.2 0z" },
    { d: "M12 8.8v10.4" },
    { circle: [12, 11.4, 0.35], fill: true },
    { circle: [12, 14.2, 0.35], fill: true },
    { circle: [12, 17, 0.35], fill: true },
  ],
  jacket: [
    { d: "M8.4 4.4 4 7.1l1.7 2.9 2-1.1v10.7h3.4V7.8z" },
    { d: "M15.6 4.4 20 7.1l-1.7 2.9-2-1.1v10.7h-3.4V7.8z" },
    { d: "M8.4 4.4 12 7.8l3.6-3.4" },
  ],
  pants: [
    { d: "M7.5 4.5h9l1.1 15.5h-3.9L12 12.6 10.3 20H6.4z" },
    { d: "M7.7 7.4h8.6" },
  ],
  dress: [
    { d: "M10 4.5h4l-.8 3.2c3 1.6 4.6 5.6 5 11.8H5.8c.4-6.2 2-10.2 5-11.8z" },
    { d: "M8.4 10.6h7.2" },
  ],
  briefs: [
    { d: "M5 8h14v2.6c-3.4.4-5 2.2-5.6 5.4h-2.8C10 12.8 8.4 11 5 10.6z" },
    { d: "M5 8.2h14" },
  ],
  sock: [
    { d: "M9.5 4h5.5v7.2c0 2.9-1.2 4.8-3.4 5.6-2 .7-4.1-.3-4.6-2.1-.4-1.6.7-2.8 2.5-3.5z" },
    { d: "M9.5 6.2H15" },
  ],
};

const tiles = [
  ["hero", "#DCEFE7", "#B7DECC", "#0E5C42", "hanger"],
  ["need-seated", "#DCE9F5", "#B9D2EB", "#1F4E79", "wheelchair"],
  ["need-sensory", "#F3EDE3", "#E3D7C3", "#7A6240", "waves"],
  ["need-fastenings", "#E9E4F2", "#D4CBE7", "#4A3B78", "magnet"],
  ["need-footwear", "#E3EEF0", "#C6DCE1", "#2B5F6B", "sneaker"],
  ["need-onehanded", "#FBEEE5", "#F2D8C6", "#8C4F26", "hand"],
  ["need-formal", "#ECECEF", "#D7D8DE", "#3A3D4D", "bowtie"],
  ["style-minimal", "#F1F1EF", "#E1E1DD", "#4F4F4A", "hanger"],
  ["style-swedish", "#E7F0F4", "#CEE1E9", "#33606F", "sun"],
  ["style-oldmoney", "#F0EBDC", "#DFD4BA", "#6B5B2E", "diamond"],
  ["style-streetwear", "#E5E5E8", "#C8C8CE", "#2E2E33", "cap"],
  ["style-formal", "#EBEDF2", "#D5D9E4", "#2F3A55", "tie"],
  ["style-casual", "#E8F3EA", "#CEE6D5", "#2F6B43", "tshirt"],
  ["style-sporty", "#E3F2EF", "#C3E3DD", "#1D6157", "bolt"],
  ["style-vintage", "#F4ECE1", "#E6D5C0", "#7B5230", "glasses"],
  ["style-smartcasual", "#EDEFEA", "#DADED2", "#4D5A3F", "blazer"],
  ["brand-tommy-hilfiger-adaptive", "#F6E2E4", "#ECC0C6", "#8E1F2F", "tshirt"],
  ["brand-iz-adaptive", "#E9E9E9", "#D1D1D1", "#2C2C2C", "blazer"],
  ["brand-zappos-adaptive", "#DFEAF6", "#BDD4ED", "#0C4B7E", "sneaker"],
  ["brand-able2wear", "#EAE3F4", "#D5C7EB", "#4A1D96", "waves"],
  ["cat-tops", "#E8F3EA", "#CEE6D5", "#2F6B43", "tshirt"],
  ["cat-shirts", "#E2EBF5", "#C3D6EC", "#2A4E7E", "shirt"],
  ["cat-tshirts", "#E2F1F1", "#C2E1E1", "#1F5F5F", "tshirt"],
  ["cat-jackets", "#E9EAEE", "#D2D4DC", "#3B4150", "jacket"],
  ["cat-pants", "#F0EAE2", "#E0D3C2", "#6B5538", "pants"],
  ["cat-jeans", "#E3E7F3", "#C6CEE8", "#2F3D72", "pants"],
  ["cat-dresses", "#F6E8EB", "#ECCDD4", "#8E3A4E", "dress"],
  ["cat-shoes", "#E3EEF0", "#C6DCE1", "#2B5F6B", "sneaker"],
  ["cat-underwear", "#ECE7F4", "#D8CEEB", "#4E3B78", "briefs"],
  ["cat-formal", "#EBEDF2", "#D5D9E4", "#2F3A55", "tie"],
  ["cat-sportswear", "#E3F2EF", "#C3E3DD", "#1D6157", "bolt"],
  ["cat-accessories", "#F2EDE0", "#E3D8BE", "#6F5D2E", "sock"],
  ["brand-magnaready", "#E2EBF5", "#C3D6EC", "#1F4E79", "shirt"],
  ["brand-billy-footwear", "#F6E9DE", "#EDD2B8", "#C75B12", "sneaker"],
  ["brand-slick-chicks", "#F6E5EE", "#ECC6DB", "#C2417F", "briefs"],
  ["brand-abl-denim", "#E7EAEE", "#CDD3DB", "#34495E", "pants"],
  ["brand-will-well", "#E5F1EC", "#C7E3D6", "#1E6B52", "shirt"],
  ["brand-leaf-adaptive", "#EAF2E2", "#D3E5C2", "#4A6B2E", "tshirt"],
  ["brand-werable", "#F1EBE4", "#E2D4C4", "#7A5C3A", "dress"],
  ["brand-dawn-adaptive", "#FBEEE3", "#F3D9C0", "#9C5A1E", "shirt"],
  ["brand-the-able-label", "#E9ECF4", "#D1D8EA", "#3A4E8C", "shirt"],
  ["brand-joe-bella", "#EFE9F1", "#DDD0E2", "#5E3A6B", "pants"],
  ["brand-silverts", "#ECEFF0", "#D6DCDE", "#42565C", "dress"],
];

// Product tiles: one per product, glyph by category, palette cycling.
const productPalette = [
  ["#E8F3EA", "#CEE6D5", "#2F6B43"],
  ["#E2EBF5", "#C3D6EC", "#2A4E7E"],
  ["#F0EAE2", "#E0D3C2", "#6B5538"],
  ["#F6E8EB", "#ECCDD4", "#8E3A4E"],
  ["#ECE7F4", "#D8CEEB", "#4E3B78"],
  ["#E3F2EF", "#C3E3DD", "#1D6157"],
  ["#F2EDE0", "#E3D8BE", "#6F5D2E"],
  ["#E9EAEE", "#D2D4DC", "#3B4150"],
];

const products = [
  ["tommy-magnetic-polo", "shirt"],
  ["tommy-seated-chinos", "pants"],
  ["tommy-magnetic-jacket", "jacket"],
  ["tommy-wrap-dress", "dress"],
  ["iz-seated-jeans", "pants"],
  ["iz-seated-blazer", "blazer"],
  ["iz-wrap-skirt", "dress"],
  ["iz-dress-pants", "pants"],
  ["zappos-nike-flyease", "sneaker"],
  ["zappos-slipon-sneakers", "sneaker"],
  ["zappos-sensory-tee", "tshirt"],
  ["zappos-seamless-socks", "sock"],
  ["zappos-pullon-joggers", "bolt"],
  ["able2wear-openback-top", "tshirt"],
  ["able2wear-side-trousers", "pants"],
  ["able2wear-openback-cardigan", "jacket"],
  ["able2wear-nightdress", "dress"],
  ["magnaready-dress-shirt", "shirt"],
  ["magnaready-stretch-blouse", "tshirt"],
  ["billy-zip-hightops", "sneaker"],
  ["billy-zip-lowtops", "sneaker"],
  ["abl-wheelchair-jeans", "pants"],
  ["abl-soft-jeans", "pants"],
  ["slick-chicks-underwear", "briefs"],
  ["will-well-magnetic-shirt", "shirt"],
  ["leaf-breathable-top", "tshirt"],
  ["werable-buckle-dress", "dress"],
  ["dawn-magnetic-polo", "shirt"],
  ["able-label-velcro-shirt", "shirt"],
  ["joe-bella-carezips", "pants"],
  ["silverts-openback-dress", "dress"],
];

for (let i = 0; i < products.length; i++) {
  const [id, glyph] = products[i];
  const [c1, c2, deep] = productPalette[i % productPalette.length];
  tiles.push([`prod-${id}`, c1, c2, deep, glyph]);
}

function renderGlyph(name, deep) {
  const parts = glyphs[name]
    .map((g) => {
      if (g.circle) {
        const [cx, cy, r] = g.circle;
        return `<circle cx="${cx}" cy="${cy}" r="${r}"${g.fill ? ` fill="${deep}" stroke="none"` : ""}/>`;
      }
      return `<path d="${g.d}"/>`;
    })
    .join("");
  return `<g transform="translate(244,104) scale(13)" fill="none" stroke="${deep}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">${parts}</g>`;
}

for (const [name, c1, c2, deep, glyph] of tiles) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-label="${name.replace(/-/g, " ")}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="520" fill="url(#bg)"/>
  <circle cx="660" cy="80" r="190" fill="#ffffff" opacity="0.22"/>
  <circle cx="110" cy="470" r="150" fill="#ffffff" opacity="0.16"/>
  <circle cx="700" cy="450" r="90" fill="${deep}" opacity="0.05"/>
  <g stroke="${deep}" stroke-width="1" opacity="0.05">
    <line x1="0" y1="120" x2="800" y2="40"/>
    <line x1="0" y1="300" x2="800" y2="220"/>
    <line x1="0" y1="480" x2="800" y2="400"/>
  </g>
  ${renderGlyph(glyph, deep)}
</svg>`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
}

console.log(`Wrote ${tiles.length} tiles to public/images`);
