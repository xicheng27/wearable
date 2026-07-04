"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import MatchBadges from "@/components/MatchBadges";
import CountryEmptyState from "@/components/CountryEmptyState";
import { communityVerificationsFor } from "@/lib/communityVerification";
import { productShipsToCountry } from "@/data/products";
import { useCountry } from "@/components/CountryProvider";
import { GLOBAL } from "@/lib/countries";
import type { Product, RecommendationResult } from "@/types";

type Recommendation = Partial<RecommendationResult> & {
  product: Product;
  reasons: string[];
  matchedTags?: string[];
  unmatchedTags?: string[];
};

type FeedbackValue = "saved" | "liked" | "disliked" | "not_relevant";

function RecommendationFeedback({ productId }: { productId: string }) {
  const [selected, setSelected] = useState<FeedbackValue | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(`xis-feedback-${productId}`);
    if (
      stored === "saved" ||
      stored === "liked" ||
      stored === "disliked" ||
      stored === "not_relevant"
    ) {
      setSelected(stored);
    }
  }, [productId]);

  function choose(value: FeedbackValue) {
    setSelected(value);
    window.localStorage.setItem(`xis-feedback-${productId}`, value);
  }

  const actions: { value: FeedbackValue; label: string }[] = [
    { value: "saved", label: "Save" },
    { value: "liked", label: "Like" },
    { value: "disliked", label: "Dislike" },
    { value: "not_relevant", label: "Not relevant" },
  ];

  return (
    <div className="mt-4 border-t border-primary-200 pt-3">
      <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
        Your feedback{" "}
        <span className="font-semibold normal-case tracking-normal text-primary-800/70">
          (private to this device)
        </span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => choose(action.value)}
            aria-pressed={selected === action.value}
            className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-bold ${
              selected === action.value
                ? "border-primary-800 bg-primary-800 text-white"
                : "border-primary-200 bg-paper text-primary-900 hover:border-primary-500"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-xs font-semibold text-primary-900" role="status">
          Saved on this device only — it tunes your own recommendations and is
          never shared as community proof.
        </p>
      )}
    </div>
  );
}

/**
 * The "Truth Card" detail block under each recommended product: the real
 * match score, a confidence level explaining how verifiable the match is,
 * why it matched (function / style / availability), honest pre-purchase
 * checks, and community fit reports (an empty, future-ready section until
 * wearers can verify items — never invented social proof).
 */
