"use client";

import { useState } from "react";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Shown if src fails (e.g. remote listing photo offline). */
  fallbackSrc?: string;
}

/**
 * Image with a graceful fallback chain: src -> fallbackSrc -> placeholder.
 * Lets product cards try the brand's real listing photo and quietly fall
 * back to the local illustration tile when it can't load.
 */
export default function Photo({
  src,
  alt,
  className = "",
  imgClassName = "",
  fallbackSrc,
}: PhotoProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const current = stage === 0 ? src : stage === 1 && fallbackSrc ? fallbackSrc : null;

  function handleError() {
    setStage((prev) => (prev === 0 && fallbackSrc ? 1 : 2));
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {current === null ? (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
          role="img"
          aria-label={alt}
        >
          <svg className="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 7a2.2 2.2 0 1 1 2.2-2.2" />
            <path d="M12 7 4.6 12.4a1.9 1.9 0 0 0 1.1 3.4h12.6a1.9 1.9 0 0 0 1.1-3.4L12 7z" />
          </svg>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={current}
          src={current}
          alt={alt}
          loading="lazy"
          onError={handleError}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
