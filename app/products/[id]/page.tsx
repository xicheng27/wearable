import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { MechanismDiagrams } from "@/components/MechanismDiagram";
import { AdaptiveFeatureBadges } from "@/components/AdaptiveFeatureBadge";
import SizeGuide from "@/components/SizeGuide";
import PriceDisplay from "@/components/PriceDisplay";
import OfficialProductLink from "@/components/OfficialProductLink";
import { serializeJsonLd } from "@/lib/security/jsonLd";
import {
  consolidateFeatures,
  diagramsForProduct,
} from "@/lib/adaptiveFeatures";
import { assessClimate } from "@/lib/climate";
import { getBrandById } from "@/data/brands";
import {
  getProductById,
  getShippingConfidence,
  getSimilarProducts,
  isOutOfStock,
  products,
} from "@/data/products";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import type { Brand, Product } from "@/types";

/** Resolve a product image to an absolute URL (remote CDNs stay as-is). */
function absoluteImage(src: string): string {
  return src.startsWith("http") ? src : absoluteUrl(src);
}

/**
 * Conservative Product + BreadcrumbList JSON-LD. We only attach an `offers`
 * block when the product has a real numeric price and an exact product link —
 * never a fabricated price or availability. Everything else (brand, name,
 * image, description, category) is taken straight from our catalogue data.
 */
