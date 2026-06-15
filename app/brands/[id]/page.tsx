import { notFound } from "next/navigation";
import Link from "next/link";
import LocationAwareProductGrid from "@/components/LocationAwareProductGrid";
import { brands, getBrandById } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";

interface BrandPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return brands.map((brand) => ({ id: brand.id }));
}

export function generateMetadata({ params }: BrandPageProps) {
  const brand = getBrandById(params.id);
  if (!brand) return {};
  return {
    title: `${brand.name} Adaptive Clothing | Xi's`,
    description: brand.description,
  };
}

export default function BrandDetailPage({ params }: BrandPageProps) {
  const brand = getBrandById(params.id);
  if (!brand) notFound();
  const brandProducts = getProductsByBrand(brand.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="relative overflow-hidden py-16 text-white"
        style={{
          background: `linear-gradient(135deg, ${brand.heroColor} 0%, ${brand.heroColor}bb 100%)`,
        }}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/search" className="hover:text-white">Clothing</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-white">{brand.name}</span>
          </nav>

          <div className="mt-8 flex items-start gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-xl font-black shadow-lg">
              {brand.logo}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                Adaptive brand
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
                {brand.name}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-white/90">{brand.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-950">Brand overview</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              {brand.longDescription}
            </p>
          </section>

          <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950">
              Where to buy
            </h2>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 block text-center text-sm"
            >
              Visit {brand.name}
            </a>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Price range
                </dt>
                <dd className="mt-1 text-gray-700">{brand.priceRange}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Ships to
                </dt>
                <dd className="mt-1 text-gray-700">
                  {brand.shipping.countries.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Availability
                </dt>
                <dd className="mt-1 text-gray-700">
                  {brand.locations.length > 0
                    ? "Online and selected stores"
                    : "Primarily online"}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-12" aria-labelledby="brand-products-heading">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700">
              Individual pieces
            </p>
            <h2 id="brand-products-heading" className="mt-2 text-3xl font-extrabold text-gray-950">
              Clothing from {brand.name}
            </h2>
            <p className="mt-2 text-gray-600">
              Browse the products in this catalog, then open the item for full
              accessibility details.
            </p>
          </div>

          {brandProducts.length > 0 ? (
            <LocationAwareProductGrid products={brandProducts} showCount />
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-gray-600">
              Product listings for this brand are being added.
            </div>
          )}
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-950">Adaptive features</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {brand.adaptiveFeatures.map((feature) => (
                <span key={feature} className="badge bg-primary-50 text-primary-800">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-950">Who it suits</h2>
            <ul className="mt-5 space-y-3">
              {brand.whoItSuits.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                  <span className="font-bold text-primary-600" aria-hidden="true">&rarr;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
