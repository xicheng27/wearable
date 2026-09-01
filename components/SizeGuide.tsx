"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import OfficialProductLink from "@/components/OfficialProductLink";
import { useTranslation } from "@/components/I18nProvider";
import type { Product } from "@/types";

type Unit = "cm" | "in";

/**
 * Convert the numeric parts of a measurement string to the requested unit.
 * Measurements are stored as free strings that may include their own unit
 * (e.g. "96cm", "38 in", "96-101 cm"). We detect the source unit (defaulting
 * to cm, the most common in brand charts), convert every number found, and
 * keep any range/formatting. Values we can't parse are shown unchanged so we
 * never display a fabricated number.
 */
function convertMeasurement(raw: string, unit: Unit): string {
  const sourceIsInches = /(\bin\b|inch|")/i.test(raw);
  const source: Unit = sourceIsInches ? "in" : "cm";
  const numbers = raw.match(/\d+(?:\.\d+)?/g);
  if (!numbers) return raw;

  const convert = (n: number): number => {
    if (source === unit) return n;
    return unit === "in" ? n / 2.54 : n * 2.54;
  };
  const round = (n: number) => Math.round(n * 2) / 2; // nearest 0.5

  let index = 0;
  const withNumbers = raw.replace(/\d+(?:\.\d+)?/g, () => {
    const original = Number(numbers[index++]);
    return String(round(convert(original)));
  });

  // Strip any existing unit tokens, then append the display unit once.
  const stripped = withNumbers.replace(/\s*(cm|inch(?:es)?|in|")\s*$/i, "").trim();
  return `${stripped} ${unit === "in" ? "in" : "cm"}`;
}

export default function SizeGuide({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<Unit>("cm");
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const measurements = useMemo(
    () => product.measurements ?? [],
    [product.measurements]
  );
  const hasTable = measurements.length > 0;
  const sizeColumns = useMemo(
    () => (hasTable ? Object.keys(measurements[0].values) : []),
    [hasTable, measurements]
  );
  // Prefer an explicit official size-guide URL; fall back to the product page
  // only if it's an exact product link (never invent a chart URL).
  const officialUrl =
    product.sizeGuideUrl ??
    (product.linkType === "exact-product" ? product.productUrl : undefined);

  // Close on Escape and restore focus to the opener.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // Move focus into the dialog for keyboard users.
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) openerRef.current?.focus();
  }, [open]);

  const displayedRows = useMemo(
    () =>
      measurements.map((row) => ({
        label: row.label,
        values: sizeColumns.map((size) =>
          row.values[size] ? convertMeasurement(row.values[size], unit) : "—"
        ),
      })),
    [measurements, sizeColumns, unit]
  );

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm font-bold text-ink/75 shadow-sm transition hover:border-primary-400 hover:text-ink ${className}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7v4M12 7v6M17 7v4" />
        </svg>
        {t("product.sizeGuide")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-heading"
            className="paper-texture max-h-[85vh] w-full overflow-y-auto rounded-t-[2rem] border border-ink/10 bg-paper shadow-paper outline-none sm:max-w-lg sm:rounded-[1.5rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 pb-4 pt-6">
              <div>
                <h2
                  id="size-guide-heading"
                  className="font-display text-2xl font-semibold text-ink"
                >
                  {t("sizeGuide.title")}
                </h2>
                <p className="mt-1 text-sm text-ink/60">{product.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("sizeGuide.close")}
                className="min-h-11 min-w-11 rounded-lg p-1 text-ink/50 hover:bg-sand/50 hover:text-ink"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              {hasTable ? (
                <>
                  <div
                    className="mb-4 inline-flex rounded-lg border border-ink/15 bg-ivory p-0.5"
                    role="group"
                    aria-label={t("sizeGuide.units")}
                  >
                    {(["cm", "in"] as Unit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        aria-pressed={unit === u}
                        className={`min-h-9 rounded-md px-4 py-1.5 text-sm font-bold transition ${
                          unit === u
                            ? "bg-primary-700 text-white shadow-sm"
                            : "text-ink/65 hover:text-ink"
                        }`}
                      >
                        {u === "cm" ? t("sizeGuide.cm") : t("sizeGuide.inches")}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <caption className="sr-only">
                        {product.measurementType === "body"
                          ? t("sizeGuide.bodyNote")
                          : t("sizeGuide.garmentNote")}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col" className="border-b border-ink/15 py-2 pr-3 text-left font-bold text-ink">
                            {t("sizeGuide.measurement")}
                          </th>
                          {sizeColumns.map((size) => (
                            <th key={size} scope="col" className="border-b border-ink/15 px-3 py-2 text-left font-bold text-ink">
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayedRows.map((row) => (
                          <tr key={row.label}>
                            <th scope="row" className="border-b border-ink/10 py-2 pr-3 text-left font-semibold text-ink/80">
                              {row.label}
                            </th>
                            {row.values.map((value, i) => (
                              <td key={i} className="border-b border-ink/10 px-3 py-2 text-ink/75">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-ink/55">
                    {product.measurementType === "body"
                      ? t("sizeGuide.bodyNote")
                      : t("sizeGuide.garmentNote")}
                  </p>
                </>
              ) : (
                <div className="rounded-xl border border-ink/10 bg-ivory px-4 py-5 text-sm leading-relaxed text-ink/70">
                  <p>{t("sizeGuide.noData")}</p>
                  {product.sizes.length > 0 && (
                    <p className="mt-3">
                      <span className="font-bold text-ink/80">
                        {t("sizeGuide.availableSizes")}:
                      </span>{" "}
                      {product.sizes.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {officialUrl && (
                <div className="mt-5">
                  <OfficialProductLink
                    href={officialUrl}
                    exact={Boolean(product.sizeGuideUrl) || product.linkType === "exact-product"}
                    productId={product.id}
                    className="btn-secondary flex w-full justify-center px-4 py-3 text-sm"
                  >
                    {t("sizeGuide.viewOfficial")}
                  </OfficialProductLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
