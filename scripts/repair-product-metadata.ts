/**
 * One-shot catalog metadata repair.
 *
 * Rewrites data/verifiedProducts.ts so that every record carries an accurate,
 * authoritative `categoryNormalized`, and so the legacy `clothingType` /
 * `category` fields are corrected wherever the generated feed classifier put a
 * garment in the wrong family (e.g. a knit SHIRT titled "… for Assisted
 * Dressing" shelved as a DRESS).
 *
 * Strategy — conservative on purpose:
 *   • Always stamp `categoryNormalized` (the field the engine now trusts).
 *   • Only OVERRIDE the legacy clothingType/category when the title clearly
 *     disagrees with the stored family, so existing correct sub-categories
 *     (e.g. the "shirts" browse page) are preserved.
 *
 * Run with:  npx esbuild scripts/repair-product-metadata.ts --bundle \
 *              --platform=node --format=cjs --alias:@=. \
 *              --outfile=.next/repair.cjs && node .next/repair.cjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Product } from "@/types";
import {
  CATEGORY_DISPLAY,
  detectMetadataWarnings,
  inferGarmentFromTitle,
  normalizeCategory,
} from "@/lib/productMetadata";

// Resolved from the repo root (the script is always run from there).
const FILE = resolve(process.cwd(), "data/verifiedProducts.ts");

function loadProducts(): { header: string; products: Product[] } {
  const src = readFileSync(FILE, "utf8");
  // Match the array assignment robustly: `... =  [` may have any run of
  // whitespace, and `Product[]` in the type contains an unrelated `[`.
  const assign = /=\s*\[/.exec(src);
  if (!assign) throw new Error("Could not locate the verifiedProducts array.");
  const arrayStart = assign.index + assign[0].length - 1; // the real "["
  const header = src.slice(0, assign.index + 1); // up to and including "="
  const json = src.slice(arrayStart, src.lastIndexOf("]") + 1);
  return { header, products: JSON.parse(json) as Product[] };
}

function repair(product: Product): { product: Product; changed: boolean } {
  const normalized = normalizeCategory(product);
  const fromTitle = inferGarmentFromTitle(product.name);
  let changed = false;
  const next: Product = { ...product };

  // Stamp the authoritative normalized category.
  if (next.categoryNormalized !== normalized) {
    next.categoryNormalized = normalized;
    changed = true;
  }

  // Repair the legacy fields only when the title clearly contradicts them.
  if (fromTitle) {
    const storedFamily = normalizeCategory({
      ...product,
      categoryNormalized: undefined,
      name: "", // force it to read clothingType/category, not the title
    } as Product);
    if (storedFamily !== "unknown" && storedFamily !== fromTitle.category) {
      const display = CATEGORY_DISPLAY[fromTitle.category];
      if (display) {
        next.clothingType = fromTitle.clothingType;
        next.category = fromTitle.legacyCategory;
        changed = true;
      }
    }
  }

  return { product: next, changed };
}

function main() {
  const { header, products } = loadProducts();

  let changedCount = 0;
  const repaired = products.map((p) => {
    const { product, changed } = repair(p);
    if (changed) changedCount += 1;
    return product;
  });

  const errorsBefore = products.flatMap(detectMetadataWarnings).filter((w) => w.severity === "error");
  const errorsAfter = repaired.flatMap(detectMetadataWarnings).filter((w) => w.severity === "error");

  console.log(`Products: ${products.length}`);
  console.log(`Records changed: ${changedCount}`);
  console.log(`Category-mismatch errors before: ${errorsBefore.length}`);
  console.log(`Category-mismatch errors after:  ${errorsAfter.length}`);
  if (errorsAfter.length > 0) {
    errorsAfter.slice(0, 20).forEach((w) => console.log("  !", w.message));
  }

  const output = `${header} ${JSON.stringify(repaired, null, 2)};\n`;
  writeFileSync(FILE, output.replace(/=\s+\[/, "= ["));
  console.log("Wrote data/verifiedProducts.ts");
}

main();
