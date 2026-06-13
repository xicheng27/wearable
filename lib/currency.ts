export type DisplayCurrency = "SGD" | "EUR" | "USD";

export type CurrencyRates = Record<string, number>;

export const displayCurrencies: DisplayCurrency[] = ["SGD", "EUR", "USD"];

// ECB reference rates, with EUR as the base, checked 2026-06-12.
export const fallbackCurrencyRates: CurrencyRates = {
  EUR: 1,
  USD: 1.1567,
  GBP: 0.86305,
  CAD: 1.618,
  SGD: 1.4854,
};

export const fallbackRatesDate = "2026-06-12";

export function convertCurrency(
  amount: number,
  sourceCurrency: string,
  targetCurrency: DisplayCurrency,
  rates: CurrencyRates
) {
  const sourceRate = rates[sourceCurrency];
  const targetRate = rates[targetCurrency];

  if (!sourceRate || !targetRate) return null;
  return (amount / sourceRate) * targetRate;
}

export function formatCurrency(amount: number, currency: string) {
  const symbols: Record<string, string> = {
    SGD: "S$",
    USD: "US$",
    EUR: "€",
    CAD: "CA$",
    GBP: "£",
  };
  const formattedAmount = new Intl.NumberFormat("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbols[currency] ?? `${currency} `}${formattedAmount}`;
}

export function parsePrice(value: string) {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

export function hasStartingPrice(value: string) {
  return /^from\b/i.test(value.trim());
}
