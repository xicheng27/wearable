import Link from "next/link";
import { disabilityCategories } from "@/data/brands";

export default function CategoryGrid() {
  return (
    <section
      className="py-20 bg-gray-50"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="categories-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Browse by disability type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your category to find clothing brands that specifically design for your needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {disabilityCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?disability=${encodeURIComponent(cat.id)}`}
              className="group card p-6 text-center hover:border-primary-200 hover:shadow-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 rounded-2xl transition-all duration-200"
            >
              <span
                className="text-4xl mb-3 block leading-none"
                role="img"
                aria-hidden="true"
              >
                {cat.icon}
              </span>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors mb-1">
                {cat.label}
              </h3>
              <p className="text-xs text-gray-400">
                {cat.count} brand{cat.count !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search"
            className="btn-outline inline-flex items-center gap-2"
          >
            Browse all brands
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
