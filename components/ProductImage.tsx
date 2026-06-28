"use client";

import Image from "next/image";
import { useState } from "react";
import type { PermissionStatus } from "@/data/imageMeta";

/**
 * PRODUCT/BRAND IMAGE
 * -------------------
 * Renders the product/brand photo whenever an image URL is available, falling
 * back to a clean first-party placeholder only when there is no usable image
 * (missing URL or the image fails to load). Brand and product names and images
 * are used for identification purposes only — see /disclaimer.
 *
 * The optional `permissionStatus`/`attribution` props are kept so licence
 * metadata can still be recorded per product (see data/imageMeta.ts); they no
 * longer suppress display.
 */

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
  permissionStatus?: PermissionStatus;
  /** Shown subtly over the image, e.g. a source/credit line. */
  attribution?: string;
  /** Brand/source the image comes from, shown as a subtle "Image via …" credit. */
  source?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fallbackLabel = "Image coming soon",
  attribution,
  source,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const cleared = !!src && !failed;

  return (
    <div
      className={`fabric-texture relative overflow-hidden bg-gradient-to-br from-[#EEE4D3] via-paper to-lavender/60 ${className}`}
    >
      {cleared ? (
        <>
          <Image
            src={src as string}
            alt={alt}
            fill
            priority={priority}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-contain p-3 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035] sm:p-4"
            onError={() => setFailed(true)}
          />
          {/* Subtle, non-ownership identification label. Images are shown only
              to identify the product — this is not a Xi's-owned mark. */}
          <span className="pointer-events-none absolute bottom-1 right-1 select-none rounded bg-ink/40 px-1.5 py-0.5 text-[8.5px] font-medium leading-none tracking-wide text-paper/85 backdrop-blur-sm">
            Image for identification only
          </span>
          {/* Optional source credit, e.g. "Image via June Adaptive". */}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-800">
          <svg
            className="h-24 w-24 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 5.5 10.2 4h3.6L16 5.5l3.5 1.7-2.2 4-1.5-.7V20H8.2v-9.5l-1.5.7-2.2-4L8 5.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.2 4c.2 1.3 1 2 1.8 2s1.6-.7 1.8-2M8.2 11.5h7.6"
            />
          </svg>
          <span className="mt-3 max-w-[15rem] rotate-[-1deg] bg-paper/75 px-4 py-2 text-center font-hand text-xs font-semibold">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}
