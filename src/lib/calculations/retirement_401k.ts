import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface Retirement401kInput {
  currentAge: number | string;
  retirementAge: number | string;
  currentBalance?: number | string;
  annualSalary: number | string;
  salaryGrowthRate?: number | string;
  employeeContributionPct: number | string;
  employerMatchPct?: number | string;
  employerMatchCapPct?: number | string;
  annualReturnRate: number | string;
  currencySymbol?: string;
}

export interface Retirement401kResult {
  totalBalanceAtRetirement: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalInvestmentGrowth: number;
  estimatedMonthlyRetirementIncome: number;
  yearsToRetirement: number;
  formattedTotalBalance: string;
  formattedEmployeeContributions: string;
  formattedEmployerContributions: string;
  formattedInvestmentGrowth: string;
  formattedMonthlyIncome: string;
}

export const RETIREMENT_401K_FORMULA_ID = 'formula-finance-401k-retirement-v1.0.0';
export const RETIREMENT_401K_FORMULA_VERSION = '1.0.0';

export function calculate401k(input: Retirement401kInput): CalculationOutcome<Retirement401kResult> {
  const curAge = toDecimal(input.currentAge);
  const retAge = toDecimal(input.retirementAge);
  const curBalance = input.currentBalance !== undefined && input.currentBalance !== '' ? toDecimal(input.currentBalance) : new Decimal(0);
  const salary = toDecimal(input.annualSalary);
  const salaryGrowth = input.salaryGrowthRate !== undefined && input.salaryGrowthRate !== '' ? toDecimal(input.salaryGrowthRate) : new Decimal(2.0);
  const empPct = toDecimal(input.employeeContributionPct);
  const matchPct = input.employerMatchPct !== undefined && input.employerMatchPct !== '' ? toDecimal(input.employerMatchPct) : new Decimal(50);
  const matchCap = input.employerMatchCapPct !== undefined && input.employerMatchCapPct !== '' ? toDecimal(input.employerMatchCapPct) : new Decimal(6);
  const rReturn = toDecimal(input.annualReturnRate);
  const symbol = input.currencySymbol || '$';

  if (!curAge || curAge.lt(16) || curAge.gt(90)) {
    return createErrorOutcome(RETIREMENT_401K_FORMULA_ID, RETIREMENT_401K_FORMULA_VERSION, 'Current age must be between 16 and 90.', { currentAge: input.currentAge });
  }
  if (!retAge || retAge.lte(curAge) || retAge.gt(100)) {
    return createErrorOutcome(RETIREMENT_401K_FORMULA_ID, RETIREMENT_401K_FORMULA_VERSION, 'Retirement age must be greater than current age and at most 100.', { retirementAge: input.retirementAge });
  }
  if (!salary || salary.lte(0)) {
    return createErrorOutcome(RETIREMENT_401K_FORMULA_ID, RETIREMENT_401K_FORMULA_VERSION, 'Annual salary must be positive.', { annualSalary: input.annualSalary });
  }
  if (!empPct || empPct.lt(0) || empPct.gt(100)) {
    return createErrorOutcome(RETIREMENT_401K_FORMULA_ID, RETIREMENT_401K_FORMULA_VERSION, 'Employee contribution must be between 0% and 100%.', { employeeContributionPct: input.employeeContributionPct });
  }
  if (!rReturn || rReturn.lt(0) || rReturn.gt(30)) {
    return createErrorOutcome(RETIREMENT_401K_FORMULA_ID, RETIREMENT_401K_FORMULA_VERSION, 'Expected annual return must be between 0% and 30%.', { annualReturnRate: input.annualReturnRate });
  }

  const trace: CalculationStep[] = [];
  const years = retAge.minus(curAge).toNumber();

  let balance = curBalance || new Decimal(0);
  let currentSalary = salary;
  let totalEmployee = new Decimal(0);
  let totalEmployer = new Decimal(0);

  const annualReturnDec = rReturn.div(100);
  const salaryGrowthDec = (salaryGrowth || new Decimal(0)).div(100);
  const empContribDec = empPct.div(100);
  const matchDec = (matchPct || new Decimal(0)).div(100);
  const matchCapDec = (matchCap || new Decimal(0)).div(100);

  for (let yr = 1; yr <= years; yr++) {
    // Annual employee contribution
    const empYearContrib = currentSalary.times(empContribDec);
    totalEmployee = totalEmployee.plus(empYearContrib);

    // Employer match: matchPct of contribution up to matchCap of salary
    const matchedSalaryPct = Decimal.min(empContribDec, matchCapDec);
    const employerYearContrib = currentSalary.times(matchedSalaryPct).times(matchDec);
    totalEmployer = totalEmployer.plus(employerYearContrib);

    // Total additions for year
    const totalYearAdditions = empYearContrib.plus(employerYearContrib);

    // Compound balance: beginning balance grows by r, additions assume mid-year average compounding
    const interestOnStart = balance.times(annualReturnDec);
    const interestOnAdditions = totalYearAdditions.times(annualReturnDec.div(2));

    balance = balance.plus(totalYearAdditions).plus(interestOnStart).plus(interestOnAdditions);

    // Grow salary for next year
    currentSalary = currentSalary.times(new Decimal(1).plus(salaryGrowthDec));
  }

  const finalBalance = balance.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalGrowth = finalBalance.minus(curBalance || 0).minus(totalEmployee).minus(totalEmployer).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  // 4% safe withdrawal rate for annual retirement income / 12 for monthly
  const monthlyIncome = finalBalance.times(0.04).div(12).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 1,
    label: 'Compute Retirement Horizon',
    expression: `${retAge.toString()} target age - ${curAge.toString()} current age`,
    result: `${years} Years`,
    explanation: 'Total accumulation horizon over which compounding occurs.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Project 401(k) Nest Egg with Compounding',
    expression: `Initial Balance + Employee Additions + Match + Cumulative Compound Growth`,
    result: formatCurrency(finalBalance, symbol),
    explanation: 'Sum of starting capital, contributions, employer matches, and market returns.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Safe Monthly Withdrawal (4% Rule)',
    expression: `(${formatCurrency(finalBalance, symbol)} × 4%) ÷ 12 months`,
    result: `${formatCurrency(monthlyIncome, symbol)} / mo`,
    explanation: 'Traditional Trinity Study sustainable retirement distribution guideline.',
  });

  return {
    status: 'success',
    value: {
      totalBalanceAtRetirement: finalBalance.toNumber(),
      totalEmployeeContributions: totalEmployee.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalEmployerContributions: totalEmployer.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalInvestmentGrowth: totalGrowth.toNumber(),
      estimatedMonthlyRetirementIncome: monthlyIncome.toNumber(),
      yearsToRetirement: years,
      formattedTotalBalance: formatCurrency(finalBalance, symbol),
      formattedEmployeeContributions: formatCurrency(totalEmployee, symbol),
      formattedEmployerContributions: formatCurrency(totalEmployer, symbol),
      formattedInvestmentGrowth: formatCurrency(totalGrowth, symbol),
      formattedMonthlyIncome: formatCurrency(monthlyIncome, symbol),
    },
    normalizedInputs: {
      currentAge: curAge.toNumber(),
      retirementAge: retAge.toNumber(),
      annualSalary: salary.toNumber(),
      annualReturnRate: rReturn.toNumber(),
    },
    appliedDefaults: [],
    formulaId: RETIREMENT_401K_FORMULA_ID,
    formulaVersion: RETIREMENT_401K_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
