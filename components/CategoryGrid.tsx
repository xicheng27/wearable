"use client";

import Link from "next/link";
import { getProductsByCategory, productCategories } from "@/data/products";
import { useShoppingLocation } from "@/components/LocationProvider";
import { filterProductsForCountry } from "@/lib/shipping";

function GarmentSketch({ type }: { type: string }) {
  const common = "stroke-current";
  if (type === "shoes") {
    return <path className={common} d="M5 18c5 0 8-2 10-7l2 1c.3 3 1.8 4.5 4 5.5V21H5zM7 21v-3" />;
  }
  if (["pants", "jeans"].includes(type)) {
    return <path className={common} d="M8 3h8l1 18h-4l-1-10-1 10H7zM8 7h8" />;
  }
  if (type === "dresses") {
    return <path className={common} d="M10 3h4l1 5 5 13H4L9 8zM8 8h8" />;
  }
  if (type === "underwear") {
    return <path className={common} d="M5 7h14l-2 11-5 3-5-3zM5 10h14" />;
  }
  if (type === "jackets") {
    return <path className={common} d="m9 4 3 2 3-2 4 3-2 5-2-1v10H9V11l-2 1-2-5zM12 6v15" />;
  }
  return <path className={common} d="m8 4 4 2 4-2 5 4-3 5-2-1v9H8v-9l-2 1-3-5zM12 6v5" />;
}

const tones = ["bg-[#EBDDC4]", "bg-lavender/65", "bg-sage/30", "bg-clay/20"];

export default function CategoryGrid() {
  const { selectedCountry, ready } = useShoppingLocation();

  return (
    <section className="paper-texture border-y border-ink/10 bg-[#EEE5D5] py-24" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-5 lg:grid-cols-[.7fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Find by clothing piece</p>
            <h2 id="categories-heading" className="section-title mt-3">Start with what you want to wear.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/65">
            Each rail mixes pieces from multiple brands, so function, feel and
            style can be considered side by side.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {productCategories.map((category, index) => {
            const categoryProducts = getProductsByCategory(category.slug);
            const count = ready
              ? filterProductsForCountry(categoryProducts, selectedCountry).length
              : categoryProducts.length;
            if (count === 0) return null;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`stitched group min-h-52 border border-ink/15 p-5 shadow-soft transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-paper ${tones[index % tones.length]} ${index % 3 === 0 ? "rounded-[.7rem_2rem_2rem_2rem]" : "rounded-[2rem_.7rem_2rem_2rem]"}`}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-primary-800 transition-transform duration-300 motion-safe:group-hover:rotate-[-3deg] motion-safe:group-hover:scale-105" aria-hidden="true">
                  <GarmentSketch type={category.slug} />
                </svg>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{category.label}</h3>
                <p className="mt-2 text-sm leading-5 text-ink/60">{category.description}</p>
                <p className="mt-4 font-hand text-xs font-semibold text-primary-800">{count} {count === 1 ? "piece" : "pieces"} &rarr;</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
