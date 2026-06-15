"use client";

import Image from "next/image";
import { useState } from "react";
import type { PermissionStatus } from "@/data/imageMeta";

/**
 * COPYRIGHT-SAFE IMAGE GATE
 * -------------------------
 * Product/brand photos are copyrighted. This component only renders a remote
 * image when `permissionStatus === "approved"` (i.e. we have written brand
 * permission, an affiliate/press licence, our own photo, or a stock licence).
 * Anything pending / needs-review / unset shows a clean first-party
 * placeholder instead — never a hot-linked brand image.
 *
 * To display a real image: record the licence on the product and set
 * permissionStatus to "approved" with attributionText. See data/imageMeta.ts.
 */

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
  /** Defaults to needs-review: nothing is shown until explicitly approved. */
  permissionStatus?: PermissionStatus;
  /** Shown subtly over the image when an approved image is displayed. */
  attribution?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fallbackLabel = "Image pending permission",
  permissionStatus = "needs-review",
  attribution,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const cleared = permissionStatus === "approved" && !!src && !failed;

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
