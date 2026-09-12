import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface RefinanceInput {
  currentBalance: number | string;
  currentMonthlyPayment: number | string;
  currentRemainingMonths: number | string;
  newInterestRate: number | string;
  newLoanTermMonths: number | string;
  closingCosts?: number | string;
  rollCostsIntoLoan?: boolean;
  currencySymbol?: string;
}

export interface RefinanceResult {
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenMonths: number | null;
  lifetimeSavings: number;
  totalCurrentRemainingCost: number;
  totalNewLoanCost: number;
  formattedNewMonthlyPayment: string;
  formattedMonthlySavings: string;
  formattedLifetimeSavings: string;
  formattedBreakEven: string;
}

export const REFINANCE_FORMULA_ID = 'formula-finance-refinance-v1.0.0';
export const REFINANCE_FORMULA_VERSION = '1.0.0';

export function calculateRefinance(input: RefinanceInput): CalculationOutcome<RefinanceResult> {
  const balance = toDecimal(input.currentBalance);
  const curPayment = toDecimal(input.currentMonthlyPayment);
  const curMonths = toDecimal(input.currentRemainingMonths);
  const newRate = toDecimal(input.newInterestRate);
  const newMonths = toDecimal(input.newLoanTermMonths);
  const closingCosts = input.closingCosts !== undefined && input.closingCosts !== '' ? toDecimal(input.closingCosts) : new Decimal(0);
  const rollCosts = Boolean(input.rollCostsIntoLoan);
  const symbol = input.currencySymbol || '$';

  if (!balance || balance.lte(0)) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'Current loan balance must be positive.', { currentBalance: input.currentBalance });
  }
  if (!curPayment || curPayment.lte(0)) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'Current monthly payment must be positive.', { currentMonthlyPayment: input.currentMonthlyPayment });
  }
  if (!curMonths || curMonths.lte(0) || !curMonths.isInteger()) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'Current remaining months must be a positive integer.', { currentRemainingMonths: input.currentRemainingMonths });
  }
  if (!newMonths || newMonths.lte(0) || !newMonths.isInteger()) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'New loan term months must be a positive integer.', { newLoanTermMonths: input.newLoanTermMonths });
  }
  if (!newRate || newRate.lt(0)) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'New interest rate cannot be negative.', { newInterestRate: input.newInterestRate });
  }
  if (!closingCosts || closingCosts.lt(0)) {
    return createErrorOutcome(REFINANCE_FORMULA_ID, REFINANCE_FORMULA_VERSION, 'Closing costs cannot be negative.', { closingCosts: input.closingCosts });
  }

  const trace: CalculationStep[] = [];

  const financedAmount = rollCosts ? balance.plus(closingCosts) : balance;

  trace.push({
    stepNumber: 1,
    label: 'Determine New Loan Principal',
    expression: rollCosts ? `${formatCurrency(balance, symbol)} balance + ${formatCurrency(closingCosts, symbol)} closing costs` : `${formatCurrency(balance, symbol)} balance`,
    result: formatCurrency(financedAmount, symbol),
    explanation: rollCosts ? 'Closing costs are rolled into the new loan balance.' : 'Closing costs paid upfront at closing.',
  });

  let newPayment = new Decimal(0);
  if (newRate.eq(0)) {
    newPayment = financedAmount.div(newMonths).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  } else {
    const rMonthly = newRate.div(1200);
    const onePlusRPowN = rMonthly.plus(1).pow(newMonths.toNumber());
    newPayment = financedAmount
      .times(rMonthly)
      .times(onePlusRPowN)
      .div(onePlusRPowN.minus(1))
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }

  const monthlySavings = curPayment.minus(newPayment).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 2,
    label: 'Calculate Monthly Payment Difference',
    expression: `${formatCurrency(curPayment, symbol)} (current) - ${formatCurrency(newPayment, symbol)} (new)`,
    result: `${formatCurrency(monthlySavings, symbol)} / mo savings`,
    explanation: 'Difference in monthly installment payments.',
  });

  // Break-even
  let breakEvenMonths: number | null = null;
  let formattedBreakEven = 'N/A (No monthly savings)';

  if (monthlySavings.gt(0)) {
    if (closingCosts.lte(0)) {
      breakEvenMonths = 0;
      formattedBreakEven = 'Immediate (No closing costs)';
    } else {
      breakEvenMonths = Math.ceil(closingCosts.div(monthlySavings).toNumber());
      formattedBreakEven = `${breakEvenMonths} Months`;
    }
  }

  // Lifetime costs
  const totalCurrentCost = curPayment.times(curMonths).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalNewPayments = newPayment.times(newMonths);
  const totalNewCost = (rollCosts ? totalNewPayments : totalNewPayments.plus(closingCosts)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const lifetimeSavings = totalCurrentCost.minus(totalNewCost).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 3,
    label: 'Calculate Net Lifetime Savings',
    expression: `${formatCurrency(totalCurrentCost, symbol)} (remaining current) - ${formatCurrency(totalNewCost, symbol)} (total new)`,
    result: formatCurrency(lifetimeSavings, symbol),
    explanation: 'Total cost difference including upfront and rolled closing costs.',
  });

  return {
    status: 'success',
    value: {
      newMonthlyPayment: newPayment.toNumber(),
      monthlySavings: monthlySavings.toNumber(),
      breakEvenMonths,
      lifetimeSavings: lifetimeSavings.toNumber(),
      totalCurrentRemainingCost: totalCurrentCost.toNumber(),
      totalNewLoanCost: totalNewCost.toNumber(),
      formattedNewMonthlyPayment: formatCurrency(newPayment, symbol),
      formattedMonthlySavings: formatCurrency(monthlySavings, symbol),
      formattedLifetimeSavings: formatCurrency(lifetimeSavings, symbol),
      formattedBreakEven,
    },
    normalizedInputs: {
      currentBalance: balance.toNumber(),
      newInterestRate: newRate.toNumber(),
      newLoanTermMonths: newMonths.toNumber(),
    },
    appliedDefaults: [],
    formulaId: REFINANCE_FORMULA_ID,
    formulaVersion: REFINANCE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
