"use client";

import Image from "next/image";
import { useState } from "react";
import type { PermissionStatus } from "@/data/imageMeta";

/**
 * Product image with graceful fallback.
 *
 * Xi's displays product/brand images from the catalogue for identification,
 * accessibility reference, and shopping comparison. If a URL is unavailable or
 * fails to load, the component falls back to a quiet first-party placeholder.
 */
interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
  /** Optional provenance status for data review/admin notes. */
  permissionStatus?: PermissionStatus;
  /** Shown subtly over the image only when an approved attribution is supplied. */
  attribution?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fallbackLabel = "Image pending verification",
  permissionStatus = "needs-review",
  attribution,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const hasImage = !!src && !failed;

  return (
    <div
      className={`fabric-texture relative overflow-hidden bg-gradient-to-br from-[#EEE4D3] via-paper to-lavender/60 ${className}`}
    >
      {hasImage ? (
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
            unoptimized={src?.startsWith("http://")}
          />
          {attribution && permissionStatus === "approved" && (
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
