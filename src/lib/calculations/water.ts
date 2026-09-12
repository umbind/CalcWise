import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type ClimateType = 'normal' | 'hot' | 'humid';
export type MaternalStatus = 'none' | 'pregnant' | 'breastfeeding';

export interface WaterInput {
  weightKg?: number | string;
  weightLbs?: number | string;
  exerciseMinutesDaily?: number | string;
  climate?: ClimateType;
  maternalStatus?: MaternalStatus;
}

export interface WaterResult {
  dailyLiters: number;
  dailyMilliliters: number;
  dailyOunces: number;
  dailyCups8oz: number;
  formattedLiters: string;
  formattedOunces: string;
  formattedCups: string;
  baselineMl: number;
  exerciseAdditionMl: number;
  climateAdditionMl: number;
}

export const WATER_FORMULA_ID = 'formula-daily-hydration-v1.0.0';
export const WATER_FORMULA_VERSION = '1.0.0';

export function calculateWaterIntake(input: WaterInput): CalculationOutcome<WaterResult> {
  let wKg: Decimal;
  if (input.weightKg) {
    const k = toDecimal(input.weightKg);
    if (!k || k.lte(15) || k.gte(400)) {
      return createErrorOutcome(WATER_FORMULA_ID, WATER_FORMULA_VERSION, 'Weight in kg must be between 15 and 400.');
    }
    wKg = k;
  } else if (input.weightLbs) {
    const l = toDecimal(input.weightLbs);
    if (!l || l.lte(30) || l.gte(880)) {
      return createErrorOutcome(WATER_FORMULA_ID, WATER_FORMULA_VERSION, 'Weight in lbs must be between 30 and 880.');
    }
    wKg = l.times(new Decimal('0.45359237'));
  } else {
    return createErrorOutcome(WATER_FORMULA_ID, WATER_FORMULA_VERSION, 'Body weight is required.');
  }

  const exerciseMins = toDecimal(input.exerciseMinutesDaily || 0) || new Decimal(0);
  const climate = input.climate || 'normal';
  const maternal = input.maternalStatus || 'none';

  const trace: CalculationStep[] = [];

  // Baseline: 35 ml per kg
  const baselineMl = wKg.times(35).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  trace.push({
    stepNumber: 1,
    label: 'Baseline Hydration (35 ml / kg body mass)',
    expression: `${wKg.toFixed(1)} kg × 35 ml/kg`,
    result: `${baselineMl.toString()} ml`,
    explanation: 'Standard baseline fluid turnover for physiological equilibrium.',
  });

  // Exercise: ~350 ml for every 30 minutes of exercise
  const exerciseIntervals = exerciseMins.div(30);
  const exerciseAdditionMl = exerciseIntervals.times(350).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  if (exerciseMins.gt(0)) {
    trace.push({
      stepNumber: 2,
      label: 'Exercise Fluid Loss Compensation',
      expression: `(${exerciseMins.toString()} mins ÷ 30) × 350 ml`,
      result: `+${exerciseAdditionMl.toString()} ml`,
      explanation: 'Replaces fluid lost through elevated respiration and perspiration.',
    });
  }

  // Climate adjustments
  let climateAdditionMl = new Decimal(0);
  if (climate === 'hot') {
    climateAdditionMl = baselineMl.times('0.10').toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    trace.push({
      stepNumber: trace.length + 1,
      label: 'Hot Climate Surcharge (+10%)',
      expression: `${baselineMl.toString()} ml × 10%`,
      result: `+${climateAdditionMl.toString()} ml`,
      explanation: 'Compensates for increased evaporative heat dissipation.',
    });
  } else if (climate === 'humid') {
    climateAdditionMl = baselineMl.times('0.15').toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    trace.push({
      stepNumber: trace.length + 1,
      label: 'Humid/Tropical Climate Surcharge (+15%)',
      expression: `${baselineMl.toString()} ml × 15%`,
      result: `+${climateAdditionMl.toString()} ml`,
      explanation: 'Compensates for perspiration rate inefficiencies in humid environments.',
    });
  }

  // Maternal adjustment
  let maternalAdditionMl = new Decimal(0);
  if (maternal === 'pregnant') {
    maternalAdditionMl = new Decimal(300);
  } else if (maternal === 'breastfeeding') {
    maternalAdditionMl = new Decimal(700);
  }

  const totalMl = baselineMl.plus(exerciseAdditionMl).plus(climateAdditionMl).plus(maternalAdditionMl);
  const totalLiters = totalMl.div(1000).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalOz = totalMl.div(new Decimal('29.5735')).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);
  const totalCups = totalOz.div(8).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: trace.length + 1,
    label: 'Total Recommended Daily Fluid Intake',
    expression: `${baselineMl.toString()} + ${exerciseAdditionMl.toString()} + ${climateAdditionMl.toString()} ml`,
    result: `${totalLiters.toFixed(2)} Liters (~${totalCups.toFixed(0)} cups)`,
    explanation: 'Total target volume from all beverages and water-dense food sources.',
  });

  return {
    status: 'success',
    value: {
      dailyLiters: totalLiters.toNumber(),
      dailyMilliliters: totalMl.toNumber(),
      dailyOunces: totalOz.toNumber(),
      dailyCups8oz: totalCups.toNumber(),
      formattedLiters: `${totalLiters.toFixed(2)} L`,
      formattedOunces: `${totalOz.toFixed(0)} fl oz`,
      formattedCups: `~${totalCups.toFixed(1)} glasses (8 oz)`,
      baselineMl: baselineMl.toNumber(),
      exerciseAdditionMl: exerciseAdditionMl.toNumber(),
      climateAdditionMl: climateAdditionMl.toNumber(),
    },
    normalizedInputs: {
      normalizedWeightKg: Number(wKg.toFixed(1)),
      exerciseMinutes: exerciseMins.toNumber(),
      climate,
    },
    appliedDefaults: [],
    formulaId: WATER_FORMULA_ID,
    formulaVersion: WATER_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
