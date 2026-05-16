const steps = [
  {
    number: "01",
    title: "Tell us your needs",
    description:
      "Search by disability type, adaptive feature, or clothing category. Filter results so you only see brands that are genuinely relevant to you.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Explore the details",
    description:
      "Each brand page lists every adaptive feature, who it suits, honest customer reviews from people with the same disability as you, and store locations.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Check shipping & returns",
    description:
      "See whether a brand ships to your country, what free-shipping thresholds apply, and how easy it is to return. No more surprises at checkout.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Shop with confidence",
    description:
      "Click through to the brand's own website or nearest stockist, knowing the clothing was made with your specific disability in mind.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="how-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            How WearAble works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We cut through the noise so you spend less time searching and more time wearing things you love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px bg-gray-200 -translate-x-8 z-0"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-primary-50 border-2 border-primary-100 flex items-center justify-center text-primary-600 mb-5">
                  {step.icon}
                </div>
                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">
                  Step {step.number}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
