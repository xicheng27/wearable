"use client";

import { usePassport } from "@/components/PassportProvider";

/**
 * Shows the free-text a shopper typed in the quiz ("in their own words").
 *
 * This reads from the on-device Fit Passport rather than the results URL: the
 * free text can describe medical/accessibility needs, so it is deliberately
 * kept out of the query string (which would leak into history / logs /
 * analytics) and rendered here from localStorage instead. React escapes it, so
 * it is always displayed as plain text.
 */
export default function QuizFreeTextNote() {
  const { passport, hydrated } = usePassport();
  if (!hydrated || !passport) return null;

  const notes = [passport.otherNeeds, passport.customNeed]
    .filter((t): t is string => Boolean(t && t.trim()))
    .join(" · ");
  if (!notes) return null;

  return (
    <div className="paper-panel mt-6 max-w-3xl rounded-[1.2rem_.5rem_1.2rem_1.2rem] px-5 py-4">
      <p className="font-hand text-xs font-semibold text-primary-700">
        What you added
      </p>
      <p className="mt-1 text-sm leading-6 text-ink/70">{notes}</p>
    </div>
  );
}
