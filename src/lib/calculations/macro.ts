import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type MacroGoal = 'maintenance' | 'cutting' | 'bulking' | 'keto' | 'custom';

export interface MacroInput {
  dailyCalories: number | string;
  goal?: MacroGoal;
  customProteinPct?: number | string;
  customCarbsPct?: number | string;
  customFatPct?: number | string;
}

export interface MacroResult {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  formattedProtein: string;
  formattedCarbs: string;
  formattedFat: string;
}

export const MACRO_FORMULA_ID = 'formula-health-macro-split-v1.0.0';
export const MACRO_FORMULA_VERSION = '1.0.0';

export function calculateMacros(input: MacroInput): CalculationOutcome<MacroResult> {
  const calories = toDecimal(input.dailyCalories);
  const goal: MacroGoal = input.goal || 'maintenance';

  if (!calories || calories.lt(800) || calories.gt(10000)) {
    return createErrorOutcome(MACRO_FORMULA_ID, MACRO_FORMULA_VERSION, 'Daily calories must be between 800 and 10,000 kcal.', { dailyCalories: input.dailyCalories });
  }

  let pPct: Decimal;
  let cPct: Decimal;
  let fPct: Decimal;

  if (goal === 'cutting') {
    pPct = new Decimal(40);
    cPct = new Decimal(30);
    fPct = new Decimal(30);
  } else if (goal === 'bulking') {
    pPct = new Decimal(25);
    cPct = new Decimal(55);
    fPct = new Decimal(20);
  } else if (goal === 'keto') {
    pPct = new Decimal(25);
    cPct = new Decimal(5);
    fPct = new Decimal(70);
  } else if (goal === 'custom') {
    const p = toDecimal(input.customProteinPct);
    const c = toDecimal(input.customCarbsPct);
    const f = toDecimal(input.customFatPct);
    if (!p || !c || !f || p.lt(0) || c.lt(0) || f.lt(0)) {
      return createErrorOutcome(MACRO_FORMULA_ID, MACRO_FORMULA_VERSION, 'All custom macro percentages must be non-negative.', {});
    }
    const sum = p.plus(c).plus(f);
    if (!sum.eq(100)) {
      return createErrorOutcome(MACRO_FORMULA_ID, MACRO_FORMULA_VERSION, `Custom macro percentages must sum to 100%. Current sum: ${sum.toString()}%.`, { sum: sum.toNumber() });
    }
    pPct = p;
    cPct = c;
    fPct = f;
  } else {
    // Maintenance default
    pPct = new Decimal(30);
    cPct = new Decimal(40);
    fPct = new Decimal(30);
  }

  const trace: CalculationStep[] = [];

  // Calories per macro
  const pCal = calories.times(pPct.div(100)).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const cCal = calories.times(cPct.div(100)).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const fCal = calories.times(fPct.div(100)).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  // Grams: Protein 4 kcal/g, Carbs 4 kcal/g, Fat 9 kcal/g
  const pGrams = pCal.div(4).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const cGrams = cCal.div(4).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const fGrams = fCal.div(9).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 1,
    label: 'Partition Total Energy by Ratio',
    expression: `${calories.toString()} kcal → Protein ${pPct.toString()}%, Carbs ${cPct.toString()}%, Fat ${fPct.toString()}%`,
    result: `${pCal.toString()} kcal / ${cCal.toString()} kcal / ${fCal.toString()} kcal`,
    explanation: 'Macronutrient caloric distribution based on nutritional targets.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Convert Energy to Gram Weights',
    expression: `Protein (${pCal.toString()} ÷ 4g), Carbs (${cCal.toString()} ÷ 4g), Fat (${fCal.toString()} ÷ 9g)`,
    result: `${pGrams.toString()}g P / ${cGrams.toString()}g C / ${fGrams.toString()}g F`,
    explanation: 'Atwater physiological energy values per gram of macronutrient.',
  });

  return {
    status: 'success',
    value: {
      proteinGrams: pGrams.toNumber(),
      carbsGrams: cGrams.toNumber(),
      fatGrams: fGrams.toNumber(),
      proteinCalories: pCal.toNumber(),
      carbsCalories: cCal.toNumber(),
      fatCalories: fCal.toNumber(),
      proteinPct: pPct.toNumber(),
      carbsPct: cPct.toNumber(),
      fatPct: fPct.toNumber(),
      formattedProtein: `${pGrams.toString()}g (${pCal.toString()} kcal)`,
      formattedCarbs: `${cGrams.toString()}g (${cCal.toString()} kcal)`,
      formattedFat: `${fGrams.toString()}g (${fCal.toString()} kcal)`,
    },
    normalizedInputs: {
      dailyCalories: calories.toNumber(),
      goal,
    },
    appliedDefaults: [],
    formulaId: MACRO_FORMULA_ID,
    formulaVersion: MACRO_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