function MatchDetail({
  product,
  reasons,
  itemClassification,
  needsSatisfied,
  preferencesSatisfied,
  unmetNeeds,
  isFallback,
  explanation,
  availabilityLabel,
  matchQuality,
  confidence,
  confidenceNotes,
  checkBeforeBuying,
  matchedTags,
  unmatchedTags,
}: Recommendation) {
  const why =
    explanation && explanation.length > 0
      ? explanation
      : reasons.length > 0
        ? reasons.join(". ")
        : `${product.adaptiveFeatures.slice(0, 2).join(" and ")} with a ${
            product.styleTags[0]?.toLowerCase() ?? "practical"
          } style.`;

  const functionTags =
    matchedTags && matchedTags.length > 0 ? matchedTags : needsSatisfied ?? [];
  const styleTags = preferencesSatisfied ?? [];
  const verifications = communityVerificationsFor(product);

  // Constraint coverage is REAL: the share of your active access needs this item
  // meets (satisfied vs satisfied + still-unmet). Exact matches cover them all;
  // when no functional needs were set there is nothing to cover, so we hide the
  // percentage rather than invent one. No fabricated "match %" is ever shown.
  const satisfied = needsSatisfied ?? [];
  const unmet = unmetNeeds ?? [];
  const totalConstraints = satisfied.length + unmet.length;
  const coverage =
    totalConstraints > 0
      ? Math.round((satisfied.length / totalConstraints) * 100)
      : null;

  return (
    <div
      className={`-mt-3 rounded-b-2xl border border-t-0 px-5 pb-5 pt-6 ${
        isFallback ? "border-amber-200 bg-amber-50/60" : "border-primary-100 bg-primary-50"
      }`}
    >
      <MatchBadges
        isFallback={Boolean(isFallback)}
        coverage={coverage}
        confidence={confidence}
        quality={matchQuality}
      />
      {matchQuality === "strong" && (
        <p className="mt-2 text-xs leading-5 text-ink/60">
          Meets every access need you selected — it just misses a minor style
          or budget preference.
        </p>
      )}
      {confidence && confidenceNotes && confidenceNotes.length > 0 && (
        <p className="mt-2 text-xs leading-5 text-ink/60">{confidenceNotes[0]}</p>
      )}

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-primary-800/80">
        Why this matches you
      </p>

      {itemClassification && itemClassification.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {itemClassification.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-semibold text-primary-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-2 text-sm leading-6 text-primary-950">{why}</p>

      {functionTags.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Function match
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {functionTags.slice(0, 8).map((need) => (
              <span
                key={need}
                className="rounded-md border border-primary-200 bg-paper px-2 py-0.5 text-xs font-semibold text-primary-900"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {styleTags.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Style &amp; budget match
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {styleTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary-200 bg-paper px-2 py-0.5 text-xs font-semibold text-primary-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {availabilityLabel && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Availability
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-800">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            {availabilityLabel}
          </p>
        </div>
      )}

      {unmatchedTags && unmatchedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary-700/80">
            Still check
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {unmatchedTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary-200 bg-transparent px-2 py-0.5 text-xs font-semibold text-primary-900/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {isFallback && unmetNeeds && unmetNeeds.length > 0 && (
        <p className="mt-3 text-xs font-medium text-amber-700">
          Doesn&apos;t yet cover: {unmetNeeds.slice(0, 2).join(", ").toLowerCase()}.
        </p>
      )}

      {checkBeforeBuying && checkBeforeBuying.length > 0 && (
        <div className="mt-4 rounded-xl border border-ink/10 bg-paper px-3.5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink/60">
            Check before buying
          </p>
          <ul className="mt-1.5 space-y-1">
            {checkBeforeBuying.map((check) => (
              <li key={check} className="flex gap-1.5 text-xs leading-5 text-ink/75">
                <span aria-hidden="true" className="mt-0.5 flex-shrink-0">
                  ☐
                </span>
                {check}
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.sourceVerifiedAt && (
        <p className="mt-3 text-xs text-ink/55">
          Source last verified{" "}
          {new Date(product.sourceVerifiedAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          .
        </p>
      )}

      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink/60">
          Community fit reports
        </p>
        {verifications.length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {verifications.map((report) => (
              <li
                key={report.tag}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                  report.isWarning
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-primary-200 bg-paper text-primary-900"
                }`}
              >
                <span aria-hidden="true">{report.isWarning ? "⚠" : "✓"}</span>
                {report.label} ×{report.count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs leading-5 text-ink/55">
            No reports yet. Soon, wearers and caregivers will be able to
            confirm things like &ldquo;worked for wheelchair use&rdquo; or
            &ldquo;easy one-handed dressing&rdquo; here.
          </p>
        )}
      </div>

      <RecommendationFeedback productId={product.id} />
    </div>
  );
}

export default function RecommendationsGrid({
  recommendations,
  showActions = true,
}: {
  recommendations: Recommendation[];
  showActions?: boolean;
}) {
  const { country } = useCountry();
  const available = recommendations.filter(({ product }) =>
    productShipsToCountry(product, country ?? GLOBAL)
  );

  if (available.length === 0) return <CountryEmptyState />;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {available.map((recommendation) => (
          <div key={recommendation.product.id} className="flex flex-col">
            <ProductCard product={recommendation.product} />
            <MatchDetail {...recommendation} />
          </div>
        ))}
      </div>

      {showActions && (
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className="btn-outline">
            Retake quiz
          </Link>
          <Link href="/search" className="btn-primary">
            Browse all clothing
          </Link>
        </div>
      )}
    </>
  );
}
