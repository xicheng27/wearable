"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SavedItemsContextValue = {
  savedIds: string[];
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => void;
};

const SavedItemsContext = createContext<SavedItemsContextValue | null>(null);
const storageKey = "xis-saved-items";

export default function SavedItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored));
      } catch {
        // Ignore malformed storage.
      }
    }
  }, []);

  const toggleSaved = (productId: string) => {
    setSavedIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      savedIds,
      isSaved: (productId: string) => savedIds.includes(productId),
      toggleSaved,
    }),
    [savedIds]
  );

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error("useSavedItems must be used inside SavedItemsProvider");
  }
  return context;
}
