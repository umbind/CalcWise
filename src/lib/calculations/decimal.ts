import Decimal from 'decimal.js';

// Configure high internal precision for calculations
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

/**
 * Safely parse a value into a Decimal. Returns null if invalid.
 */
export function toDecimal(val: number | string | Decimal | null | undefined): Decimal | null {
  if (val === null || val === undefined || val === '') return null;
  try {
    const d = new Decimal(val);
    if (d.isNaN() || !d.isFinite()) return null;
    return d;
  } catch {
    return null;
  }
}

/**
 * Format a Decimal as currency (defaults to 2 decimal places with comma grouping)
 */
export function formatCurrency(
  val: Decimal | number | string,
  currencySymbol = '$',
  decimals = 2
): string {
  const d = toDecimal(val);
  if (!d) return '—';
  
  const num = d.toNumber();
  return `${currencySymbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Format a number/decimal to a fixed number of decimals
 */
export function formatNumber(val: Decimal | number | string, decimals = 2): string {
  const d = toDecimal(val);
  if (!d) return '—';
  return d.toNumber().toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
