import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface CreditCardPayoffInput {
  currentBalance: number | string;
  interestRate: number | string; // APR %
  payoffStrategy: 'fixed_payment' | 'target_months';
  monthlyPayment?: number | string;
  targetMonths?: number | string;
  currencySymbol?: string;
}

export interface CreditCardPayoffResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  monthlyPaymentAmount: number;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  formattedTotalPayment: string;
  formattedTimeToPayoff: string;
}

export const CC_PAYOFF_FORMULA_ID = 'formula-finance-credit-card-payoff-v1.0.0';
export const CC_PAYOFF_FORMULA_VERSION = '1.0.0';

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CalculationOutcome<CreditCardPayoffResult> {
  const balance = toDecimal(input.currentBalance);
  const apr = toDecimal(input.interestRate);
  const symbol = input.currencySymbol || '$';

  if (!balance || balance.lte(0)) {
    return createErrorOutcome(CC_PAYOFF_FORMULA_ID, CC_PAYOFF_FORMULA_VERSION, 'Current balance must be positive.', { currentBalance: input.currentBalance });
  }
  if (!apr || apr.lt(0) || apr.gt(100)) {
    return createErrorOutcome(CC_PAYOFF_FORMULA_ID, CC_PAYOFF_FORMULA_VERSION, 'Interest rate (APR) must be between 0% and 100%.', { interestRate: input.interestRate });
  }

  const monthlyRate = apr.div(100).div(12);
  const trace: CalculationStep[] = [];

  let months = 0;
  let totalInterest = new Decimal(0);
  let totalPaid = new Decimal(0);
  let monthlyPay = new Decimal(0);

  if (input.payoffStrategy === 'target_months') {
    const targetM = toDecimal(input.targetMonths);
    if (!targetM || targetM.lte(0) || targetM.gt(600)) {
      return createErrorOutcome(CC_PAYOFF_FORMULA_ID, CC_PAYOFF_FORMULA_VERSION, 'Target months must be between 1 and 600.', { targetMonths: input.targetMonths });
    }
    months = targetM.toNumber();

    if (monthlyRate.eq(0)) {
      monthlyPay = balance.div(targetM).toDecimalPlaces(2, Decimal.ROUND_UP);
      totalPaid = balance;
      totalInterest = new Decimal(0);
    } else {
      // Standard amortization payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const onePlusRToN = monthlyRate.plus(1).pow(months);
      monthlyPay = balance.times(monthlyRate).times(onePlusRToN).div(onePlusRToN.minus(1)).toDecimalPlaces(2, Decimal.ROUND_UP);
      totalPaid = monthlyPay.times(months);
      totalInterest = totalPaid.minus(balance).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    }

    trace.push({
      stepNumber: 1,
      label: 'Compute Required Monthly Payment for Target Duration',
      expression: `Amortization payment for ${formatCurrency(balance, symbol)} over ${months} months at ${apr.toString()}% APR`,
      result: `${formatCurrency(monthlyPay, symbol)} / mo`,
      explanation: 'Monthly installment needed to reach zero balance in target timeframe.',
    });
  } else {
    // Fixed payment strategy
    const fixedPay = toDecimal(input.monthlyPayment);
    if (!fixedPay || fixedPay.lte(0)) {
      return createErrorOutcome(CC_PAYOFF_FORMULA_ID, CC_PAYOFF_FORMULA_VERSION, 'Monthly payment must be greater than zero.', { monthlyPayment: input.monthlyPayment });
    }

    // Minimum monthly interest
    const initialMonthInterest = balance.times(monthlyRate);
    if (fixedPay.lte(initialMonthInterest)) {
      return createErrorOutcome(
        CC_PAYOFF_FORMULA_ID,
        CC_PAYOFF_FORMULA_VERSION,
        `Monthly payment of ${formatCurrency(fixedPay, symbol)} is insufficient to cover the monthly interest of ${formatCurrency(initialMonthInterest, symbol)}. The balance would grow indefinitely.`,
        { monthlyPayment: input.monthlyPayment, firstMonthInterest: initialMonthInterest.toNumber() }
      );
    }

    monthlyPay = fixedPay;
    let remBalance = balance;
    const maxMonths = 1200; // 100-year safety ceiling

    while (remBalance.gt(0) && months < maxMonths) {
      months++;
      const monthInterest = remBalance.times(monthlyRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
      totalInterest = totalInterest.plus(monthInterest);

      const principalPaid = Decimal.min(fixedPay.minus(monthInterest), remBalance);
      remBalance = remBalance.minus(principalPaid);
      totalPaid = totalPaid.plus(monthInterest).plus(principalPaid);
    }

    trace.push({
      stepNumber: 1,
      label: 'Simulate Amortization Iterations',
      expression: `${months} months at ${formatCurrency(monthlyPay, symbol)} / month`,
      result: `${months} Months`,
      explanation: 'Simulated month-by-month payment until principal is zero.',
    });
  }

  trace.push({
    stepNumber: 2,
    label: 'Compute Total Financing Cost',
    expression: `${formatCurrency(balance, symbol)} Principal + ${formatCurrency(totalInterest, symbol)} Total Interest`,
    result: formatCurrency(totalPaid, symbol),
    explanation: 'Overall amount paid to retire the credit card balance.',
  });

  const yearsDisplay = Math.floor(months / 12);
  const remMonthsDisplay = months % 12;
  let formattedTime = `${months} months`;
  if (yearsDisplay > 0) {
    formattedTime = `${yearsDisplay} yr${yearsDisplay > 1 ? 's' : ''}${remMonthsDisplay > 0 ? ` ${remMonthsDisplay} mo` : ''} (${months} mo)`;
  }

  return {
    status: 'success',
    value: {
      monthsToPayoff: months,
      totalInterest: totalInterest.toNumber(),
      totalPayment: totalPaid.toNumber(),
      monthlyPaymentAmount: monthlyPay.toNumber(),
      formattedMonthlyPayment: formatCurrency(monthlyPay, symbol),
      formattedTotalInterest: formatCurrency(totalInterest, symbol),
      formattedTotalPayment: formatCurrency(totalPaid, symbol),
      formattedTimeToPayoff: formattedTime,
    },
    normalizedInputs: {
      currentBalance: balance.toNumber(),
      interestRate: apr.toNumber(),
      payoffStrategy: input.payoffStrategy,
    },
    appliedDefaults: [],
    formulaId: CC_PAYOFF_FORMULA_ID,
    formulaVersion: CC_PAYOFF_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
