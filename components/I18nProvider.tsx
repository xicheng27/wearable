"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";
import ms from "@/locales/ms.json";
import ta from "@/locales/ta.json";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/config";

type Dict = Record<string, unknown>;

const DICTS: Record<Locale, Dict> = { en, zh, ms, ta };

/** Resolve a dot-path (e.g. "nav.browse") in a dictionary object. */
function lookup(dict: Dict, path: string): string | undefined {
  const value = path
    .split(".")
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in (acc as Dict)) {
        return (acc as Dict)[key];
      }
      return undefined;
    }, dict);
  return typeof value === "string" ? value : undefined;
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /**
   * Translate a dot-path key. Falls back to the English string, then to the
   * provided fallback, then to the key itself — so a missing translation never
   * renders a blank or a raw key when English has it.
   */
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Load the visitor's stored choice on mount (English until then — avoids a
  // hydration mismatch, then swaps to the saved language).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored) && stored !== locale) setLocaleState(stored);
    } catch {
      // localStorage unavailable — stay on the default.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the document language attribute in sync for assistive tech / SEO.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore persistence failures.
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return (
        lookup(DICTS[locale], key) ??
        lookup(DICTS.en, key) ??
        fallback ??
        key
      );
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used inside I18nProvider");
  }
  return context;
}
