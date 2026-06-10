import Link from "next/link";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.id}`} className="group block h-full">
      <article className="card card-hover flex h-full flex-col overflow-hidden">
        <div
          className="relative flex h-28 items-center justify-center"
          style={{ backgroundColor: brand.heroColor + "10" }}
          aria-hidden="true"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: brand.heroColor }}
          >
            {brand.logo}
          </div>
          {brand.featured && (
            <span className="badge absolute right-3 top-3 border border-primary-100 bg-white/90 text-primary-700 backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-base font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
            {brand.name}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            {brand.country} · {brand.priceRange} · Est. {brand.founded}
          </p>

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
            {brand.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {brand.adaptiveFeatures.slice(0, 3).map((feature) => (
              <span key={feature} className="badge bg-gray-50 text-gray-600">
                {feature}
              </span>
            ))}
            {brand.adaptiveFeatures.length > 3 && (
              <span className="badge bg-gray-50 text-gray-400">
                +{brand.adaptiveFeatures.length - 3}
              </span>
            )}
          </div>

          <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600">
            View brand
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
