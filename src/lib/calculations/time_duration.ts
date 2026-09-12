import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface TimeDurationInput {
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM (default 00:00)
  endDate: string; // YYYY-MM-DD
  endTime?: string; // HH:MM (default 00:00)
  includeEndDay?: boolean;
}

export interface DurationBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

export interface TimeDurationResult {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  businessDays: number;
  weekendDays: number;
  breakdown: DurationBreakdown;
  formattedDuration: string;
  formattedDaysSummary: string;
}

export const TIME_DURATION_FORMULA_ID = 'formula-everyday-time-duration-v1.0.0';
export const TIME_DURATION_FORMULA_VERSION = '1.0.0';

export function calculateTimeDuration(input: TimeDurationInput): CalculationOutcome<TimeDurationResult> {
  const sDate = input.startDate;
  const eDate = input.endDate;
  const sTime = input.startTime || '00:00';
  const eTime = input.endTime || '00:00';
  const includeEnd = input.includeEndDay === true;

  if (!sDate || !/^\d{4}-\d{2}-\d{2}$/.test(sDate) || !eDate || !/^\d{4}-\d{2}-\d{2}$/.test(eDate)) {
    return createErrorOutcome(TIME_DURATION_FORMULA_ID, TIME_DURATION_FORMULA_VERSION, 'Please enter valid start and end dates in YYYY-MM-DD format.', {});
  }

  const startIso = `${sDate}T${sTime}:00Z`;
  const endIso = `${eDate}T${eTime}:00Z`;

  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();

  if (isNaN(startMs) || isNaN(endMs)) {
    return createErrorOutcome(TIME_DURATION_FORMULA_ID, TIME_DURATION_FORMULA_VERSION, 'Invalid date or time specification.', {});
  }

  if (endMs < startMs) {
    return createErrorOutcome(TIME_DURATION_FORMULA_ID, TIME_DURATION_FORMULA_VERSION, 'End date and time must be chronologically at or after start date and time.', {});
  }

  // Milliseconds difference
  let diffMs = endMs - startMs;
  if (includeEnd) {
    diffMs += 24 * 60 * 60 * 1000; // Add 1 day
  }

  const totalSec = Math.floor(diffMs / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalHrs = Math.floor(totalMin / 60);
  const totalDays = Math.floor(totalHrs / 24);

  // Business day count
  let cur = new Date(startMs);
  const finish = new Date(endMs + (includeEnd ? 24 * 60 * 60 * 1000 : 0));
  let businessDays = 0;
  let weekendDays = 0;

  // Day-by-day iteration for full day intervals
  const tempCur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate()));
  const tempFinish = new Date(Date.UTC(finish.getUTCFullYear(), finish.getUTCMonth(), finish.getUTCDate()));

  while (tempCur < tempFinish) {
    const dayOfWeek = tempCur.getUTCDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    tempCur.setUTCDate(tempCur.getUTCDate() + 1);
  }

  // Calendar year / month / day breakdown
  const dStart = new Date(startMs);
  const dEnd = new Date(endMs + (includeEnd ? 24 * 60 * 60 * 1000 : 0));

  let years = dEnd.getUTCFullYear() - dStart.getUTCFullYear();
  let months = dEnd.getUTCMonth() - dStart.getUTCMonth();
  let days = dEnd.getUTCDate() - dStart.getUTCDate();
  let hours = dEnd.getUTCHours() - dStart.getUTCHours();
  let minutes = dEnd.getUTCMinutes() - dStart.getUTCMinutes();

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonthDays = new Date(Date.UTC(dEnd.getUTCFullYear(), dEnd.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthDays;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  const formattedDuration = parts.length > 0 ? parts.join(', ') : '0 minutes';

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Unix Epoch Millisecond Delta',
    expression: `${endIso} - ${startIso}${includeEnd ? ' + 1 day inclusive' : ''}`,
    result: `${diffMs.toLocaleString('en-US')} ms (${totalDays} Days)`,
    explanation: 'High-precision duration between timestamps.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Partition Business Days and Weekends',
    expression: `${totalDays} elapsed calendar days`,
    result: `${businessDays} Work Days (Mon-Fri) / ${weekendDays} Weekend Days`,
    explanation: 'Standard work calendar breakdown excluding statutory public holidays.',
  });

  return {
    status: 'success',
    value: {
      totalDays,
      totalHours: totalHrs,
      totalMinutes: totalMin,
      totalSeconds: totalSec,
      businessDays,
      weekendDays,
      breakdown: { years, months, days, hours, minutes },
      formattedDuration,
      formattedDaysSummary: `${totalDays} day${totalDays === 1 ? '' : 's'} (${totalHrs.toLocaleString('en-US')} hours)`,
    },
    normalizedInputs: {
      startDate: sDate,
      endDate: eDate,
      includeEndDay: includeEnd,
    },
    appliedDefaults: [],
    formulaId: TIME_DURATION_FORMULA_ID,
    formulaVersion: TIME_DURATION_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
