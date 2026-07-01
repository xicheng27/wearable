import Link from "next/link";

export const metadata = {
  title: "Accessibility",
  description:
    "Accessibility features and usability commitments for Xi's adaptive fashion finder: keyboard navigation, screen-reader support, contrast, large touch targets and text controls.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="link-underline text-sm">
          Back to home
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Accessibility</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            Built to be easier to read, tap, and navigate
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
            Xi&apos;s is for people with different bodies, needs, vision,
            movement, and technology comfort levels. The site keeps product
            information plain, buttons large, and paths to clothing clear.
          </p>
        </header>

        <section className="paper-panel mt-10 rounded-[2rem_.9rem_2rem_2rem] p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-ink">
            On-page tools
          </h2>
          <p className="mt-3 text-base leading-7 text-ink/72">
            Use the Accessibility button in the lower-left corner to increase
            text size, turn on high contrast, reduce motion, or make buttons
            larger. Your choice is saved on this device.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            [
              "Keyboard support",
              "Navigation, filters, search, modals, cards, and forms are designed to work with Tab, Enter, Space, and Escape where appropriate.",
            ],
            [
              "Clear labels",
              "Search, location, filters, and forms use visible or screen-reader labels so users do not have to guess what a field means.",
            ],
            [
              "Readable cards",
              "Product cards show the product, brand, price, location availability, best-for need, adaptive features, and official links.",
            ],
            [
              "Independent tool",
              "Xi's is not affiliated with listed brands. Always confirm price, sizing, stock, shipping, and returns on the official site.",
            ],
          ].map(([title, body]) => (
            <article key={title} className="card p-5">
              <h2 className="text-lg font-extrabold text-ink">{title}</h2>
              <p className="mt-2 text-base leading-7 text-ink/70">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
