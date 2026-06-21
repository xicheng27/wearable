import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import ProductSection from "@/components/ProductSection";
import { products, diversifyProducts } from "@/data/products";

export default function HomePage() {
  const popular = diversifyProducts(products.filter((product) => product.featured));
  const shoes = products.filter((product) => product.category === "shoes");
  const seated = products.filter(
    (product) =>
      product.seatedFit &&
      ["pants", "jeans"].includes(product.category)
  );
  const magnetic = products.filter((product) =>
    product.adaptiveFeatures.some((feature) =>
      feature.toLowerCase().includes("magnetic")
    )
  );
  const sensory = products.filter((product) => product.sensoryFriendly);
  const formal = products.filter(
    (product) =>
      product.category === "formalwear" ||
      product.styleTags.includes("Formal") ||
      product.styleTags.includes("Professional")
  );

  return (
    <>
      <HeroSection />

      <ProductSection
        title="Popular adaptive pieces"
        description="Individual products you can compare by need, style, price and location."
        products={popular}
        href="/search"
      />

      <section className="bg-ivory px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="help-choosing-heading">
        <div className="paper-panel mx-auto grid max-w-7xl gap-6 rounded-[2rem_.9rem_2rem_2rem] p-6 sm:p-8 lg:grid-cols-[1.4fr_.8fr] lg:items-center">
          <div>
            <p className="eyebrow">Need help choosing?</p>
            <h2 id="help-choosing-heading" className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Answer a few simple questions.
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/72">
              If you are not sure what to search for, the guided flow can start
              with country, clothing type, dressing difficulty, comfort needs
              and budget.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/quiz" className="btn-primary text-base">
              Find clothing for me
            </Link>
            <Link href="/search" className="btn-secondary text-base">
              Browse all clothing
            </Link>
          </div>
        </div>
      </section>

      <CategoryGrid />

      <div className="bg-paper">
        <ProductSection
          title="Best adaptive shoes"
          description="Easy-entry, zip-opening and hands-free footwear from different brands."
          products={shoes}
          href="/categories/shoes"
          compact
        />
      </div>

      <div className="paper-texture bg-[#EEE5D5]">
        <ProductSection
          title="Best seated-fit pants"
          description="Jeans and trousers shaped to stay comfortable and polished in a wheelchair."
          products={seated}
          href="/search?seated=true&clothing=Pants"
          compact
        />
      </div>

      <div className="bg-ivory">
        <ProductSection
          title="Best magnetic shirts"
          description="Classic polos and dress shirts with easier self-aligning fasteners."
          products={magnetic}
          href="/search?feature=Magnetic%20closures"
          compact
        />
      </div>

      <div className="paper-texture bg-lavender/25">
        <ProductSection
          title="Sensory-friendly picks"
          description="Soft, tag-free and low-friction pieces for more comfortable everyday wear."
          products={sensory}
          href="/search?sensory=true"
          compact
        />
      </div>

      <div className="bg-paper">
        <ProductSection
          title="Formal adaptive wear"
          description="Professional pieces that make polished dressing less demanding."
          products={formal}
          href="/categories/formalwear"
          compact
        />
      </div>

      <section className="paper-texture border-y border-primary-900/30 bg-primary-800 py-16 text-paper" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">
            Xi&apos;s catalog
          </h2>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { value: `${products.length}`, label: "Individual pieces" },
              { value: "9", label: "Adaptive brands" },
              { value: "10+", label: "Accessibility needs" },
              { value: "9", label: "Clothing categories" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-5xl font-semibold">{stat.value}</p>
                <p className="mt-2 font-hand text-xs text-lavender">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="paper-texture bg-lavender py-24 text-ink" aria-labelledby="cta-heading">
        <div className="paper-panel mx-auto max-w-4xl rounded-[3rem_1rem_3rem_3rem] px-6 py-14 text-center sm:px-12">
          <p className="eyebrow">Your wardrobe, your terms</p>
          <h2 id="cta-heading" className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Start with what you want to wear.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/65">
            Tell us your needs once and we match exact pieces to your body,
            accessibility needs, location and style — or browse everything yourself.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/quiz" className="btn-primary px-8 py-4">
              Find clothing for me <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/search" className="btn-secondary px-8 py-4">
              Browse adaptive clothing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
