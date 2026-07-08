"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Home hero calls-to-action — deliberately quiz-first.
 *
 * The primary action pushes shoppers into the guided quiz ("Find clothing for
 * my needs"); browsing stays available but is visually and hierarchically
 * secondary. Both fire named funnel events (plus the existing quiz-start event
 * so the funnel stays continuous).
 */
export default function HomeCtas() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/quiz"
          onClick={() => {
            trackEvent("homepage_cta_quiz_click", { location: "home_hero" });
            trackEvent("cta_quiz_start", { location: "home_hero" });
          }}
          className="btn-primary px-8 py-4 text-lg"
        >
          Find clothing for my needs
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href="/search"
          onClick={() => trackEvent("homepage_cta_browse_click", { location: "home_hero" })}
          className="btn-secondary px-7 py-4 text-base"
        >
          Browse all clothing
        </Link>
      </div>
      <p className="mt-4 text-sm text-ink/60">
        Tell us your dressing challenge and we&apos;ll find clothing that works
        &middot; free &middot; no account needed &middot; about 2 minutes
      </p>
    </div>
  );
}
