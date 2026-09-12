import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type PercentageMode =
  | 'percent_of'
  | 'what_percent'
  | 'percentage_change'
  | 'percentage_increase'
  | 'percentage_decrease';

export interface PercentageInput {
  mode: PercentageMode;
  valA: number | string;
  valB: number | string;
}

export interface PercentageResult {
  result: number;
  formattedResult: string;
  explanation: string;
  modeLabel: string;
}

export const PERCENTAGE_FORMULA_ID = 'formula-percentage-v1.0.0';
export const PERCENTAGE_FORMULA_VERSION = '1.0.0';

export function calculatePercentage(input: PercentageInput): CalculationOutcome<PercentageResult> {
  const decA = toDecimal(input.valA);
  const decB = toDecimal(input.valB);

  if (!decA || !decB) {
    return createErrorOutcome(
      PERCENTAGE_FORMULA_ID,
      PERCENTAGE_FORMULA_VERSION,
      'Both inputs must be valid numbers.',
      { mode: input.mode, valA: input.valA, valB: input.valB }
    );
  }

  const trace: CalculationStep[] = [];
  let resultDec: Decimal;
  let explanation = '';
  let modeLabel = '';

  switch (input.mode) {
    case 'percent_of': {
      // What is A% of B? Result = (A / 100) * B
      modeLabel = `What is ${decA.toString()}% of ${decB.toString()}?`;
      trace.push({
        stepNumber: 1,
        label: 'Convert percentage to decimal',
        expression: `${decA.toString()} ÷ 100`,
        result: decA.div(100).toString(),
        explanation: 'Divide the percentage by 100 to get the decimal multiplier.',
      });
      resultDec = decA.div(100).times(decB);
      trace.push({
        stepNumber: 2,
        label: 'Multiply by base value',
        expression: `${decA.div(100).toString()} × ${decB.toString()}`,
        result: resultDec.toString(),
        explanation: 'Multiply the decimal multiplier by the target number.',
      });
      explanation = `${decA.toString()}% of ${decB.toString()} is ${resultDec.toFixed(4).replace(/\.?0+$/, '')}.`;
      break;
    }

    case 'what_percent': {
      // A is what percent of B? Result = (A / B) * 100
      modeLabel = `${decA.toString()} is what percent of ${decB.toString()}?`;
      if (decB.isZero()) {
        return createErrorOutcome(
          PERCENTAGE_FORMULA_ID,
          PERCENTAGE_FORMULA_VERSION,
          'Cannot divide by zero. Base number must be non-zero.',
          { mode: input.mode, valA: input.valA, valB: input.valB }
        );
      }
      const fraction = decA.div(decB);
      trace.push({
        stepNumber: 1,
        label: 'Calculate ratio',
        expression: `${decA.toString()} ÷ ${decB.toString()}`,
        result: fraction.toFixed(6),
        explanation: 'Divide the part by the whole to get the proportion.',
      });
      resultDec = fraction.times(100);
      trace.push({
        stepNumber: 2,
        label: 'Convert to percentage',
        expression: `${fraction.toFixed(6)} × 100`,
        result: `${resultDec.toFixed(4).replace(/\.?0+$/, '')}%`,
        explanation: 'Multiply the ratio by 100 to obtain percentage format.',
      });
      explanation = `${decA.toString()} is ${resultDec.toFixed(2)}% of ${decB.toString()}.`;
      break;
    }

    case 'percentage_change': {
      // Change from A to B: ((B - A) / |A|) * 100
      modeLabel = `Percentage change from ${decA.toString()} to ${decB.toString()}`;
      if (decA.isZero()) {
        return createErrorOutcome(
          PERCENTAGE_FORMULA_ID,
          PERCENTAGE_FORMULA_VERSION,
          'Initial value cannot be zero for percentage change calculation.',
          { mode: input.mode, valA: input.valA, valB: input.valB }
        );
      }
      const delta = decB.minus(decA);
      trace.push({
        stepNumber: 1,
        label: 'Calculate absolute difference',
        expression: `${decB.toString()} - ${decA.toString()}`,
        result: delta.toString(),
        explanation: 'Subtract initial value from final value.',
      });
      const ratio = delta.div(decA.abs());
      trace.push({
        stepNumber: 2,
        label: 'Calculate relative ratio',
        expression: `${delta.toString()} ÷ |${decA.toString()}|`,
        result: ratio.toFixed(6),
        explanation: 'Divide difference by absolute initial value.',
      });
      resultDec = ratio.times(100);
      trace.push({
        stepNumber: 3,
        label: 'Convert to percentage',
        expression: `${ratio.toFixed(6)} × 100`,
        result: `${resultDec.toFixed(2)}%`,
        explanation: 'Multiply by 100 to get the percentage change.',
      });
      const direction = resultDec.gte(0) ? 'increase' : 'decrease';
      explanation = `The change from ${decA.toString()} to ${decB.toString()} is a ${resultDec.abs().toFixed(2)}% ${direction}.`;
      break;
    }

    case 'percentage_increase': {
      // Increase A by B%: A * (1 + B / 100)
      modeLabel = `Increase ${decA.toString()} by ${decB.toString()}%`;
      const multiplier = new Decimal(1).plus(decB.div(100));
      trace.push({
        stepNumber: 1,
        label: 'Calculate multiplier',
        expression: `1 + (${decB.toString()} ÷ 100)`,
        result: multiplier.toString(),
        explanation: 'Add the percentage in decimal form to 1.',
      });
      resultDec = decA.times(multiplier);
      trace.push({
        stepNumber: 2,
        label: 'Calculate final increased value',
        expression: `${decA.toString()} × ${multiplier.toString()}`,
        result: resultDec.toString(),
        explanation: 'Multiply initial value by the growth multiplier.',
      });
      explanation = `${decA.toString()} increased by ${decB.toString()}% is ${resultDec.toFixed(2)}.`;
      break;
    }

    case 'percentage_decrease': {
      // Decrease A by B%: A * (1 - B / 100)
      modeLabel = `Decrease ${decA.toString()} by ${decB.toString()}%`;
      const multiplier = new Decimal(1).minus(decB.div(100));
      trace.push({
        stepNumber: 1,
        label: 'Calculate reduction multiplier',
        expression: `1 - (${decB.toString()} ÷ 100)`,
        result: multiplier.toString(),
        explanation: 'Subtract the percentage in decimal form from 1.',
      });
      resultDec = decA.times(multiplier);
      trace.push({
        stepNumber: 2,
        label: 'Calculate final decreased value',
        expression: `${decA.toString()} × ${multiplier.toString()}`,
        result: resultDec.toString(),
        explanation: 'Multiply initial value by the reduction multiplier.',
      });
      explanation = `${decA.toString()} decreased by ${decB.toString()}% is ${resultDec.toFixed(2)}.`;
      break;
    }

    default:
      return createErrorOutcome(
        PERCENTAGE_FORMULA_ID,
        PERCENTAGE_FORMULA_VERSION,
        'Invalid percentage calculation mode.',
        { mode: input.mode }
      );
  }

  const numVal = resultDec.toNumber();

  return {
    status: 'success',
    value: {
      result: numVal,
      formattedResult: resultDec.toFixed(2).replace(/\.?0+$/, ''),
      explanation,
      modeLabel,
    },
    normalizedInputs: {
      mode: input.mode,
      valA: decA.toNumber(),
      valB: decB.toNumber(),
    },
    appliedDefaults: [],
    formulaId: PERCENTAGE_FORMULA_ID,
    formulaVersion: PERCENTAGE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
