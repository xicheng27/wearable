import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import BodyModel from "@/components/quiz/BodyModel";
import QuizCtaLink from "@/components/QuizCtaLink";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Adaptive Clothing Finder — Clothing That Works for Your Body",
  description:
    "Take a short visual quiz to get adaptive clothing recommendations by mobility, comfort, access need, style and location — or browse accessible, disability-friendly fashion directly.",
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.title,
    description:
      "Take a short quiz to get adaptive clothing recommendations by mobility, comfort, access need, style and location.",
    url: siteConfig.url,
    type: "website",
  },
};

const navItems = [
  { href: "/search", label: "Browse clothing" },
  { href: "/singapore", label: "Singapore guide" },
  { href: "/map", label: "Global map" },
  { href: "/saved", label: "Saved" },
  { href: "/how-it-works", label: "How it works" },
];

const previewSignals = [
  { label: "Fit & mobility", pct: 88 },
  { label: "Access & dexterity", pct: 76 },
  { label: "Sensory comfort", pct: 54 },
];

export default function HomePage() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-ivory">
      {/* Minimal top bar */}
      <header className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Logo size={34} />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-sand/40 hover:text-ink ${
                index === 0 ? "" : "hidden lg:inline-flex"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Centre stage */}
      <div className="grid min-h-0 flex-1 items-center gap-8 px-5 pb-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12">
        <div className="max-w-xl">
          <p className="eyebrow">Adaptive clothing intelligence</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">
            Find adaptive clothing that works for your body.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-ink/65">
            Answer a short visual quiz and get clothing recommendations based on
            mobility, comfort, access needs, style, and location.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuizCtaLink className="btn-primary px-8 py-4 text-lg" location="home_hero">
              Start quiz
              <span aria-hidden="true">&rarr;</span>
            </QuizCtaLink>
            <Link href="/search" className="btn-secondary px-7 py-4 text-base">
              Browse clothing
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink/55">
            Free to use · no account needed · takes about 2 minutes
          </p>
        </div>

        {/* Visual preview: interactive model + signal-map vibe */}
        <div className="relative hidden h-full max-h-[68vh] items-center justify-center lg:flex">
          <div className="paper-panel relative grid w-full max-w-md grid-cols-[1fr_1.1fr] items-center gap-4 rounded-[2.25rem_.9rem_2.25rem_2.25rem] p-6">
            <BodyModel
              persona="adult"
              zones={["hips", "hands", "skin"]}
              accents={{ soft: true, oneHanded: true }}
              className="h-[44vh] w-auto"
            />
            <div className="space-y-4">
              <p className="font-hand text-sm font-semibold text-primary-700">
                Signal map
              </p>
              {previewSignals.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-ink/75">{s.label}</span>
                    <span className="font-display text-base font-semibold text-ink">
                      {s.pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-primary-600"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["seated fit", "soft fabric", "easy entry"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile preview strip */}
        <div className="flex items-center justify-center lg:hidden">
          <div className="paper-panel flex items-center gap-4 rounded-[1.5rem_.6rem_1.5rem_1.5rem] p-4">
            <BodyModel
              persona="adult"
              zones={["hips", "skin"]}
              accents={{ soft: true }}
              className="h-32 w-auto"
            />
            <div className="space-y-2">
              {previewSignals.slice(0, 2).map((s) => (
                <div key={s.label} className="w-36">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-ink/70">{s.label}</span>
                    <span className="font-semibold text-ink">{s.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full rounded-full bg-primary-600" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
