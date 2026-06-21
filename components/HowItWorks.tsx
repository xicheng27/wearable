const steps = [
  ["01", "Name the piece", "Start with what you want to wear: a shirt, easy shoes, seated-fit jeans or a softer layer."],
  ["02", "Add what matters", "Filter by movement, sensory needs, fasteners, fit, size, budget and availability."],
  ["03", "Compare honestly", "See products from different labels together, with accessibility details in plain language."],
  ["04", "Go to the source", "Open the exact product page to confirm current sizing, price and stock."],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="overflow-hidden bg-paper py-24 scroll-mt-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">A gentler way to search</p>
            <h2 id="how-heading" className="section-title mt-3">How Xi&apos;s works</h2>
            <p className="section-subtitle">
              No jargon-heavy directory. Just a clear path from what you need
              to a piece you can actually consider.
            </p>
            <svg className="mt-8 h-16 w-32 text-clay" viewBox="0 0 130 60" fill="none" aria-hidden="true">
              <path d="M5 15c28-8 54 2 68 19 9 11 21 15 43 11M108 36l10 9-13 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="space-y-5">
            {steps.map(([number, title, description], index) => (
              <article key={number} className={`paper-panel relative grid gap-4 p-6 sm:grid-cols-[5rem_1fr] sm:p-8 ${index % 2 ? "ml-0 rounded-[2rem_.7rem_2rem_2rem] lg:ml-10" : "mr-0 rounded-[.7rem_2rem_2rem_2rem] lg:mr-10"}`}>
                <span className="font-hand text-3xl font-bold text-primary-600">{number}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
                  <p className="mt-2 leading-7 text-ink/65">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
