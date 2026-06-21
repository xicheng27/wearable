"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import SearchBar from "@/components/SearchBar";
import { getBrandName, products, filterProductsByCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";

export default function HeroSection() {
  const { country } = useCountry();
  const availableProducts = filterProductsByCountry(products, country);
  const featured = [
    availableProducts.find(
      (product) => product.id === "tommy-adaptive-magnetic-polo"
    ),
    availableProducts.find(
      (product) => product.category === "shoes" && product.imageUrl
    ),
    availableProducts.find(
      (product) => product.seatedFit && product.imageUrl
    ),
    ...availableProducts,
  ].filter((product): product is (typeof products)[number] => Boolean(product));
  const uniqueFeatured = Array.from(
    new Map(featured.map((product) => [product.id, product])).values()
  ).slice(0, 3);

  return (
    <section className="paper-texture relative overflow-hidden border-b border-ink/10 bg-ivory" aria-labelledby="hero-heading">
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-clay/10 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-72 w-72 bg-lavender/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.12fr_.88fr] lg:px-8 lg:py-18">
        <div className="relative z-10">
          <p className="eyebrow rotate-[-1deg]">Adaptive fashion, thoughtfully found</p>
          <h1 id="hero-heading" className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[.98] tracking-[-.045em] text-ink sm:text-6xl lg:text-[4.9rem]">
            Find adaptive clothing that works for your body, needs, and location.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
            Answer a few simple questions about your body, accessibility needs,
            location and style. We match you to exact clothing pieces — not just
            a list of brands.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/quiz" className="btn-primary px-8 py-4 text-lg">
              Find clothing for me <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/search" className="btn-secondary px-7 py-4 text-base">
              Browse all clothing
            </Link>
          </div>

          <div className="mt-8 max-w-2xl rounded-[1.25rem] border border-ink/15 bg-paper/90 p-2 shadow-paper backdrop-blur">
            <SearchBar placeholder="Or search directly: 'magnetic shirt', 'wheelchair jeans'" />
          </div>

          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/58">
            The guided flow treats your accessibility needs as requirements, then
            ranks by style and budget. Prefer to browse? The full catalogue is one
            tap away.
          </p>
        </div>

        <div className="relative mx-auto hidden h-[500px] w-full max-w-[520px] lg:block" aria-label="Featured adaptive clothing pieces">
          <div className="absolute left-[7%] top-[5%] h-[70%] w-[56%] rotate-[-3deg] overflow-hidden rounded-[2rem_2rem_.8rem_2rem] border-[10px] border-paper bg-sand shadow-lift">
            {uniqueFeatured[0] && <ProductImage src={uniqueFeatured[0].imageUrl} alt={uniqueFeatured[0].imageAlt} permissionStatus={uniqueFeatured[0].permissionStatus} attribution={uniqueFeatured[0].attributionText} priority className="h-full w-full" />}
            <span className="absolute bottom-3 left-3 right-3 bg-paper/90 px-3 py-2 text-xs font-bold text-ink backdrop-blur">
              {uniqueFeatured[0]?.name}
            </span>
          </div>
          <div className="absolute right-[2%] top-[2%] h-[42%] w-[41%] rotate-[4deg] overflow-hidden rounded-[.8rem_2rem_2rem_2rem] border-[8px] border-paper bg-lavender shadow-paper">
            {uniqueFeatured[1] && <ProductImage src={uniqueFeatured[1].imageUrl} alt={uniqueFeatured[1].imageAlt} permissionStatus={uniqueFeatured[1].permissionStatus} attribution={uniqueFeatured[1].attributionText} priority className="h-full w-full" />}
          </div>
          <div className="absolute bottom-[2%] right-[4%] h-[43%] w-[48%] rotate-[2deg] overflow-hidden rounded-[2rem_.8rem_2rem_2rem] border-[8px] border-paper bg-sage/30 shadow-lift">
            {uniqueFeatured[2] && <ProductImage src={uniqueFeatured[2].imageUrl} alt={uniqueFeatured[2].imageAlt} permissionStatus={uniqueFeatured[2].permissionStatus} attribution={uniqueFeatured[2].attributionText} className="h-full w-full" />}
          </div>
          <div className="absolute right-[4%] top-[43%] rotate-[5deg] rounded-sm bg-[#F2E5CA] px-4 py-3 font-hand text-sm font-semibold text-ink shadow-paper">
            style + access
            <br />
            belong together
          </div>
          {uniqueFeatured[1] && (
            <span className="absolute right-[8%] top-[36%] rounded-md bg-primary-800 px-3 py-1.5 text-xs font-bold text-paper shadow-soft">
              {getBrandName(uniqueFeatured[1].brandId)}
            </span>
          )}
          <svg className="absolute bottom-2 left-0 h-24 w-32 text-clay" viewBox="0 0 140 90" fill="none" aria-hidden="true">
            <path d="M10 70c28 11 51 6 65-15 9-14 9-30 4-43M70 20l10-9 8 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
