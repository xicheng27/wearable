import { AdaptiveProduct, getAdaptiveBrand } from "@/data/adaptiveBrands";

function availabilityBadge(value: string): { label: string; className: string } {
  const v = value.toLowerCase();
  if (v.includes("local singapore"))
    return { label: "Singapore local", className: "bg-emerald-50 text-emerald-800" };
  if (v.includes("initiative"))
    return { label: "Singapore initiative", className: "bg-emerald-50 text-emerald-800" };
  if (v.includes("sgd store"))
    return { label: "SGD store", className: "bg-emerald-50 text-emerald-800" };
  if (v.includes("ships to singapore"))
    return { label: "Ships to Singapore", className: "bg-blue-50 text-blue-800" };
  if (v.includes("contact"))
    return { label: "Contact to order", className: "bg-amber-50 text-amber-800" };
  return { label: value, className: "bg-gray-100 text-gray-700" };
}

const listingBadge: Record<string, { label: string; className: string } | null> = {
  product: null,
  category: { label: "Category-level", className: "bg-gray-100 text-gray-700" },
  service: { label: "Service", className: "bg-primary-50 text-primary-700" },
  initiative: { label: "Initiative", className: "bg-primary-50 text-primary-700" },
};

export default function CatalogCard({ product }: { product: AdaptiveProduct }) {
  const brand = getAdaptiveBrand(product.brandId);
  const accent = brand?.accent ?? "#6D28D9";
  const avail = availabilityBadge(product.singaporeAvailability);
  const listing = listingBadge[product.listingType];
  const isSgd = product.currency === "SGD";

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {/* Placeholder image — no AI/stock photos; brand + type on a soft tint */}
      <div
        className="relative flex aspect-[4/3] flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: `${accent}14` }}
        role="img"
        aria-label={`${product.brandName} — ${product.productType}`}
      >
        <span
          className="text-base font-bold tracking-tight"
          style={{ color: accent }}
        >
          {product.brandName}
        </span>
        <span className="mt-1 text-sm font-medium text-gray-600">
          {product.productType}
        </span>
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={`badge ${avail.className}`}>{avail.label}</span>
          {listing && <span className={`badge ${listing.className}`}>{listing.label}</span>}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          {product.brandName}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-gray-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {product.productType} · {product.category} · {product.gender}
        </p>

        {(product.price || isSgd) && (
          <p className="mt-3 flex items-center gap-2">
            {product.price && (
              <span className="text-base font-bold text-gray-900">
                {product.currency ? `${product.currency} ` : ""}
                {product.price}
              </span>
            )}
            {isSgd && <span className="badge bg-emerald-50 text-emerald-800">SGD pricing</span>}
          </p>
        )}

        <p className="mt-3 text-sm text-gray-700">
          <span className="font-semibold">Best for:</span> {product.bestFor.join(", ")}
        </p>

        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
          {product.adaptiveFeatures.map((f) => (
            <span key={f} className="badge bg-primary-50 text-primary-700">
              {f}
            </span>
          ))}
        </div>

        {product.closureType && (
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Closure:</span> {product.closureType}
          </p>
        )}

        <p className="mt-3 text-xs leading-relaxed text-gray-500">{product.sourceNotes}</p>

        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-700 px-5 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-800"
        >
          {product.listingType === "product" ? "View product" : "View on brand site"}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
