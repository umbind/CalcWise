import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type BmiUnitSystem = 'metric' | 'imperial';

export interface BmiInput {
  unitSystem: BmiUnitSystem;
  // Metric inputs
  weightKg?: number | string;
  heightCm?: number | string;
  // Imperial inputs
  weightLbs?: number | string;
  heightFeet?: number | string;
  heightInches?: number | string;
  age?: number | string;
}

export interface BmiCategory {
  classification: string;
  categoryCode: 'severe_thin' | 'moderate_thin' | 'mild_thin' | 'normal' | 'overweight' | 'obese_1' | 'obese_2' | 'obese_3';
  color: string;
  description: string;
}

export interface BmiResult {
  bmi: number;
  formattedBmi: string;
  bmiPrime: number;
  category: BmiCategory;
  healthyWeightRange: {
    minWeightKg: number;
    maxWeightKg: number;
    minWeightLbs: number;
    maxWeightLbs: number;
    formattedRangeMetric: string;
    formattedRangeImperial: string;
  };
  disclaimer: string;
}

export const BMI_FORMULA_ID = 'formula-who-adult-bmi-v1.0.0';
export const BMI_FORMULA_VERSION = '1.0.0';

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 16.0) {
    return {
      classification: 'Severe Thinness',
      categoryCode: 'severe_thin',
      color: '#B42318',
      description: 'Significantly below healthy weight range. Consider consulting a medical professional.',
    };
  } else if (bmi < 17.0) {
    return {
      classification: 'Moderate Thinness',
      categoryCode: 'moderate_thin',
      color: '#8A4B08',
      description: 'Below healthy weight range.',
    };
  } else if (bmi < 18.5) {
    return {
      classification: 'Mild Thinness',
      categoryCode: 'mild_thin',
      color: '#CA8A04',
      description: 'Slightly below standard healthy weight range.',
    };
  } else if (bmi < 25.0) {
    return {
      classification: 'Normal Weight',
      categoryCode: 'normal',
      color: '#087A55',
      description: 'Within the standard World Health Organization healthy weight range.',
    };
  } else if (bmi < 30.0) {
    return {
      classification: 'Overweight',
      categoryCode: 'overweight',
      color: '#CA8A04',
      description: 'Above standard healthy weight range.',
    };
  } else if (bmi < 35.0) {
    return {
      classification: 'Obese Class I',
      categoryCode: 'obese_1',
      color: '#EA580C',
      description: 'Higher health risk associated with increased body weight.',
    };
  } else if (bmi < 40.0) {
    return {
      classification: 'Obese Class II',
      categoryCode: 'obese_2',
      color: '#DC2626',
      description: 'Significantly increased risk of weight-related health conditions.',
    };
  } else {
    return {
      classification: 'Obese Class III',
      categoryCode: 'obese_3',
      color: '#7F1D1D',
      description: 'Severe obesity. High risk of cardiovascular and metabolic conditions.',
    };
  }
}

