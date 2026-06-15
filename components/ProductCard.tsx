"use client";

import Link from "next/link";
import { Product } from "@/types";
import { getBrandName } from "@/data/products";
import ProductImage from "@/components/ProductImage";
import PriceDisplay from "@/components/PriceDisplay";
import { useShoppingLocation } from "@/components/LocationProvider";
import { productShippingLabel } from "@/lib/shipping";

export default function ProductCard({ product }: { product: Product }) {
  const brandName = getBrandName(product.brandId);
  const { selectedCountry } = useShoppingLocation();

  return (
    <article className="group card card-hover flex h-full flex-col overflow-hidden rounded-[1.7rem_.7rem_1.7rem_1.7rem]">
      <Link
        href={`/products/${product.id}`}
        className="relative block"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.imageAlt}
          permissionStatus={product.permissionStatus}
          attribution={product.attributionText}
          className="aspect-[4/5] w-full"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`sticker border-paper/70 shadow-sm ${
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
            <span className="sticker rotate-[1deg] bg-sage/25 text-ink shadow-sm">
              Seated fit
            </span>
          )}
          {product.sensoryFriendly && (
            <span className="sticker rotate-[1deg] bg-lavender/70 text-ink shadow-sm">
              Sensory-friendly
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <Link
            href={`/brands/${product.brandId}`}
            className="link-underline text-xs tracking-wide"
          >
            {brandName}
          </Link>
          <span className="font-hand text-ink/55">{product.clothingType}</span>
        </div>

        <h3 className="font-display text-[1.35rem] font-semibold leading-tight text-ink">
          <Link
            href={`/products/${product.id}`}
            className="transition-colors hover:text-primary-700"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-3 text-sm font-extrabold text-ink">
          <PriceDisplay
            price={product.price}
            sourceCurrency={product.currency}
            fallback={product.priceRange}
          />
        </p>

        <div className="mt-4">
          <p className="text-xs font-bold tracking-wide text-ink/45">
            Best for
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">
            {product.bestFor.slice(0, 2).join(", ")}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.adaptiveFeatures.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="sticker odd:rotate-[1deg] even:rotate-[-1deg]"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <p className="mb-3 w-fit rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800">
            {productShippingLabel(product, selectedCountry)}
          </p>
          <div className="mb-3 flex items-center gap-2 text-xs text-ink/55">
            <span
              className={`h-2 w-2 rounded-full ${
                product.availability.online ? "bg-sage" : "bg-ink/20"
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
            className="btn-primary flex w-full px-4 py-2.5 text-center text-sm"
          >
            {product.linkType === "exact-product"
              ? "View exact item"
              : "View brand page"}
          </a>
          <Link
            href={`/products/${product.id}`}
            className="link-underline mx-auto mt-4 block w-fit text-center text-xs"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
