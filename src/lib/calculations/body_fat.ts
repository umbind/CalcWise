import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface BodyFatInput {
  gender: 'male' | 'female';
  weightKg: number | string;
  heightCm: number | string;
  waistCm: number | string;
  neckCm: number | string;
  hipCm?: number | string; // Required for females
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  category: string;
  formattedBodyFat: string;
  formattedFatMass: string;
  formattedLeanMass: string;
}

export const BODY_FAT_FORMULA_ID = 'formula-health-body-fat-navy-v1.0.0';
export const BODY_FAT_FORMULA_VERSION = '1.0.0';

export function calculateBodyFat(input: BodyFatInput): CalculationOutcome<BodyFatResult> {
  const gender = input.gender;
  const weight = toDecimal(input.weightKg);
  const height = toDecimal(input.heightCm);
  const waist = toDecimal(input.waistCm);
  const neck = toDecimal(input.neckCm);
  const hip = input.hipCm !== undefined && input.hipCm !== '' ? toDecimal(input.hipCm) : undefined;

  if (!weight || weight.lt(25) || weight.gt(350)) {
    return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Weight must be between 25 kg and 350 kg.', { weightKg: input.weightKg });
  }
  if (!height || height.lt(80) || height.gt(250)) {
    return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Height must be between 80 cm and 250 cm.', { heightCm: input.heightCm });
  }
  if (!neck || neck.lt(15) || neck.gt(80)) {
    return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Neck circumference must be between 15 cm and 80 cm.', { neckCm: input.neckCm });
  }
  if (!waist || waist.lt(30) || waist.gt(200)) {
    return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Waist circumference must be between 30 cm and 200 cm.', { waistCm: input.waistCm });
  }
  if (gender === 'male' && waist.lte(neck)) {
    return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Waist circumference must be greater than neck circumference.', { waistCm: input.waistCm, neckCm: input.neckCm });
  }
  if (gender === 'female') {
    if (!hip || hip.lt(30) || hip.gt(250)) {
      return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Hip circumference is required for females and must be between 30 cm and 250 cm.', { hipCm: input.hipCm });
    }
    if (waist.plus(hip).lte(neck)) {
      return createErrorOutcome(BODY_FAT_FORMULA_ID, BODY_FAT_FORMULA_VERSION, 'Waist + hip circumference must be greater than neck circumference.', {});
    }
  }

  const h = height.toNumber();
  const w = waist.toNumber();
  const n = neck.toNumber();
  const trace: CalculationStep[] = [];

  let bfPct = 0;

  if (gender === 'male') {
    // Official DoD / Hodgdon-Beckett equation for males (metric cm)
    // Body Density = 1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)
    const logWaistNeck = Math.log10(w - n);
    const logHeight = Math.log10(h);
    const bodyDensity = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
    bfPct = (495 / bodyDensity) - 450;

    trace.push({
      stepNumber: 1,
      label: 'Hodgdon-Beckett Body Density & Siri Equation (Male)',
      expression: `495 ÷ (1.0324 - 0.19077 × log10(${w - n}) + 0.15456 × log10(${h})) - 450`,
      result: `${bfPct.toFixed(1)}%`,
      explanation: 'Official U.S. Department of Defense anthropometric body fat equation.',
    });
  } else {
    // Official DoD / Hodgdon-Beckett equation for females (metric cm)
    // Body Density = 1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)
    const hipVal = hip!.toNumber();
    const logWaistHipNeck = Math.log10(w + hipVal - n);
    const logHeight = Math.log10(h);
    const bodyDensity = 1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight;
    bfPct = (495 / bodyDensity) - 450;

    trace.push({
      stepNumber: 1,
      label: 'Hodgdon-Beckett Body Density & Siri Equation (Female)',
      expression: `495 ÷ (1.29579 - 0.35004 × log10(${w + hipVal - n}) + 0.22100 × log10(${h})) - 450`,
      result: `${bfPct.toFixed(1)}%`,
      explanation: 'Official U.S. Department of Defense anthropometric body fat equation for females.',
    });
  }

  // Bound to biologically plausible ranges (2% to 65%)
  bfPct = Math.max(2, Math.min(65, bfPct));
  const bfDec = new Decimal(bfPct).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  const fatMass = weight.times(bfDec.div(100)).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);
  const leanMass = weight.minus(fatMass).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  // Categorization based on American Council on Exercise (ACE)
  let category = 'Normal';
  const pct = bfDec.toNumber();
  if (gender === 'male') {
    if (pct < 6) category = 'Essential Fat';
    else if (pct < 14) category = 'Athletes';
    else if (pct < 18) category = 'Fitness';
    else if (pct < 25) category = 'Average';
    else category = 'Obese';
  } else {
    if (pct < 14) category = 'Essential Fat';
    else if (pct < 21) category = 'Athletes';
    else if (pct < 25) category = 'Fitness';
    else if (pct < 32) category = 'Average';
    else category = 'Obese';
  }

  trace.push({
    stepNumber: 2,
    label: 'Compute Fat and Lean Tissue Mass',
    expression: `${weight.toString()} kg × ${bfDec.toString()}% Body Fat`,
    result: `${fatMass.toString()} kg Fat / ${leanMass.toString()} kg Lean`,
    explanation: 'Decomposition of total body weight into adipose and fat-free lean tissue.',
  });

  return {
    status: 'success',
    value: {
      bodyFatPercentage: bfDec.toNumber(),
      fatMassKg: fatMass.toNumber(),
      leanMassKg: leanMass.toNumber(),
      category,
      formattedBodyFat: `${bfDec.toFixed(1)}%`,
      formattedFatMass: `${fatMass.toFixed(1)} kg`,
      formattedLeanMass: `${leanMass.toFixed(1)} kg`,
    },
    normalizedInputs: {
      gender,
      weightKg: weight.toNumber(),
      heightCm: height.toNumber(),
      waistCm: waist.toNumber(),
      neckCm: neck.toNumber(),
      hipCm: hip ? hip.toNumber() : undefined,
    },
    appliedDefaults: [],
    formulaId: BODY_FAT_FORMULA_ID,
    formulaVersion: BODY_FAT_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
