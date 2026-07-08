import type { Product } from "@/types";
import { productTrustBadges, type ProductBadgeKind } from "@/lib/productBadges";

const KIND_CLASS: Record<ProductBadgeKind, string> = {
  verified: "border-primary-200 bg-primary-50 text-primary-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  sg: "border-rose-200 bg-rose-50 text-rose-800",
};

/**
 * A compact row of trust / availability badges (verified vs category listing,
 * ships-to-Singapore, price unavailable) so a card makes clear whether it is
 * truly buyable or just a lead to check. Logic lives in lib/productBadges.
 */
export default function ProductTrustBadges({
  product,
  country,
  className = "",
}: {
  product: Product;
  country?: string | null;
  className?: string;
}) {
  const badges = productTrustBadges(product, country);
  if (badges.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge) => (
        <li
          key={badge.label}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${KIND_CLASS[badge.kind]}`}
        >
          {badge.kind === "verified" && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
