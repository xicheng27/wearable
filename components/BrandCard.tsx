import Link from "next/link";
import { Brand } from "@/types";
import { getProductsByBrand } from "@/data/products";
import Photo from "./Photo";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const brandImage =
    brand.image ||
    getProductsByBrand(brand.id).find((product) => product.imageUrl)?.imageUrl ||
    "";

  return (
    <Link href={`/brands/${brand.id}`} className="group block h-full">
      <article className="card card-hover flex h-full flex-col overflow-hidden">
        <div className="relative h-32" aria-hidden="true">
          <Photo
            src={brandImage}
            alt=""
            className="h-full w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div
            className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold shadow-sm ring-1 ring-gray-900/5"
            style={{ color: brand.heroColor }}
          >
            {brand.logo}
          </div>
          {brand.featured && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium text-gray-500 backdrop-blur-sm">
              <svg className="h-3 w-3 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h2 className="text-base font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
            {brand.name}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
            {brand.tagline}
          </p>
          <p className="mt-3 text-xs text-gray-400">
            {brand.country} · {brand.priceRange}
            {brand.founded ? ` · Est. ${brand.founded}` : ""}
          </p>

          <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
            {brand.adaptiveFeatures.slice(0, 2).map((feature) => (
              <span key={feature} className="badge bg-gray-50 text-gray-500">
                {feature}
              </span>
            ))}
            {brand.adaptiveFeatures.length > 2 && (
              <span className="badge bg-gray-50 text-gray-400">
                +{brand.adaptiveFeatures.length - 2} features
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 px-6 py-4">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 group-hover:text-primary-700">
            View brand
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all duration-200 group-hover:bg-primary-50 group-hover:text-primary-600"
            aria-hidden="true"
          >
            <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
