import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BrandCard from "@/components/BrandCard";
import CategoryCard from "@/components/CategoryCard";
import Reveal from "@/components/Reveal";
import { searchCategories } from "@/data/categories";
import { searchBrands } from "@/data/brands";

export const metadata = {
  title: "Browse Adaptive Clothing – Xi's",
  description:
    "Shop adaptive clothing by piece: tops, pants, jeans, shoes, formal wear and more — each matched to the brands that make them.",
};

interface PageProps {
  searchParams: { q?: string };
}

export default function BrowseClothingPage({ searchParams }: PageProps) {
  const q = searchParams.q?.trim() ?? "";
  const categories = searchCategories(q);
  const brandResults = q ? searchBrands({ query: q }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {q ? `Results for “${q}”` : "Browse adaptive clothing"}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {q
              ? "Matching clothing pieces, adaptive features and brands."
              : "Start from the piece you need — we'll show you who makes it well."}{" "}
            <Link href="/brands" className="font-medium text-primary-600 hover:text-primary-700">
              Prefer browsing by brand?
            </Link>
          </p>
          <div className="mt-5 max-w-xl">
            <SearchBar defaultValue={q} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <section aria-labelledby="pieces-heading">
            {q && (
              <h2 id="pieces-heading" className="mb-5 text-lg font-semibold text-gray-900">
                Clothing pieces
              </h2>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <Reveal key={cat.id} delay={Math.min(i * 50, 300)} className="h-full">
                  <CategoryCard category={cat} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          !q && null
        )}

        {q && brandResults.length > 0 && (
          <section className="mt-12" aria-labelledby="brand-results-heading">
            <h2 id="brand-results-heading" className="mb-5 text-lg font-semibold text-gray-900">
              Matching brands
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {brandResults.map((brand, i) => (
                <Reveal key={brand.id} delay={Math.min(i * 50, 300)} className="h-full">
                  <BrandCard brand={brand} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {q && categories.length === 0 && brandResults.length === 0 && (
          <div className="card animate-fade-in px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-gray-900">Nothing found</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Try a clothing piece like “pants”, a feature like “magnetic”, or a brand name.
            </p>
            <Link href="/search" className="btn-primary mt-6 inline-flex">
              Browse all clothing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
