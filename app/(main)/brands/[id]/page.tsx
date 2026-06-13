import { notFound } from "next/navigation";
import { getBrandById, brands } from "@/data/brands";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import MapCanvas from "@/components/MapCanvas";
import { productsOfBrand } from "@/data/products";
import { mapPlaces } from "@/data/places";

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

  const brandProducts = productsOfBrand(brand.id);
  const brandPlaces = mapPlaces.filter((pl) => pl.brandId === brand.id);
  const storeLocations = brand.locations.filter((l) => l.type !== "online-only");
  const onlineOnly = brand.locations.filter((l) => l.type === "online-only");

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-gray-100 bg-white">
        <div className="relative h-36 w-full overflow-hidden sm:h-52">
          <Photo src={brand.image} alt={`${brand.name} adaptive fashion`} className="h-full w-full" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${brand.heroColor}22 0%, rgba(255,255,255,0.85) 100%)`,
            }}
            aria-hidden="true"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition-colors hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/brands" className="transition-colors hover:text-gray-700">
                  Brands
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-gray-700" aria-current="page">
                {brand.name}
              </li>
            </ol>
          </nav>

          <div className="animate-fade-up flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md sm:h-20 sm:w-20 sm:text-2xl"
              style={{ backgroundColor: brand.heroColor }}
              aria-hidden="true"
            >
              {brand.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {brand.name}
              </h1>
              <p className="mt-1.5 text-base text-gray-500 sm:text-lg">{brand.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="badge bg-gray-100 text-gray-600">{brand.country}</span>
                <span className="badge bg-gray-100 text-gray-600">Est. {brand.founded}</span>
                <span className="badge bg-gray-100 text-gray-600">{brand.priceRange}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <section className="card p-6 sm:p-8" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-lg font-semibold text-gray-900">
                About {brand.name}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-600">{brand.longDescription}</p>
              {brand.certifications.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {brand.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="badge border border-primary-100 bg-primary-50 text-primary-700"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {brandProducts.length > 0 && (
              <Reveal>
                <section aria-labelledby="products-heading">
                  <div className="mb-4 flex items-end justify-between">
                    <h2 id="products-heading" className="text-lg font-semibold text-gray-900">
                      Adaptive pieces from {brand.name}
                    </h2>
                    <Link
                      href={`/search?brand=${brand.id}`}
                      className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    >
                      See all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {brandProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            <Reveal>
            <section className="card p-6 sm:p-8" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-lg font-semibold text-gray-900">
                Adaptive features
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {brand.adaptiveFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors duration-200 hover:bg-primary-50"
                  >
                    <span
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
                      aria-hidden="true"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
            </Reveal>

            <Reveal>
            <section className="card p-6 sm:p-8" aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-lg font-semibold text-gray-900">
                Who it suits
              </h2>
              <ul className="mt-4 space-y-3">
                {brand.whoItSuits.map((who) => (
                  <li key={who} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 text-primary-500" aria-hidden="true">
                      →
                    </span>
                    <span className="text-sm leading-relaxed text-gray-600">{who}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Disability types covered
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brand.disabilityTypes.map((dt) => (
                    <span key={dt} className="badge bg-gray-100 text-gray-600">
                      {dt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Clothing types
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brand.clothingTypes.map((ct) => (
                    <span key={ct} className="badge bg-gray-100 text-gray-600">
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </section>
            </Reveal>
          </div>

          <aside className="space-y-6" aria-label="Brand details sidebar">
            <div className="card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Visit the brand
              </h2>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 w-full"
              >
                Shop at {brand.name.split(" ")[0]}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="mt-3 text-center text-xs text-gray-500">
                Price range: {brand.priceRange}
              </p>
            </div>

            <div className="card p-6" aria-labelledby="shipping-heading">
              <h2 id="shipping-heading" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Shipping info
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="mb-1.5 text-xs font-medium text-gray-500">Ships to</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {brand.shipping.countries.map((c) => (
                      <span key={c} className="badge bg-gray-100 text-gray-600">
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs font-medium text-gray-500">Estimated delivery</dt>
                  <dd className="text-gray-700">{brand.shipping.estimatedDays}</dd>
                </div>
                {brand.shipping.freeShippingThreshold !== undefined && (
                  <div>
                    <dt className="mb-1 text-xs font-medium text-gray-500">Free shipping</dt>
                    <dd className="text-gray-700">
                      {brand.shipping.freeShippingThreshold === 0
                        ? "Always free"
                        : `On orders over ${brand.shipping.currency} ${brand.shipping.freeShippingThreshold}`}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="mb-1 text-xs font-medium text-gray-500">Returns policy</dt>
                  <dd className="leading-relaxed text-gray-700">{brand.shipping.returnsPolicy}</dd>
                </div>
              </dl>
            </div>

            <div className="card p-6" aria-labelledby="locations-heading">
              <h2 id="locations-heading" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Store locations
              </h2>

              {brandPlaces.length > 0 && (
                <Link href="/map" aria-label="Open the full map" className="mt-4 block">
                  <MapCanvas
                    places={brandPlaces}
                    interactive={false}
                    className="pointer-events-none aspect-[4/3]"
                  />
                </Link>
              )}

              {storeLocations.length > 0 && (
                <ul className="mt-4 space-y-4">
                  {storeLocations.map((loc) => (
                    <li key={loc.name} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex-shrink-0 text-primary-500" aria-hidden="true">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{loc.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {loc.address}, {loc.city}, {loc.country}
                        </p>
                        {loc.phone && (
                          <a
                            href={`tel:${loc.phone}`}
                            className="mt-0.5 inline-block text-xs text-primary-600 hover:underline"
                          >
                            {loc.phone}
                          </a>
                        )}
                        <div className="mt-1.5">
                          <span
                            className={`badge ${
                              loc.type === "flagship"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {loc.type === "flagship" ? "Flagship" : "Stockist"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {onlineOnly.length > 0 && (
                <p
                  className={`flex items-center gap-2 text-sm text-gray-500 ${
                    storeLocations.length > 0 ? "mt-4 border-t border-gray-100 pt-4" : "mt-4"
                  }`}
                >
                  <svg className="h-4 w-4 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available online — ships internationally
                </p>
              )}

              {storeLocations.length === 0 && onlineOnly.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">Online only</p>
              )}
            </div>
          </aside>
        </div>

        <Reveal>
        <section className="card mt-8 p-6 sm:p-8" aria-labelledby="more-brands-heading">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="more-brands-heading" className="text-lg font-semibold text-gray-900">
                Explore more brands
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Discover more adaptive fashion brands on Xi&apos;s.
              </p>
            </div>
            <Link
              href="/brands"
              className="hidden flex-shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:block"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {brand.disabilityTypes.slice(0, 3).map((dt) => (
              <Link
                key={dt}
                href={`/brands?disability=${encodeURIComponent(dt.toLowerCase())}`}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                More brands for {dt}
              </Link>
            ))}
          </div>
        </section>
        </Reveal>
      </div>
    </div>
  );
}
