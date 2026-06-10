import Link from "next/link";
import BrandCard from "@/components/BrandCard";
import CategoryCard from "@/components/CategoryCard";
import MapCanvas from "@/components/MapCanvas";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { brands } from "@/data/brands";
import { mapPlaces } from "@/data/places";
import { clothingCategories } from "@/data/categories";

const steps = [
  {
    title: "Tell us your needs",
    description: "Accessibility needs, comfort, location and personal style — two minutes, all skippable.",
  },
  {
    title: "Get matched",
    description: "We rank adaptive brands by how well they genuinely fit you, with honest reasons why.",
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

const styleCards = [
  {
    title: "Clean / minimal",
    description: "Quiet palettes, simple lines.",
    image: "/images/style-minimal.svg",
  },
  {
    title: "Swedish style",
    description: "Light, functional, effortless.",
    image: "/images/style-swedish.svg",
  },
  {
    title: "Old money",
    description: "Tailored, timeless, understated.",
    image: "/images/style-oldmoney.svg",
  },
  {
    title: "Streetwear",
    description: "Relaxed fits, bold attitude.",
    image: "/images/style-streetwear.svg",
  },
  {
    title: "Formal",
    description: "Sharp looks for big days.",
    image: "/images/style-formal.svg",
  },
  {
    title: "Casual",
    description: "Everyday comfort, easy wear.",
    image: "/images/style-casual.svg",
  },
];

export default function HomePage() {
  const featured = brands.filter((b) => b.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{
            background:
              "radial-gradient(55% 90% at 50% 0%, rgba(29, 158, 117, 0.07) 0%, rgba(29, 158, 117, 0) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="max-w-xl">
            <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
              Personalised adaptive fashion
            </p>
            <h1
              id="hero-heading"
              className="animate-fade-up text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 sm:text-5xl"
              style={{ animationDelay: "60ms" }}
            >
              Find adaptive clothing that actually fits your{" "}
              <span className="text-primary-600">needs, style, and comfort.</span>
            </h1>
            <p
              className="animate-fade-up mt-5 text-base leading-relaxed text-gray-500 sm:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              Discover adaptive brands matched to your accessibility needs,
              location, comfort, and personal style — no endless searching, no
              guesswork.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "180ms" }}
            >
              <Link href="/quiz" className="btn-primary px-8 py-4 text-base">
                Find my fit
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/search" className="btn-secondary px-8 py-4 text-base">
                Browse clothing
              </Link>
            </div>
            <p
              className="animate-fade-up mt-5 text-sm text-gray-400"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="/quiz" className="font-medium transition-colors hover:text-gray-600">
                Continue as guest
              </Link>{" "}
              ·{" "}
              <Link href="/signin" className="font-medium transition-colors hover:text-gray-600">
                Sign in
              </Link>
            </p>
          </div>
          <div className="animate-fade-up hidden lg:block" style={{ animationDelay: "200ms" }}>
            <Photo
              src="/images/hero.svg"
              alt="Adaptive fashion illustration with a clothes hanger"
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
                    <span className="mt-0.5 block text-xs text-gray-400">{card.description}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Find by style */}
      <section className="bg-gray-50/60 py-16 sm:py-20" aria-labelledby="style-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 id="style-heading" className="section-title">Find by style</h2>
              <p className="section-subtitle">Adaptive doesn&apos;t mean compromising on the look you love.</p>
            </div>
            <Link
              href="/quiz"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:inline-flex"
            >
              Take the style quiz
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
            {styleCards.map((card, i) => (
              <Reveal key={card.title} delay={Math.min(i * 50, 300)} className="h-full">
                <Link href="/quiz" className="group card card-hover block h-full overflow-hidden">
                  <Photo
                    src={card.image}
                    alt=""
                    className="aspect-square"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">{card.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
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

      {/* Featured brands */}
      <section className="bg-gray-50/60 py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 id="featured-heading" className="section-title">Featured adaptive brands</h2>
              <p className="section-subtitle">Trusted labels loved by the disability community.</p>
            </div>
            <Link
              href="/brands"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:inline-flex"
            >
              See all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((brand, i) => (
              <Reveal key={brand.id} delay={Math.min(i * 70, 280)} className="h-full">
                <BrandCard brand={brand} />
              </Reveal>
            ))}
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
              <p className="mx-auto mt-3 max-w-md text-base text-gray-400">
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
