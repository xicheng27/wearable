import type { BudgetRange, MobilityLevel } from "@/types";

// The quiz's location step uses shipping regions rather than full country
// names, so map those directly to a default display currency.
export const shippingLocationCurrency: Record<string, string> = {
  USA: "USD",
  Canada: "CAD",
  UK: "GBP",
  EU: "EUR",
  Australia: "AUD",
};

export function deriveMobilityLevel(needs: string[]): MobilityLevel {
  const lower = needs.map((need) => need.toLowerCase());
  if (lower.some((need) => need.includes("wheelchair"))) return "wheelchair-or-seated";
  if (lower.some((need) => need.includes("mobility"))) return "some-difficulty";
  return "full-mobility";
}

export function deriveBudgetRange(label: string): BudgetRange | undefined {
  const value = label.toLowerCase();
  if (value.includes("budget")) return "budget";
  if (value.includes("mid")) return "mid-range";
  if (value.includes("premium")) return "premium";
  if (value.includes("no limit")) return "no-limit";
  return undefined;
}
