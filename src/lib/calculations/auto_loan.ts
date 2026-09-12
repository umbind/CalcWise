import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface AutoLoanInput {
  vehiclePrice: number | string;
  salesTaxRate?: number | string;
  downPayment?: number | string;
  tradeInValue?: number | string;
  tradeInOwed?: number | string;
  loanTermMonths: number | string;
  interestRate: number | string;
  currencySymbol?: string;
}

export interface AutoLoanResult {
  monthlyPayment: number;
  totalFinanced: number;
  totalInterest: number;
  totalSalesTax: number;
  totalCostOfVehicle: number;
  formattedMonthlyPayment: string;
  formattedTotalFinanced: string;
  formattedTotalInterest: string;
  formattedTotalSalesTax: string;
  formattedTotalCostOfVehicle: string;
}

export const AUTO_LOAN_FORMULA_ID = 'formula-finance-auto-loan-v1.0.0';
export const AUTO_LOAN_FORMULA_VERSION = '1.0.0';

export function calculateAutoLoan(input: AutoLoanInput): CalculationOutcome<AutoLoanResult> {
  const price = toDecimal(input.vehiclePrice);
  const taxRate = input.salesTaxRate !== undefined && input.salesTaxRate !== '' ? toDecimal(input.salesTaxRate) : new Decimal(0);
  const downPayment = input.downPayment !== undefined && input.downPayment !== '' ? toDecimal(input.downPayment) : new Decimal(0);
  const tradeIn = input.tradeInValue !== undefined && input.tradeInValue !== '' ? toDecimal(input.tradeInValue) : new Decimal(0);
  const tradeInOwed = input.tradeInOwed !== undefined && input.tradeInOwed !== '' ? toDecimal(input.tradeInOwed) : new Decimal(0);
  const months = toDecimal(input.loanTermMonths);
  const rate = toDecimal(input.interestRate);
  const symbol = input.currencySymbol || '$';

  if (!price || price.lte(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Vehicle price must be greater than zero.', { vehiclePrice: input.vehiclePrice });
  }
  if (!months || months.lte(0) || !months.isInteger()) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Loan term must be a positive integer number of months.', { loanTermMonths: input.loanTermMonths });
  }
  if (!rate || rate.lt(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Interest rate cannot be negative.', { interestRate: input.interestRate });
  }
  if (!taxRate || taxRate.lt(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Sales tax rate cannot be negative.', { salesTaxRate: input.salesTaxRate });
  }
  if (!downPayment || downPayment.lt(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Down payment cannot be negative.', { downPayment: input.downPayment });
  }
  if (!tradeIn || tradeIn.lt(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Trade-in value cannot be negative.', { tradeInValue: input.tradeInValue });
  }
  if (!tradeInOwed || tradeInOwed.lt(0)) {
    return createErrorOutcome(AUTO_LOAN_FORMULA_ID, AUTO_LOAN_FORMULA_VERSION, 'Trade-in owed amount cannot be negative.', { tradeInOwed: input.tradeInOwed });
  }

  const trace: CalculationStep[] = [];

  // Sales Tax base = max(0, price - tradeIn)
  const taxableBase = Decimal.max(0, price.minus(tradeIn));
  const salesTax = taxableBase.times(taxRate.div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 1,
    label: 'Calculate Sales Tax',
    expression: `(${formatCurrency(taxableBase, symbol)} taxable base) × (${taxRate.toString()}% ÷ 100)`,
    result: formatCurrency(salesTax, symbol),
    explanation: 'Sales tax calculated after deducting trade-in value where legally applicable.',
  });

  // Net trade-in equity = tradeIn - tradeInOwed
  const netTradeEquity = tradeIn.minus(tradeInOwed);

  // Total Financed = price + salesTax - downPayment - netTradeEquity
  const totalFinanced = Decimal.max(0, price.plus(salesTax).minus(downPayment).minus(netTradeEquity)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 2,
    label: 'Calculate Net Financed Principal',
    expression: `${formatCurrency(price, symbol)} + ${formatCurrency(salesTax, symbol)} - ${formatCurrency(downPayment, symbol)} - (${formatCurrency(netTradeEquity, symbol)} net trade)`,
    result: formatCurrency(totalFinanced, symbol),
    explanation: 'Total purchase price plus taxes minus down payment and vehicle trade-in equity.',
  });

  let monthlyPayment = new Decimal(0);
  let totalInterest = new Decimal(0);

  if (totalFinanced.gt(0)) {
    if (rate.eq(0)) {
      monthlyPayment = totalFinanced.div(months).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    } else {
      const rMonthly = rate.div(1200);
      const onePlusRPowN = rMonthly.plus(1).pow(months.toNumber());
      monthlyPayment = totalFinanced
        .times(rMonthly)
        .times(onePlusRPowN)
        .div(onePlusRPowN.minus(1))
        .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    }
    totalInterest = monthlyPayment.times(months).minus(totalFinanced).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }

  trace.push({
    stepNumber: 3,
    label: 'Calculate Monthly Auto Loan Payment (EMI)',
    expression: rate.eq(0) ? `${formatCurrency(totalFinanced, symbol)} ÷ ${months.toString()}` : `P × [r(1+r)^n] ÷ [(1+r)^n - 1]`,
    result: `${formatCurrency(monthlyPayment, symbol)} / mo`,
    explanation: 'Standard reducing-balance vehicle loan installment.',
  });

  const totalCostOfVehicle = downPayment.plus(monthlyPayment.times(months)).plus(Decimal.max(0, tradeInOwed.minus(tradeIn))).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    status: 'success',
    value: {
      monthlyPayment: monthlyPayment.toNumber(),
      totalFinanced: totalFinanced.toNumber(),
      totalInterest: totalInterest.toNumber(),
      totalSalesTax: salesTax.toNumber(),
      totalCostOfVehicle: totalCostOfVehicle.toNumber(),
      formattedMonthlyPayment: formatCurrency(monthlyPayment, symbol),
      formattedTotalFinanced: formatCurrency(totalFinanced, symbol),
      formattedTotalInterest: formatCurrency(totalInterest, symbol),
      formattedTotalSalesTax: formatCurrency(salesTax, symbol),
      formattedTotalCostOfVehicle: formatCurrency(totalCostOfVehicle, symbol),
    },
    normalizedInputs: {
      vehiclePrice: price.toNumber(),
      loanTermMonths: months.toNumber(),
      interestRate: rate.toNumber(),
    },
    appliedDefaults: [],
    formulaId: AUTO_LOAN_FORMULA_ID,
    formulaVersion: AUTO_LOAN_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
