import Link from "next/link";
import { getProductsByCategory, productCategories } from "@/data/products";

const categoryIcons: Record<string, React.ReactNode> = {
  tops: "T",
  shirts: "S",
  pants: "P",
  jeans: "J",
  shoes: "SH",
  underwear: "U",
  dresses: "D",
  jackets: "JK",
  formalwear: "F",
};

export default function CategoryGrid() {
  return (
    <section className="bg-gray-50 py-20" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Shop by clothing type
          </p>
          <h2
            id="categories-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Start with the piece you need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Each category mixes individual items from multiple brands, so you can
            compare function and style side by side.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productCategories.map((category) => {
            const count = getProductsByCategory(category.slug).length;

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="card group p-5 hover:border-primary-200 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-sm font-black text-primary-800">
                  {categoryIcons[category.slug]}
                </span>
                <h3 className="mt-5 font-bold text-gray-900 transition-colors group-hover:text-primary-700">
                  {category.label}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {category.description}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary-700">
                  {count} {count === 1 ? "piece" : "pieces"}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/search" className="btn-outline inline-flex items-center gap-2">
            Browse every item <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
