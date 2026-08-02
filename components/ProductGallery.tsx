"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/types";

/**
 * Accessible product gallery built ONLY from official images the catalogue
 * captured (`galleryImages`, falling back to the single `imageUrl`). Duplicate
 * URLs are removed and no view is invented — when only one image exists it
 * renders a single image with no thumbnail strip.
 */
export default function ProductGallery({ product }: { product: Product }) {
  const images = Array.from(
    new Set([product.imageUrl, ...(product.galleryImages ?? [])].filter(Boolean))
  );
  const [active, setActive] = useState(0);
  const current = images[active] ?? product.imageUrl;

  return (
    <div className="flex flex-col">
      <ProductImage
        src={current}
        alt={
          images.length > 1
            ? `${product.imageAlt} — view ${active + 1} of ${images.length}`
            : product.imageAlt
        }
        category={product.categoryNormalized}
        permissionStatus={product.permissionStatus}
        source={product.brand}
        className="aspect-[4/3] min-h-[360px] lg:aspect-auto lg:min-h-[620px]"
        priority
      />
      {images.length > 1 && (
        <ul
          className="flex flex-wrap gap-2 p-3"
          aria-label={`${images.length} product views`}
        >
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={`Show view ${index + 1}`}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                  index === active
                    ? "border-primary-700"
                    : "border-ink/15 hover:border-primary-400"
                }`}
              >
                <ProductImage
                  src={src}
                  alt=""
                  category={product.categoryNormalized}
                  className="h-full w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
