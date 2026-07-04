"use client";

import Link from "next/link";
import { usePassport } from "@/components/PassportProvider";
import { passportMustHaves, passportSections } from "@/lib/passport";

/**
 * Compact Adaptive Fit Passport panel shown beside the quiz results — the
 * bridge between "here are your matches" and "here is the reusable profile
 * they were matched against".
 */
export default function PassportSummary() {
  const { passport, hydrated } = usePassport();

  if (!hydrated) return null;

  if (!passport) {
    return (
      <div className="mt-6 rounded-2xl border border-ink/15 bg-paper px-5 py-4">
        <p className="text-sm leading-6 text-ink/70">
          These results come from a shared link.{" "}
          <Link href="/quiz" className="font-bold text-primary-800 underline underline-offset-2">
            Take the quiz
          </Link>{" "}
          to create your own reusable Adaptive Fit Passport.
        </p>
      </div>
    );
  }

  const sections = passportSections(passport).filter((s) => s.id !== "words");
  const mustHaves = passportMustHaves(passport);

  return (
    <section
      aria-labelledby="passport-summary-heading"
      className="mt-6 overflow-hidden rounded-3xl border border-primary-200 bg-paper"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 bg-primary-50/60 px-5 py-4 sm:px-6">
        <div>
          <h2 id="passport-summary-heading" className="font-display text-xl font-semibold text-ink">
            Your Adaptive Fit Passport
          </h2>
          <p className="mt-0.5 text-sm text-ink/60">
            Every match below was checked against this profile. Saved on this
            device — reuse it when browsing.
          </p>
        </div>
        <Link href="/passport" className="btn-secondary px-4 py-2.5 text-sm">
          View &amp; edit passport
        </Link>
      </div>

      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {mustHaves.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-800">
              Must-haves
            </h3>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {mustHaves.slice(0, 5).map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-2.5 py-1 text-xs font-bold text-white"
                >
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sections.slice(0, 5).map((section) => (
          <div key={section.id}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/55">
              {section.title}
            </h3>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {section.items.slice(0, 4).map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-ink/10 bg-ivory px-2 py-0.5 text-xs font-semibold text-ink/75"
                >
                  {item}
                </li>
              ))}
              {section.items.length > 4 && (
                <li className="px-1 py-0.5 text-xs text-ink/50">
                  +{section.items.length - 4} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
