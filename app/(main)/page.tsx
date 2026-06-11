import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import MapCanvas from "@/components/MapCanvas";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { mapPlaces } from "@/data/places";
import { clothingCategories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const steps = [
  {
    title: "Tell us your needs",
    description: "Accessibility needs, comfort, location and personal style — two minutes, all skippable.",
  },
  {
    title: "Get matched",
    description: "We rank individual adaptive pieces and brands by how well they fit you, with honest reasons why.",
  },
  {
    title: "Shop with confidence",
    description: "Shipping, returns and store locations up front — no surprises at checkout.",
  },
];

const needCards = [
  {
    title: "Sensory-friendly clothing",
    description: "Soft, tag-free fabrics and flat seams.",
    image: "/images/need-sensory.svg",
    href: "/brands?feature=Sensory-friendly",
  },
  {
    title: "Wheelchair seated fit",
    description: "Cuts designed from the seated position up.",
    image: "/images/need-seated.svg",
    href: "/brands?feature=Seated+fit",
  },
  {
    title: "Easy fastenings",
    description: "Magnetic buttons, Velcro and easy zippers.",
    image: "/images/need-fastenings.svg",
    href: "/brands?feature=Magnetic+closures",
  },
];

const homeCategoryIds = ["tops", "pants", "shoes", "jackets", "formal"];

const shopEdits = [
  { label: "Best adaptive shoes", href: "/search?category=shoes" },
  { label: "Best seated-fit pants", href: "/search?category=pants&feature=seated" },
  { label: "Best magnetic shirts", href: "/search?category=shirts&feature=magnetic" },
  { label: "Sensory-friendly picks", href: "/search?feature=sensory" },
  { label: "Formal adaptive wear", href: "/search?category=formal" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{
            background:
              "radial-gradient(55% 90% at 50% 0%, rgba(109, 40, 217, 0.06) 0%, rgba(109, 40, 217, 0) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="max-w-xl">
            <h1
              id="hero-heading"
              className="animate-fade-up text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl"
            >
              Find adaptive clothing that fits your needs.
            </h1>
            <p
              className="animate-fade-up mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl"
              style={{ animationDelay: "80ms" }}
            >
              Browse real adaptive clothing items by brand, category, adaptive
              feature, or the need they solve — from magnetic shirts to
              seated-fit pants, all in one trusted place.
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "160ms" }}
            >
              <Link href="/search" className="btn-primary px-9 py-4 text-lg">
                Browse Clothing
              </Link>
              <Link href="/quiz" className="btn-secondary px-9 py-4 text-lg">
                Find by Need
              </Link>
            </div>
          </div>
          <div className="animate-fade-up hidden lg:block" style={{ animationDelay: "200ms" }}>
            <Photo
              src="/images/hero.svg"
              alt="Illustration of a clothes hanger representing adaptive fashion"
              className="aspect-[4/3] rounded-3xl shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-16 sm:py-20" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center sm:mb-14">
            <h2 id="how-heading" className="section-title">How Xi&apos;s works</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Three steps between you and clothes that genuinely work for your body.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={Math.min(i * 80, 240)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Find by clothing piece */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="pieces-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 id="pieces-heading" className="section-title">Find by clothing piece</h2>
              <p className="section-subtitle">Shop the piece you need — we&apos;ll show you who makes it well.</p>
            </div>
            <Link
              href="/search"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:inline-flex"
            >
              All clothing
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
            {clothingCategories
              .filter((c) => homeCategoryIds.includes(c.id))
              .map((cat, i) => (
                <Reveal key={cat.id} delay={Math.min(i * 60, 300)} className="h-full">
                  <CategoryCard category={cat} compact />
                </Reveal>
              ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {needCards.map((card, i) => (
              <Reveal key={card.title} delay={Math.min(i * 60, 240)} className="h-full">
                <Link
                  href={card.href}
                  className="group card card-hover flex h-full items-center gap-4 p-4"
                >
                  <Photo src={card.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl" />
                  <span>
                    <span className="block text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                      {card.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-500">{card.description}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular adaptive pieces */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-16 sm:py-20" aria-labelledby="popular-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 id="popular-heading" className="section-title">Popular adaptive pieces</h2>
              <p className="section-subtitle">Individual items the community loves — from every brand, in one grid.</p>
            </div>
            <Link
              href="/search"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:inline-flex"
            >
              Shop all items
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => p.featured)
              .slice(0, 8)
              .map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i * 50, 300)} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
          </div>
          <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
            {shopEdits.map((edit) => (
              <Link
                key={edit.label}
                href={edit.href}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                {edit.label}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Brands near you */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="map-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <h2 id="map-heading" className="section-title">Brands near you</h2>
              <p className="section-subtitle max-w-md">
                Flagship stores, stockists and adaptive alteration services —
                mapped with their accessibility focus, so you know before you go.
              </p>
              <Link href="/map" className="btn-secondary mt-7">
                Explore the map
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-3">
              <Link href="/map" className="group block" aria-label="Open the map">
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <MapCanvas
                    places={mapPlaces}
                    interactive={false}
                    className="pointer-events-none aspect-[16/10] shadow-soft"
                  />
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-gray-900 px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2 id="cta-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to find your fit?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-lg text-gray-200">
                Two minutes, eight friendly questions, zero guesswork — get
                brands ranked for your body and your style.
              </p>
              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-100 active:scale-[0.98]"
              >
                Take the quiz
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
