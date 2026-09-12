import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type CompoundingFrequency = 'annually' | 'semi_annually' | 'quarterly' | 'monthly' | 'daily';

export interface CompoundInterestInput {
  initialPrincipal: number | string;
  annualInterestRate: number | string;
  years: number | string;
  monthlyContribution?: number | string;
  compoundingFrequency?: CompoundingFrequency;
  currencySymbol?: string;
}

export interface CompoundYearRow {
  year: number;
  startingBalance: number;
  annualDeposits: number;
  interestEarned: number;
  endingBalance: number;
  formattedEndingBalance: string;
  formattedInterestEarned: string;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  formattedFutureValue: string;
  formattedTotalPrincipal: string;
  formattedTotalContributions: string;
  formattedTotalInterest: string;
  growthSchedule: CompoundYearRow[];
}

export const COMPOUND_INTEREST_FORMULA_ID = 'formula-compound-interest-v1.0.0';
export const COMPOUND_INTEREST_FORMULA_VERSION = '1.0.0';

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CalculationOutcome<CompoundInterestResult> {
  const p = toDecimal(input.initialPrincipal);
  const rAnnual = toDecimal(input.annualInterestRate);
  const t = toDecimal(input.years);
  const pmtMonthly = toDecimal(input.monthlyContribution || 0) || new Decimal(0);
  const symbol = input.currencySymbol || '$';
  const freq = input.compoundingFrequency || 'monthly';

  if (!p || p.lt(0)) {
    return createErrorOutcome(COMPOUND_INTEREST_FORMULA_ID, COMPOUND_INTEREST_FORMULA_VERSION, 'Principal must be zero or positive.', { initialPrincipal: input.initialPrincipal });
  }
  if (!rAnnual || rAnnual.lt(0)) {
    return createErrorOutcome(COMPOUND_INTEREST_FORMULA_ID, COMPOUND_INTEREST_FORMULA_VERSION, 'Interest rate cannot be negative.', { annualInterestRate: input.annualInterestRate });
  }
  if (!t || t.lte(0)) {
    return createErrorOutcome(COMPOUND_INTEREST_FORMULA_ID, COMPOUND_INTEREST_FORMULA_VERSION, 'Time period must be greater than 0 years.', { years: input.years });
  }

  const freqMap: Record<CompoundingFrequency, number> = {
    annually: 1,
    semi_annually: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };
  const n = new Decimal(freqMap[freq]);
  const rDec = rAnnual.div(100);
  const totalYears = Math.min(100, Math.ceil(t.toNumber()));

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Identify Periodic Interest Rate (r / n)',
    expression: `${rAnnual.toString()}% ÷ ${n.toString()}`,
    result: rDec.div(n).toFixed(8),
    explanation: `Divide annual rate by compounding frequency (${freq}).`,
  });

  // Calculate year by year for exact schedule and totals
  let currentBalance = p;
  let totalDepositedContributions = new Decimal(0);
  let accumulatedInterest = new Decimal(0);
  const growthSchedule: CompoundYearRow[] = [];

  const periodicRate = rDec.div(n);
  const periodsPerYear = n.toNumber();

  for (let y = 1; y <= totalYears; y++) {
    const startBal = currentBalance;
    let yearDeposits = new Decimal(0);
    let yearStartPlusGrowth = currentBalance;

    // Simulate 12 months in this year
    for (let m = 1; m <= 12; m++) {
      yearStartPlusGrowth = yearStartPlusGrowth.plus(pmtMonthly);
      yearDeposits = yearDeposits.plus(pmtMonthly);
    }
    totalDepositedContributions = totalDepositedContributions.plus(yearDeposits);

    // Approximate compounding growth for the year
    // Balance with compounding: (currentBalance) * (1 + r/n)^n + PMT compounding
    const compoundFactorYear = new Decimal(1).plus(periodicRate).pow(periodsPerYear);
    const balanceFromPrincipal = currentBalance.times(compoundFactorYear);
    
    // Future value of an ordinary annuity for the year's monthly contributions
    let balanceFromDeposits = new Decimal(0);
    if (rDec.gt(0) && pmtMonthly.gt(0)) {
      const rMonthly = rDec.div(12);
      const fvAnnuityFactor = new Decimal(1).plus(rMonthly).pow(12).minus(1).div(rMonthly);
      balanceFromDeposits = pmtMonthly.times(fvAnnuityFactor);
    } else {
      balanceFromDeposits = yearDeposits;
    }

    currentBalance = balanceFromPrincipal.plus(balanceFromDeposits);
    const yearInterest = currentBalance.minus(startBal).minus(yearDeposits);
    accumulatedInterest = accumulatedInterest.plus(yearInterest);

    growthSchedule.push({
      year: y,
      startingBalance: startBal.toDecimalPlaces(2).toNumber(),
      annualDeposits: yearDeposits.toDecimalPlaces(2).toNumber(),
      interestEarned: yearInterest.toDecimalPlaces(2).toNumber(),
      endingBalance: currentBalance.toDecimalPlaces(2).toNumber(),
      formattedEndingBalance: formatCurrency(currentBalance, symbol),
      formattedInterestEarned: formatCurrency(yearInterest, symbol),
    });
  }

  const futureValueRounded = currentBalance.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 2,
    label: 'Calculate Total Future Value',
    expression: `P × (1 + r/n)^(n×t) + Contributions`,
    result: formatCurrency(futureValueRounded, symbol),
    explanation: 'Sum of compounded initial principal plus growth of regular periodic additions.',
  });

  return {
    status: 'success',
    value: {
      futureValue: futureValueRounded.toNumber(),
      totalPrincipal: p.toNumber(),
      totalContributions: totalDepositedContributions.toNumber(),
      totalInterest: accumulatedInterest.toDecimalPlaces(2).toNumber(),
      formattedFutureValue: formatCurrency(futureValueRounded, symbol),
      formattedTotalPrincipal: formatCurrency(p, symbol),
      formattedTotalContributions: formatCurrency(totalDepositedContributions, symbol),
      formattedTotalInterest: formatCurrency(accumulatedInterest, symbol),
      growthSchedule,
    },
    normalizedInputs: {
      initialPrincipal: p.toNumber(),
      annualInterestRate: rAnnual.toNumber(),
      years: t.toNumber(),
      monthlyContribution: pmtMonthly.toNumber(),
      compoundingFrequency: freq,
    },
    appliedDefaults: [],
    formulaId: COMPOUND_INTEREST_FORMULA_ID,
    formulaVersion: COMPOUND_INTEREST_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
