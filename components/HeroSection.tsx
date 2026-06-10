import SearchBar from "@/components/SearchBar";

export default function HeroSection() {
  const searches = [
    "Magnetic shirt",
    "Wheelchair jeans",
    "Easy shoes",
    "Sensory T-shirt",
    "Formal adaptive shirt",
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-400 text-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 0 2px, transparent 3px), radial-gradient(circle at 80% 60%, white 0 2px, transparent 3px)",
          backgroundSize: "70px 70px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-primary-50">
            Individual adaptive pieces from 9 brands
          </p>
          <h1
            id="hero-heading"
            className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            Find clothing that fits your style and your life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-50 md:text-xl">
            Search real adaptive clothing pieces across brands. Compare magnetic
            shirts, seated-fit jeans, easy-entry shoes and sensory-friendly
            essentials in one place.
          </p>

          <div className="mt-10 max-w-3xl">
            <SearchBar placeholder="Search 'magnetic shirt', 'wheelchair jeans' or 'easy shoes'" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {searches.map((search) => (
              <a
                key={search}
                href={`/search?q=${encodeURIComponent(search)}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/20 hover:text-white"
              >
                {search}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
