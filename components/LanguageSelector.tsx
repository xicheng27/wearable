"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/components/I18nProvider";
import { LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Compact language picker for the navigation. Styled to match the country /
 * currency selectors. Keyboard accessible: opens a listbox-style menu, closes
 * on Escape or outside click, and each option is a real button.
 *
 * Only English is fully translated today; the others fall back per-string to
 * English (see I18nProvider). The selector is always available so the i18n
 * plumbing is real and testable end to end.
 */
export default function LanguageSelector({
  className = "",
}: {
  className?: string;
}) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.change")}
        title={t("language.label")}
        className="flex min-h-11 items-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-2 py-2 text-xs font-bold text-ink/65 shadow-sm transition hover:border-primary-400 hover:text-ink"
      >
        <svg
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.5 2.5 3.75 5.75 3.75 9S14.5 18.5 12 21c-2.5-2.5-3.75-5.75-3.75-9S9.5 5.5 12 3Z"
          />
        </svg>
        <span className="max-w-[8rem] truncate">{active.nativeName}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language.label")}
          className="absolute right-0 z-50 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-ink/10 bg-paper py-1 shadow-paper"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={l.code === locale}
                onClick={() => choose(l.code)}
                className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-semibold transition hover:bg-sand/60 ${
                  l.code === locale ? "bg-primary-50 text-primary-800" : "text-ink/80"
                }`}
              >
                <span>{l.nativeName}</span>
                {l.code === locale && (
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-primary-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
