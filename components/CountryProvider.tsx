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

async function fetchCountryCode(
  url: string,
  pick: (data: Record<string, unknown>) => unknown
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const code = pick(data);
    return typeof code === "string" && code ? code : null;
  } catch {
    return null;
  }
}

// Best-effort country detection. Tries several CORS-friendly IP geolocation
// services in turn (each returns quickly or is skipped), then falls back to the
// browser locale's region. Returns a country name that matches our list, or
// null so the picker can be shown.
async function detectCountry(): Promise<string | null> {
  const providers: Array<() => Promise<string | null>> = [
    () => fetchCountryCode("https://api.country.is/", (d) => d.country),
    () =>
      fetchCountryCode(
        "https://ipwho.is/?fields=country_code",
        (d) => d.country_code
      ),
    () =>
      fetchCountryCode(
        "https://get.geojs.io/v1/ip/country.json",
        (d) => d.country
      ),
    () =>
      fetchCountryCode(
        "https://ipapi.co/json/",
        (d) => d.country_code || d.country
      ),
  ];

  for (const provider of providers) {
    const code = await provider();
    if (code) {
      const name = regionName(code.toUpperCase());
      if (name && countries.includes(name)) return name;
    }
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
