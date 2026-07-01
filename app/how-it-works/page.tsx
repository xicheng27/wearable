import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";

export const metadata = {
  title: "How It Works",
  description:
    "How Xi's translates mobility, comfort, body access, style and location into strict adaptive clothing recommendations by need — and how the quiz and filters work.",
  alternates: { canonical: "/how-it-works" },
};

const targetGroups = [
  {
    title: "Wheelchair and seated mobility users",
    text: "Prioritises seated fit, pressure-sensitive areas, easy access, no bulky back pockets and clothing that does not bunch while seated.",
  },
  {
    title: "Limited dexterity and one-handed dressing",
    text: "Filters for magnetic closures, Velcro, elastic waists, front openings, slip-on designs and fewer small fasteners.",
  },
  {
    title: "Elderly and caregiver-assisted dressing",
    text: "Looks for open-back, side-opening, easy-change, washable and comfortable clothing that reduces bending and twisting.",
  },
  {
    title: "Sensory-sensitive comfort",
    text: "Prioritises soft, tagless, low-seam, breathable and non-restrictive pieces when sensory needs are selected.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-ivory">
      <section className="paper-texture border-b border-ink/10 bg-paper px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">How it works</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Tell us your clothing needs. We do the matching.
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink/68">
            Xi&apos;s translates mobility, comfort, body access, style and
            location into adaptive clothing recommendations. Accessibility needs
            come first; style and budget refine the results.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-primary px-7 py-3.5 text-base">
              Find clothing for me <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/search" className="btn-secondary px-7 py-3.5 text-base">
              Browse products
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="bg-paper px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="who-heading">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Who it&apos;s for</p>
            <h2 id="who-heading" className="section-title">
              Built around real adaptive needs.
            </h2>
            <p className="section-subtitle text-lg">
              The quiz groups your self-selected answers into shopping
              categories only — never a medical assessment or diagnosis.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {targetGroups.map((group) => (
              <article key={group.title} className="card p-6">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {group.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-ink/70">{group.text}</p>
              </article>
            ))}
          </div>

          <div className="paper-panel mt-12 flex flex-col gap-5 rounded-[2rem_.9rem_2rem_2rem] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">
                Ready when you are.
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink/70">
                Answer a short visual quiz about dressing, mobility, comfort,
                access, style and budget. Every result explains why it matched.
              </p>
            </div>
            <Link href="/quiz" className="btn-primary shrink-0 px-8 py-4 text-lg">
              Start the quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
