import { Decimal } from './decimal';
import { calculateBmr, type BiologicalSex, type BmrUnitSystem } from './bmr';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extra_active';

export interface CalorieInput {
  sex: BiologicalSex;
  age: number | string;
  unitSystem: BmrUnitSystem;
  weightKg?: number | string;
  heightCm?: number | string;
  weightLbs?: number | string;
  heightFeet?: number | string;
  heightInches?: number | string;
  activityLevel: ActivityLevel;
}

export interface CalorieTargets {
  maintenance: number;
  mildWeightLoss: number; // -250 kcal
  weightLoss: number; // -500 kcal
  extremeWeightLoss: number; // -1000 kcal
  mildWeightGain: number; // +250 kcal
  weightGain: number; // +500 kcal
}

export interface CalorieResult {
  tdee: number;
  bmr: number;
  activityLevel: ActivityLevel;
  activityMultiplier: number;
  targets: CalorieTargets;
  formattedTdee: string;
}

export const CALORIE_FORMULA_ID = 'formula-tdee-energy-balance-v1.0.0';
export const CALORIE_FORMULA_VERSION = '1.0.0';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: string; label: string; description: string }> = {
  sedentary: { multiplier: '1.2', label: 'Sedentary', description: 'Desk job, little or no structured exercise.' },
  light: { multiplier: '1.375', label: 'Lightly Active', description: 'Light exercise or walking 1 to 3 days per week.' },
  moderate: { multiplier: '1.55', label: 'Moderately Active', description: 'Moderate workout/sports 3 to 5 days per week.' },
  active: { multiplier: '1.725', label: 'Very Active', description: 'Hard exercise/sports 6 to 7 days per week.' },
  extra_active: { multiplier: '1.9', label: 'Extra Active', description: 'Very demanding physical labor or athlete training 2x/day.' },
};

export function calculateCalories(input: CalorieInput): CalculationOutcome<CalorieResult> {
  const bmrOutcome = calculateBmr({
    sex: input.sex,
    age: input.age,
    unitSystem: input.unitSystem,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    weightLbs: input.weightLbs,
    heightFeet: input.heightFeet,
    heightInches: input.heightInches,
  });

  if (bmrOutcome.status !== 'success' || !bmrOutcome.value) {
    return createErrorOutcome(CALORIE_FORMULA_ID, CALORIE_FORMULA_VERSION, bmrOutcome.warnings[0]?.message || 'Invalid physiological inputs.');
  }

  const bmrVal = bmrOutcome.value.bmrMifflin;
  const act = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const multDec = new Decimal(act.multiplier);
  const tdeeDec = new Decimal(bmrVal).times(multDec).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const tdee = tdeeDec.toNumber();

  const trace: CalculationStep[] = [
    ...bmrOutcome.trace,
    {
      stepNumber: bmrOutcome.trace.length + 1,
      label: `Apply Activity Multiplier (${act.label})`,
      expression: `${bmrVal} kcal (BMR) × ${act.multiplier}`,
      result: `${tdee} kcal/day`,
      explanation: 'Multiply basal metabolic rate by physical activity factor to obtain TDEE.',
    },
  ];

  return {
    status: 'success',
    value: {
      tdee,
      bmr: bmrVal,
      activityLevel: input.activityLevel,
      activityMultiplier: multDec.toNumber(),
      targets: {
        maintenance: tdee,
        mildWeightLoss: Math.max(1200, tdee - 250),
        weightLoss: Math.max(1200, tdee - 500),
        extremeWeightLoss: Math.max(1200, tdee - 1000),
        mildWeightGain: tdee + 250,
        weightGain: tdee + 500,
      },
      formattedTdee: `${tdee.toLocaleString()} kcal`,
    },
    normalizedInputs: {
      sex: input.sex,
      age: input.age,
      activityLevel: input.activityLevel,
    },
    appliedDefaults: [],
    formulaId: CALORIE_FORMULA_ID,
    formulaVersion: CALORIE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
