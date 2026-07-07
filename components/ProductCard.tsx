"use client";

import Link from "next/link";
import { Product } from "@/types";
import { getBrandName, getProductShipsTo } from "@/data/products";
import ProductImage from "@/components/ProductImage";
import PriceDisplay from "@/components/PriceDisplay";
import OfficialProductLink from "@/components/OfficialProductLink";
import { useCountry } from "@/components/CountryProvider";
import { useSavedItems } from "@/components/SavedItemsProvider";
import { GLOBAL } from "@/lib/countries";
import { normalizeAvailability, availabilityLabelFor } from "@/lib/productMetadata";
import { resolvePriceStatus } from "@/lib/pricingProvider";

function plainBestFor(product: Product) {
  const text = product.bestFor[0] || product.disabilityNeeds[0] || "adaptive dressing";
  return text
    .replace("Limited hand dexterity", "limited hand movement")
    .replace("Full-time wheelchair users", "wheelchair users")
    .replace("One-handed formal dressing", "one-handed dressing");
}

export default function ProductCard({ product }: { product: Product }) {
  const brandName = getBrandName(product.brandId);
  const { country } = useCountry();
  const { isSaved, toggleSaved } = useSavedItems();
  const saved = isSaved(product.id);
  const shipsTo = getProductShipsTo(product);
  const shipsGlobally = shipsTo.includes(GLOBAL);
  const shippingLabel = shipsGlobally
    ? "Available globally"
    : country && country !== GLOBAL && shipsTo.includes(country)
      ? `Ships to ${country}`
      : `Ships to ${shipsTo[0]}`;

  // Lightweight, honest trust hints so browse cards disclose data gaps rather
  // than looking artificially complete.
  const dataGaps: string[] = [];
  if (product.linkType !== "exact-product") dataGaps.push("exact link");
  if (resolvePriceStatus(product) === "unknown") dataGaps.push("price");
  if (normalizeAvailability(product) === "unknown") dataGaps.push("shipping");

  return (
    <article className="group card card-hover flex h-full flex-col overflow-hidden rounded-[1.7rem_.7rem_1.7rem_1.7rem]">
      <div className="relative">
        <Link
          href={`/products/${product.id}`}
          className="relative block"
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.imageAlt}
            category={product.categoryNormalized}
            permissionStatus={product.permissionStatus}
            attribution={product.attributionText}
            source={brandName}
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
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-paper/70 bg-paper/90 text-primary-800 shadow-sm backdrop-blur transition-transform active:scale-95"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.6-9.8-9.1C.7 8 2 4.5 5.3 3.6c2-.5 4 .3 5 2.1 1-1.8 3-2.6 5-2.1C18.6 4.5 19.9 8 18.4 11.4 16.1 15.9 12 20.5 12 20.5z"
            />
          </svg>
        </button>
      </div>

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
          <p className="text-sm font-bold text-ink/55">Best for</p>
          <p className="mt-1 text-base leading-relaxed text-ink/78">
            {plainBestFor(product)}
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
          <div className="mb-2 flex items-center gap-2 text-sm text-ink/60">
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
          <p className="mb-2 w-fit rounded-md bg-primary-50 px-3 py-1.5 text-sm font-bold text-primary-900">
            {shippingLabel}
          </p>
          {dataGaps.length > 0 && (
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <span aria-hidden="true">⚠</span>
              Confirm {dataGaps.join(", ")} on the official page
            </p>
          )}
          <Link
            href={`/products/${product.id}`}
            className="btn-primary flex w-full px-4 py-3.5 text-center text-base"
          >
            View details
          </Link>
          <OfficialProductLink
            href={product.productUrl}
            exact={product.linkType === "exact-product"}
            productId={product.id}
            className="btn-secondary mt-3 flex w-full px-4 py-3 text-center text-sm"
          >
            {product.linkType === "exact-product"
              ? "View official product →"
              : "View official source →"}
          </OfficialProductLink>
        </div>
      </div>
    </article>
  );
}
