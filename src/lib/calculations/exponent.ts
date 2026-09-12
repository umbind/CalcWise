import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface ExponentInput {
  base: number | string;
  exponent: number | string;
}

export interface ExponentResult {
  resultNumber: number;
  formattedResult: string;
  scientificNotation: string;
  isNegativeExponent: boolean;
  isFractionalExponent: boolean;
  base: number;
  exponent: number;
}

export const EXPONENT_FORMULA_ID = 'formula-math-exponentiation-v1.0.0';
export const EXPONENT_FORMULA_VERSION = '1.0.0';

export function calculateExponent(input: ExponentInput): CalculationOutcome<ExponentResult> {
  const decBase = toDecimal(input.base);
  const decExp = toDecimal(input.exponent);

  if (!decBase || !decExp) {
    return createErrorOutcome(EXPONENT_FORMULA_ID, EXPONENT_FORMULA_VERSION, 'Please enter valid numbers for both base and exponent.', {});
  }

  const b = decBase.toNumber();
  const x = decExp.toNumber();

  // Mathematical constraints
  if (b === 0 && x < 0) {
    return createErrorOutcome(EXPONENT_FORMULA_ID, EXPONENT_FORMULA_VERSION, 'Zero raised to a negative power results in division by zero (undefined).', { base: b, exponent: x });
  }
  if (b < 0 && !decExp.isInteger()) {
    return createErrorOutcome(EXPONENT_FORMULA_ID, EXPONENT_FORMULA_VERSION, 'Negative base with fractional exponent produces a complex number. Only real roots are supported.', { base: b, exponent: x });
  }

  let resultNum: number;
  try {
    resultNum = Math.pow(b, x);
  } catch (e) {
    return createErrorOutcome(EXPONENT_FORMULA_ID, EXPONENT_FORMULA_VERSION, 'Computation overflowed capacity.', {});
  }

  if (!isFinite(resultNum)) {
    return createErrorOutcome(EXPONENT_FORMULA_ID, EXPONENT_FORMULA_VERSION, 'Result exceeds maximum floating-point representation (overflow).', {});
  }

  const trace: CalculationStep[] = [];
  const isNegativeExp = x < 0;
  const isFractionalExp = !decExp.isInteger();

  if (x === 0) {
    trace.push({
      stepNumber: 1,
      label: 'Zero Power Law',
      expression: `${b}⁰ = 1`,
      result: '1',
      explanation: 'Any non-zero real base raised to power zero equals 1.',
    });
  } else if (isNegativeExp) {
    const posExp = Math.abs(x);
    trace.push({
      stepNumber: 1,
      label: 'Negative Exponent Reciprocal Rule',
      expression: `${b}^(${x}) = 1 ÷ (${b}^${posExp})`,
      result: `1 / ${Math.pow(b, posExp)}`,
      explanation: 'Negative powers invert the base to its reciprocal.',
    });
  } else if (isFractionalExp) {
    trace.push({
      stepNumber: 1,
      label: 'Fractional Exponent Radical Rule',
      expression: `${b}^(${x}) = exp(${x} × ln(${b}))`,
      result: `${resultNum}`,
      explanation: 'Fractional powers correspond to n-th roots.',
    });
  } else {
    trace.push({
      stepNumber: 1,
      label: 'Repeated Multiplication',
      expression: `${b}^${x}`,
      result: `${resultNum}`,
      explanation: 'Standard integer exponentiation.',
    });
  }

  let formattedResult = '';
  if (Math.abs(resultNum) >= 1e9 || (Math.abs(resultNum) <= 1e-4 && resultNum !== 0)) {
    formattedResult = resultNum.toExponential(6);
  } else {
    formattedResult = new Decimal(resultNum).toDecimalPlaces(6, Decimal.ROUND_HALF_UP).toString();
  }

  const sci = resultNum.toExponential(4);

  return {
    status: 'success',
    value: {
      resultNumber: resultNum,
      formattedResult,
      scientificNotation: sci,
      isNegativeExponent: isNegativeExp,
      isFractionalExponent: isFractionalExp,
      base: b,
      exponent: x,
    },
    normalizedInputs: {
      base: b,
      exponent: x,
    },
    appliedDefaults: [],
    formulaId: EXPONENT_FORMULA_ID,
    formulaVersion: EXPONENT_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
