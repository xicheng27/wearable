import SearchBar from "./SearchBar";

const suggestions = [
  "Wheelchair users",
  "Sensory friendly",
  "Magnetic closures",
  "Open-back",
  "One-handed dressing",
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(29, 158, 117, 0.08) 0%, rgba(29, 158, 117, 0) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            40+ adaptive features · ships worldwide
          </p>

          <h1
            id="hero-heading"
            className="animate-fade-up text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            Clothing that works
            <br />
            <span className="text-primary-600">for your body.</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Xi&apos;s helps people with disabilities find adaptive clothing that
            looks great, fits right, and respects your independence.
          </p>

          <div
            className="animate-fade-up mx-auto mt-9 max-w-xl"
            style={{ animationDelay: "180ms" }}
          >
            <SearchBar placeholder="Try 'magnetic closures' or 'wheelchair jeans'…" />
          </div>

          <div
            className="animate-fade-up mt-6 flex flex-wrap justify-center gap-2"
            style={{ animationDelay: "240ms" }}
          >
            {suggestions.map((tag) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
