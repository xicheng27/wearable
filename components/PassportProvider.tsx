"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildPassport, isValidPassport } from "@/lib/passport";
import { trackEvent } from "@/lib/analytics";
import type { Answers } from "@/lib/quiz/config";
import type { AdaptiveFitPassport } from "@/types";

/**
 * Holds the shopper's Adaptive Fit Passport. Stored only in this browser's
 * localStorage — never sent to a server — and reusable across quiz results,
 * browsing, saved items and future recommendation updates.
 */

type PassportContextValue = {
  passport: AdaptiveFitPassport | null;
  /** True once localStorage has been read (avoids hydration flicker). */
  hydrated: boolean;
  /** Replace the passport (e.g. when the quiz completes). */
  savePassport: (answers: Answers, otherNeeds?: string, customNeed?: string) => void;
  /** Merge edited answers into the existing passport. */
  updateAnswers: (answers: Answers) => void;
  clearPassport: () => void;
};

const PassportContext = createContext<PassportContextValue | null>(null);
const storageKey = "xis-fit-passport";

export default function PassportProvider({ children }: { children: React.ReactNode }) {
  const [passport, setPassport] = useState<AdaptiveFitPassport | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValidPassport(parsed)) setPassport(parsed);
      }
    } catch {
      // Malformed stored passport — start fresh.
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AdaptiveFitPassport | null) => {
    setPassport(next);
    if (next) window.localStorage.setItem(storageKey, JSON.stringify(next));
    else window.localStorage.removeItem(storageKey);
  }, []);

  const savePassport = useCallback(
    (answers: Answers, otherNeeds = "", customNeed = "") => {
      persist(buildPassport(answers, otherNeeds, customNeed, passport));
      trackEvent("passport_saved");
    },
    [persist, passport]
  );

  const updateAnswers = useCallback(
    (answers: Answers) => {
      if (!passport) return;
      persist(buildPassport(answers, passport.otherNeeds, passport.customNeed, passport));
      trackEvent("passport_edited");
    },
    [persist, passport]
  );

  const clearPassport = useCallback(() => {
    persist(null);
    trackEvent("passport_reset");
  }, [persist]);

  const value = useMemo(
    () => ({ passport, hydrated, savePassport, updateAnswers, clearPassport }),
    [passport, hydrated, savePassport, updateAnswers, clearPassport]
  );

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error("usePassport must be used inside PassportProvider");
  }
  return context;
}
