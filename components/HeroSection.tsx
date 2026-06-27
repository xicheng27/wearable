"use client";

import Link from "next/link";

const signals = [
  "Physical needs first",
  "Style and fit second",
  "Country availability checked",
  "Official product links",
];

export default function HeroSection() {
  return (
    <section
      className="paper-texture relative overflow-hidden border-b border-ink/10 bg-ivory"
      aria-labelledby="hero-heading"
    >
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-clay/10 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-72 w-72 bg-lavender/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="relative z-10">
          <p className="eyebrow rotate-[-1deg]">Personal adaptive fashion assistant</p>
          <h1
            id="hero-heading"
            className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[.98] tracking-[-.045em] text-ink sm:text-6xl lg:text-[4.9rem]"
          >
            Find clothes that fit your body, needs, and daily life.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-ink/74">
            Xi&apos;s builds adaptive clothing recommendations from a guided
            quiz, matching mobility, dressing method, sensory comfort, style,
            age, budget and country availability with tagged product data.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="btn-primary px-8 py-4 text-lg">
              Start personalisation quiz <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/search" className="btn-secondary px-8 py-4 text-base">
              Browse catalogue
            </Link>
          </div>

          <p className="mt-5 max-w-xl text-base leading-7 text-ink/65">
            The quiz is the main feature. It filters out unsuitable items first,
            then ranks the remaining pieces by style, budget and fit.
          </p>
        </div>

        <div className="paper-panel relative rounded-[2.5rem_.9rem_2.5rem_2.5rem] p-6 shadow-lift sm:p-8">
          <p className="eyebrow">How matching works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
            From real-life needs to practical clothing picks.
          </h2>
          <div className="mt-6 space-y-4">
            {[
              ["1", "Tell us about dressing challenges", "Wheelchair fit, dexterity, caregiver help, sensory comfort and medical access are treated as serious constraints."],
              ["2", "Add style, age and budget", "The system respects clothing range, style preference and country availability after access needs are protected."],
              ["3", "Get explained recommendations", "Each result shows why it matched, which tags matched, and what did not match."],
            ].map(([step, title, body]) => (
              <article key={step} className="rounded-2xl border border-ink/10 bg-paper p-4">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-800 font-bold text-paper">
                    {step}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{title}</h3>
                    <p className="mt-1 text-base leading-7 text-ink/68">{body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {signals.map((signal) => (
              <span key={signal} className="badge bg-primary-50 text-primary-900">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
