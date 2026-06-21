import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import PriceDisplay from "@/components/PriceDisplay";
import LocationAwareProductGrid from "@/components/LocationAwareProductGrid";
import OfficialProductLink from "@/components/OfficialProductLink";
import ProductLocationGate from "@/components/ProductLocationGate";
import { getBrandById } from "@/data/brands";
import {
  getProductById,
  getSimilarProducts,
  products,
} from "@/data/products";

function explainFeature(feature: string) {
  const value = feature.toLowerCase();
  if (value.includes("magnetic")) return "Magnets can reduce the need to line up and push small buttons.";
  if (value.includes("seated")) return "The cut is designed to sit more comfortably while using a wheelchair or sitting for long periods.";
  if (value.includes("open-back")) return "The back opening can make assisted dressing easier, especially while seated or lying down.";
  if (value.includes("side")) return "Side openings can reduce bending, pulling, or stepping into clothing.";
  if (value.includes("zip")) return "Zip access can make openings larger and easier to manage.";
  if (value.includes("velcro") || value.includes("touch")) return "Touch-and-close fasteners can be easier than buttons for limited dexterity.";
  if (value.includes("sensory") || value.includes("seam") || value.includes("tag")) return "Softer finishes may reduce scratching, rubbing, or sensory discomfort.";
  if (value.includes("wide") || value.includes("afo") || value.includes("orthotic")) return "Extra room can help with braces, orthotics, swelling, or easier shoe entry.";
  return "This feature is intended to make dressing, comfort, or access easier.";
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

  return (
    <ProductLocationGate product={product}>
      <div className="min-h-screen bg-ivory">
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
                  <dt className="font-bold text-ink/45">
                    Clothing type
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.clothingType}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">
                    Style
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.styleTags.slice(0, 2).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">
                    Fit
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {product.genderFit.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink/45">
                    Availability
                  </dt>
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
                    <span key={item} className="badge bg-primary-50 text-primary-900">
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
              Adaptive features explained
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              {product.accessibilityExplanation}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3">
              {product.adaptiveFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl bg-primary-50 p-4 text-sm text-primary-950"
                >
                  <p className="font-bold">{feature}</p>
                  <p className="mt-1 leading-6">{explainFeature(feature)}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="paper-panel rounded-[1.5rem_.7rem_1.5rem_1.5rem] p-6">
            <h2 className="font-display text-3xl font-semibold text-ink">
              Fit and access
            </h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="font-bold text-ink/45">
                  Who it may suit
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.disabilityNeeds.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">
                  Sizing information
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.sizes.length > 0
                    ? product.sizes.join(", ")
                    : "Sizing was not listed in our current data. Check the official product page."}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">
                  Location availability
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.availability.note}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">
                  Ships to
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {product.availability.countries.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink/45">
                  Returns / source policy
                </dt>
                <dd className="mt-2 leading-6 text-ink/72">
                  {brand.shipping.returnsPolicy || "Check the official retailer for current returns and exchange rules."}
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
            <LocationAwareProductGrid
              products={similarItems}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            />
          </section>
        )}
      </main>
      </div>
    </ProductLocationGate>
  );
}
