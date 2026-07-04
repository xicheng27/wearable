"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";
import ProductCard from "@/components/ProductCard";
import MatchBadges, { ConfidenceBadge } from "@/components/MatchBadges";
import CountrySelector from "@/components/CountrySelector";
import {
  PASSPORT_FILTER_STORAGE_KEY,
  usePassport,
} from "@/components/PassportProvider";
import { passportMustHaves, passportToRecommendationInput } from "@/lib/passport";
import { evaluateProductForInput } from "@/lib/recommendationEngine";
import {
  searchProducts,
  filterProductsByCountry,
  diversifyProducts,
} from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";
import { trackEvent } from "@/lib/analytics";
import type { ProductNeedsEvaluation } from "@/types";

// Filter keys that represent real access / functional needs (not taste or
// availability). searchProducts is a strict AND filter, so every result meets
// all of these — coverage is honestly 100% and never invented. Style, brand,
// budget, size, fit, availability and location are preferences, not needs.
const NEED_FILTER_KEYS = [
  "disability",
  "feature",
  "sensory",
  "seated",
  "oneHanded",
  "easyClosures",
  "wheelchair",
  "limitedDexterity",
  "prosthetic",
  "difficulty",
] as const;

const filterLabels: Record<string, string> = {
  clothing: "Clothing",
  brand: "Brand",
  disability: "Need",
  feature: "Feature",
  style: "Style",
  budget: "Budget",
  size: "Size",
  fit: "Fit",
  availability: "Availability",
  location: "Location",
  difficulty: "Dressing difficulty",
  sensory: "Sensory-friendly",
  seated: "Seated fit",
  oneHanded: "One-handed dressing",
  easyClosures: "Easy closures",
  wheelchair: "Wheelchair users",
  limitedDexterity: "Limited dexterity",
  prosthetic: "Prosthetic access",
};

const PAGE_SIZE = 48;

