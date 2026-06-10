import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { recommendProducts } from "@/data/products";

interface QuizResultsPageProps {
  searchParams: {
    need?: string;
    style?: string;
    budget?: string;
  };
}

export const metadata = {
  title: "Your Adaptive Clothing Matches | Xi's",
  description:
    "Individual adaptive clothing recommendations matched to accessibility needs, style and budget.",
};

export default function QuizResultsPage({
  searchParams,
}: QuizResultsPageProps) {
  const needs = searchParams.need
    ? searchParams.need.split(",").map((value) => value.trim())
    : ["Limited dexterity"];
  const styles = searchParams.style
    ? searchParams.style.split(",").map((value) => value.trim())
    : ["Everyday"];

  const recommendations = recommendProducts({
    needs,
    styles,
    budget: searchParams.budget,
    limit: 6,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Your matches
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-950">
            Recommended clothing pieces
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Items are ranked by how closely their accessibility features and
            style tags match your answers.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[...needs, ...styles, searchParams.budget]
              .filter(Boolean)
              .map((item) => (
                <span key={item} className="badge bg-primary-50 text-primary-800">
                  {item}
                </span>
              ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map(({ product, reasons }) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard product={product} />
                <div className="-mt-3 rounded-b-2xl border border-t-0 border-primary-100 bg-primary-50 px-5 pb-5 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
                    Why it matches
                  </p>
                  <p className="mt-1 text-sm text-primary-950">
                    {reasons.length > 0
                      ? reasons.join(". ")
                      : `${product.adaptiveFeatures[0]} with a ${product.styleTags[0].toLowerCase()} style.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-gray-950">
              No exact matches yet
            </h2>
            <p className="mt-2 text-gray-600">
              Browse the full catalog and adjust filters to find a close fit.
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/search" className="btn-outline inline-block">
            Browse and refine all items
          </Link>
        </div>
      </main>
    </div>
  );
}
