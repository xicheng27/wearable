import { notFound } from "next/navigation";
import Link from "next/link";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  getBrandOfProduct,
  getProductById,
  products,
  similarProducts,
} from "@/data/products";
import { getCategoryById } from "@/data/categories";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const product = getProductById(params.id);
  if (!product) return {};
  const brand = getBrandOfProduct(product);
  return {
    title: `${product.name} by ${brand.name} – Xi's`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const brand = getBrandOfProduct(product);
  const category = getCategoryById(product.categoryId);
  const similar = similarProducts(product, 3);
  const hasStores =
    product.availability.includes("In stores") &&
    brand.locations.some((l) => l.type !== "online-only");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <li><Link href="/" className="transition-colors hover:text-gray-700">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/search" className="transition-colors hover:text-gray-700">Clothing</Link></li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/clothing/${category.id}`} className="transition-colors hover:text-gray-700">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="font-medium text-gray-700" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="animate-fade-up">
              <Photo
                src={product.image}
                alt={`${product.name} by ${brand.name}`}
                className="aspect-[4/3] rounded-3xl shadow-soft"
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
              <Link
                href={`/brands/${brand.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-primary-600 transition-colors hover:text-primary-700"
              >
                {brand.name}
              </Link>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {product.clothingType} · {product.priceRange} · {product.gender} ·
                Sizes {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">{product.description}</p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Best for
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.bestFor.map((b) => (
                    <span key={b} className="badge border border-primary-100 bg-primary-50 text-primary-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Style
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.styleTags.map((s) => (
                    <span key={s} className="badge bg-gray-100 text-gray-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-7"
                >
                  Buy at {brand.name.split(" ")[0]}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <Link href={`/brands/${brand.id}`} className="btn-secondary px-7">
                  View brand
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                {hasStores
                  ? "Available online and in stores — see brand page for locations."
                  : `Online only · ships ${
                      brand.shipping.countries.some((c) => c.toLowerCase() === "worldwide")
                        ? "worldwide"
                        : `to ${brand.shipping.countries.slice(0, 4).join(", ")}`
                    }.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <section className="card h-full p-6 sm:p-8" aria-labelledby="access-heading">
              <h2 id="access-heading" className="text-lg font-semibold text-gray-900">
                Why it&apos;s accessible
              </h2>
              <p className="mt-3 leading-relaxed text-gray-600">{product.accessibilityNote}</p>
            </section>
          </Reveal>
          <Reveal delay={80}>
            <section className="card h-full p-6 sm:p-8" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-lg font-semibold text-gray-900">
                Adaptive features
              </h2>
              <ul className="mt-4 space-y-2.5">
                {product.adaptiveFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
                      aria-hidden="true"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8" aria-labelledby="brand-heading">
            <Photo src={brand.image} alt="" className="h-20 w-28 flex-shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <h2 id="brand-heading" className="text-lg font-semibold text-gray-900">
                About {brand.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">{brand.description}</p>
            </div>
            <Link href={`/brands/${brand.id}`} className="btn-secondary flex-shrink-0 px-6 py-2.5 text-sm">
              Brand page
            </Link>
          </section>
        </Reveal>

        {similar.length > 0 && (
          <section aria-labelledby="similar-heading">
            <Reveal className="mb-5 mt-10 flex items-end justify-between">
              <h2 id="similar-heading" className="text-lg font-semibold text-gray-900">
                Similar items
              </h2>
              <Link
                href={category ? `/clothing/${category.id}` : "/search"}
                className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                See all →
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 60, 240)} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
