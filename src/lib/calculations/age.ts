import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  asOfDate?: string; // YYYY-MM-DD (defaults to current date)
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  daysUntilNextBirthday: number;
  nextBirthdayDate: string;
  formattedAge: string;
  birthDayOfWeek: string;
}

export const AGE_FORMULA_ID = 'formula-chronological-age-v1.0.0';
export const AGE_FORMULA_VERSION = '1.0.0';

export function calculateAge(input: AgeInput): CalculationOutcome<AgeResult> {
  const birth = new Date(input.birthDate + 'T00:00:00');
  const asOf = input.asOfDate ? new Date(input.asOfDate + 'T00:00:00') : new Date();

  if (isNaN(birth.getTime())) {
    return createErrorOutcome(AGE_FORMULA_ID, AGE_FORMULA_VERSION, 'Invalid birth date provided.');
  }
  if (isNaN(asOf.getTime())) {
    return createErrorOutcome(AGE_FORMULA_ID, AGE_FORMULA_VERSION, 'Invalid target as-of date provided.');
  }
  if (birth > asOf) {
    return createErrorOutcome(AGE_FORMULA_ID, AGE_FORMULA_VERSION, 'Birth date cannot be in the future.');
  }

  const trace: CalculationStep[] = [];

  const bYear = birth.getFullYear();
  const bMonth = birth.getMonth(); // 0-indexed
  const bDay = birth.getDate();

  const aYear = asOf.getFullYear();
  const aMonth = asOf.getMonth();
  const aDay = asOf.getDate();

  let years = aYear - bYear;
  let months = aMonth - bMonth;
  let days = aDay - bDay;

  if (days < 0) {
    // Borrow days from previous month
    months -= 1;
    // Days in previous month of asOf date:
    const prevMonthDays = new Date(aYear, aMonth, 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  trace.push({
    stepNumber: 1,
    label: 'Chronological Calendar Borrowing',
    expression: `${aYear}-${aMonth + 1}-${aDay} minus ${bYear}-${bMonth + 1}-${bDay}`,
    result: `${years} years, ${months} months, ${days} days`,
    explanation: 'Subtract birth date from target date respecting varying calendar month lengths.',
  });

  // Total days difference:
  const diffMs = asOf.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMonths = years * 12 + months;

  // Next birthday calculation:
  let nextBdayYear = aYear;
  let nextBday = new Date(nextBdayYear, bMonth, bDay);
  if (nextBday < asOf) {
    nextBdayYear += 1;
    nextBday = new Date(nextBdayYear, bMonth, bDay);
  }
  const nextBdayDiffMs = nextBday.getTime() - asOf.getTime();
  const daysUntilNextBirthday = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const birthDayOfWeek = daysOfWeek[birth.getDay()];

  trace.push({
    stepNumber: 2,
    label: 'Total Elapsed Units',
    expression: `${totalDays.toLocaleString()} total days elapsed`,
    result: `${totalHours.toLocaleString()} hours`,
    explanation: 'Total calendar duration converted into hours and weeks.',
  });

  return {
    status: 'success',
    value: {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      daysUntilNextBirthday,
      nextBirthdayDate: nextBday.toISOString().split('T')[0],
      formattedAge: `${years} years, ${months} months, and ${days} days`,
      birthDayOfWeek,
    },
    normalizedInputs: {
      birthDate: input.birthDate,
      asOfDate: input.asOfDate || asOf.toISOString().split('T')[0],
    },
    appliedDefaults: [],
    formulaId: AGE_FORMULA_ID,
    formulaVersion: AGE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
