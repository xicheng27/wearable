"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MapCanvas from "@/components/MapCanvas";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { matchBrands, QuizAnswers } from "@/data/brands";
import {
  clothingCategories,
  ClothingCategory,
  quizClothingOptions,
} from "@/data/categories";
import { getBrandOfProduct, matchProducts, ProductMatch } from "@/data/products";
import { mapPlaces } from "@/data/places";

function readList(value: string | null): string[] {
  return value ? value.split(",").map(decodeURIComponent).filter(Boolean) : [];
}

/** Categories the user asked for; sensible defaults when skipped. */
function categoriesForAnswers(clothing: string[]): ClothingCategory[] {
  const picked = clothing
    .map((label) => quizClothingOptions.find((o) => o.label === label)?.categoryId)
    .map((id) => clothingCategories.find((c) => c.id === id))
    .filter(Boolean) as ClothingCategory[];
  if (picked.length > 0) return picked;
  return clothingCategories.filter((c) => ["tops", "pants", "shoes"].includes(c.id));
}

function MatchRing({ percent, size = 14 }: { percent: number; size?: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size * 4, height: size * 4 }}
      role="img"
      aria-label={`${percent}% match`}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#1D9E75"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
        {percent}%
      </span>
    </div>
  );
}

/** Rich product match card: image, brand, reasons, style match, price, CTA. */
function ProductMatchCard({ m, badge }: { m: ProductMatch; badge?: string }) {
  const brand = getBrandOfProduct(m.product);
  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Photo src={m.product.imageUrl ?? m.product.image} fallbackSrc={m.product.image} alt="" className="aspect-[16/9] bg-gray-50" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {brand.name}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-snug text-gray-900">
              {m.product.name}
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              {m.product.clothingType} · {m.product.price ?? m.product.priceRange}
            </p>
          </div>
          {m.percent !== null && <MatchRing percent={m.percent} />}
        </div>

        <ul className="mt-3 flex-1 space-y-1.5">
          {m.reasons.slice(0, 3).map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {reason}
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.product.adaptiveFeatures.slice(0, 3).map((f) => (
            <span key={f} className="badge bg-gray-50 text-gray-500">
              {f}
            </span>
          ))}
        </div>

        {m.stylePercent !== null && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-500">Style match</span>
              <span className="font-semibold text-gray-900">{m.stylePercent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-700 ease-out"
                style={{ width: `${m.stylePercent}%` }}
              />
            </div>
          </div>
        )}

        <Link href={`/products/${m.product.id}`} className="btn-primary mt-4 w-full py-2.5 text-sm">
          View details
        </Link>
      </div>
    </article>
  );
}

export default function ResultsClient() {
  const sp = useSearchParams();

  const answers: QuizAnswers = {
    needs: readList(sp.get("needs")),
    seated: sp.get("seated") ?? undefined,
    sensory: readList(sp.get("sensory")),
    fastenings: readList(sp.get("fastenings")),
    clothing: readList(sp.get("clothing")),
    location: sp.get("location") ?? undefined,
    styles: readList(sp.get("styles")),
    budget: sp.get("budget") ?? undefined,
  };

  const answeredAnything =
    answers.needs.length > 0 ||
    !!answers.seated ||
    answers.sensory.length > 0 ||
    answers.fastenings.length > 0 ||
    answers.clothing.length > 0 ||
    !!answers.location ||
    answers.styles.length > 0 ||
    !!answers.budget;

  const productMatches = matchProducts(answers);
  const topPicks = productMatches.slice(0, 3);
  const topPickIds = new Set(topPicks.map((m) => m.product.id));
  const categories = categoriesForAnswers(answers.clothing);
  const brandMatches = matchBrands(answers);

  const matchedBrandIds = new Set(
    topPicks.map((m) => m.product.brandId)
  );
  const nearbyPlaces = mapPlaces.filter(
    (p) => !p.brandId || matchedBrandIds.has(p.brandId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-widest text-primary-600">
            Quiz complete
          </p>
          <h1
            className="animate-fade-up mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            style={{ animationDelay: "60ms" }}
          >
            {answeredAnything ? "Your matches" : "Start with these pieces"}
          </h1>
          <p
            className="animate-fade-up mt-2 text-sm text-gray-500 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {answeredAnything
              ? "Individual adaptive pieces ranked for your needs and style — with the reasons why."
              : "You skipped the questions, so here are the community's most-loved adaptive pieces."}
          </p>
          <div
            className="animate-fade-up mt-5 flex flex-wrap gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/quiz" className="btn-secondary px-5 py-2.5 text-sm">
              Retake quiz
            </Link>
            <Link href="/search" className="btn-secondary px-5 py-2.5 text-sm">
              Browse all items
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* Top product picks */}
        <section aria-labelledby="picks-heading">
          <Reveal className="mb-5">
            <h2 id="picks-heading" className="text-lg font-semibold text-gray-900">
              Top picks for you
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map((m, i) => (
              <Reveal key={m.product.id} delay={Math.min(i * 70, 210)} className="h-full">
                <ProductMatchCard
                  m={m}
                  badge={i === 0 && m.percent !== null ? "Best match" : undefined}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Per-piece picks */}
        {categories.map((cat, ci) => {
          const inCategory = productMatches.filter(
            (m) => m.product.categoryId === cat.id && !topPickIds.has(m.product.id)
          );
          const top = inCategory.slice(0, 2);
          if (top.length === 0) return null;
          return (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}-heading`}>
              <Reveal className="mb-5 flex items-end justify-between" delay={Math.min(ci * 50, 200)}>
                <h2 id={`cat-${cat.id}-heading`} className="text-lg font-semibold text-gray-900">
                  Best {cat.noun} for you
                </h2>
                <Link
                  href={`/clothing/${cat.id}`}
                  className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Explore {cat.noun} →
                </Link>
              </Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {top.map((m) => (
                  <ProductMatchCard key={m.product.id} m={m} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Brand ranking */}
        <Reveal>
          <section className="card p-6 sm:p-8" aria-labelledby="overall-heading">
            <h2 id="overall-heading" className="text-lg font-semibold text-gray-900">
              Recommended brands
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The labels behind your matches, ranked by overall fit.
            </p>
            <div className="mt-5 space-y-4">
              {brandMatches.slice(0, 5).map((m) => (
                <div
                  key={m.brand.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition-colors duration-200 hover:border-gray-200 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                      style={{ backgroundColor: m.brand.heroColor }}
                      aria-hidden="true"
                    >
                      {m.brand.logo}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{m.brand.name}</h3>
                      <p className="truncate text-xs text-gray-400">
                        {m.reasons.slice(0, 2).join(" · ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-shrink-0">
                    {m.percent !== null && (
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                        {m.percent}% match
                      </span>
                    )}
                    <Link
                      href={`/brands/${m.brand.id}`}
                      className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Nearby map */}
        <Reveal>
          <section className="card overflow-hidden" aria-labelledby="nearby-heading">
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="nearby-heading" className="text-lg font-semibold text-gray-900">
                    Nearby options
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Stores and services connected to your top matches.
                  </p>
                </div>
                <Link
                  href="/map"
                  className="flex-shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Open map →
                </Link>
              </div>
              <Link href="/map" aria-label="Open the full map">
                <MapCanvas
                  places={nearbyPlaces}
                  interactive={false}
                  className="pointer-events-none aspect-[16/8]"
                />
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
