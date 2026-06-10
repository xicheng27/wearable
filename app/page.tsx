import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import BrandCard from "@/components/BrandCard";
import Reveal from "@/components/Reveal";
import { brands } from "@/data/brands";
import Link from "next/link";

const stats = [
  { value: "4+", label: "Adaptive brands" },
  { value: "40+", label: "Adaptive features" },
  { value: "8", label: "Disability categories" },
  { value: "15+", label: "Countries covered" },
];

export default function HomePage() {
  const featured = brands.filter((b) => b.featured);

  return (
    <>
      <HeroSection />

      <section className="bg-white py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 id="featured-heading" className="section-title">
                Featured brands
              </h2>
              <p className="section-subtitle">
                Trusted adaptive fashion labels loved by the disability community.
              </p>
            </div>
            <Link
              href="/search"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:inline-flex"
            >
              See all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((brand, i) => (
              <Reveal key={brand.id} delay={Math.min(i * 70, 280)} className="h-full">
                <BrandCard brand={brand} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/search" className="btn-secondary">
              View all brands
            </Link>
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section className="border-y border-gray-100 bg-white py-12 sm:py-14" aria-labelledby="stats-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">Xi&apos;s by the numbers</h2>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={Math.min(i * 60, 240)}>
                <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="bg-white pb-20 sm:pb-24" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-gray-900 px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2
                id="cta-heading"
                className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                Ready to find your fit?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-400">
                Browse adaptive clothing brands tailored to your specific needs
                — no more guessing.
              </p>
              <Link
                href="/search"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-100 active:scale-[0.98]"
              >
                Start browsing
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
