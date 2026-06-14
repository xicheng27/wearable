"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fallbackLabel = "Exact product image unavailable",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`fabric-texture relative overflow-hidden bg-gradient-to-br from-[#EEE4D3] via-paper to-lavender/60 ${className}`}
    >
      {!failed && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={90}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-3 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035] sm:p-4"
          onError={() => setFailed(true)}
        />
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