export function calculateBmi(input: BmiInput): CalculationOutcome<BmiResult> {
  const trace: CalculationStep[] = [];
  let weightKgDec: Decimal | null = null;
  let heightMetersDec: Decimal | null = null;

  if (input.unitSystem === 'metric') {
    const w = toDecimal(input.weightKg);
    const hCm = toDecimal(input.heightCm);

    if (!w || w.lte(10) || w.gte(600)) {
      return createErrorOutcome(BMI_FORMULA_ID, BMI_FORMULA_VERSION, 'Weight must be between 10 kg and 600 kg.', {
        weightKg: input.weightKg,
      });
    }
    if (!hCm || hCm.lte(50) || hCm.gte(300)) {
      return createErrorOutcome(BMI_FORMULA_ID, BMI_FORMULA_VERSION, 'Height must be between 50 cm and 300 cm.', {
        heightCm: input.heightCm,
      });
    }

    weightKgDec = w;
    heightMetersDec = hCm.div(100);

    trace.push({
      stepNumber: 1,
      label: 'Convert Height to Meters',
      expression: `${hCm.toString()} cm ÷ 100`,
      result: `${heightMetersDec.toFixed(2)} m`,
      explanation: 'BMI requires height in meters for the standard metric formula.',
    });
  } else {
    // Imperial: weight in lbs, height in feet + inches
    const wLbs = toDecimal(input.weightLbs);
    const hFt = toDecimal(input.heightFeet || 0);
    const hIn = toDecimal(input.heightInches || 0);

    if (!wLbs || wLbs.lte(20) || wLbs.gte(1400)) {
      return createErrorOutcome(BMI_FORMULA_ID, BMI_FORMULA_VERSION, 'Weight must be between 20 lbs and 1400 lbs.', {
        weightLbs: input.weightLbs,
      });
    }

    const totalInches = (hFt ? hFt.times(12) : new Decimal(0)).plus(hIn || 0);
    if (totalInches.lte(20) || totalInches.gte(120)) {
      return createErrorOutcome(
        BMI_FORMULA_ID,
        BMI_FORMULA_VERSION,
        'Total height must be between 20 inches (1 ft 8 in) and 120 inches (10 ft).',
        { heightFeet: input.heightFeet, heightInches: input.heightInches }
      );
    }

    trace.push({
      stepNumber: 1,
      label: 'Calculate Total Height in Inches',
      expression: `(${hFt ? hFt.toString() : '0'} × 12) + ${hIn ? hIn.toString() : '0'}`,
      result: `${totalInches.toString()} inches`,
      explanation: 'Convert imperial feet and inches to total inches.',
    });

    // Convert imperial to metric for universal computation:
    // 1 lb = 0.45359237 kg; 1 inch = 0.0254 m
    weightKgDec = wLbs.times(new Decimal('0.45359237'));
    heightMetersDec = totalInches.times(new Decimal('0.0254'));

    trace.push({
      stepNumber: 2,
      label: 'Convert Imperial Values to Metric Equivalents',
      expression: `Weight = ${wLbs.toString()} × 0.453592 kg, Height = ${totalInches.toString()} × 0.0254 m`,
      result: `${weightKgDec.toFixed(2)} kg, ${heightMetersDec.toFixed(3)} m`,
      explanation: 'Normalize imperial inputs to SI units.',
    });
  }

  // Formula: BMI = weight (kg) / [height (m)]^2
  const heightSquared = heightMetersDec.pow(2);
  trace.push({
    stepNumber: trace.length + 1,
    label: 'Square the Height',
    expression: `(${heightMetersDec.toFixed(3)})²`,
    result: heightSquared.toFixed(4),
    explanation: 'Denominator of the Quetelet BMI equation.',
  });

  const bmiDec = weightKgDec.div(heightSquared);
  const bmiNum = Number(bmiDec.toFixed(1));

  trace.push({
    stepNumber: trace.length + 1,
    label: 'Compute Quetelet BMI Index',
    expression: `${weightKgDec.toFixed(2)} ÷ ${heightSquared.toFixed(4)}`,
    result: bmiNum.toFixed(1),
    explanation: 'Divide weight in kilograms by height in meters squared.',
  });

  // BMI Prime = BMI / 25
  const bmiPrime = Number((bmiNum / 25).toFixed(2));

  // Healthy weight range (BMI 18.5 to 24.9)
  // weight = BMI * height^2
  const minHealthyKg = heightSquared.times('18.5').toDecimalPlaces(1, Decimal.ROUND_HALF_UP);
  const maxHealthyKg = heightSquared.times('24.9').toDecimalPlaces(1, Decimal.ROUND_HALF_UP);
  const kgToLbs = new Decimal('2.20462262185');
  const minHealthyLbs = minHealthyKg.times(kgToLbs).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);
  const maxHealthyLbs = maxHealthyKg.times(kgToLbs).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  const category = getBmiCategory(bmiNum);

  return {
    status: 'success',
    value: {
      bmi: bmiNum,
      formattedBmi: bmiNum.toFixed(1),
      bmiPrime,
      category,
      healthyWeightRange: {
        minWeightKg: minHealthyKg.toNumber(),
        maxWeightKg: maxHealthyKg.toNumber(),
        minWeightLbs: minHealthyLbs.toNumber(),
        maxWeightLbs: maxHealthyLbs.toNumber(),
        formattedRangeMetric: `${minHealthyKg.toString()} kg – ${maxHealthyKg.toString()} kg`,
        formattedRangeImperial: `${minHealthyLbs.toString()} lbs – ${maxHealthyLbs.toString()} lbs`,
      },
      disclaimer:
        'Informational screening only (Risk Tier T2). BMI does not measure body composition, muscle mass, or body fat distribution directly. Consult a healthcare professional for clinical health assessments.',
    },
    normalizedInputs: {
      unitSystem: input.unitSystem,
      normalizedWeightKg: weightKgDec.toNumber(),
      normalizedHeightMeters: heightMetersDec.toNumber(),
    },
    appliedDefaults: [],
    formulaId: BMI_FORMULA_ID,
    formulaVersion: BMI_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
