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

function regionName(code: string): string | null {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? null;
  } catch {
    return null;
  }
}

// Best-effort country detection: IP geolocation first (most accurate for
// "where are you shopping from"), then the browser locale's region. Returns a
// country name that matches our list, or null so the picker can be shown.
async function detectCountry(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const code = data?.country_code || data?.country;
      const name = code ? regionName(String(code)) : null;
      if (name && countries.includes(name)) return name;
    }
  } catch {
    // Ignore network/abort errors and fall through to locale detection.
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
  const { setCurrency } = useCurrency();
  const [country, setCountryState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sync the display currency to a country (skip "Global", which keeps the
  // current currency). Unknown countries fall back to USD as a neutral default.
  const syncCurrency = (next: string) => {
    if (next === GLOBAL) return;
    setCurrency(currencyForCountry(next) ?? "USD");
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      // Returning visitor: keep their stored country and currency untouched.
      setCountryState(stored);
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
        syncCurrency(detected);
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
    syncCurrency(next);
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
