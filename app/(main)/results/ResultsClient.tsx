"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MapCanvas from "@/components/MapCanvas";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { matchBrands, QuizAnswers } from "@/data/brands";
import { mapPlaces } from "@/data/places";

function readList(value: string | null): string[] {
  return value ? value.split(",").map(decodeURIComponent).filter(Boolean) : [];
}

function MatchRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 flex-shrink-0" role="img" aria-label={`${percent}% match`}>
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
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
        {percent}%
      </span>
    </div>
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
            {answeredAnything ? "Your matches" : "Our curated brands"}
          </h1>
          <p
            className="animate-fade-up mt-2 text-sm text-gray-500 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {answeredAnything
              ? "Ranked by how well each brand fits your answers — with the reasons why."
              : "You skipped the questions, so here's our full curated list — every brand is worth a look."}
          </p>
          <div
            className="animate-fade-up mt-5 flex flex-wrap gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/quiz" className="btn-secondary px-5 py-2.5 text-sm">
              Retake quiz
            </Link>
            <Link href="/search" className="btn-secondary px-5 py-2.5 text-sm">
              Browse all brands
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        {matches.map((m, i) => (
          <Reveal key={m.brand.id} delay={Math.min(i * 70, 280)}>
            <article className="card card-hover overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-36 flex-shrink-0 sm:h-auto sm:w-48">
                  <Photo src={m.brand.image} alt="" className="h-full w-full" />
                  <div
                    className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold shadow-sm ring-1 ring-gray-900/5"
                    style={{ color: m.brand.heroColor }}
                    aria-hidden="true"
                  >
                    {m.brand.logo}
                  </div>
                  {i === 0 && m.percent !== null && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                      Best match
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{m.brand.name}</h2>
                      <p className="mt-0.5 text-sm text-gray-500">{m.brand.tagline}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {m.brand.country} · {m.brand.priceRange} · Est. {m.brand.founded}
                      </p>
                    </div>
                    {m.percent !== null && <MatchRing percent={m.percent} />}
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {m.reasons.slice(0, 4).map((reason) => (
                      <li key={reason} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {reason}
                      </li>
                    ))}
                  </ul>

                  {m.stylePercent !== null && (
                    <div className="mt-4">
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

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.brand.adaptiveFeatures.slice(0, 3).map((f) => (
                      <span key={f} className="badge bg-gray-50 text-gray-500">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/brands/${m.brand.id}`}
                      className="btn-primary px-6 py-2.5 text-sm"
                    >
                      View brand
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}

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
