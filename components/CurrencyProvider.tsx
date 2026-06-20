"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CurrencyRates,
  DisplayCurrency,
  displayCurrencies,
  fallbackCurrencyRates,
  fallbackRatesDate,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  /** Manual selection from the currency selector — sticks across reloads. */
  setCurrency: (currency: DisplayCurrency) => void;
  /**
   * Sets the currency to follow the shopping country. Skips when the visitor
   * has manually chosen a currency, unless `force` is set (used when the
   * visitor explicitly changes their country).
   */
  setCurrencyForCountry: (
    currency: DisplayCurrency,
    options?: { force?: boolean }
  ) => void;
  rates: CurrencyRates;
  ratesDate: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const storageKey = "xis-display-currency";
const manualKey = "xis-currency-manual";

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>("SGD");
  const [rates, setRates] = useState<CurrencyRates>(fallbackCurrencyRates);
  const [ratesDate, setRatesDate] = useState(fallbackRatesDate);
  const manualRef = useRef(false);

  useEffect(() => {
    const storedManual = window.localStorage.getItem(manualKey) === "1";
    const stored = window.localStorage.getItem(storageKey) as DisplayCurrency | null;
    // Only restore a stored currency if the visitor chose it manually. Otherwise
    // the CountryProvider sets the currency from the detected/stored country.
    if (storedManual && stored && displayCurrencies.includes(stored)) {
      manualRef.current = true;
      setCurrencyState(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,SGD,CAD,GBP,AUD")
      .then((response) => {
        if (!response.ok) throw new Error("Currency rates unavailable");
        return response.json();
      })
      .then((payload: { date?: string; rates?: CurrencyRates }) => {
        if (cancelled || !payload.rates) return;
        setRates({ EUR: 1, ...fallbackCurrencyRates, ...payload.rates });
        if (payload.date) setRatesDate(payload.date);
      })
      .catch(() => {
        // The checked ECB fallback keeps prices usable if the rate service is offline.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (nextCurrency: DisplayCurrency) => {
    manualRef.current = true;
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(storageKey, nextCurrency);
    window.localStorage.setItem(manualKey, "1");
  };

  const setCurrencyForCountry = (
    nextCurrency: DisplayCurrency,
    options?: { force?: boolean }
  ) => {
    const force = options?.force ?? false;
    if (manualRef.current && !force) return;
    if (force) {
      manualRef.current = false;
      window.localStorage.removeItem(manualKey);
    }
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(storageKey, nextCurrency);
  };

  const value = useMemo(
    () => ({ currency, setCurrency, setCurrencyForCountry, rates, ratesDate }),
    // setCurrency/setCurrencyForCountry only touch refs and setters, so they
    // are stable; currency/rates/ratesDate are the values consumers re-render on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currency, rates, ratesDate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return context;
}
