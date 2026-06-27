import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

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

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="bg-paper px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="assistant-heading">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">One clear path</p>
            <h2 id="assistant-heading" className="section-title">
              The quiz is the easiest place to start.
            </h2>
            <p className="section-subtitle text-lg">
              Xi&apos;s is a guided matching tool for adaptive fashion, built
              around accessibility needs first and personal style second.
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
                Need help choosing?
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink/70">
                Answer simple questions about daily dressing, mobility, comfort,
                style range and budget. The results explain every match.
              </p>
            </div>
            <Link href="/quiz" className="btn-primary shrink-0 px-8 py-4 text-lg">
              Find clothing for me
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="paper-texture bg-lavender py-24 text-ink" aria-labelledby="cta-heading">
        <div className="paper-panel mx-auto max-w-4xl rounded-[3rem_1rem_3rem_3rem] px-6 py-14 text-center sm:px-12">
          <p className="eyebrow">Your wardrobe, your terms</p>
          <h2 id="cta-heading" className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Start with what you want to wear.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/65">
            Tell us your needs once and we match exact pieces to your body,
            accessibility needs, location and style, or browse everything yourself.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/quiz" className="btn-primary px-8 py-4">
              Find clothing for me <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/search" className="btn-secondary px-8 py-4">
              Browse adaptive clothing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
