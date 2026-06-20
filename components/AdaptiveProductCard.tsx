import { AdaptiveProduct } from "@/data/adaptiveBrands";
import PriceDisplay from "@/components/PriceDisplay";
import ProductImage from "@/components/ProductImage";

function sourceLevel(product: AdaptiveProduct) {
  const source = product.sourceNotes.toLowerCase();
  if (product.productType === "Service" || source.includes("service")) {
    return "Service";
  }
  if (
    product.productType === "Collection" ||
    source.includes("category") ||
    source.includes("collection") ||
    source.includes("brand-level") ||
    source.includes("initiative") ||
    source.includes("planned")
  ) {
    return "Category-level";
  }
  return "Product-level";
}

function availabilityBadge(product: AdaptiveProduct) {
  const value = product.singaporeAvailability.toLowerCase();
  if (value.includes("local sg") || value.includes("singapore-based")) {
    return "Singapore local";
  }
  if (value.includes("ships to sg")) return "Ships to Singapore";
  if (value.includes("contact")) return "Contact for international order";
  return product.singaporeAvailability;
}

export default function AdaptiveProductCard({
  product,
}: {
  product: AdaptiveProduct;
}) {
  const level = sourceLevel(product);
  const availability = availabilityBadge(product);

  return (
    <article className="paper-panel group flex h-full flex-col overflow-hidden rounded-[1.5rem_.6rem_1.5rem_1.5rem]">
      <ProductImage
        src={product.imageUrl ?? null}
        alt={`${product.name} by ${product.brandName}`}
        className="min-h-56 border-b border-ink/10"
        fallbackLabel={`${product.brandName} - ${product.productType} - Image pending verification`}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="sticker">{availability}</span>
          {product.currency === "SGD" && (
            <span className="sticker rotate-[1deg] bg-sage/25">SGD pricing</span>
          )}
          <span
            className={`sticker rotate-[1deg] ${
              level === "Product-level"
                ? "bg-primary-100"
                : level === "Service"
                  ? "bg-clay/20"
                  : "bg-sand/70"
            }`}
          >
            {level}
          </span>
        </div>

        <p className="mt-5 text-sm font-bold text-primary-700">{product.brandName}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
          {product.name}
        </h2>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="font-bold text-ink/45">Type</dt>
            <dd className="mt-0.5 text-ink/75">{product.productType}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink/45">Gender / fit</dt>
            <dd className="mt-0.5 text-ink/75">{product.gender}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink/45">Price</dt>
            <dd className="mt-0.5 font-semibold text-ink">
              <PriceDisplay
                price={product.price}
                sourceCurrency={product.currency}
              />
            </dd>
          </div>
          <div>
            <dt className="font-bold text-ink/45">Category</dt>
            <dd className="mt-0.5 text-ink/75">{product.category}</dd>
          </div>
        </dl>

        {product.closureType && (
          <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm">
            <span className="font-bold text-primary-800">Closure:</span>{" "}
            <span className="text-primary-900">{product.closureType}</span>
          </div>
        )}

        <div className="mt-5">
          <h3 className="text-sm font-bold text-ink">Adaptive features</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.adaptiveFeatures.map((feature) => (
              <span key={feature} className="badge bg-sage/15 text-ink/70">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-ink">Best for</h3>
          <p className="mt-1 text-sm leading-6 text-ink/65">
            {product.bestFor.join(", ")}
          </p>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-4">
          <p className="text-xs leading-5 text-ink/50">
            <span className="font-bold text-ink/65">Source:</span>{" "}
            {product.sourceNotes}
          </p>
        </div>

        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 w-full"
        >
          Open official source <span aria-hidden="true">&nearr;</span>
        </a>
      </div>
    </article>
  );
}
