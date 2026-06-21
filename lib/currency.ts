export type DisplayCurrency = "SGD" | "EUR" | "USD" | "GBP" | "CAD" | "AUD";

export type CurrencyRates = Record<string, number>;

export const displayCurrencies: DisplayCurrency[] = [
  "SGD",
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
];

// ECB reference rates, with EUR as the base, checked 2026-06-12.
export const fallbackCurrencyRates: CurrencyRates = {
  EUR: 1,
  USD: 1.1567,
  GBP: 0.86305,
  CAD: 1.618,
  SGD: 1.4854,
  AUD: 1.7785,
};

export const fallbackRatesDate = "2026-06-12";

// Maps a shopping country to the display currency we show prices in. Countries
// without a dedicated supported currency fall back to USD as a neutral default.
// Add overrides here as more currencies are supported.
const currencyByCountry: Record<string, DisplayCurrency> = {
  Singapore: "SGD",
  "United States": "USD",
  "United Kingdom": "GBP",
  Canada: "CAD",
  Australia: "AUD",
  Ireland: "EUR",
  Austria: "EUR",
  Belgium: "EUR",
  Croatia: "EUR",
  Cyprus: "EUR",
  Estonia: "EUR",
  Finland: "EUR",
  France: "EUR",
  Germany: "EUR",
  Greece: "EUR",
  Italy: "EUR",
  Latvia: "EUR",
  Lithuania: "EUR",
  Luxembourg: "EUR",
  Malta: "EUR",
  Netherlands: "EUR",
  Portugal: "EUR",
  Slovakia: "EUR",
  Slovenia: "EUR",
  Spain: "EUR",
};

export function currencyForCountry(country: string): DisplayCurrency | null {
  return currencyByCountry[country] ?? null;
}


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
    AUD: "A$",
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
