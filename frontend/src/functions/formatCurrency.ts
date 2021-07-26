interface FormatCurrencyProps {
  currency: string;
  value: number;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export function formatCurrency({
  currency,
  value,
  maximumFractionDigits = 9,
  minimumFractionDigits = 2,
}: FormatCurrencyProps) {
  return `${new Intl.NumberFormat('de-DE', {
    // currency,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)} ${currency?.toUpperCase()}`;
}
