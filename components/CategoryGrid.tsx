import Link from "next/link";
import { disabilityCategories } from "@/data/brands";
import Reveal from "./Reveal";

export default function CategoryGrid() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center sm:mb-12">
          <h2 id="categories-heading" className="section-title">
            Browse by disability type
          </h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Select your category to find brands that design specifically for your needs.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {disabilityCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={Math.min(i * 50, 300)}>
              <Link
                href={`/search?disability=${encodeURIComponent(cat.id)}`}
                className="card card-hover group block h-full p-5 text-center sm:p-6"
              >
                <span className="mb-3 block text-3xl leading-none" aria-hidden="true">
                  {cat.icon}
                </span>
                <h3 className="text-sm font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                  {cat.label}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {cat.count} brand{cat.count !== 1 ? "s" : ""}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/search" className="btn-secondary">
            Browse all brands
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
