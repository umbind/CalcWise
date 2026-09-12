import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface InflationInput {
  initialAmount: number | string;
  annualInflationRate: number | string; // Annual percentage rate %
  years: number | string;
  currencySymbol?: string;
}

export interface InflationResult {
  equivalentFutureCost: number;
  futurePurchasingPowerOfSameAmount: number;
  cumulativeInflationPct: number;
  purchasingPowerLossPct: number;
  formattedFutureCost: string;
  formattedFuturePurchasingPower: string;
  formattedCumulativeInflation: string;
  formattedPurchasingPowerLoss: string;
}

export const INFLATION_FORMULA_ID = 'formula-finance-inflation-v1.0.0';
export const INFLATION_FORMULA_VERSION = '1.0.0';

export function calculateInflation(input: InflationInput): CalculationOutcome<InflationResult> {
  const amount = toDecimal(input.initialAmount);
  const rate = toDecimal(input.annualInflationRate);
  const years = toDecimal(input.years);
  const symbol = input.currencySymbol || '$';

  if (!amount || amount.lte(0)) {
    return createErrorOutcome(INFLATION_FORMULA_ID, INFLATION_FORMULA_VERSION, 'Initial amount must be greater than zero.', { initialAmount: input.initialAmount });
  }
  if (!rate || rate.lt(-20) || rate.gt(100)) {
    return createErrorOutcome(INFLATION_FORMULA_ID, INFLATION_FORMULA_VERSION, 'Annual inflation rate must be between -20% and 100%.', { annualInflationRate: input.annualInflationRate });
  }
  if (!years || years.lte(0) || years.gt(100)) {
    return createErrorOutcome(INFLATION_FORMULA_ID, INFLATION_FORMULA_VERSION, 'Years must be between 1 and 100.', { years: input.years });
  }

  const rDec = rate.div(100);
  const yNum = years.toNumber();
  const trace: CalculationStep[] = [];

  // Future equivalent cost: F = P * (1 + r)^y
  const compoundMultiplier = Math.pow(rDec.plus(1).toNumber(), yNum);
  const futureCost = amount.times(new Decimal(compoundMultiplier)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Future purchasing power of the exact same nominal amount: P_future = P / (1 + r)^y
  const futurePower = amount.div(new Decimal(compoundMultiplier)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Cumulative inflation %: ((1 + r)^y - 1) * 100
  const cumulativePct = new Decimal((compoundMultiplier - 1) * 100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Purchasing power loss %: (1 - 1 / (1 + r)^y) * 100
  const lossPct = new Decimal((1 - 1 / compoundMultiplier) * 100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 1,
    label: 'Compute Inflation Multiplier',
    expression: `(1 + ${rDec.toString()})^${yNum}`,
    result: compoundMultiplier.toFixed(4),
    explanation: 'Compounded price increase factor across the specified timeframe.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Compute Future Equivalent Cost of Goods',
    expression: `${formatCurrency(amount, symbol)} × ${compoundMultiplier.toFixed(4)}`,
    result: formatCurrency(futureCost, symbol),
    explanation: 'Nominal currency required in the future to purchase the identical basket of goods.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Compute Real Purchasing Power Erosion',
    expression: `${formatCurrency(amount, symbol)} ÷ ${compoundMultiplier.toFixed(4)}`,
    result: formatCurrency(futurePower, symbol),
    explanation: 'Value of today’s nominal cash in future purchasing capability.',
  });

  return {
    status: 'success',
    value: {
      equivalentFutureCost: futureCost.toNumber(),
      futurePurchasingPowerOfSameAmount: futurePower.toNumber(),
      cumulativeInflationPct: cumulativePct.toNumber(),
      purchasingPowerLossPct: lossPct.toNumber(),
      formattedFutureCost: formatCurrency(futureCost, symbol),
      formattedFuturePurchasingPower: formatCurrency(futurePower, symbol),
      formattedCumulativeInflation: `${cumulativePct.toFixed(2)}%`,
      formattedPurchasingPowerLoss: `-${lossPct.toFixed(2)}%`,
    },
    normalizedInputs: {
      initialAmount: amount.toNumber(),
      annualInflationRate: rate.toNumber(),
      years: yNum,
    },
    appliedDefaults: [],
    formulaId: INFLATION_FORMULA_ID,
    formulaVersion: INFLATION_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
