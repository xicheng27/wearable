"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { useTranslation } from "@/components/I18nProvider";
import type { Product, ProductImageViewType } from "@/types";

/**
 * Accessible product gallery built ONLY from official images the catalogue
 * captured. Prefers typed `imageViews` (so each view can be labelled and the
 * adaptive-feature shot called out), then falls back to `galleryImages`, then
 * to the single `imageUrl`. Duplicate URLs are removed and no view is invented
 * — when only one image exists it renders a single image with no thumbnail
 * strip. Any image can be clicked/opened to enlarge in an accessible lightbox.
 */

interface GalleryImage {
  url: string;
  alt: string;
  /** Short, human-readable view label (e.g. "Back", "Adaptive feature"). */
  label?: string;
  isAdaptiveFeature?: boolean;
}

const VIEW_LABELS: Record<ProductImageViewType, string> = {
  front: "Front",
  back: "Back",
  side: "Side",
  detail: "Detail",
  "adaptive-feature": "Adaptive feature",
  worn: "Worn",
};

function buildImages(
  product: Product,
  adaptiveFeatureLabel: string
): GalleryImage[] {
  const seen = new Set<string>();
  const out: GalleryImage[] = [];

  if (product.imageViews && product.imageViews.length > 0) {
    for (const view of product.imageViews) {
      if (!view.url || seen.has(view.url)) continue;
      seen.add(view.url);
      const isAdaptive = view.type === "adaptive-feature";
      out.push({
        url: view.url,
        alt:
          view.alt ??
          `${product.imageAlt} — ${VIEW_LABELS[view.type].toLowerCase()} view`,
        label: isAdaptive ? adaptiveFeatureLabel : VIEW_LABELS[view.type],
        isAdaptiveFeature: isAdaptive,
      });
    }
  }

  // Untyped fallbacks: main image first, then any extra gallery images.
  for (const url of [product.imageUrl, ...(product.galleryImages ?? [])]) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ url, alt: product.imageAlt });
  }

  return out;
}

export default function ProductGallery({ product }: { product: Product }) {
  const { t } = useTranslation();
  const images = buildImages(product, t("product.adaptiveFeature"));
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const count = images.length;
  const current = images[active] ?? { url: product.imageUrl, alt: product.imageAlt };

  const go = useCallback(
    (delta: number) => {
      setActive((prev) => (prev + delta + count) % count);
    },
    [count]
  );

  // Keyboard: arrows navigate; Escape closes the lightbox.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (lightboxOpen && event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (count <= 1) return;
      if (lightboxOpen || document.activeElement === mainButtonRef.current) {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen, count, go]);

  useEffect(() => {
    if (lightboxOpen) lightboxRef.current?.focus();
    else mainButtonRef.current?.focus?.();
  }, [lightboxOpen]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <button
          ref={mainButtonRef}
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={t("product.enlargeImage")}
          aria-haspopup="dialog"
          className="group block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <ProductImage
            src={current.url}
            alt={
              count > 1
                ? `${current.alt} (${active + 1}/${count})`
                : current.alt
            }
            category={product.categoryNormalized}
            permissionStatus={product.permissionStatus}
            source={product.brand}
            className="aspect-[4/3] min-h-[360px] lg:aspect-auto lg:min-h-[620px]"
            priority
          />
        </button>

        {current.label && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
              current.isAdaptiveFeature
                ? "bg-primary-700 text-white"
                : "bg-paper/90 text-ink/75"
            }`}
          >
            {current.isAdaptiveFeature && <span aria-hidden="true">★ </span>}
            {current.label}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t("common.previous")}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink shadow-sm transition hover:bg-paper"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("common.next")}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink shadow-sm transition hover:bg-paper"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex flex-wrap gap-2 p-3" aria-label={`${count} product views`}>
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={
                  image.label
                    ? `Show ${image.label} view`
                    : `Show view ${index + 1}`
                }
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                  index === active
                    ? "border-primary-700"
                    : "border-ink/15 hover:border-primary-400"
                }`}
              >
                <ProductImage
                  src={image.url}
                  alt=""
                  category={product.categoryNormalized}
                  className="h-full w-full"
                />
                {image.isAdaptiveFeature && (
                  <span
                    className="absolute inset-x-0 bottom-0 bg-primary-700/90 py-0.5 text-center text-[8px] font-bold uppercase tracking-wide text-white"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-ink/85 p-4"
          role="presentation"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="relative flex w-full max-w-4xl flex-col outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label={t("common.close")}
              className="absolute -top-2 right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm hover:bg-paper"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative overflow-hidden rounded-2xl bg-paper">
              <ProductImage
                src={current.url}
                alt={current.alt}
                category={product.categoryNormalized}
                source={product.brand}
                className="aspect-[4/3] max-h-[75vh] w-full sm:aspect-auto sm:min-h-[70vh]"
                priority
              />
              {current.label && (
                <span
                  className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${
                    current.isAdaptiveFeature
                      ? "bg-primary-700 text-white"
                      : "bg-paper/90 text-ink/75"
                  }`}
                >
                  {current.isAdaptiveFeature && <span aria-hidden="true">★ </span>}
                  {current.label}
                </span>
              )}
            </div>

            {count > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t("common.previous")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm hover:bg-paper"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-semibold text-paper/90" aria-live="polite">
                  {active + 1} / {count}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t("common.next")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm hover:bg-paper"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
