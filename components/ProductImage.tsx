"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-100 ${className}`}
    >
      {!failed && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-700">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l4.72-4.72a1.5 1.5 0 012.12 0l2.19 2.19 1.22-1.22a1.5 1.5 0 012.12 0l2.63 2.63M14.25 8.25h.008v.008h-.008V8.25z"
            />
          </svg>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
            Product image
          </span>
        </div>
      )}
    </div>
  );
}
