import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface PregnancyInput {
  lastMenstrualPeriod: string; // YYYY-MM-DD
  cycleLengthDays?: number | string;
}

export interface PregnancyMilestone {
  label: string;
  dateString: string;
  description: string;
}

export interface PregnancyResult {
  estimatedDueDateIso: string;
  formattedDueDate: string;
  gestationalWeeks: number;
  gestationalDays: number;
  formattedGestationalAge: string;
  currentTrimester: string;
  daysRemaining: number;
  milestones: PregnancyMilestone[];
}

export const PREGNANCY_FORMULA_ID = 'formula-health-pregnancy-due-date-v1.0.0';
export const PREGNANCY_FORMULA_VERSION = '1.0.0';

export function calculatePregnancyDueDate(input: PregnancyInput): CalculationOutcome<PregnancyResult> {
  const lmpStr = input.lastMenstrualPeriod;
  const cycle = input.cycleLengthDays !== undefined && input.cycleLengthDays !== ''
    ? toDecimal(input.cycleLengthDays)
    : new Decimal(28);

  if (!lmpStr || !/^\d{4}-\d{2}-\d{2}$/.test(lmpStr)) {
    return createErrorOutcome(PREGNANCY_FORMULA_ID, PREGNANCY_FORMULA_VERSION, 'Please enter a valid Last Menstrual Period date (YYYY-MM-DD).', { lastMenstrualPeriod: lmpStr });
  }

  const lmpDate = new Date(lmpStr + 'T00:00:00Z');
  if (isNaN(lmpDate.getTime())) {
    return createErrorOutcome(PREGNANCY_FORMULA_ID, PREGNANCY_FORMULA_VERSION, 'Invalid date provided.', {});
  }

  if (!cycle || cycle.lt(20) || cycle.gt(45)) {
    return createErrorOutcome(PREGNANCY_FORMULA_ID, PREGNANCY_FORMULA_VERSION, 'Menstrual cycle length typically ranges between 20 and 45 days.', { cycleLengthDays: input.cycleLengthDays });
  }

  // Naegele's rule: LMP + 280 days + (cycle - 28 days)
  const cycleDiffDays = cycle.minus(28).toNumber();
  const totalPregnancyDays = 280 + cycleDiffDays;

  const eddDate = new Date(lmpDate.getTime() + totalPregnancyDays * 24 * 60 * 60 * 1000);

  // Reference date: current UTC date
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const elapsedMs = todayUtc.getTime() - lmpDate.getTime();
  const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));

  if (elapsedDays < 0) {
    return createErrorOutcome(PREGNANCY_FORMULA_ID, PREGNANCY_FORMULA_VERSION, 'LMP date cannot be in the future.', {});
  }
  if (elapsedDays > 320) {
    return createErrorOutcome(PREGNANCY_FORMULA_ID, PREGNANCY_FORMULA_VERSION, 'LMP date exceeds full-term gestational duration (> 45 weeks).', {});
  }

  const gestWeeks = Math.floor(elapsedDays / 7);
  const gestDaysRem = elapsedDays % 7;
  const daysRemaining = Math.max(0, Math.floor((eddDate.getTime() - todayUtc.getTime()) / (24 * 60 * 60 * 1000)));

  let trimester = 'First Trimester';
  if (elapsedDays > 196) {
    trimester = 'Third Trimester';
  } else if (elapsedDays > 91) {
    trimester = 'Second Trimester';
  }

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

  const conceptionDate = new Date(lmpDate.getTime() + (14 + cycleDiffDays) * 24 * 60 * 60 * 1000);
  const tri1EndDate = new Date(lmpDate.getTime() + 91 * 24 * 60 * 60 * 1000);
  const tri2EndDate = new Date(lmpDate.getTime() + 196 * 24 * 60 * 60 * 1000);

  const milestones: PregnancyMilestone[] = [
    { label: 'Estimated Conception', dateString: formatDate(conceptionDate), description: 'Probable fertilization based on ovulation timing.' },
    { label: 'End of 1st Trimester', dateString: formatDate(tri1EndDate), description: 'Week 13 completed; major organogenesis finished.' },
    { label: 'End of 2nd Trimester', dateString: formatDate(tri2EndDate), description: 'Week 28 completed; fetal viability threshold achieved.' },
    { label: 'Estimated Due Date (40 Weeks)', dateString: formatDate(eddDate), description: 'Full-term delivery milestone (Naegele’s standard).' },
  ];

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Naegele’s Rule with Cycle Adjustment',
    expression: `LMP (${lmpStr}) + 280 days + (${cycle.toString()} - 28) cycle offset`,
    result: formatDate(eddDate),
    explanation: 'Standard American College of Obstetricians and Gynecologists (ACOG) delivery forecast.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Current Gestational Age',
    expression: `${elapsedDays} days since LMP ÷ 7 days/week`,
    result: `${gestWeeks} Weeks, ${gestDaysRem} Days`,
    explanation: 'Clinical fetal gestational maturity measured from last menstrual period.',
  });

  return {
    status: 'success',
    value: {
      estimatedDueDateIso: eddDate.toISOString().split('T')[0],
      formattedDueDate: formatDate(eddDate),
      gestationalWeeks: gestWeeks,
      gestationalDays: gestDaysRem,
      formattedGestationalAge: `${gestWeeks} weeks, ${gestDaysRem} days`,
      currentTrimester: trimester,
      daysRemaining,
      milestones,
    },
    normalizedInputs: {
      lastMenstrualPeriod: lmpStr,
      cycleLengthDays: cycle.toNumber(),
    },
    appliedDefaults: [],
    formulaId: PREGNANCY_FORMULA_ID,
    formulaVersion: PREGNANCY_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
