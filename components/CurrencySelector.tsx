"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import {
  DisplayCurrency,
  displayCurrencies,
} from "@/lib/currency";

const labels: Record<DisplayCurrency, string> = {
  SGD: "SGD",
  EUR: "EUR",
  USD: "USD",
};

export default function CurrencySelector({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label
      className={`flex items-center gap-2 text-xs font-bold text-ink/65 ${className}`}
    >
      <span className="sr-only">Display currency</span>
      {!compact && <span aria-hidden="true">Currency</span>}
      <select
        value={currency}
        onChange={(event) =>
          setCurrency(event.target.value as DisplayCurrency)
        }
        className="rounded-lg border border-ink/15 bg-paper px-2 py-2 text-xs font-extrabold text-ink shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
        aria-label="Display currency"
      >
        {displayCurrencies.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
