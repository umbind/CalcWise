import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface IdealWeightInput {
  gender: 'male' | 'female';
  heightCm: number | string;
}

export interface FormulaResult {
  formulaName: string;
  weightKg: number;
  weightLbs: number;
  formattedKg: string;
  formattedLbs: string;
}

export interface IdealWeightResult {
  averageWeightKg: number;
  averageWeightLbs: number;
  formattedAverageKg: string;
  formattedAverageLbs: string;
  healthyBmiRangeKg: { min: number; max: number };
  healthyBmiRangeLbs: { min: number; max: number };
  clinicalFormulas: FormulaResult[];
}

export const IDEAL_WEIGHT_FORMULA_ID = 'formula-health-ideal-weight-clinical-v1.0.0';
export const IDEAL_WEIGHT_FORMULA_VERSION = '1.0.0';

export function calculateIdealWeight(input: IdealWeightInput): CalculationOutcome<IdealWeightResult> {
  const gender = input.gender;
  const height = toDecimal(input.heightCm);

  if (!height || height.lt(140) || height.gt(230)) {
    return createErrorOutcome(IDEAL_WEIGHT_FORMULA_ID, IDEAL_WEIGHT_FORMULA_VERSION, 'Height must be between 140 cm (4\'7") and 230 cm (7\'6").', { heightCm: input.heightCm });
  }

  // Convert cm to inches: 1 inch = 2.54 cm
  const heightInches = height.div(2.54).toNumber();
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  // 1. Devine (1974)
  const devineKg = gender === 'male'
    ? 50.0 + 2.3 * inchesOver5Ft
    : 45.5 + 2.3 * inchesOver5Ft;

  // 2. Robinson (1983)
  const robinsonKg = gender === 'male'
    ? 52.0 + 1.9 * inchesOver5Ft
    : 49.0 + 1.7 * inchesOver5Ft;

  // 3. Miller (1983)
  const millerKg = gender === 'male'
    ? 56.2 + 1.41 * inchesOver5Ft
    : 53.1 + 1.36 * inchesOver5Ft;

  // 4. Hamwi (1964)
  const hamwiKg = gender === 'male'
    ? 48.0 + 2.7 * inchesOver5Ft
    : 45.5 + 2.2 * inchesOver5Ft;

  // Healthy BMI range (18.5 - 24.9)
  const heightM = height.div(100).toNumber();
  const bmiMinKg = 18.5 * heightM * heightM;
  const bmiMaxKg = 24.9 * heightM * heightM;

  const toLbs = (kg: number) => kg * 2.20462;
  const round1 = (num: number) => new Decimal(num).toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toNumber();

  const clinicalFormulas: FormulaResult[] = [
    {
      formulaName: 'Devine Formula (Clinical Standard)',
      weightKg: round1(devineKg),
      weightLbs: round1(toLbs(devineKg)),
      formattedKg: `${round1(devineKg)} kg`,
      formattedLbs: `${round1(toLbs(devineKg))} lbs`,
    },
    {
      formulaName: 'Robinson Formula (1983)',
      weightKg: round1(robinsonKg),
      weightLbs: round1(toLbs(robinsonKg)),
      formattedKg: `${round1(robinsonKg)} kg`,
      formattedLbs: `${round1(toLbs(robinsonKg))} lbs`,
    },
    {
      formulaName: 'Miller Formula (1983)',
      weightKg: round1(millerKg),
      weightLbs: round1(toLbs(millerKg)),
      formattedKg: `${round1(millerKg)} kg`,
      formattedLbs: `${round1(toLbs(millerKg))} lbs`,
    },
    {
      formulaName: 'Hamwi Formula (1964)',
      weightKg: round1(hamwiKg),
      weightLbs: round1(toLbs(hamwiKg)),
      formattedKg: `${round1(hamwiKg)} kg`,
      formattedLbs: `${round1(toLbs(hamwiKg))} lbs`,
    },
  ];

  const avgKg = round1((devineKg + robinsonKg + millerKg + hamwiKg) / 4);
  const avgLbs = round1(toLbs(avgKg));

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Convert Metric Height to Base-60 Baseline',
    expression: `${height.toString()} cm ÷ 2.54 = ${heightInches.toFixed(1)} inches (${inchesOver5Ft.toFixed(1)} inches over 5 ft)`,
    result: `${inchesOver5Ft.toFixed(1)} inches`,
    explanation: 'Anthropometric baseline required by historical pharmacological equations.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Devine Reference Equation',
    expression: gender === 'male' ? `50.0 kg + (2.3 × ${inchesOver5Ft.toFixed(1)})` : `45.5 kg + (2.3 × ${inchesOver5Ft.toFixed(1)})`,
    result: `${round1(devineKg)} kg (${round1(toLbs(devineKg))} lbs)`,
    explanation: 'Primary hospital clinical dosing reference weight.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Compute WHO Healthy BMI Interval (18.5 - 24.9)',
    expression: `[18.5 × ${heightM.toFixed(2)}², 24.9 × ${heightM.toFixed(2)}²]`,
    result: `${round1(bmiMinKg)} - ${round1(bmiMaxKg)} kg`,
    explanation: 'Epidemiologically verified low-morbidity weight corridor.',
  });

  return {
    status: 'success',
    value: {
      averageWeightKg: avgKg,
      averageWeightLbs: avgLbs,
      formattedAverageKg: `${avgKg} kg`,
      formattedAverageLbs: `${avgLbs} lbs`,
      healthyBmiRangeKg: { min: round1(bmiMinKg), max: round1(bmiMaxKg) },
      healthyBmiRangeLbs: { min: round1(toLbs(bmiMinKg)), max: round1(toLbs(bmiMaxKg)) },
      clinicalFormulas,
    },
    normalizedInputs: {
      gender,
      heightCm: height.toNumber(),
    },
    appliedDefaults: [],
    formulaId: IDEAL_WEIGHT_FORMULA_ID,
    formulaVersion: IDEAL_WEIGHT_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
