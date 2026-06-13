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
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Curated edit</p>
            <h2
              id={headingId}
              className="section-title mt-2"
            >
              {title}
            </h2>
            <p className="section-subtitle">{description}</p>
          </div>
          <Link
            href={href}
            className="link-underline hidden flex-shrink-0 text-sm sm:inline-flex"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
