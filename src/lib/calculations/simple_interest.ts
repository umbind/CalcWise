import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface SimpleInterestInput {
  principal: number | string;
  annualRate: number | string;
  timeYears: number | string;
  currencySymbol?: string;
}

export interface SimpleInterestResult {
  interestEarned: number;
  totalRepayment: number;
  formattedInterest: string;
  formattedTotal: string;
  principal: number;
  rate: number;
  timeYears: number;
}

export const SIMPLE_INTEREST_FORMULA_ID = 'formula-simple-interest-v1.0.0';
export const SIMPLE_INTEREST_FORMULA_VERSION = '1.0.0';

export function calculateSimpleInterest(input: SimpleInterestInput): CalculationOutcome<SimpleInterestResult> {
  const p = toDecimal(input.principal);
  const r = toDecimal(input.annualRate);
  const t = toDecimal(input.timeYears);
  const symbol = input.currencySymbol || '$';

  if (!p || p.lt(0)) {
    return createErrorOutcome(SIMPLE_INTEREST_FORMULA_ID, SIMPLE_INTEREST_FORMULA_VERSION, 'Principal must be non-negative.', { principal: input.principal });
  }
  if (!r || r.lt(0)) {
    return createErrorOutcome(SIMPLE_INTEREST_FORMULA_ID, SIMPLE_INTEREST_FORMULA_VERSION, 'Interest rate cannot be negative.', { annualRate: input.annualRate });
  }
  if (!t || t.lt(0)) {
    return createErrorOutcome(SIMPLE_INTEREST_FORMULA_ID, SIMPLE_INTEREST_FORMULA_VERSION, 'Time duration cannot be negative.', { timeYears: input.timeYears });
  }

  const trace: CalculationStep[] = [];

  // I = (P * R * T) / 100
  const interestDec = p.times(r).times(t).div(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalDec = p.plus(interestDec);

  trace.push({
    stepNumber: 1,
    label: 'Calculate Simple Interest (I = P × R × T ÷ 100)',
    expression: `(${p.toString()} × ${r.toString()} × ${t.toString()}) ÷ 100`,
    result: formatCurrency(interestDec, symbol),
    explanation: 'Multiply principal by rate and time, then divide by 100.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Total Repayment Amount (A = P + I)',
    expression: `${p.toString()} + ${interestDec.toString()}`,
    result: formatCurrency(totalDec, symbol),
    explanation: 'Sum of starting principal plus simple interest.',
  });

  return {
    status: 'success',
    value: {
      interestEarned: interestDec.toNumber(),
      totalRepayment: totalDec.toNumber(),
      formattedInterest: formatCurrency(interestDec, symbol),
      formattedTotal: formatCurrency(totalDec, symbol),
      principal: p.toNumber(),
      rate: r.toNumber(),
      timeYears: t.toNumber(),
    },
    normalizedInputs: {
      principal: p.toNumber(),
      annualRate: r.toNumber(),
      timeYears: t.toNumber(),
    },
    appliedDefaults: [],
    formulaId: SIMPLE_INTEREST_FORMULA_ID,
    formulaVersion: SIMPLE_INTEREST_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
