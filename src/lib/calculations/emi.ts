import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface EmiInput {
  principal: number | string;
  annualInterestRate: number | string;
  tenureMonths: number | string;
  currencySymbol?: string;
}

export interface AmortizationScheduleRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  formattedPayment: string;
  formattedPrincipalPaid: string;
  formattedInterestPaid: string;
  formattedRemainingBalance: string;
}

export interface EmiResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  formattedTotalRepayment: string;
  principal: number;
  annualRate: number;
  tenureMonths: number;
  schedule: AmortizationScheduleRow[];
}

export const EMI_FORMULA_ID = 'formula-reducing-emi-v1.0.0';
export const EMI_FORMULA_VERSION = '1.0.0';

export function calculateEmi(input: EmiInput): CalculationOutcome<EmiResult> {
  const p = toDecimal(input.principal);
  const rAnnual = toDecimal(input.annualInterestRate);
  const n = toDecimal(input.tenureMonths);
  const symbol = input.currencySymbol || '$';

  if (!p || p.lte(0)) {
    return createErrorOutcome(EMI_FORMULA_ID, EMI_FORMULA_VERSION, 'Principal must be greater than 0.', {
      principal: input.principal,
    });
  }
  if (!rAnnual || rAnnual.lt(0)) {
    return createErrorOutcome(EMI_FORMULA_ID, EMI_FORMULA_VERSION, 'Interest rate cannot be negative.', {
      annualInterestRate: input.annualInterestRate,
    });
  }
  if (!n || n.lt(1) || !n.isInteger()) {
    return createErrorOutcome(EMI_FORMULA_ID, EMI_FORMULA_VERSION, 'Tenure must be at least 1 whole month.', {
      tenureMonths: input.tenureMonths,
    });
  }

  const trace: CalculationStep[] = [];
  const nInt = n.toNumber();

  let emiDec: Decimal;

  if (rAnnual.isZero()) {
    emiDec = p.div(n);
    trace.push({
      stepNumber: 1,
      label: 'Zero Interest Loan Payment',
      expression: `${p.toString()} ÷ ${n.toString()}`,
      result: emiDec.toFixed(2),
      explanation: 'At 0% annual interest, monthly payment is simply principal divided by tenure.',
    });
  } else {
    // Monthly interest rate = Annual Rate / (12 * 100)
    const rMonthly = rAnnual.div(1200);
    trace.push({
      stepNumber: 1,
      label: 'Calculate Monthly Interest Rate (r)',
      expression: `${rAnnual.toString()} ÷ 1200`,
      result: rMonthly.toFixed(8),
      explanation: 'Convert nominal annual rate into effective monthly rate decimal.',
    });

    // Compound factor: (1 + r)^n
    const onePlusRPowN = new Decimal(1).plus(rMonthly).pow(nInt);
    trace.push({
      stepNumber: 2,
      label: 'Calculate Compounding Factor (1 + r)^n',
      expression: `(1 + ${rMonthly.toFixed(6)})^${nInt}`,
      result: onePlusRPowN.toFixed(8),
      explanation: 'Compound factor over the total number of monthly payment periods.',
    });

    // EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const numerator = p.times(rMonthly).times(onePlusRPowN);
    const denominator = onePlusRPowN.minus(1);
    emiDec = numerator.div(denominator);

    trace.push({
      stepNumber: 3,
      label: 'Calculate Standard Reducing EMI',
      expression: `[${p.toString()} × ${rMonthly.toFixed(6)} × ${onePlusRPowN.toFixed(4)}] ÷ [${onePlusRPowN.toFixed(4)} - 1]`,
      result: emiDec.toFixed(2),
      explanation: 'Standard reducing balance loan formula for equal monthly repayments.',
    });
  }

  // Rounded monthly payment to 2 decimal places for execution
  const monthlyPaymentRounded = emiDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Generate Amortization Schedule (up to 360 months; keep first 120 or complete)
  const schedule: AmortizationScheduleRow[] = [];
  let currentBalance = p;
  let accumulatedInterest = new Decimal(0);
  const rMonthly = rAnnual.div(1200);

  for (let m = 1; m <= nInt; m++) {
    const interestForMonth = rAnnual.isZero()
      ? new Decimal(0)
      : currentBalance.times(rMonthly).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    
    let principalForMonth = monthlyPaymentRounded.minus(interestForMonth);

    // If final month or principal exceeds remaining balance, adjust
    if (m === nInt || principalForMonth.gt(currentBalance)) {
      principalForMonth = currentBalance;
    }

    currentBalance = currentBalance.minus(principalForMonth);
    if (currentBalance.lt(0)) currentBalance = new Decimal(0);
    accumulatedInterest = accumulatedInterest.plus(interestForMonth);

    const actualPayment = principalForMonth.plus(interestForMonth);

    schedule.push({
      month: m,
      payment: actualPayment.toNumber(),
      principalPaid: principalForMonth.toNumber(),
      interestPaid: interestForMonth.toNumber(),
      remainingBalance: currentBalance.toNumber(),
      formattedPayment: formatCurrency(actualPayment, symbol),
      formattedPrincipalPaid: formatCurrency(principalForMonth, symbol),
      formattedInterestPaid: formatCurrency(interestForMonth, symbol),
      formattedRemainingBalance: formatCurrency(currentBalance, symbol),
    });

    if (currentBalance.isZero()) break;
  }

  const totalRepaymentDec = p.plus(accumulatedInterest);

  trace.push({
    stepNumber: 4,
    label: 'Calculate Total Interest & Repayment',
    expression: `Total Interest = ${accumulatedInterest.toFixed(2)}, Total Repaid = ${totalRepaymentDec.toFixed(2)}`,
    result: formatCurrency(totalRepaymentDec, symbol),
    explanation: 'Sum of all interest components plus original loan principal.',
  });

  return {
    status: 'success',
    value: {
      monthlyPayment: monthlyPaymentRounded.toNumber(),
      totalInterest: accumulatedInterest.toNumber(),
      totalRepayment: totalRepaymentDec.toNumber(),
      formattedMonthlyPayment: formatCurrency(monthlyPaymentRounded, symbol),
      formattedTotalInterest: formatCurrency(accumulatedInterest, symbol),
      formattedTotalRepayment: formatCurrency(totalRepaymentDec, symbol),
      principal: p.toNumber(),
      annualRate: rAnnual.toNumber(),
      tenureMonths: nInt,
      schedule,
    },
    normalizedInputs: {
      principal: p.toNumber(),
      annualInterestRate: rAnnual.toNumber(),
      tenureMonths: nInt,
    },
    appliedDefaults: [],
    formulaId: EMI_FORMULA_ID,
    formulaVersion: EMI_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
