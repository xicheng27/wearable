import Link from "next/link";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
}

const priceColors: Record<string, string> = {
  "$": "text-green-700 bg-green-50",
  "$$": "text-yellow-700 bg-yellow-50",
  "$$$": "text-orange-700 bg-orange-50",
  "$–$$$": "text-blue-700 bg-blue-50",
};

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.id}`} className="group block">
      <article className="card overflow-hidden h-full flex flex-col">
        <div
          className="h-32 flex items-center justify-center relative"
          style={{ backgroundColor: brand.heroColor + "18" }}
          aria-hidden="true"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ backgroundColor: brand.heroColor }}
          >
            {brand.logo}
          </div>
          {brand.featured && (
            <span className="absolute top-3 right-3 badge bg-primary-50 text-primary-700 border border-primary-200 text-xs">
              Featured
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors">
              {brand.name}
            </h2>
            <span
              className={`badge text-xs font-semibold flex-shrink-0 ${
                priceColors[brand.priceRange] ?? "text-gray-600 bg-gray-100"
              }`}
            >
              {brand.priceRange}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-3">{brand.country} · Est. {brand.founded}</p>

          <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-4">
            {brand.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {brand.adaptiveFeatures.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="badge bg-primary-50 text-primary-700 text-xs"
              >
                {feature}
              </span>
            ))}
            {brand.adaptiveFeatures.length > 3 && (
              <span className="badge bg-gray-100 text-gray-600 text-xs">
                +{brand.adaptiveFeatures.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="px-5 pb-4">
          <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
            View brand
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
