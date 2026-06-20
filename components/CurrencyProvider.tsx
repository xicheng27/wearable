"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  setCurrency: (currency: DisplayCurrency) => void;
  rates: CurrencyRates;
  ratesDate: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const storageKey = "xis-display-currency";

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>("SGD");
  const [rates, setRates] = useState<CurrencyRates>(fallbackCurrencyRates);
  const [ratesDate, setRatesDate] = useState(fallbackRatesDate);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as DisplayCurrency | null;
    if (stored && displayCurrencies.includes(stored)) {
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
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(storageKey, nextCurrency);
  };

  const value = useMemo(
    () => ({ currency, setCurrency, rates, ratesDate }),
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
