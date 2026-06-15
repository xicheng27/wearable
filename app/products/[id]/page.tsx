import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import PriceDisplay from "@/components/PriceDisplay";
import { getBrandById } from "@/data/brands";
import {
  getProductById,
  getSimilarProducts,
  products,
} from "@/data/products";

interface ProductPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({ params }: ProductPageProps) {
  const product = getProductById(params.id);
  if (!product) return {};
  const brand = getBrandById(product.brandId);

  return {
    title: `${product.name} by ${brand?.name ?? "Adaptive Brand"} | Xi's`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const brand = getBrandById(product.brandId);
  if (!brand) notFound();
  const similarItems = getSimilarProducts(product);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary-700">Home</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <Link href="/search" className="hover:text-primary-700">Clothing</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ProductImage
              src={product.imageUrl}
              alt={product.imageAlt}
              permissionStatus={product.permissionStatus}
              attribution={product.attributionText}
              className="aspect-[4/3] min-h-[360px] lg:aspect-auto lg:min-h-[620px]"
              priority
            />

            <div className="flex flex-col p-6 sm:p-10">
              <Link
                href={`/brands/${brand.id}`}
                className="text-sm font-bold uppercase tracking-[0.16em] text-primary-700 hover:text-primary-800"
              >
                {brand.name}
              </Link>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-extrabold text-gray-950">
                <PriceDisplay
                  price={product.price}
                  sourceCurrency={product.currency}
                  fallback={product.priceRange}
                  prominent
                />
              </p>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                {product.description}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-gray-100 py-6 text-sm">
                <div>
                  <dt className="font-bold uppercase tracking-wider text-gray-400">
                    Clothing type
                  </dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {product.clothingType}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wider text-gray-400">
                    Style
                  </dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {product.styleTags.slice(0, 2).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wider text-gray-400">
                    Fit
                  </dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {product.genderFit.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-wider text-gray-400">
                    Availability
                  </dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {product.availability.online && product.availability.inStore
                      ? "Online and in store"
                      : product.availability.online
                        ? "Online"
                        : "In store"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Best for
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.bestFor.map((item) => (
                    <span key={item} className="badge bg-blue-50 text-blue-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary block w-full text-center"
                >
                  {product.linkType === "exact-product"
                    ? "Shop this exact item"
                    : "View brand page only"}
                </a>
                <Link
                  href={`/brands/${brand.id}`}
                  className="btn-outline mt-3 block w-full text-center"
                >
                  View brand
                </Link>
                <div className="mt-3 text-center">
                  <span
                    className={`badge ${
                      product.linkType === "exact-product"
                        ? "bg-primary-50 text-primary-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {product.linkType === "exact-product"
                      ? "Exact product link"
                      : "Brand page only"}
                  </span>
                </div>
                <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
                  The source price is exact at the time checked. Currency
                  conversions are estimates; confirm current stock, price,
                  sizing and delivery on the official website.
                </p>
                {product.sourceVerifiedAt && (
                  <p className="mt-2 text-center text-xs font-semibold text-gray-500">
                    Official product data checked {product.sourceVerifiedAt}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-950">
              Why this item is adaptive
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              {product.accessibilityExplanation}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.adaptiveFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl bg-primary-50 p-3 text-sm font-semibold text-primary-900"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                    &#10003;
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">Fit and access</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Accessibility needs
                </dt>
                <dd className="mt-2 text-gray-700">
                  {product.disabilityNeeds.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Sizes
                </dt>
                <dd className="mt-2 text-gray-700">{product.sizes.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Where available
                </dt>
                <dd className="mt-2 text-gray-700">
                  {product.availability.note}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-gray-400">
                  Ships to
                </dt>
                <dd className="mt-2 text-gray-700">
                  {product.availability.countries.join(", ")}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {similarItems.length > 0 && (
          <section className="mt-16" aria-labelledby="similar-heading">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 id="similar-heading" className="text-3xl font-extrabold text-gray-950">
                  Similar items from other brands
                </h2>
                <p className="mt-2 text-gray-600">
                  Compare another approach to the same clothing or accessibility need.
                </p>
              </div>
              <Link href="/search" className="hidden text-sm font-bold text-primary-700 sm:block">
                Browse all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
