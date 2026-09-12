import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface MortgageInput {
  homePrice: number | string;
  downPayment: number | string;
  loanTermYears: number | string;
  interestRate: number | string;
  annualPropertyTax?: number | string;
  annualHomeInsurance?: number | string;
  monthlyHoa?: number | string;
  currencySymbol?: string;
}

export interface MortgageResult {
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPmi: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  loanAmount: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  totalInterestPaid: number;
  totalRepaid: number;
  formattedTotalMonthly: string;
  formattedPrincipalInterest: string;
  formattedPropertyTax: string;
  formattedHomeInsurance: string;
  formattedPmi: string;
  formattedHoa: string;
  formattedLoanAmount: string;
  formattedTotalInterest: string;
}

export const MORTGAGE_FORMULA_ID = 'formula-residential-mortgage-v1.0.0';
export const MORTGAGE_FORMULA_VERSION = '1.0.0';

export function calculateMortgage(input: MortgageInput): CalculationOutcome<MortgageResult> {
  const price = toDecimal(input.homePrice);
  const down = toDecimal(input.downPayment || 0) || new Decimal(0);
  const termYears = toDecimal(input.loanTermYears);
  const rate = toDecimal(input.interestRate);
  const taxAnnual = toDecimal(input.annualPropertyTax || 0) || new Decimal(0);
  const insAnnual = toDecimal(input.annualHomeInsurance || 0) || new Decimal(0);
  const hoaMonthly = toDecimal(input.monthlyHoa || 0) || new Decimal(0);
  const symbol = input.currencySymbol || '$';

  if (!price || price.lte(0)) {
    return createErrorOutcome(MORTGAGE_FORMULA_ID, MORTGAGE_FORMULA_VERSION, 'Home price must be greater than 0.', { homePrice: input.homePrice });
  }
  if (!termYears || termYears.lte(0)) {
    return createErrorOutcome(MORTGAGE_FORMULA_ID, MORTGAGE_FORMULA_VERSION, 'Loan term must be at least 1 year.', { loanTermYears: input.loanTermYears });
  }
  if (!rate || rate.lt(0)) {
    return createErrorOutcome(MORTGAGE_FORMULA_ID, MORTGAGE_FORMULA_VERSION, 'Interest rate cannot be negative.', { interestRate: input.interestRate });
  }
  if (down.gte(price)) {
    return createErrorOutcome(MORTGAGE_FORMULA_ID, MORTGAGE_FORMULA_VERSION, 'Down payment cannot be equal to or greater than home price.', { downPayment: input.downPayment });
  }

  const trace: CalculationStep[] = [];
  const loanPrincipal = price.minus(down);
  const downPct = down.div(price).times(100).toDecimalPlaces(1);
  const totalMonths = Math.round(termYears.toNumber() * 12);

  trace.push({
    stepNumber: 1,
    label: 'Calculate Financed Loan Principal',
    expression: `${price.toString()} - ${down.toString()}`,
    result: formatCurrency(loanPrincipal, symbol),
    explanation: `Home price minus down payment (${downPct.toString()}% down).`,
  });

  // Calculate Monthly P&I
  let piDec = new Decimal(0);
  if (rate.isZero()) {
    piDec = loanPrincipal.div(totalMonths);
  } else {
    const rMonthly = rate.div(1200);
    const compoundFactor = new Decimal(1).plus(rMonthly).pow(totalMonths);
    piDec = loanPrincipal.times(rMonthly).times(compoundFactor).div(compoundFactor.minus(1));
  }
  const monthlyPI = piDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 2,
    label: 'Calculate Monthly Principal & Interest (P&I)',
    expression: `Reducing balance formula over ${totalMonths} monthly periods`,
    result: formatCurrency(monthlyPI, symbol),
    explanation: 'Standard mortgage amortization payment.',
  });

  // Monthly Escrow Components: Tax & Insurance
  const monthlyTax = taxAnnual.div(12).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const monthlyIns = insAnnual.div(12).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // PMI: If down payment < 20%, estimate standard conventional PMI at 0.5% - 1.0% annual (use 0.75% default)
  let monthlyPmi = new Decimal(0);
  if (downPct.lt(20)) {
    monthlyPmi = loanPrincipal.times('0.0075').div(12).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    trace.push({
      stepNumber: 3,
      label: 'Estimate Private Mortgage Insurance (PMI)',
      expression: `${formatCurrency(loanPrincipal, symbol)} × 0.75% ÷ 12`,
      result: formatCurrency(monthlyPmi, symbol),
      explanation: 'Required because down payment is under 20%.',
    });
  }

  // Total Monthly = P&I + Tax + Insurance + PMI + HOA
  const totalMonthly = monthlyPI.plus(monthlyTax).plus(monthlyIns).plus(monthlyPmi).plus(hoaMonthly);

  const totalRepaidLoan = monthlyPI.times(totalMonths);
  const totalInterestPaid = totalRepaidLoan.minus(loanPrincipal);

  return {
    status: 'success',
    value: {
      monthlyPrincipalInterest: monthlyPI.toNumber(),
      monthlyPropertyTax: monthlyTax.toNumber(),
      monthlyHomeInsurance: monthlyIns.toNumber(),
      monthlyPmi: monthlyPmi.toNumber(),
      monthlyHoa: hoaMonthly.toNumber(),
      totalMonthlyPayment: totalMonthly.toNumber(),
      loanAmount: loanPrincipal.toNumber(),
      downPaymentAmount: down.toNumber(),
      downPaymentPercentage: downPct.toNumber(),
      totalInterestPaid: totalInterestPaid.toDecimalPlaces(2).toNumber(),
      totalRepaid: totalRepaidLoan.toDecimalPlaces(2).toNumber(),
      formattedTotalMonthly: formatCurrency(totalMonthly, symbol),
      formattedPrincipalInterest: formatCurrency(monthlyPI, symbol),
      formattedPropertyTax: formatCurrency(monthlyTax, symbol),
      formattedHomeInsurance: formatCurrency(monthlyIns, symbol),
      formattedPmi: formatCurrency(monthlyPmi, symbol),
      formattedHoa: formatCurrency(hoaMonthly, symbol),
      formattedLoanAmount: formatCurrency(loanPrincipal, symbol),
      formattedTotalInterest: formatCurrency(totalInterestPaid, symbol),
    },
    normalizedInputs: {
      homePrice: price.toNumber(),
      downPayment: down.toNumber(),
      loanTermYears: termYears.toNumber(),
      interestRate: rate.toNumber(),
    },
    appliedDefaults: [],
    formulaId: MORTGAGE_FORMULA_ID,
    formulaVersion: MORTGAGE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
