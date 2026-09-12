import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface CdInput {
  initialDeposit: number | string;
  interestRate: number | string; // Annual interest rate %
  termMonths: number | string;
  compoundFrequency?: 'daily' | 'monthly' | 'annually';
  currencySymbol?: string;
}

export interface CdResult {
  endBalance: number;
  totalInterest: number;
  effectiveApy: number;
  formattedEndBalance: string;
  formattedTotalInterest: string;
  formattedEffectiveApy: string;
}

export const CD_FORMULA_ID = 'formula-finance-cd-calculator-v1.0.0';
export const CD_FORMULA_VERSION = '1.0.0';

export function calculateCd(input: CdInput): CalculationOutcome<CdResult> {
  const deposit = toDecimal(input.initialDeposit);
  const rate = toDecimal(input.interestRate);
  const months = toDecimal(input.termMonths);
  const freq = input.compoundFrequency || 'monthly';
  const symbol = input.currencySymbol || '$';

  if (!deposit || deposit.lte(0)) {
    return createErrorOutcome(CD_FORMULA_ID, CD_FORMULA_VERSION, 'Initial deposit must be greater than zero.', { initialDeposit: input.initialDeposit });
  }
  if (!rate || rate.lt(0) || rate.gt(30)) {
    return createErrorOutcome(CD_FORMULA_ID, CD_FORMULA_VERSION, 'Interest rate must be between 0% and 30%.', { interestRate: input.interestRate });
  }
  if (!months || months.lte(0) || months.gt(120)) {
    return createErrorOutcome(CD_FORMULA_ID, CD_FORMULA_VERSION, 'Term must be between 1 and 120 months (10 years).', { termMonths: input.termMonths });
  }

  const periodsPerYear = freq === 'daily' ? 365 : freq === 'annually' ? 1 : 12;
  const tYears = months.div(12);
  const rDec = rate.div(100);

  // Compound Interest formula: A = P * (1 + r / n)^(n * t)
  const ratePerPeriod = rDec.div(periodsPerYear);
  const totalPeriods = periodsPerYear * tYears.toNumber();

  const factor = ratePerPeriod.plus(1).toNumber();
  const compoundMultiplier = Math.pow(factor, totalPeriods);
  const endBalDec = deposit.times(new Decimal(compoundMultiplier)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalIntDec = endBalDec.minus(deposit).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // APY = (1 + r / n)^n - 1
  const annualFactor = Math.pow(factor, periodsPerYear) - 1;
  const apyPct = new Decimal(annualFactor).times(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const trace: CalculationStep[] = [];

  trace.push({
    stepNumber: 1,
    label: 'Determine Compounding Frequency and Periods',
    expression: `${freq.toUpperCase()}: ${periodsPerYear} periods/year over ${months.toString()} months (${tYears.toFixed(2)} years)`,
    result: `${totalPeriods.toFixed(1)} periods`,
    explanation: 'Total number of interest crediting intervals during CD tenure.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Compute Maturity Balance with Compound Interest',
    expression: `${formatCurrency(deposit, symbol)} × (1 + ${rDec.toString()} ÷ ${periodsPerYear})^(${totalPeriods.toFixed(1)})`,
    result: formatCurrency(endBalDec, symbol),
    explanation: 'Final balance upon CD term completion including principal and interest.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Calculate Annual Percentage Yield (APY)',
    expression: `(1 + ${rDec.toString()} ÷ ${periodsPerYear})^${periodsPerYear} - 1`,
    result: `${apyPct.toFixed(2)}% APY`,
    explanation: 'Effective annualized return accounting for compounding frequency.',
  });

  return {
    status: 'success',
    value: {
      endBalance: endBalDec.toNumber(),
      totalInterest: totalIntDec.toNumber(),
      effectiveApy: apyPct.toNumber(),
      formattedEndBalance: formatCurrency(endBalDec, symbol),
      formattedTotalInterest: formatCurrency(totalIntDec, symbol),
      formattedEffectiveApy: `${apyPct.toFixed(2)}%`,
    },
    normalizedInputs: {
      initialDeposit: deposit.toNumber(),
      interestRate: rate.toNumber(),
      termMonths: months.toNumber(),
      compoundFrequency: freq,
    },
    appliedDefaults: [],
    formulaId: CD_FORMULA_ID,
    formulaVersion: CD_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
