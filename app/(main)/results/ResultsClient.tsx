"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MapCanvas from "@/components/MapCanvas";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { BrandMatch, matchBrands, QuizAnswers } from "@/data/brands";
import {
  brandsForCategory,
  categoryFeaturesOfBrand,
  clothingCategories,
  ClothingCategory,
  quizClothingOptions,
} from "@/data/categories";
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

/** One friendly line on why this piece type suits the user's answers. */
function whyCategory(cat: ClothingCategory, answers: QuizAnswers): string {
  const has = (kw: string) => cat.features.some((f) => f.keyword === kw);
  const bits: string[] = [];
  if (answers.seated?.startsWith("Yes") && (has("seated") || has("back rise")))
    bits.push("seated-fit cuts");
  if (answers.fastenings.includes("Magnetic buttons") && has("magnetic"))
    bits.push("magnetic closures");
  if (answers.fastenings.includes("Velcro") && has("velcro")) bits.push("Velcro fastenings");
  if (answers.fastenings.includes("Easy zippers") && has("zipper")) bits.push("easy zippers");
  if (answers.fastenings.includes("Slip-on / no fastenings") && has("slip-on"))
    bits.push("slip-on designs");
  if (
    answers.sensory.some((s) => s !== "No sensory preferences") &&
    cat.features.some((f) => ["tag-free", "flat", "soft", "sensory"].includes(f.keyword))
  )
    bits.push("tag-free, flat-seam comfort");
  if (bits.length === 0) return cat.description;
  return `Matched to your answers for ${bits.slice(0, 3).join(", ")}.`;
}

function MatchRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-14 w-14 flex-shrink-0" role="img" aria-label={`${percent}% match`}>
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

function CategorySection({
  category,
  answers,
  matches,
  index,
}: {
  category: ClothingCategory;
  answers: QuizAnswers;
  matches: BrandMatch[];
  index: number;
}) {
  const inCategory = new Set(brandsForCategory(category).map((b) => b.id));
  const top = matches.filter((m) => inCategory.has(m.brand.id)).slice(0, 2);

  return (
    <Reveal delay={Math.min(index * 70, 280)}>
      <section className="card overflow-hidden" aria-label={`Best ${category.noun} for you`}>
        <div className="flex items-center gap-4 border-b border-gray-50 p-6">
          <Photo src={category.image} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Best {category.noun} for you
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">{whyCategory(category, answers)}</p>
          </div>
          <Link
            href={`/clothing/${category.id}`}
            className="hidden flex-shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:block"
          >
            Explore {category.noun} →
          </Link>
        </div>

        {top.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No brand in our catalogue makes adaptive {category.noun} yet — we&apos;re adding
            brands all the time.
          </p>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {top.map((m) => {
              const matched = categoryFeaturesOfBrand(category, m.brand);
              return (
                <div key={m.brand.id} className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                        style={{ backgroundColor: m.brand.heroColor }}
                        aria-hidden="true"
                      >
                        {m.brand.logo}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{m.brand.name}</h3>
                        <p className="text-xs text-gray-400">
                          {m.brand.country} · {m.brand.priceRange}
                        </p>
                      </div>
                    </div>
                    {m.percent !== null && <MatchRing percent={m.percent} />}
                  </div>

                  <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                    {(matched.length > 0 ? matched : m.brand.adaptiveFeatures)
                      .slice(0, 3)
                      .map((f) => (
                        <span
                          key={f}
                          className="badge border border-primary-100 bg-primary-50 text-primary-700"
                        >
                          {f}
                        </span>
                      ))}
                  </div>

                  <Link
                    href={`/brands/${m.brand.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                  >
                    View brand
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Reveal>
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

  const matches = matchBrands(answers);
  const categories = categoriesForAnswers(answers.clothing);
  const matchedBrandIds = new Set(matches.slice(0, 3).map((m) => m.brand.id));
  const nearbyPlaces = mapPlaces.filter(
    (p) => !p.brandId || matchedBrandIds.has(p.brandId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-widest text-primary-600">
            Quiz complete
          </p>
          <h1
            className="animate-fade-up mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            style={{ animationDelay: "60ms" }}
          >
            {answeredAnything ? "Your matches, piece by piece" : "Start with these pieces"}
          </h1>
          <p
            className="animate-fade-up mt-2 text-sm text-gray-500 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {answeredAnything
              ? "The clothing pieces that fit your needs — and the brands that make each one best."
              : "You skipped the questions, so here are the most-loved adaptive pieces to start from."}
          </p>
          <div
            className="animate-fade-up mt-5 flex flex-wrap gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/quiz" className="btn-secondary px-5 py-2.5 text-sm">
              Retake quiz
            </Link>
            <Link href="/search" className="btn-secondary px-5 py-2.5 text-sm">
              Browse all clothing
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        {categories.map((cat, i) => (
          <CategorySection
            key={cat.id}
            category={cat}
            answers={answers}
            matches={matches}
            index={i}
          />
        ))}

        {/* Overall brand ranking */}
        <Reveal>
          <section className="card p-6 sm:p-8" aria-labelledby="overall-heading">
            <h2 id="overall-heading" className="text-lg font-semibold text-gray-900">
              Recommended brands overall
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Across every clothing piece, ranked by fit with your answers.
            </p>
            <div className="mt-5 space-y-4">
              {matches.map((m) => (
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
                    {m.stylePercent !== null && (
                      <span className="text-xs text-gray-400">
                        Style {m.stylePercent}%
                      </span>
                    )}
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
