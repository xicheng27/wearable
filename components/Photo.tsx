"use client";

import { useState } from "react";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Image with a graceful fallback: if the source fails to load, a quiet
 * gradient placeholder with a hanger glyph is shown instead. Sources live
 * in /public/images and can be swapped for real photography (same path)
 * without touching components.
 */
export default function Photo({ src, alt, className = "", imgClassName = "" }: PhotoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
          role="img"
          aria-label={alt}
        >
          <svg className="h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 7a2.2 2.2 0 1 1 2.2-2.2" />
            <path d="M12 7 4.6 12.4a1.9 1.9 0 0 0 1.1 3.4h12.6a1.9 1.9 0 0 0 1.1-3.4L12 7z" />
          </svg>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