export default function SearchResults({
  params,
}: {
  params: Record<string, string>;
}) {
  const router = useRouter();
  const { country, setCountry } = useCountry();
  const { passport, hydrated: passportHydrated } = usePassport();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mounted, setMounted] = useState(false);
  const [passportOn, setPassportOn] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    setPassportOn(window.localStorage.getItem(PASSPORT_FILTER_STORAGE_KEY) === "1");
  }, []);

  function togglePassportFilter() {
    setPassportOn((on) => {
      const next = !on;
      window.localStorage.setItem(PASSPORT_FILTER_STORAGE_KEY, next ? "1" : "0");
      trackEvent("passport_filter_toggled", { on: next });
      return next;
    });
  }

  const query = params.q ?? "";

  // Identical filtering to the server component — recomputed on the client so
  // there is no large prop payload and no hydration mismatch.
  const matchedFilters = searchProducts({
    query: query || undefined,
    clothingType: params.clothing || undefined,
    brand: params.brand || undefined,
    disabilityNeed: params.disability || undefined,
    adaptiveFeature: params.feature || undefined,
    style: params.style || undefined,
    budget: params.budget || undefined,
    size: params.size || undefined,
    genderFit: params.fit || undefined,
    availability: params.availability || undefined,
    location: params.location || undefined,
    sensoryFriendly: params.sensory === "true",
    seatedFit: params.seated === "true",
    oneHandedDressing: params.oneHanded === "true",
    easyClosures: params.easyClosures === "true",
    wheelchairFriendly: params.wheelchair === "true",
    limitedDexterity: params.limitedDexterity === "true",
    prostheticAccess: params.prosthetic === "true",
    dressingDifficulty: params.difficulty || undefined,
  });

  // Country narrowing only happens once mounted (country comes from
  // localStorage / detection), so the server render shows all matches.
  const countryFiltered = mounted
    ? filterProductsByCountry(matchedFilters, country)
    : matchedFilters;
  const hiddenByLocation =
    countryFiltered.length === 0 &&
    matchedFilters.length > 0 &&
    !!country &&
    country !== GLOBAL;

  const activeFilters = Object.keys(filterLabels)
    .filter((key) => Boolean(params[key]))
    .map((key) => ({
      key,
      label:
        params[key] === "true"
          ? filterLabels[key]
          : `${filterLabels[key]}: ${params[key]}`,
    }));

  // Human-readable list of the access needs currently being filtered on.
  // Boolean toggles use their label ("Seated fit"); value filters use the value.
  const needsCovered = NEED_FILTER_KEYS.filter(
    (key) => params[key] && params[key] !== "false"
  ).map((key) => (params[key] === "true" ? filterLabels[key] : params[key]));
  const hasNeeds = needsCovered.length > 0;

  const isDefaultView = activeFilters.length === 0 && !query;
  const baseResults =
    isDefaultView && mounted ? diversifyProducts(countryFiltered) : countryFiltered;

  // "Use my passport to filter products": every item is evaluated against the
  // Adaptive Fit Passport's hard requirements (category, range, location and
  // access needs). Items that fail are hidden — never silently mixed in.
  const passportActive = mounted && passportHydrated && passportOn && Boolean(passport);
  const passportInput = useMemo(
    () => (passport ? passportToRecommendationInput(passport) : null),
    [passport]
  );
  const passportMust = useMemo(
    () => (passport ? passportMustHaves(passport) : []),
    [passport]
  );
  // Evaluating the whole result set is regex-heavy, so only recompute when
  // the inputs that shape baseResults (params, country, mount) or the
  // passport change — not on unrelated re-renders like "Load more" clicks.
  const paramsKey = JSON.stringify(params);
  const passportEvaluations = useMemo<Map<string, ProductNeedsEvaluation> | null>(
    () => {
      if (!passportActive || !passportInput) return null;
      return new Map(
        baseResults.map((product) => [
          product.id,
          evaluateProductForInput(product, passportInput),
        ])
      );
    },
    // baseResults is rebuilt each render but derives solely from these deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [passportActive, passportInput, paramsKey, country, mounted]
  );
  const results = passportEvaluations
    ? baseResults.filter(
        (product) => passportEvaluations.get(product.id)?.meetsAllNeeds
      )
    : baseResults;
  const hiddenByPassport = baseResults.length - results.length;
  const visibleResults = results.slice(0, visibleCount);

  function buildHref(next: URLSearchParams) {
    const qs = next.toString();
    return qs ? `/search?${qs}` : "/search";
  }

  function removeFilter(key: string) {
    const next = new URLSearchParams(params);
    next.delete(key);
    trackEvent("filter_cleared", { filter: key });
    router.push(buildHref(next));
  }

  function clearAll() {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    trackEvent("filter_cleared", { filter: "all" });
    router.push(buildHref(next));
  }

  // Focus trap + Escape handling for the mobile filter drawer.
  const closeDrawer = useCallback(() => {
    setMobileFiltersOpen(false);
    filtersButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const node = drawerRef.current;
    const focusable = node?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileFiltersOpen, closeDrawer]);

  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Product discovery</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            {query ? `Adaptive clothing for "${query}"` : "Browse adaptive clothing"}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            Compare individual disability-friendly and mobility-friendly pieces
            from different brands by fit, function, style, accessibility need and
            location availability.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <SearchBar
                defaultValue={query}
                placeholder="Try 'magnetic shirt', 'wheelchair jeans' or 'easy shoes'"
              />
            </div>
            <CountrySelector className="justify-between px-4 py-3 text-sm" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="paper-panel sticky top-24 rounded-[1.5rem_.8rem_1.5rem_1.5rem] p-6">
              <SearchFilters />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {/* Sticky result toolbar: count, active chips, clear all, filter button */}
            <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-ink/10 bg-ivory/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className="mr-1 text-sm text-ink/65"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <span className="font-bold text-ink">{results.length}</span>{" "}
                    {results.length === 1 ? "item" : "items"}
                    {query ? ` for "${query}"` : ""}
                  </p>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => removeFilter(filter.key)}
                      className="inline-flex min-h-9 items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-800 hover:bg-primary-100"
                      aria-label={`Remove ${filter.label} filter`}
                    >
                      {filter.label}
                      <span aria-hidden="true">&times;</span>
                    </button>
                  ))}
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="rounded-lg px-2 py-1 text-sm font-bold text-primary-800 underline underline-offset-2 hover:bg-primary-50"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <button
                  ref={filtersButtonRef}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 py-2 text-base font-bold text-ink/80 shadow-soft lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={mobileFiltersOpen}
                >
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Adaptive Fit Passport filter */}
            {mounted && passportHydrated && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-paper px-4 py-3 sm:px-5">
                {passport ? (
                  <>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={passportOn}
                      onClick={togglePassportFilter}
                      className="inline-flex min-h-11 items-center gap-3 rounded-xl px-1 py-1 text-left text-sm font-bold text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border transition-colors ${
                          passportOn
                            ? "border-primary-700 bg-primary-700"
                            : "border-ink/25 bg-ink/15"
                        }`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white shadow transition-all ${
                            passportOn ? "left-6" : "left-1"
                          }`}
                        />
                      </span>
                      Use my passport to filter products
                      <span className="font-normal text-ink/55">
                        {passportOn ? "(on)" : "(off)"}
                      </span>
                    </button>
                    <Link
                      href="/passport"
                      className="link-underline text-sm font-semibold text-primary-800"
                    >
                      View / edit passport
                    </Link>
                  </>
                ) : (
                  <p className="text-sm leading-6 text-ink/70">
                    Take the{" "}
                    <Link
                      href="/quiz"
                      className="font-bold text-primary-800 underline underline-offset-2"
                    >
                      short quiz
                    </Link>{" "}
                    to create an Adaptive Fit Passport, then filter everything
                    here by your real needs.
                  </p>
                )}
              </div>
            )}

            {passportActive && results.length > 0 && passportMust.length > 0 && (
              <div className="mb-6 rounded-2xl border border-primary-200 bg-primary-50/60 px-5 py-4" role="status">
                <p className="text-sm font-bold text-primary-900">
                  Filtered by your Adaptive Fit Passport — {results.length} of{" "}
                  {baseResults.length} items meet your must-haves
                  {hiddenByPassport > 0 ? ` (${hiddenByPassport} hidden)` : ""}.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {passportMust.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-2.5 py-1 text-xs font-bold text-white"
                    >
                      <span aria-hidden="true">✓</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {passportActive && passportMust.length === 0 && (
              <div className="mb-6 rounded-2xl border border-ink/15 bg-paper px-5 py-4" role="status">
                <p className="text-sm leading-6 text-ink/70">
                  Your passport doesn&apos;t have any must-have requirements
                  yet, so nothing is filtered out.{" "}
                  <Link
                    href="/passport"
                    className="font-bold text-primary-800 underline underline-offset-2"
                  >
                    Add needs to your passport
                  </Link>{" "}
                  to narrow this list to items that truly fit.
                </p>
              </div>
            )}

            {results.length > 0 && hasNeeds && !passportActive && (
              <div className="mb-6 rounded-2xl border border-primary-200 bg-primary-50/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">
                    <span aria-hidden="true">✓</span>Exact matches
                  </span>
                  <span className="rounded-full border border-primary-200 bg-paper px-2.5 py-1 text-xs font-bold text-primary-800">
                    Needs matched 100%
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/70">
                  Every item below meets all of your selected access needs. Style,
                  budget and other filters only narrow the list — they never
                  override an access need.
                </p>
                <div className="mt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
                    Needs covered
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {needsCovered.map((need) => (
                      <span
                        key={need}
                        className="rounded-md border border-primary-200 bg-paper px-2 py-0.5 text-xs font-semibold text-primary-900"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {results.length > 0 && !hasNeeds && (query || activeFilters.length > 0) && (
              <p className="mb-6 text-sm leading-6 text-ink/60">
                Showing items that match your selected filters. Add an access need
                (like seated fit or sensory-friendly) to see constraint coverage.
              </p>
            )}

            {passportActive && results.length === 0 && baseResults.length > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-16 text-center">
                <h2 className="text-xl font-bold text-ink">
                  None of these {baseResults.length} items meet your
                  passport&apos;s must-haves.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-ink/65">
                  Rather than show items that don&apos;t fit your needs, we hid
                  them. Broaden one requirement in your passport, or turn the
                  passport filter off to see everything.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={togglePassportFilter}
                    className="btn-primary"
                  >
                    Turn passport filter off
                  </button>
                  <Link href="/passport" className="btn-secondary">
                    Edit my passport
                  </Link>
                </div>
              </div>
            ) : results.length === 0 && hiddenByLocation ? (
              <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-20 text-center">
                <h2 className="text-xl font-bold text-ink">
                  No products currently available for your location.
                </h2>
                <p className="mt-2 text-ink/60">
                  These items do not list shipping to {country} yet.
                </p>
                <button
                  type="button"
                  onClick={() => setCountry(GLOBAL)}
                  className="btn-primary mt-6 inline-block"
                >
                  View globally available items
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-20 text-center">
                <h2 className="text-xl font-bold text-ink">No clothing items found</h2>
                <p className="mt-2 text-ink/60">
                  Try a broader phrase or remove one of the filters. You can also
                  take the quiz to get matched by your needs.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href="/search" className="btn-primary inline-block">
                    Clear all filters
                  </a>
                  <a href="/quiz" className="btn-secondary inline-block">
                    Take the quiz
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleResults.map((product) => {
                  // With no must-haves there is nothing to vet, so per-card
                  // "meets your passport" badges would be empty reassurance.
                  const evaluation =
                    passportMust.length > 0
                      ? passportEvaluations?.get(product.id)
                      : undefined;
                  return evaluation ? (
                    <div key={product.id} className="flex flex-col">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">
                          <span aria-hidden="true">✓</span>
                          Meets your passport
                        </span>
                        <ConfidenceBadge level={evaluation.confidence} />
                      </div>
                      <ProductCard product={product} />
                    </div>
                  ) : hasNeeds ? (
                    <div key={product.id} className="flex flex-col">
                      <MatchBadges
                        isFallback={false}
                        coverage={100}
                        className="mb-2"
                      />
                      <ProductCard product={product} />
                    </div>
                  ) : (
                    <ProductCard key={product.id} product={product} />
                  );
                })}
              </div>
            )}
            {visibleCount < results.length && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  className="btn-primary min-w-48"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Load more clothing
                </button>
                <p className="text-sm text-ink/60">
                  Showing {visibleResults.length} of {results.length} items
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <button
            className="fixed inset-0 bg-black/40"
            onClick={closeDrawer}
            aria-label="Close filters"
            tabIndex={-1}
          />
          <div
            ref={drawerRef}
            className="relative ml-auto h-full w-[min(24rem,92vw)] overflow-y-auto bg-ivory p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filter clothing</h2>
              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-2xl text-ink/60 hover:bg-sand/50"
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>
            <SearchFilters />
          </div>
        </div>
      )}
    </div>
  );
}
