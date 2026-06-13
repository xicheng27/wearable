import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import SearchBar from "@/components/SearchBar";
import { getBrandName, products } from "@/data/products";

export default function HeroSection() {
  const featured = [
    products.find((product) => product.id === "tommy-adaptive-magnetic-polo"),
    products.find((product) => product.category === "shoes" && product.imageUrl),
    products.find((product) => product.seatedFit && product.imageUrl),
  ].filter((product): product is (typeof products)[number] => Boolean(product));

  return (
    <section className="paper-texture relative overflow-hidden border-b border-ink/10 bg-ivory" aria-labelledby="hero-heading">
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-clay/10 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-72 w-72 bg-lavender/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-24">
        <div className="relative z-10">
          <p className="eyebrow rotate-[-1deg]">Adaptive fashion, thoughtfully found</p>
          <h1 id="hero-heading" className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-[.92] tracking-[-.055em] text-ink sm:text-7xl lg:text-[5.7rem]">
            Clothes should meet you where you are.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ink/70">
            Discover real adaptive pieces across brands, chosen for comfort,
            independence and personal style.
          </p>

          <div className="mt-9 max-w-2xl rounded-[1.25rem] border border-ink/15 bg-paper/90 p-2 shadow-paper backdrop-blur">
            <SearchBar placeholder="Try 'magnetic shirt' or 'wheelchair jeans'" />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/search" className="btn-primary">
              Browse clothing <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/quiz" className="btn-secondary">
              Find by need
            </Link>
            <span className="font-hand text-xs text-ink/55">9 brands, one considered edit</span>
          </div>
        </div>

        <div className="relative mx-auto h-[550px] w-full max-w-[570px]" aria-label="Featured adaptive clothing pieces">
          <div className="absolute left-[7%] top-[5%] h-[70%] w-[56%] rotate-[-3deg] overflow-hidden rounded-[2rem_2rem_.8rem_2rem] border-[10px] border-paper bg-sand shadow-lift">
            {featured[0] && <ProductImage src={featured[0].imageUrl} alt={featured[0].imageAlt} priority className="h-full w-full" />}
            <span className="absolute bottom-3 left-3 right-3 bg-paper/90 px-3 py-2 text-xs font-bold text-ink backdrop-blur">
              {featured[0]?.name}
            </span>
          </div>
          <div className="absolute right-[2%] top-[2%] h-[42%] w-[41%] rotate-[4deg] overflow-hidden rounded-[.8rem_2rem_2rem_2rem] border-[8px] border-paper bg-lavender shadow-paper">
            {featured[1] && <ProductImage src={featured[1].imageUrl} alt={featured[1].imageAlt} priority className="h-full w-full" />}
          </div>
          <div className="absolute bottom-[2%] right-[4%] h-[43%] w-[48%] rotate-[2deg] overflow-hidden rounded-[2rem_.8rem_2rem_2rem] border-[8px] border-paper bg-sage/30 shadow-lift">
            {featured[2] && <ProductImage src={featured[2].imageUrl} alt={featured[2].imageAlt} className="h-full w-full" />}
          </div>
          <div className="absolute right-[4%] top-[43%] rotate-[5deg] rounded-sm bg-[#F2E5CA] px-4 py-3 font-hand text-sm font-semibold text-ink shadow-paper">
            style + access
            <br />
            belong together
          </div>
          {featured[1] && (
            <span className="absolute right-[8%] top-[36%] rounded-md bg-primary-800 px-3 py-1.5 text-xs font-bold text-paper shadow-soft">
              {getBrandName(featured[1].brandId)}
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
