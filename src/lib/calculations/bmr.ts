import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type BiologicalSex = 'male' | 'female';
export type BmrUnitSystem = 'metric' | 'imperial';

export interface BmrInput {
  sex: BiologicalSex;
  age: number | string;
  unitSystem: BmrUnitSystem;
  weightKg?: number | string;
  heightCm?: number | string;
  weightLbs?: number | string;
  heightFeet?: number | string;
  heightInches?: number | string;
}

export interface BmrResult {
  bmrMifflin: number;
  bmrHarrisBenedict: number;
  formattedBmr: string;
  dailyCaloriesAtRest: number;
  sex: BiologicalSex;
  age: number;
  normalizedWeightKg: number;
  normalizedHeightCm: number;
}

export const BMR_FORMULA_ID = 'formula-mifflin-st-jeor-bmr-v1.0.0';
export const BMR_FORMULA_VERSION = '1.0.0';

export function calculateBmr(input: BmrInput): CalculationOutcome<BmrResult> {
  const ageDec = toDecimal(input.age);
  if (!ageDec || ageDec.lt(15) || ageDec.gt(120)) {
    return createErrorOutcome(BMR_FORMULA_ID, BMR_FORMULA_VERSION, 'Age must be between 15 and 120 years.', { age: input.age });
  }

  let wKg: Decimal;
  let hCm: Decimal;
  const trace: CalculationStep[] = [];

  if (input.unitSystem === 'metric') {
    const w = toDecimal(input.weightKg);
    const h = toDecimal(input.heightCm);
    if (!w || w.lte(20) || w.gte(500) || !h || h.lte(50) || h.gte(250)) {
      return createErrorOutcome(BMR_FORMULA_ID, BMR_FORMULA_VERSION, 'Valid metric weight (20-500 kg) and height (50-250 cm) are required.');
    }
    wKg = w;
    hCm = h;
  } else {
    const wLbs = toDecimal(input.weightLbs);
    const hFt = toDecimal(input.heightFeet || 0);
    const hIn = toDecimal(input.heightInches || 0);
    if (!wLbs || wLbs.lte(40) || wLbs.gte(1000)) {
      return createErrorOutcome(BMR_FORMULA_ID, BMR_FORMULA_VERSION, 'Valid imperial weight (40-1000 lbs) is required.');
    }
    const totalInches = (hFt ? hFt.times(12) : new Decimal(0)).plus(hIn || 0);
    if (totalInches.lte(20) || totalInches.gte(100)) {
      return createErrorOutcome(BMR_FORMULA_ID, BMR_FORMULA_VERSION, 'Valid height in feet and inches is required.');
    }
    // 1 lb = 0.45359237 kg; 1 inch = 2.54 cm
    wKg = wLbs.times(new Decimal('0.45359237'));
    hCm = totalInches.times(new Decimal('2.54'));
    trace.push({
      stepNumber: 1,
      label: 'Convert Imperial Inputs to Metric',
      expression: `${wLbs.toString()} lbs = ${wKg.toFixed(1)} kg, ${totalInches.toString()} in = ${hCm.toFixed(1)} cm`,
      result: `${wKg.toFixed(1)} kg, ${hCm.toFixed(1)} cm`,
      explanation: 'Normalize weight to kg and height to cm.',
    });
  }

  // Mifflin-St Jeor Equation:
  // Men: BMR = (10 × W) + (6.25 × H) - (5 × A) + 5
  // Women: BMR = (10 × W) + (6.25 × H) - (5 × A) - 161
  const termW = wKg.times(10);
  const termH = hCm.times(new Decimal('6.25'));
  const termA = ageDec.times(5);

  const baseSum = termW.plus(termH).minus(termA);
  const mifflinAdjustment = input.sex === 'male' ? 5 : -161;
  const bmrMifflinDec = baseSum.plus(mifflinAdjustment).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: trace.length + 1,
    label: `Mifflin-St Jeor Equation (${input.sex})`,
    expression: `(10 × ${wKg.toFixed(1)}) + (6.25 × ${hCm.toFixed(1)}) - (5 × ${ageDec.toString()}) ${mifflinAdjustment >= 0 ? `+ ${mifflinAdjustment}` : `- ${Math.abs(mifflinAdjustment)}`}`,
    result: `${bmrMifflinDec.toString()} kcal/day`,
    explanation: 'Standard clinical formula for resting basal metabolic energy.',
  });

  // Revised Harris-Benedict for comparison:
  // Men: BMR = 88.362 + (13.397 × W) + (4.799 × H) - (5.677 × A)
  // Women: BMR = 447.593 + (9.247 × W) + (3.098 × H) - (4.330 × A)
  let bmrHarrisDec: Decimal;
  if (input.sex === 'male') {
    bmrHarrisDec = new Decimal('88.362')
      .plus(wKg.times('13.397'))
      .plus(hCm.times('4.799'))
      .minus(ageDec.times('5.677'));
  } else {
    bmrHarrisDec = new Decimal('447.593')
      .plus(wKg.times('9.247'))
      .plus(hCm.times('3.098'))
      .minus(ageDec.times('4.330'));
  }

  const bmrMifflinNum = bmrMifflinDec.toNumber();

  return {
    status: 'success',
    value: {
      bmrMifflin: bmrMifflinNum,
      bmrHarrisBenedict: Math.round(bmrHarrisDec.toNumber()),
      formattedBmr: `${bmrMifflinNum.toLocaleString()} kcal`,
      dailyCaloriesAtRest: bmrMifflinNum,
      sex: input.sex,
      age: ageDec.toNumber(),
      normalizedWeightKg: Number(wKg.toFixed(1)),
      normalizedHeightCm: Number(hCm.toFixed(1)),
    },
    normalizedInputs: {
      sex: input.sex,
      age: ageDec.toNumber(),
      unitSystem: input.unitSystem,
      normalizedWeightKg: Number(wKg.toFixed(1)),
      normalizedHeightCm: Number(hCm.toFixed(1)),
    },
    appliedDefaults: [],
    formulaId: BMR_FORMULA_ID,
    formulaVersion: BMR_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
