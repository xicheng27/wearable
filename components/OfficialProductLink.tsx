"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type OfficialProductLinkProps = {
  href?: string | null;
  exact?: boolean;
  className?: string;
  children?: ReactNode;
  productId?: string;
};

export function isValidOfficialUrl(href?: string | null) {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

export default function OfficialProductLink({
  href,
  exact = true,
  className = "",
  children,
  productId,
}: OfficialProductLinkProps) {
  if (!isValidOfficialUrl(href)) return null;

  return (
    <a
      href={href as string}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        // Records the retailer host + product slug only — no personal data.
        trackEvent("official_link_clicked", {
          host: hostOf(href as string),
          linkType: exact ? "exact-product" : "brand-page",
          ...(productId ? { productId } : {}),
        })
      }
    >
      {children ?? (exact ? "View official product →" : "View official source →")}
    </a>
  );
}
