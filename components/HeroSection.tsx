import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-400 text-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-primary-100 text-sm font-medium mb-4 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
            4 brands · 40+ adaptive features · ships worldwide
          </p>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6"
          >
            Fashion that works{" "}
            <span className="relative">
              <span className="relative z-10">for your body.</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-white/20 -rotate-1 rounded"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-50 mb-10 leading-relaxed max-w-2xl">
            Xi&apos;s helps people with disabilities find adaptive clothing that looks great, fits right, and respects your independence. Browse by disability type, adaptive feature, or clothing category.
          </p>

          <div className="max-w-2xl">
            <SearchBar placeholder="Try 'magnetic closures', 'wheelchair jeans', 'sensory friendly'…" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Wheelchair users",
              "Sensory friendly",
              "Magnetic closures",
              "Open-back",
              "One-handed dressing",
            ].map((tag) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/20"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none hidden lg:block" aria-hidden="true">
        <svg viewBox="0 0 400 600" fill="white" className="h-full w-full">
          <circle cx="300" cy="100" r="80" />
          <circle cx="200" cy="300" r="120" />
          <circle cx="350" cy="500" r="60" />
        </svg>
      </div>
    </section>
  );
}
