"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { captureFeedback } from "@/lib/feedback";
import { hostOf, isSafeExternalUrl, safeExternalUrl } from "@/lib/security/url";

type OfficialProductLinkProps = {
  href?: string | null;
  exact?: boolean;
  className?: string;
  children?: ReactNode;
  productId?: string;
};

/** Exported for callers that only need to check whether a link is renderable. */
export function isValidOfficialUrl(href?: string | null) {
  return isSafeExternalUrl(href);
}

export default function OfficialProductLink({
  href,
  exact = true,
  className = "",
  children,
  productId,
}: OfficialProductLinkProps) {
  // Validate + normalise before rendering so a bad/unsafe scheme never becomes
  // an active link.
  const safeHref = safeExternalUrl(href);
  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      target="_blank"
      // noopener/noreferrer close the tab-nabbing + referrer-leak vectors;
      // sponsored/nofollow marks these as commercial outbound links.
      rel="noopener noreferrer nofollow sponsored"
      className={className}
      onClick={() => {
        // Records the retailer host + product slug only — no personal data.
        trackEvent("official_link_clicked", {
          host: hostOf(safeHref),
          linkType: exact ? "exact-product" : "brand-page",
          ...(productId ? { productId } : {}),
        });
        captureFeedback({ actionType: "retailer_link_clicked", productId });
      }}
    >
      {children ?? (exact ? "View official product →" : "View official source →")}
    </a>
  );
}
