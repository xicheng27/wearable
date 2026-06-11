import Link from "next/link";
import Photo from "./Photo";
import { getBrandOfProduct, Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const brand = getBrandOfProduct(product);

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <article className="card card-hover flex h-full flex-col overflow-hidden">
        <div className="relative">
          <Photo
            src={product.imageUrl ?? product.image}
            fallbackSrc={product.image}
            alt=""
            className="aspect-[4/3] bg-gray-50"
            imgClassName="transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-gray-500 backdrop-blur-sm">
            {product.availability.includes("In stores") ? "Online · In stores" : "Online"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {brand.name}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {product.clothingType} · {product.priceRange} · {product.gender}
          </p>

          <p className="mt-2.5 line-clamp-1 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Best for:</span>{" "}
            {product.bestFor.slice(0, 2).join(", ")}
          </p>

          <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
            {product.adaptiveFeatures.slice(0, 2).map((f) => (
              <span key={f} className="badge bg-gray-50 text-gray-500">
                {f}
              </span>
            ))}
            {product.adaptiveFeatures.length > 2 && (
              <span className="badge bg-gray-50 text-gray-400">
                +{product.adaptiveFeatures.length - 2}
              </span>
            )}
          </div>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
            View item
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
