"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CountrySelectorModal from "@/components/CountrySelectorModal";
import { GLOBAL_LOCATION, countryNames } from "@/lib/countries";

type LocationContextValue = {
  selectedCountry: string;
  ready: boolean;
  setCountry: (country: string) => void;
  openSelector: () => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);
const storageKey = "xis-shopping-country";
const validLocations = new Set([GLOBAL_LOCATION, ...countryNames]);

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [ready, setReady] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && validLocations.has(stored)) {
      setSelectedCountry(stored);
    } else {
      setSelectorOpen(true);
    }
    setReady(true);
  }, []);

  const setCountry = (country: string) => {
    if (!validLocations.has(country)) return;
    setSelectedCountry(country);
    window.localStorage.setItem(storageKey, country);
    setSelectorOpen(false);
  };

  const value = useMemo(
    () => ({
      selectedCountry,
      ready,
      setCountry,
      openSelector: () => setSelectorOpen(true),
    }),
    [selectedCountry, ready]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
      {ready && selectorOpen && (
        <CountrySelectorModal
          selectedCountry={selectedCountry}
          onSelect={setCountry}
          onClose={
            selectedCountry ? () => setSelectorOpen(false) : undefined
          }
        />
      )}
    </LocationContext.Provider>
  );
}

export function useShoppingLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useShoppingLocation must be used inside LocationProvider");
  }
  return context;
}

