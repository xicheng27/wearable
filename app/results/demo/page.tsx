import Link from "next/link";
import { demoScenarios } from "@/lib/demoScenarios";

export const metadata = {
  title: "Demo recommendation reports | Xi's",
  description:
    "Five sample adaptive clothing profiles run through the real matching engine — see how strict hard filters, honest match tiers and confidence levels work before taking the quiz.",
};

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="paper-texture border-b border-ink/10 bg-paper py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">See it work</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Demo recommendation reports
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/68">
            Five sample profiles, each run live through the same matching engine
            the quiz uses. Every result, score and warning below comes from real
            product data — including the honest gaps where the catalogue can&apos;t
            yet satisfy a strict profile.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ul className="grid gap-4 sm:grid-cols-2">
          {demoScenarios.map((scenario) => (
            <li key={scenario.slug}>
              <Link
                href={`/results/demo/${scenario.slug}`}
                className="group block h-full rounded-3xl border border-ink/10 bg-paper p-6 transition hover:border-primary-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
              >
                <h2 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-primary-800">
                  {scenario.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">{scenario.persona}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {scenario.hardFilters.map((filter) => (
                    <li
                      key={filter}
                      className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-900"
                    >
                      {filter}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-bold text-primary-800">
                  View the report →
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/quiz" className="btn-primary">
            Build my own report
          </Link>
          <Link href="/how-it-works" className="btn-secondary">
            How the matching works
          </Link>
        </div>
      </main>
    </div>
  );
}
