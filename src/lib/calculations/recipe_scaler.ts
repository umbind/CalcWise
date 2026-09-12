import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface RecipeScalerInput {
  originalServings: number | string;
  desiredServings: number | string;
  ingredientsText: string;
}

export interface ScaledIngredient {
  originalLine: string;
  scaledLine: string;
  originalQuantity?: number;
  scaledQuantity?: number;
  unitAndItem: string;
}

export interface RecipeScalerResult {
  scaleFactor: number;
  originalServings: number;
  desiredServings: number;
  scaledIngredients: ScaledIngredient[];
  formattedScaleFactor: string;
}

export const RECIPE_SCALER_FORMULA_ID = 'formula-everyday-recipe-scaler-v1.0.0';
export const RECIPE_SCALER_FORMULA_VERSION = '1.0.0';

// Convert decimal to nice kitchen mixed fraction (e.g. 1.75 -> "1 3/4")
function toKitchenFraction(num: number): string {
  if (Math.abs(num - Math.round(num)) < 0.01) {
    return Math.round(num).toString();
  }
  const whole = Math.floor(num);
  const frac = num - whole;

  const fractions = [
    { val: 0.125, str: '1/8' },
    { val: 0.25, str: '1/4' },
    { val: 0.333, str: '1/3' },
    { val: 0.375, str: '3/8' },
    { val: 0.5, str: '1/2' },
    { val: 0.625, str: '5/8' },
    { val: 0.666, str: '2/3' },
    { val: 0.75, str: '3/4' },
    { val: 0.875, str: '7/8' },
  ];

  let closest = fractions[0];
  let minDiff = Math.abs(frac - fractions[0].val);
  for (const f of fractions) {
    const diff = Math.abs(frac - f.val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = f;
    }
  }

  if (minDiff < 0.05) {
    return whole > 0 ? `${whole} ${closest.str}` : closest.str;
  }
  return new Decimal(num).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString();
}

function parseQuantity(str: string): { quantity?: number; rest: string } {
  const trimmed = str.trim();
  // Check mixed fraction e.g. "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    if (den !== 0) {
      return { quantity: whole + num / den, rest: mixedMatch[4] };
    }
  }

  // Check simple fraction e.g. "1/2" or "3/4"
  const fracMatch = trimmed.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (den !== 0) {
      return { quantity: num / den, rest: fracMatch[3] };
    }
  }

  // Check decimal or integer e.g. "2.5" or "3"
  const numMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (numMatch) {
    return { quantity: Number(numMatch[1]), rest: numMatch[2] };
  }

  return { rest: trimmed };
}

export function calculateRecipeScale(input: RecipeScalerInput): CalculationOutcome<RecipeScalerResult> {
  const origS = toDecimal(input.originalServings);
  const desS = toDecimal(input.desiredServings);

  if (!origS || origS.lte(0) || origS.gt(1000)) {
    return createErrorOutcome(RECIPE_SCALER_FORMULA_ID, RECIPE_SCALER_FORMULA_VERSION, 'Original servings must be between 1 and 1,000.', {});
  }
  if (!desS || desS.lte(0) || desS.gt(10000)) {
    return createErrorOutcome(RECIPE_SCALER_FORMULA_ID, RECIPE_SCALER_FORMULA_VERSION, 'Desired servings must be between 1 and 10,000.', {});
  }

  const scaleFactorDec = desS.div(origS);
  const scaleFactor = scaleFactorDec.toNumber();

  const lines = input.ingredientsText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const scaledIngredients: ScaledIngredient[] = lines.map((line) => {
    const { quantity, rest } = parseQuantity(line);
    if (quantity !== undefined) {
      const scaledVal = quantity * scaleFactor;
      const formattedQty = toKitchenFraction(scaledVal);
      return {
        originalLine: line,
        scaledLine: `${formattedQty} ${rest}`.trim(),
        originalQuantity: quantity,
        scaledQuantity: scaledVal,
        unitAndItem: rest,
      };
    }
    return {
      originalLine: line,
      scaledLine: line,
      unitAndItem: line,
    };
  });

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Scaling Ratio',
    expression: `${desS.toString()} Desired Servings ÷ ${origS.toString()} Original Servings`,
    result: `${scaleFactorDec.toDecimalPlaces(3).toString()}x Multiplier`,
    explanation: 'Uniform linear magnification factor applied to recipe ingredient quantities.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Parse and Re-Scale Ingredients',
    expression: `Scaled ${scaledIngredients.length} ingredient items to fractional kitchen measurements`,
    result: 'Success',
    explanation: 'Converts floating quantities to practical baking/cooking fractional increments.',
  });

  return {
    status: 'success',
    value: {
      scaleFactor,
      originalServings: origS.toNumber(),
      desiredServings: desS.toNumber(),
      scaledIngredients,
      formattedScaleFactor: `${scaleFactorDec.toDecimalPlaces(3).toString()}x`,
    },
    normalizedInputs: {
      originalServings: origS.toNumber(),
      desiredServings: desS.toNumber(),
      ingredientCount: scaledIngredients.length,
    },
    appliedDefaults: [],
    formulaId: RECIPE_SCALER_FORMULA_ID,
    formulaVersion: RECIPE_SCALER_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
