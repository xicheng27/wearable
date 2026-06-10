import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  description: string;
  products: Product[];
  href: string;
  compact?: boolean;
}

export default function ProductSection({
  title,
  description,
  products,
  href,
  compact = false,
}: ProductSectionProps) {
  if (products.length === 0) return null;
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;

  return (
    <section className={compact ? "py-14" : "py-20"} aria-labelledby={headingId}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2
              id={headingId}
              className="text-3xl font-extrabold tracking-tight text-gray-900"
            >
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-gray-600">{description}</p>
          </div>
          <Link
            href={href}
            className="hidden flex-shrink-0 text-sm font-bold text-primary-700 hover:text-primary-800 sm:inline-flex"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
