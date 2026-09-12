import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface CurrencyInput {
  amount: number | string;
  fromCurrency: string;
  toCurrency: string;
  bankSpreadFeePct?: number | string;
}

export interface CurrencyResult {
  convertedAmount: number;
  exchangeRate: number;
  inverseRate: number;
  spreadFeeAmount: number;
  netReceived: number;
  fromCurrency: string;
  toCurrency: string;
  formattedConverted: string;
  formattedNetReceived: string;
  formattedExchangeRate: string;
  formattedInverseRate: string;
}

export const CURRENCY_FORMULA_ID = 'formula-converters-currency-estimator-v1.0.0';
export const CURRENCY_FORMULA_VERSION = '1.0.0';

// Benchmark Reference Rates relative to USD = 1.0000
export const BENCHMARK_USD_RATES: Record<string, number> = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.20,
  CAD: 1.38,
  AUD: 1.52,
  CHF: 0.90,
  INR: 83.50,
  CNY: 7.24,
  MXN: 18.20,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  CHF: 'CHF ',
  INR: '₹',
  CNY: '¥',
  MXN: 'Mex$',
};

export function calculateCurrency(input: CurrencyInput): CalculationOutcome<CurrencyResult> {
  const decAmt = toDecimal(input.amount);
  const from = (input.fromCurrency || 'USD').toUpperCase();
  const to = (input.toCurrency || 'EUR').toUpperCase();
  const feePct = input.bankSpreadFeePct !== undefined && input.bankSpreadFeePct !== ''
    ? toDecimal(input.bankSpreadFeePct)
    : new Decimal(0);

  if (!decAmt || decAmt.lte(0)) {
    return createErrorOutcome(CURRENCY_FORMULA_ID, CURRENCY_FORMULA_VERSION, 'Exchange amount must be greater than zero.', { amount: input.amount });
  }
  if (!BENCHMARK_USD_RATES[from]) {
    return createErrorOutcome(CURRENCY_FORMULA_ID, CURRENCY_FORMULA_VERSION, `Unsupported source currency: ${from}.`, { fromCurrency: input.fromCurrency });
  }
  if (!BENCHMARK_USD_RATES[to]) {
    return createErrorOutcome(CURRENCY_FORMULA_ID, CURRENCY_FORMULA_VERSION, `Unsupported target currency: ${to}.`, { toCurrency: input.toCurrency });
  }
  if (!feePct || feePct.lt(0) || feePct.gt(20)) {
    return createErrorOutcome(CURRENCY_FORMULA_ID, CURRENCY_FORMULA_VERSION, 'Bank spread fee must be between 0% and 20%.', { bankSpreadFeePct: input.bankSpreadFeePct });
  }

  // Cross-rate calculation via USD base: (USD per From) -> (To per USD)
  // rate = toRate / fromRate
  const fromRate = new Decimal(BENCHMARK_USD_RATES[from]);
  const toRate = new Decimal(BENCHMARK_USD_RATES[to]);

  const crossRate = toRate.div(fromRate);
  const inverseRate = fromRate.div(toRate);

  const rawConverted = decAmt.times(crossRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const feeAmount = rawConverted.times(feePct.div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const netReceived = rawConverted.minus(feeAmount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const toSym = CURRENCY_SYMBOLS[to] || '';

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Derive Triangulated Interbank Cross Rate',
    expression: `${to} benchmark (${toRate.toString()}) ÷ ${from} benchmark (${fromRate.toString()})`,
    result: `1 ${from} = ${crossRate.toDecimalPlaces(4).toString()} ${to}`,
    explanation: 'Synthetic cross-rate derived from central bank benchmark pegs.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Convert Principal & Deduct Bank Spread',
    expression: `(${decAmt.toString()} ${from} × ${crossRate.toDecimalPlaces(4).toString()}) - ${feePct.toString()}% fee`,
    result: `${toSym}${netReceived.toString()} ${to}`,
    explanation: 'Net currency payout after bank spread markup.',
  });

  return {
    status: 'success',
    value: {
      convertedAmount: rawConverted.toNumber(),
      exchangeRate: crossRate.toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber(),
      inverseRate: inverseRate.toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber(),
      spreadFeeAmount: feeAmount.toNumber(),
      netReceived: netReceived.toNumber(),
      fromCurrency: from,
      toCurrency: to,
      formattedConverted: `${toSym}${rawConverted.toString()} ${to}`,
      formattedNetReceived: `${toSym}${netReceived.toString()} ${to}`,
      formattedExchangeRate: `1 ${from} = ${crossRate.toFixed(4)} ${to}`,
      formattedInverseRate: `1 ${to} = ${inverseRate.toFixed(4)} ${from}`,
    },
    normalizedInputs: {
      amount: decAmt.toNumber(),
      fromCurrency: from,
      toCurrency: to,
      bankSpreadFeePct: feePct.toNumber(),
    },
    appliedDefaults: [],
    formulaId: CURRENCY_FORMULA_ID,
    formulaVersion: CURRENCY_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
