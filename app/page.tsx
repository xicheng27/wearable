import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import BrandCard from "@/components/BrandCard";
import { brands } from "@/data/brands";
import Link from "next/link";

export default function HomePage() {
  const featured = brands.filter((b) => b.featured);

  return (
    <>
      <HeroSection />

      <section className="py-20 bg-white" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                id="featured-heading"
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2"
              >
                Featured brands
              </h2>
              <p className="text-gray-600 text-lg">
                Trusted adaptive fashion labels loved by the disability community.
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              See all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link href="/search" className="btn-outline inline-flex items-center gap-2">
              View all brands
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section
        className="py-16 bg-primary-600 text-white"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">Xi&apos;s by the numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4+", label: "Adaptive brands" },
              { value: "40+", label: "Adaptive features" },
              { value: "8", label: "Disability categories" },
              { value: "15+", label: "Countries covered" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold mb-1">{stat.value}</p>
                <p className="text-primary-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20 bg-primary-500 text-white" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl font-extrabold mb-4"
          >
            Ready to find your fit?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Browse adaptive clothing brands tailored to your specific needs — no more guessing.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg"
          >
            Start browsing
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
