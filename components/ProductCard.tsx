import Link from "next/link";
import { Product } from "@/types";
import { getBrandName } from "@/data/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const brandName = getBrandName(product.brandId);

  return (
    <article className="group card flex h-full flex-col overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="relative block"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.imageAlt}
          className="aspect-[4/3] w-full"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`badge border border-white/70 bg-white/90 shadow-sm ${
              product.linkType === "exact-product"
                ? "text-primary-800"
                : "text-amber-800"
            }`}
          >
            {product.linkType === "exact-product"
              ? "Exact product"
              : "Brand page only"}
          </span>
          {product.seatedFit && (
            <span className="badge border border-white/70 bg-white/90 text-gray-800 shadow-sm">
              Seated fit
            </span>
          )}
          {product.sensoryFriendly && (
            <span className="badge border border-white/70 bg-white/90 text-gray-800 shadow-sm">
              Sensory-friendly
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <Link
            href={`/brands/${product.brandId}`}
            className="font-bold uppercase tracking-wider text-primary-700 hover:text-primary-800"
          >
            {brandName}
          </Link>
          <span className="font-semibold text-gray-500">{product.clothingType}</span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-gray-900">
          <Link
            href={`/products/${product.id}`}
            className="transition-colors hover:text-primary-700"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-base font-extrabold text-gray-900">
          {product.priceRange}
        </p>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Best for
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">
            {product.bestFor.slice(0, 2).join(", ")}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.adaptiveFeatures.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="badge bg-primary-50 text-primary-800"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
            <span
              className={`h-2 w-2 rounded-full ${
                product.availability.online ? "bg-primary-500" : "bg-gray-300"
              }`}
              aria-hidden="true"
            />
            {product.availability.online && product.availability.inStore
              ? "Online and in store"
              : product.availability.online
                ? "Available online"
                : "In-store availability"}
          </div>
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block w-full px-4 py-2.5 text-center text-sm"
          >
            {product.linkType === "exact-product"
              ? "View exact item"
              : "View brand page"}
          </a>
          <Link
            href={`/products/${product.id}`}
            className="mt-3 block text-center text-xs font-bold text-gray-500 hover:text-primary-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
