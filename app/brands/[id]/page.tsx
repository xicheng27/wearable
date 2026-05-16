import { notFound } from "next/navigation";
import { getBrandById, brands } from "@/data/brands";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return brands.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const brand = getBrandById(params.id);
  if (!brand) return {};
  return {
    title: `${brand.name} – Xi's`,
    description: brand.description,
  };
}

export default function BrandDetailPage({ params }: PageProps) {
  const brand = getBrandById(params.id);
  if (!brand) notFound();

  const storeLocations = brand.locations.filter(
    (l) => l.type !== "online-only"
  );
  const onlineOnly = brand.locations.filter((l) => l.type === "online-only");

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative overflow-hidden text-white py-16"
        style={{
          background: `linear-gradient(135deg, ${brand.heroColor}ee 0%, ${brand.heroColor}99 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true"><span>/</span></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Brands</Link></li>
              <li aria-hidden="true"><span>/</span></li>
              <li className="text-white font-medium" aria-current="page">{brand.name}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl flex-shrink-0 border-2 border-white/30"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              aria-hidden="true"
            >
              {brand.logo}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold">{brand.name}</h1>
                <span className="badge bg-white/20 text-white border border-white/30 text-xs">
                  Est. {brand.founded}
                </span>
                <span className="badge bg-white/20 text-white border border-white/30 text-xs">
                  {brand.country}
                </span>
              </div>
              <p className="text-lg text-white/90">{brand.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-bold text-gray-900 mb-4">About {brand.name}</h2>
              <p className="text-gray-700 leading-relaxed">{brand.longDescription}</p>
              {brand.certifications.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {brand.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="badge bg-green-50 text-green-700 border border-green-200 text-xs"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-xl font-bold text-gray-900 mb-5">Adaptive features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brand.adaptiveFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-primary-900">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-xl font-bold text-gray-900 mb-5">Who it suits</h2>
              <ul className="space-y-3">
                {brand.whoItSuits.map((who) => (
                  <li key={who} className="flex items-start gap-3">
                    <span className="text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true">→</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{who}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Disability types covered</p>
                <div className="flex flex-wrap gap-2">
                  {brand.disabilityTypes.map((dt) => (
                    <span key={dt} className="badge bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                      {dt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Clothing types</p>
                <div className="flex flex-wrap gap-2">
                  {brand.clothingTypes.map((ct) => (
                    <span key={ct} className="badge bg-gray-100 text-gray-700 text-xs">
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </section>

          </div>

          <aside className="space-y-6" aria-label="Brand details sidebar">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Visit the brand
              </h2>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block text-sm"
              >
                Shop at {brand.name.split(" ")[0]} →
              </a>
              <div className="mt-4 text-center">
                <span className="badge bg-gray-100 text-gray-700 text-xs">
                  Price range: {brand.priceRange}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" aria-labelledby="shipping-heading">
              <h2 id="shipping-heading" className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Shipping info
              </h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Ships to</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {brand.shipping.countries.map((c) => (
                      <span key={c} className="badge bg-blue-50 text-blue-700 text-xs border border-blue-100">
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Estimated delivery</dt>
                  <dd className="text-gray-700">{brand.shipping.estimatedDays}</dd>
                </div>
                {brand.shipping.freeShippingThreshold !== undefined && (
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Free shipping</dt>
                    <dd className="text-gray-700">
                      {brand.shipping.freeShippingThreshold === 0
                        ? "Always free"
                        : `On orders over ${brand.shipping.currency} ${brand.shipping.freeShippingThreshold}`}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Returns policy</dt>
                  <dd className="text-gray-700 leading-relaxed">{brand.shipping.returnsPolicy}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" aria-labelledby="locations-heading">
              <h2 id="locations-heading" className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Store locations
              </h2>

              {storeLocations.length > 0 ? (
                <ul className="space-y-4">
                  {storeLocations.map((loc) => (
                    <li key={loc.name} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span
                          className="text-primary-500 mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{loc.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {loc.address}, {loc.city}, {loc.country}
                          </p>
                          {loc.phone && (
                            <a
                              href={`tel:${loc.phone}`}
                              className="text-xs text-primary-600 hover:underline mt-0.5 inline-block"
                            >
                              {loc.phone}
                            </a>
                          )}
                          <span
                            className={`mt-1.5 badge text-xs ${
                              loc.type === "flagship"
                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {loc.type === "flagship" ? "Flagship" : "Stockist"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {onlineOnly.length > 0 && (
                <div className={storeLocations.length > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    Also available online — ships internationally
                  </p>
                </div>
              )}

              {storeLocations.length === 0 && onlineOnly.length === 0 && (
                <p className="text-sm text-gray-500">Online only</p>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" aria-labelledby="more-brands-heading">
          <div className="flex items-center justify-between">
            <h2 id="more-brands-heading" className="text-xl font-bold text-gray-900">
              Explore more brands
            </h2>
            <Link href="/search" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Browse all →
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Discover more adaptive fashion brands on Xi&apos;s.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {brand.disabilityTypes.slice(0, 3).map((dt) => (
              <Link
                key={dt}
                href={`/search?disability=${encodeURIComponent(dt.toLowerCase())}`}
                className="badge bg-primary-50 text-primary-700 border border-primary-200 text-sm hover:bg-primary-100 transition-colors"
              >
                More brands for {dt}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
