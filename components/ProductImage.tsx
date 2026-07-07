"use client";

import Image from "next/image";
import { useState } from "react";
import type { PermissionStatus } from "@/data/imageMeta";

/**
 * PRODUCT/BRAND IMAGE
 * -------------------
 * Renders the product photo whenever a usable URL is available, with:
 *   • a skeleton shimmer while the image loads (no layout shift — the wrapper
 *     reserves the aspect ratio),
 *   • a polished, category-specific fallback when the URL is missing or fails
 *     to load (never a broken-image icon, never a blank card),
 *   • priority hinting for above-the-fold images, lazy loading otherwise.
 *
 * Brand and product names/images are used for identification only — see
 * /disclaimer. `permissionStatus`/`attribution` remain as provenance metadata.
 */

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
  /** Normalized category (footwear/tops/…): picks the fallback icon + label. */
  category?: string;
  permissionStatus?: PermissionStatus;
  attribution?: string;
  source?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  footwear: "Adaptive footwear",
  tops: "Adaptive top",
  bottoms: "Adaptive bottoms",
  dresses_skirts: "Adaptive dress",
  outerwear: "Adaptive outerwear",
  undergarments: "Adaptive base layer",
  sleepwear: "Adaptive sleepwear",
  accessories: "Adaptive accessory",
  adaptive_sets: "Adaptive set",
};

/** Simple, consistent line icon per category — reads as intentional, not error. */
function CategoryGlyph({ category }: { category?: string }) {
  const common = {
    className: "h-16 w-16 opacity-70",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.4,
    "aria-hidden": true as const,
  };
  switch (category) {
    case "footwear":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h12l4 1.5a2 2 0 0 1 2 2V19H3v-4Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15V9l4 1c1 1.6 2.6 2.5 4.5 2.5H15" />
        </svg>
      );
    case "bottoms":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10l-1 18h-4l-1-9-1 9H6L7 3Z" />
        </svg>
      );
    case "dresses_skirts":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l-1 5 4 13H6l4-13-1-5Z" />
        </svg>
      );
    case "outerwear":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 6 5 4 9l3 1v10h10V10l3-1-2-4-6-2Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17" />
        </svg>
      );
    case "undergarments":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16l-2 6c-2 0-3-1-6-1s-4 1-6 1L4 7Z" />
        </svg>
      );
    default: // tops + generic
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 3 4 6l2 3 2-1v10h8V8l2 1 2-3-4-3-3 2H11L8 3Z" />
        </svg>
      );
  }
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fallbackLabel,
  category,
  attribution,
  source,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const usable = !!src && !failed;
  const label = fallbackLabel ?? "Product image pending verification";

  return (
    <div
      className={`fabric-texture relative overflow-hidden bg-gradient-to-br from-[#EEE4D3] via-paper to-lavender/60 ${className}`}
    >
      {usable ? (
        <>
          {/* Skeleton shimmer until the image paints (reserved space = no CLS). */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sand/40 via-paper to-sand/30" aria-hidden="true" />
          )}
          <Image
            src={src as string}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`object-contain p-3 transition-all duration-700 ease-out motion-safe:group-hover:scale-[1.035] sm:p-4 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
          <span className="pointer-events-none absolute bottom-1 right-1 select-none rounded bg-ink/40 px-1.5 py-0.5 text-[8.5px] font-medium leading-none tracking-wide text-paper/85 backdrop-blur-sm">
            Image for identification only
          </span>
          {source && (
            <span className="pointer-events-none absolute bottom-1 left-1 max-w-[60%] select-none truncate rounded bg-ink/35 px-1.5 py-0.5 text-[8.5px] font-medium leading-none tracking-wide text-paper/80 backdrop-blur-sm">
              Image via {source}
            </span>
          )}
          {attribution && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/55 px-2 py-1 text-center text-[11px] font-medium text-paper">
              {attribution}
            </span>
          )}
        </>
      ) : (
        // Polished, intentional category fallback — never a broken-image icon.
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-primary-800">
          <CategoryGlyph category={category} />
          <span className="mt-3 text-sm font-semibold text-ink/70">{label}</span>
          {category && CATEGORY_LABEL[category] && (
            <span className="mt-1 rounded-full bg-paper/70 px-2.5 py-0.5 text-xs font-bold text-primary-800">
              {CATEGORY_LABEL[category]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
