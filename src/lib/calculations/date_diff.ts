import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface DateDiffInput {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  includeEndDay?: boolean;
}

export interface DateDiffResult {
  totalDays: number;
  totalWeeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
  years: number;
  months: number;
  days: number;
  formattedDuration: string;
}

export const DATE_DIFF_FORMULA_ID = 'formula-calendar-date-difference-v1.0.0';
export const DATE_DIFF_FORMULA_VERSION = '1.0.0';

export function calculateDateDifference(input: DateDiffInput): CalculationOutcome<DateDiffResult> {
  const d1 = new Date(input.startDate + 'T00:00:00');
  const d2 = new Date(input.endDate + 'T00:00:00');

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return createErrorOutcome(DATE_DIFF_FORMULA_ID, DATE_DIFF_FORMULA_VERSION, 'Please provide valid start and end dates.');
  }

  // Ensure d1 <= d2 for forward difference
  const start = d1 <= d2 ? d1 : d2;
  const end = d1 <= d2 ? d2 : d1;
  const trace: CalculationStep[] = [];

  const msPerDay = 1000 * 60 * 60 * 24;
  let totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  if (input.includeEndDay) {
    totalDays += 1;
  }

  trace.push({
    stepNumber: 1,
    label: 'Calculate Absolute Days Difference',
    expression: `(${end.toISOString().split('T')[0]} - ${start.toISOString().split('T')[0]}) in ms ÷ 86,400,000${input.includeEndDay ? ' + 1 day' : ''}`,
    result: `${totalDays} calendar days`,
    explanation: 'Calendar duration in total days between the two dates.',
  });

  // Calculate business days vs weekend days
  let businessDays = 0;
  let weekendDays = 0;
  const cur = new Date(start.getTime());
  const loopEndDays = input.includeEndDay ? totalDays : totalDays;

  for (let i = 0; i < loopEndDays; i++) {
    const dayOfWeek = cur.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Breakdown in years, months, days
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  let d = end.getDate() - start.getDate();

  if (d < 0) {
    m -= 1;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  if (input.includeEndDay) {
    d += 1;
    const maxDays = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    if (d >= maxDays) {
      d = 0;
      m += 1;
      if (m >= 12) {
        m = 0;
        y += 1;
      }
    }
  }

  const weeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;

  return {
    status: 'success',
    value: {
      totalDays,
      totalWeeks: weeks,
      remainingDays: remDays,
      businessDays,
      weekendDays,
      years: y,
      months: m,
      days: d,
      formattedDuration: `${y} years, ${m} months, and ${d} days`,
    },
    normalizedInputs: {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      includeEndDay: input.includeEndDay || false,
    },
    appliedDefaults: [],
    formulaId: DATE_DIFF_FORMULA_ID,
    formulaVersion: DATE_DIFF_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
