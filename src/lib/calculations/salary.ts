import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type SalaryFrequency = 'hourly' | 'daily' | 'weekly' | 'bi_weekly' | 'semi_monthly' | 'monthly' | 'annual';

export interface SalaryInput {
  amount: number | string;
  frequency: SalaryFrequency;
  hoursPerWeek?: number | string;
  weeksPerYear?: number | string;
  currencySymbol?: string;
}

export interface SalaryBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biWeekly: number;
  semiMonthly: number;
  monthly: number;
  annual: number;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedBiWeekly: string;
  formattedSemiMonthly: string;
  formattedMonthly: string;
  formattedAnnual: string;
}

export const SALARY_FORMULA_ID = 'formula-salary-wage-conversion-v1.0.0';
export const SALARY_FORMULA_VERSION = '1.0.0';

export function calculateSalary(input: SalaryInput): CalculationOutcome<SalaryBreakdown> {
  const amt = toDecimal(input.amount);
  const hpw = toDecimal(input.hoursPerWeek || 40) || new Decimal(40);
  const wpy = toDecimal(input.weeksPerYear || 52) || new Decimal(52);
  const symbol = input.currencySymbol || '$';

  if (!amt || amt.lt(0)) {
    return createErrorOutcome(SALARY_FORMULA_ID, SALARY_FORMULA_VERSION, 'Pay amount cannot be negative.', { amount: input.amount });
  }
  if (hpw.lte(0) || hpw.gt(168)) {
    return createErrorOutcome(SALARY_FORMULA_ID, SALARY_FORMULA_VERSION, 'Hours per week must be between 1 and 168.', { hoursPerWeek: input.hoursPerWeek });
  }
  if (wpy.lte(0) || wpy.gt(52)) {
    return createErrorOutcome(SALARY_FORMULA_ID, SALARY_FORMULA_VERSION, 'Weeks per year must be between 1 and 52.', { weeksPerYear: input.weeksPerYear });
  }

  const trace: CalculationStep[] = [];
  const totalAnnualHours = hpw.times(wpy);

  // Normalize everything to annual salary first
  let annualDec: Decimal;
  switch (input.frequency) {
    case 'hourly':
      annualDec = amt.times(totalAnnualHours);
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Hourly Wage',
        expression: `${amt.toString()} × (${hpw.toString()} hrs/wk × ${wpy.toString()} wks/yr)`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply hourly wage by total working hours in the year.',
      });
      break;
    case 'daily':
      // 5 working days per week
      annualDec = amt.times(5).times(wpy);
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Daily Wage',
        expression: `${amt.toString()} × (5 days/wk × ${wpy.toString()} wks/yr)`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply daily wage by total working days.',
      });
      break;
    case 'weekly':
      annualDec = amt.times(wpy);
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Weekly Wage',
        expression: `${amt.toString()} × ${wpy.toString()} weeks`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply weekly pay by weeks per year.',
      });
      break;
    case 'bi_weekly':
      // 26 paychecks per year
      annualDec = amt.times(wpy.div(2));
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Bi-Weekly Wage',
        expression: `${amt.toString()} × ${wpy.div(2).toString()} pay periods`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply bi-weekly pay by 26 pay periods.',
      });
      break;
    case 'semi_monthly':
      // 24 paychecks per year
      annualDec = amt.times(24);
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Semi-Monthly Wage',
        expression: `${amt.toString()} × 24 pay periods`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply semi-monthly pay by 24 pay periods.',
      });
      break;
    case 'monthly':
      annualDec = amt.times(12);
      trace.push({
        stepNumber: 1,
        label: 'Calculate Annual Salary from Monthly Salary',
        expression: `${amt.toString()} × 12 months`,
        result: formatCurrency(annualDec, symbol),
        explanation: 'Multiply monthly salary by 12 months.',
      });
      break;
    case 'annual':
    default:
      annualDec = amt;
      trace.push({
        stepNumber: 1,
        label: 'Annual Baseline Established',
        expression: formatCurrency(annualDec, symbol),
        result: formatCurrency(annualDec, symbol),
        explanation: 'Annual salary established as baseline.',
      });
      break;
  }

  // Derive all other frequencies from annualDec
  const hourlyDec = annualDec.div(totalAnnualHours);
  const dailyDec = annualDec.div(wpy.times(5));
  const weeklyDec = annualDec.div(wpy);
  const biWeeklyDec = annualDec.div(26);
  const semiMonthlyDec = annualDec.div(24);
  const monthlyDec = annualDec.div(12);

  return {
    status: 'success',
    value: {
      hourly: hourlyDec.toDecimalPlaces(2).toNumber(),
      daily: dailyDec.toDecimalPlaces(2).toNumber(),
      weekly: weeklyDec.toDecimalPlaces(2).toNumber(),
      biWeekly: biWeeklyDec.toDecimalPlaces(2).toNumber(),
      semiMonthly: semiMonthlyDec.toDecimalPlaces(2).toNumber(),
      monthly: monthlyDec.toDecimalPlaces(2).toNumber(),
      annual: annualDec.toDecimalPlaces(2).toNumber(),
      formattedHourly: formatCurrency(hourlyDec, symbol),
      formattedDaily: formatCurrency(dailyDec, symbol),
      formattedWeekly: formatCurrency(weeklyDec, symbol),
      formattedBiWeekly: formatCurrency(biWeeklyDec, symbol),
      formattedSemiMonthly: formatCurrency(semiMonthlyDec, symbol),
      formattedMonthly: formatCurrency(monthlyDec, symbol),
      formattedAnnual: formatCurrency(annualDec, symbol),
    },
    normalizedInputs: {
      amount: amt.toNumber(),
      frequency: input.frequency,
      hoursPerWeek: hpw.toNumber(),
      weeksPerYear: wpy.toNumber(),
    },
    appliedDefaults: [],
    formulaId: SALARY_FORMULA_ID,
    formulaVersion: SALARY_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
