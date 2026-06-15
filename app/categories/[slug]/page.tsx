import { notFound } from "next/navigation";
import Link from "next/link";
import LocationAwareProductGrid from "@/components/LocationAwareProductGrid";
import {
  getProductsByCategory,
  productCategories,
} from "@/data/products";

interface CategoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps) {
  const category = productCategories.find((item) => item.slug === params.slug);
  if (!category) return {};

  return {
    title: `${category.label} | Xi's`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = productCategories.find((item) => item.slug === params.slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-700">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/search" className="hover:text-primary-700">Clothing</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-gray-900">{category.label}</span>
          </nav>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Mixed-brand category
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-950">
            {category.label}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            {category.description} Compare individual products from different
            brands in one place.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-end gap-4">
          <Link
            href={`/search?clothing=${encodeURIComponent(category.label.replace("Adaptive ", ""))}`}
            className="text-sm font-bold text-primary-700 hover:text-primary-800"
          >
            Refine with filters &rarr;
          </Link>
        </div>

        <LocationAwareProductGrid products={categoryProducts} showCount />
      </main>
    </div>
  );
}
