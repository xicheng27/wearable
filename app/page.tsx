import Link from "next/link";
import HeroSection from "@/components/HeroSection";

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
              The quiz is the start of every recommendation.
            </h2>
            <p className="section-subtitle text-lg">
              Xi&apos;s is not trying to be a giant storefront. It is a guided
              matching tool for adaptive fashion, built around accessibility
              needs first and personal style second.
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
                Ready to build your recommendations?
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink/70">
                Answer simple questions about daily dressing, mobility, comfort,
                style range and budget. The results explain every match.
              </p>
            </div>
            <Link href="/quiz" className="btn-primary shrink-0 px-8 py-4 text-lg">
              Build my recommendations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
