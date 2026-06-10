const steps = [
  {
    number: "01",
    title: "Search for a piece",
    description:
      "Start with what you want to wear: a magnetic shirt, wheelchair jeans, easy shoes or a sensory-friendly layer.",
  },
  {
    number: "02",
    title: "Filter around your life",
    description:
      "Narrow the catalog by accessibility need, adaptive feature, style, size, budget, fit and availability.",
  },
  {
    number: "03",
    title: "Compare across brands",
    description:
      "See individual items from different labels together instead of searching one brand at a time.",
  },
  {
    number: "04",
    title: "Open the full details",
    description:
      "Learn how each design works, then visit the official brand or retailer to check current stock and sizing.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            From need to item
          </p>
          <h2
            id="how-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            How Xi&apos;s works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-sm font-black text-white">
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
