"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { countries, GLOBAL } from "@/lib/countries";
import { currencyForCountry } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics";

type CountryContextValue = {
  /** null until the visitor's country is known (detected or chosen). */
  country: string | null;
  setCountry: (country: string) => void;
  /** Re-opens the picker so the visitor can change their location. */
  openPicker: () => void;
  closePicker: () => void;
  pickerOpen: boolean;
};

const CountryContext = createContext<CountryContextValue | null>(null);
const storageKey = "xis-shopping-country";

// Some ICU region names differ from the labels in our country list; normalise
// the common ones so detection still matches.
const nameAliases: Record<string, string> = {
  Czechia: "Czech Republic",
  "Myanmar (Burma)": "Myanmar",
  "Hong Kong SAR China": "Hong Kong",
  "United States of America": "United States",
};

function regionName(code: string): string | null {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    if (!name) return null;
    return nameAliases[name] ?? name;
  } catch {
    return null;
  }
}

// Best-effort country detection for the shopping region only.
//
// PRIVACY: this uses our OWN /api/geo endpoint, which reads Vercel's edge
// geolocation header (x-vercel-ip-country). No third-party IP-lookup service is
// contacted and the visitor's IP is never sent anywhere new — Vercel already
// terminates the request. We only ever read the COUNTRY (never precise
// location), cache it in localStorage so it runs at most once per device, and
// the visitor can override it any time with the region picker. Off Vercel
// (local dev) /api/geo returns null and we fall back to the browser locale,
// then the picker.
async function detectCountry(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch("/api/geo", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { country?: string | null };
      if (typeof data.country === "string" && data.country) {
        const name = regionName(data.country.toUpperCase());
        if (name && countries.includes(name)) return name;
      }
    }
  } catch {
    // Endpoint unavailable — fall through to the locale hint.
  }

  try {
    const locale =
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      "";
    const region = locale.includes("-") ? locale.split("-")[1] : "";
    if (region) {
      const name = regionName(region.toUpperCase());
      if (name && countries.includes(name)) return name;
    }
  } catch {
    // No locale region available.
  }

  return null;
}

export default function CountryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrencyForCountry } = useCurrency();
  const [country, setCountryState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sync the display currency to a country (skip "Global", which keeps the
  // current currency). Unknown countries fall back to USD as a neutral default.
  const syncCurrency = (next: string, force: boolean) => {
    if (next === GLOBAL) return;
    setCurrencyForCountry(currencyForCountry(next) ?? "USD", { force });
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      // Returning visitor: keep their stored country, and make the currency
      // follow it (unless they've manually overridden the currency).
      setCountryState(stored);
      syncCurrency(stored, false);
      setHydrated(true);
      return;
    }

    let cancelled = false;
    setHydrated(true);
    detectCountry().then((detected) => {
      if (cancelled) return;
      if (detected) {
        setCountryState(detected);
        window.localStorage.setItem(storageKey, detected);
        syncCurrency(detected, false);
        trackEvent("location_used", { country: detected, source: "auto" });
      } else {
        setPickerOpen(true);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCountry = (next: string) => {
    setCountryState(next);
    window.localStorage.setItem(storageKey, next);
    setPickerOpen(false);
    // Explicit country change drives the currency, overriding a manual choice.
    syncCurrency(next, true);
    // Coarse country name is the shopping region, not precise/PII location data.
    trackEvent("location_used", { country: next, source: "manual" });
  };

  const value = useMemo(
    () => ({
      country,
      setCountry,
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      pickerOpen: hydrated && pickerOpen,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [country, hydrated, pickerOpen]
  );

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used inside CountryProvider");
  }
  return context;
}

export { GLOBAL };