function buildProductJsonLd(product: Product, brand: Brand) {
  const numericPrice = Number.parseFloat(product.price);
  const hasRealOffer =
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    product.linkType === "exact-product" &&
    Boolean(product.productUrl);

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteImage(product.imageUrl),
    category: product.clothingType,
    url: absoluteUrl(`/products/${product.id}`),
    brand: { "@type": "Brand", name: brand.name },
  };

  if (hasRealOffer) {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: product.productUrl,
      priceCurrency: product.currency,
      price: numericPrice.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: brand.name },
    };
    // Honest availability only: never assert InStock without evidence.
    if (product.stockStatus === "in_stock") {
      offer.availability = "https://schema.org/InStock";
    } else if (product.stockStatus === "out_of_stock") {
      offer.availability = "https://schema.org/OutOfStock";
    }
    // Unknown stock → omit `availability` entirely rather than guess.
    productLd.offers = offer;
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Clothing", item: absoluteUrl("/search") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(`/products/${product.id}`),
      },
    ],
  };

  return [productLd, breadcrumbLd];
}

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
  const jsonLd = buildProductJsonLd(product, brand);

  // §6 derived, evidence-backed detail: concise features (no generic repeats),
  // illustrative mechanism diagrams, climate verdict, stock and SG shipping.
  const helpfulFeatures = consolidateFeatures(product.adaptiveFeatures);
  const extraFeatures = product.adaptiveFeatures.filter(
    (f) => !helpfulFeatures.includes(f)
  );
  const diagrams = diagramsForProduct(product);
  const climate = assessClimate(product);
  const outOfStock = isOutOfStock(product);
  const sgShipping = getShippingConfidence(product, "Singapore");
  const magnetWarning = product.adaptiveFeatures.some((f) => /magnet/i.test(f));

  return (
    <div className="min-h-screen bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-ink/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary-700">Home</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <Link href="/search" className="hover:text-primary-700">Clothing</Link>
          <span className="px-2" aria-hidden="true">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <section className="paper-panel overflow-hidden rounded-[2rem_.9rem_2rem_2rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ProductGallery product={product} />

            <div className="flex flex-col p-6 sm:p-10">
              <Link
                href={`/brands/${brand.id}`}
                className="link-underline w-fit text-sm"
              >
                {brand.name}
              </Link>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-extrabold text-ink">
                <PriceDisplay
                  price={product.price}
                  sourceCurrency={product.currency}
                  fallback={product.priceRange}
                  prominent
                />
              </p>
              <p className="mt-5 text-lg leading-relaxed text-ink/68">
                {product.description}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 border-y border-ink/10 py-6 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-ink/45">Clothing type</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.clothingType}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">Style</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.styleTags.slice(0, 2).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">Fit</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.genderFit.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">Availability</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.availability.online && product.availability.inStore
                      ? "Online and in store"
                      : product.availability.online
                        ? "Online"
                        : "In store"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <h2 className="text-base font-bold text-ink">
                  What this helps with
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.bestFor.map((item) => (
                    <span key={item} className="chip-soft">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <OfficialProductLink
                  href={product.productUrl}
                  exact={product.linkType === "exact-product"}
                  className="btn-primary block w-full py-4 text-center text-base"
                >
                  {product.linkType === "exact-product"
                    ? "Buy / view official product"
                    : "View official source"}
                </OfficialProductLink>
                <Link
                  href={`/brands/${brand.id}`}
                  className="btn-outline mt-3 block w-full py-3.5 text-center text-base"
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
                <p className="mt-3 text-center text-sm leading-relaxed text-ink/55">
                  Stock, price, sizing, delivery and returns can change. Please
                  check the official site before buying.
                </p>
                {product.sourceVerifiedAt && (
                  <p className="mt-2 text-center text-sm font-semibold text-ink/60">
                    Official product data checked {product.sourceVerifiedAt}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="paper-panel rounded-[1.5rem_.7rem_1.5rem_1.5rem] p-6 lg:col-span-2">
            <h2 className="font-display text-3xl font-semibold text-ink">
              How it helps
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              {product.accessibilityExplanation}
            </p>

            {magnetWarning && (
              <p
                className="mt-5 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm font-semibold leading-6 text-ink"
                role="note"
              >
                ⚠ Contains magnets. Magnetic closures can interfere with
                pacemakers and other implanted medical devices — check with the
                wearer&apos;s clinician if this applies.
              </p>
            )}

            {/* Compact visual feature badges — icon + name + a very short
                explanation, with a tap/keyboard tooltip for more detail. Only
                specific, meaningful features (generic duplicates removed). */}
            <div className="mt-6">
              <AdaptiveFeatureBadges features={helpfulFeatures} />
            </div>

            {diagrams.length > 0 && (
              <div className="mt-6">
                <MechanismDiagrams ids={diagrams} />
              </div>
            )}

            {extraFeatures.length > 0 && (
              <details className="mt-6 rounded-xl border border-ink/10 bg-paper px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold text-ink">
                  More technical details
                </summary>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {extraFeatures.map((f) => (
                    <li
                      key={f}
                      className="rounded-md border border-ink/15 bg-ivory px-2 py-0.5 text-xs font-semibold text-ink/75"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>

          <aside className="paper-panel rounded-[1.5rem_.7rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-3xl font-semibold text-ink">
              Fit and access
            </h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="font-bold text-ink/45">Who it may suit</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.disabilityNeeds.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">Stock</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {outOfStock
                    ? "Reported out of stock — check the official page for restocks."
                    : product.stockStatus === "in_stock"
                      ? "In stock at last check."
                      : "Stock not confirmed in our data — check the official page."}
                  {product.stockCheckedAt && (
                    <span className="mt-1 block text-xs text-ink/50">
                      Stock last checked {product.stockCheckedAt}.
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">Ships to Singapore</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {sgShipping === "ships"
                    ? "Yes — Singapore is listed in the official availability."
                    : sgShipping === "unknown"
                      ? "Not confirmed — the listing didn't state Singapore delivery. Check the official page."
                      : "Not listed for Singapore. Confirm international delivery on the official page."}
                </dd>
              </div>
              {(product.materialComposition || (product.materials?.length ?? 0) > 0) && (
                <div>
                  <dt className="font-bold text-ink/45">Material</dt>
                  <dd className="mt-2 leading-6 text-ink/72">
                    {product.materialComposition ?? product.materials?.join(", ")}
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-bold text-ink/45">Hot &amp; humid weather</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {climate.suitability === "high"
                    ? "Suited to a hot, humid climate."
                    : climate.suitability === "medium"
                      ? "Reasonable for warm weather."
                      : climate.suitability === "low"
                        ? "Warm/heavy — better suited to cooler weather or air-conditioned settings."
                        : "Not enough official material evidence to say."}
                  {climate.evidence.length > 0 && (
                    <span className="mt-1 block text-xs text-ink/50">
                      Why: {climate.evidence.join(" ")}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">Sizing</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.sizes.length > 0 ? (
                    <>Available sizes: {product.sizes.join(", ")}.</>
                  ) : (
                    "Sizing was not listed in our current data."
                  )}
                  <span className="mt-3 block">
                    <SizeGuide product={product} />
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">Location availability</dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.availability.note}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">
                  Returns / source policy
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {brand.shipping.returnsPolicy ||
                    "Check the official retailer for current returns and exchange rules."}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {similarItems.length > 0 && (
          <section className="mt-16" aria-labelledby="similar-heading">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 id="similar-heading" className="font-display text-4xl font-semibold text-ink">
                  Similar items from other brands
                </h2>
                <p className="mt-2 text-ink/65">
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
