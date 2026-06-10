import Link from "next/link";
import Photo from "./Photo";
import { brandsForCategory, ClothingCategory } from "@/data/categories";

interface CategoryCardProps {
  category: ClothingCategory;
  compact?: boolean;
}

export default function CategoryCard({ category, compact = false }: CategoryCardProps) {
  const brandCount = brandsForCategory(category).length;

  return (
    <Link href={`/clothing/${category.id}`} className="group block h-full">
      <article className="card card-hover flex h-full flex-col overflow-hidden">
        <div className="relative">
          <Photo
            src={category.image}
            alt=""
            className={compact ? "aspect-[8/5]" : "aspect-[16/9]"}
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-gray-500 backdrop-blur-sm">
            {brandCount} {brandCount === 1 ? "brand" : "brands"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
            {category.name}
          </h3>
          {!compact && (
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              {category.description}
            </p>
          )}

          <div className={`flex flex-1 flex-wrap content-start gap-1.5 ${compact ? "mt-3" : "mt-4"}`}>
            {category.features.slice(0, compact ? 2 : 4).map((f) => (
              <span key={f.label} className="badge bg-gray-50 text-gray-500">
                {f.label}
              </span>
            ))}
          </div>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
            Explore {category.noun}
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
