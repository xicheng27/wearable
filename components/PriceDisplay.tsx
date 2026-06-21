"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import {
  convertCurrency,
  formatCurrency,
  hasStartingPrice,
  parsePrice,
} from "@/lib/currency";

export default function PriceDisplay({
  price,
  sourceCurrency,
  fallback = "Price not listed",
  prominent = false,
}: {
  price?: string;
  sourceCurrency?: string;
  fallback?: string;
  prominent?: boolean;
}) {
  const { currency, rates, ratesDate } = useCurrency();

  if (!price || !sourceCurrency) {
    return <span className={prominent ? "text-2xl font-extrabold" : ""}>{fallback}</span>;
  }

  const amount = parsePrice(price);
  if (amount === null) {
    return <span>{`${sourceCurrency} ${price}`}</span>;
  }

  const prefix = hasStartingPrice(price) ? "From " : "";
  const converted = convertCurrency(amount, sourceCurrency, currency, rates);
  const exactSource = `${prefix}${formatCurrency(amount, sourceCurrency)}`;

  if (sourceCurrency === currency || converted === null) {
    return (
      <span
        className={prominent ? "text-2xl font-extrabold" : "font-extrabold"}
        title="Exact price from the official product listing"
      >
        {exactSource}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col">
      <span
        className={prominent ? "text-2xl font-extrabold" : "font-extrabold"}
        title={`Converted using reference rates dated ${ratesDate}`}
      >
        {prefix}
        {formatCurrency(converted, currency)}
      </span>
      <span className="mt-0.5 text-xs font-semibold leading-tight text-ink/60">
        Estimated in {currency}. Exact source {exactSource}
      </span>
    </span>
  );
}
