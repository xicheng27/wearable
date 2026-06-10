import Link from "next/link";

const miniSteps = [
  { label: "Tell us your needs", detail: "Accessibility, comfort & style" },
  { label: "Get matched", detail: "Brands that genuinely fit" },
  { label: "Shop with confidence", detail: "Shipping & returns up front" },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background:
            "radial-gradient(55% 90% at 50% 0%, rgba(29, 158, 117, 0.07) 0%, rgba(29, 158, 117, 0) 100%)",
        }}
        aria-hidden="true"
      />

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="Xi's home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="select-none text-sm font-bold text-white">X</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Xi<span className="text-primary-600">&apos;s</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Landing navigation">
          <Link
            href="/search"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 sm:block"
          >
            Browse brands
          </Link>
          <Link
            href="/signin"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
          Personalised adaptive fashion
        </p>

        <h1
          className="animate-fade-up text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 sm:text-5xl md:text-[3.4rem]"
          style={{ animationDelay: "60ms" }}
        >
          Find adaptive clothing that actually fits your{" "}
          <span className="text-primary-600">needs, style, and comfort.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Discover adaptive brands matched to your accessibility needs,
          location, comfort, and personal style — no endless searching, no
          guesswork.
        </p>

        <div
          className="animate-fade-up mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "180ms" }}
        >
          <Link href="/quiz" className="btn-primary w-full px-8 py-4 text-base sm:w-auto">
            Find my fit
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/search" className="btn-secondary w-full px-8 py-4 text-base sm:w-auto">
            Browse brands
          </Link>
        </div>

        <div
          className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-gray-400"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/quiz"
            className="rounded-full px-2 py-1 font-medium transition-colors duration-200 hover:text-gray-600"
          >
            Continue as guest
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/quiz"
            className="rounded-full px-2 py-1 font-medium transition-colors duration-200 hover:text-gray-600"
          >
            Create account
          </Link>
        </div>

        <div
          className="animate-fade-up mt-16 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
          style={{ animationDelay: "320ms" }}
        >
          {miniSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-1">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-[11px] font-semibold text-primary-700">
                  {i + 1}
                </span>
                {step.label}
              </p>
              <p className="text-xs text-gray-400">{step.detail}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative pb-6 text-center text-xs text-gray-300">
        © 2025 Xi&apos;s · Made for the disability community
      </footer>
    </div>
  );
}
