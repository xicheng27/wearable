import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Tell us your needs",
    description:
      "Search by disability type, adaptive feature, or clothing category — so you only see brands that are genuinely relevant to you.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Explore the details",
    description:
      "Each brand page lists every adaptive feature, who it suits, and where to find it — no digging required.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Check shipping & returns",
    description:
      "See whether a brand ships to your country, free-shipping thresholds, and return policies — before checkout.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Shop with confidence",
    description:
      "Click through to the brand's own site or nearest stockist, knowing the clothing was made with your needs in mind.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center sm:mb-16">
          <h2 id="how-heading" className="section-title">
            How Xi&apos;s works
          </h2>
          <p className="section-subtitle mx-auto max-w-xl">
            We cut through the noise so you spend less time searching and more
            time wearing things you love.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={Math.min(i * 80, 320)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                {step.icon}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Step {step.number}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
