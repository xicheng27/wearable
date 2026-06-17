"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GLOBAL } from "@/lib/countries";

type CountryContextValue = {
  /** null until the visitor has made a choice (first-visit modal is open). */
  country: string | null;
  setCountry: (country: string) => void;
  /** Re-opens the picker so the visitor can change their location. */
  openPicker: () => void;
  closePicker: () => void;
  pickerOpen: boolean;
};

const CountryContext = createContext<CountryContextValue | null>(null);
const storageKey = "xis-shopping-country";

export default function CountryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [country, setCountryState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setCountryState(stored);
    } else {
      setPickerOpen(true);
    }
    setHydrated(true);
  }, []);

  const setCountry = (next: string) => {
    setCountryState(next);
    window.localStorage.setItem(storageKey, next);
    setPickerOpen(false);
  };

  const value = useMemo(
    () => ({
      country,
      setCountry,
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      pickerOpen: hydrated && pickerOpen,
    }),
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
