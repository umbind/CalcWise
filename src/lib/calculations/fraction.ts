import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface FractionInput {
  num1: number | string;
  den1: number | string;
  op: FractionOperation;
  num2: number | string;
  den2: number | string;
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  mixedNumber: string;
  decimalValue: number;
  formattedResult: string;
  operationString: string;
}

export const FRACTION_FORMULA_ID = 'formula-fraction-arithmetic-v1.0.0';
export const FRACTION_FORMULA_VERSION = '1.0.0';

// Greatest Common Divisor (Euclidean algorithm)
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function calculateFraction(input: FractionInput): CalculationOutcome<FractionResult> {
  const n1 = Math.round(Number(input.num1));
  const d1 = Math.round(Number(input.den1));
  const n2 = Math.round(Number(input.num2));
  const d2 = Math.round(Number(input.den2));

  if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
    return createErrorOutcome(FRACTION_FORMULA_ID, FRACTION_FORMULA_VERSION, 'All numerator and denominator inputs must be integers.');
  }
  if (d1 === 0 || d2 === 0) {
    return createErrorOutcome(FRACTION_FORMULA_ID, FRACTION_FORMULA_VERSION, 'Denominator cannot be zero.');
  }

  const trace: CalculationStep[] = [];
  let resNum = 0;
  let resDen = 1;
  let opSymbol = '+';

  switch (input.op) {
    case 'add': {
      opSymbol = '+';
      // n1/d1 + n2/d2 = (n1*d2 + n2*d1) / (d1*d2)
      resNum = n1 * d2 + n2 * d1;
      resDen = d1 * d2;
      trace.push({
        stepNumber: 1,
        label: 'Find Common Denominator & Cross-Multiply',
        expression: `(${n1} × ${d2}) + (${n2} × ${d1}) ÷ (${d1} × ${d2})`,
        result: `${resNum} / ${resDen}`,
        explanation: 'Find common denominator and sum the cross-multiplied numerators.',
      });
      break;
    }
    case 'subtract': {
      opSymbol = '−';
      resNum = n1 * d2 - n2 * d1;
      resDen = d1 * d2;
      trace.push({
        stepNumber: 1,
        label: 'Find Common Denominator & Cross-Multiply',
        expression: `(${n1} × ${d2}) − (${n2} × ${d1}) ÷ (${d1} × ${d2})`,
        result: `${resNum} / ${resDen}`,
        explanation: 'Subtract the second cross-multiplied numerator from the first.',
      });
      break;
    }
    case 'multiply': {
      opSymbol = '×';
      resNum = n1 * n2;
      resDen = d1 * d2;
      trace.push({
        stepNumber: 1,
        label: 'Multiply Numerators and Denominators',
        expression: `(${n1} × ${n2}) ÷ (${d1} × ${d2})`,
        result: `${resNum} / ${resDen}`,
        explanation: 'Multiply top by top, bottom by bottom.',
      });
      break;
    }
    case 'divide': {
      opSymbol = '÷';
      if (n2 === 0) {
        return createErrorOutcome(FRACTION_FORMULA_ID, FRACTION_FORMULA_VERSION, 'Cannot divide by a fraction with value 0.');
      }
      resNum = n1 * d2;
      resDen = d1 * n2;
      trace.push({
        stepNumber: 1,
        label: 'Multiply by Reciprocal (Invert and Multiply)',
        expression: `(${n1} ÷ ${d1}) × (${d2} ÷ ${n2}) = (${n1} × ${d2}) ÷ (${d1} × ${n2})`,
        result: `${resNum} / ${resDen}`,
        explanation: 'Invert the second fraction and multiply.',
      });
      break;
    }
  }

  // Handle negative signs cleanly on denominator
  if (resDen < 0) {
    resNum = -resNum;
    resDen = -resDen;
  }

  // Simplify fraction using GCD
  const commonDivisor = gcd(resNum, resDen);
  const simpNum = resNum / commonDivisor;
  const simpDen = resDen / commonDivisor;

  trace.push({
    stepNumber: 2,
    label: `Simplify by Greatest Common Divisor (GCD = ${commonDivisor})`,
    expression: `(${resNum} ÷ ${commonDivisor}) ÷ (${resDen} ÷ ${commonDivisor})`,
    result: simpDen === 1 ? `${simpNum}` : `${simpNum} / ${simpDen}`,
    explanation: 'Divide both numerator and denominator by their greatest common factor.',
  });

  // Calculate mixed number
  let mixedNumber = '';
  if (simpDen !== 1 && Math.abs(simpNum) > simpDen) {
    const whole = Math.trunc(simpNum / simpDen);
    const remainder = Math.abs(simpNum % simpDen);
    mixedNumber = `${whole} ${remainder}/${simpDen}`;
  } else if (simpDen === 1) {
    mixedNumber = `${simpNum}`;
  } else {
    mixedNumber = `${simpNum}/${simpDen}`;
  }

  const decimalVal = Number((simpNum / simpDen).toFixed(6));
  const formattedResult = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
  const operationString = `${n1}/${d1} ${opSymbol} ${n2}/${d2} = ${formattedResult}`;

  return {
    status: 'success',
    value: {
      numerator: simpNum,
      denominator: simpDen,
      mixedNumber,
      decimalValue: decimalVal,
      formattedResult,
      operationString,
    },
    normalizedInputs: {
      n1,
      d1,
      op: input.op,
      n2,
      d2,
    },
    appliedDefaults: [],
    formulaId: FRACTION_FORMULA_ID,
    formulaVersion: FRACTION_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
