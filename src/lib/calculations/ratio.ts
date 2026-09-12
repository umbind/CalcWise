import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface RatioProportionInput {
  a?: number | string;
  b?: number | string;
  c?: number | string;
  d?: number | string;
}

export interface RatioResult {
  solvedVariable: 'A' | 'B' | 'C' | 'D' | 'none';
  solvedValue?: number;
  simplifiedRatio: string;
  decimalEquivalent: number;
  a: number;
  b: number;
  c: number;
  d: number;
  formattedProportion: string;
}

export const RATIO_FORMULA_ID = 'formula-math-ratio-proportion-v1.0.0';
export const RATIO_FORMULA_VERSION = '1.0.0';

function gcd(x: number, y: number): number {
  let a = Math.abs(Math.round(x));
  let b = Math.abs(Math.round(y));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function calculateRatio(input: RatioProportionInput): CalculationOutcome<RatioResult> {
  const decA = input.a !== undefined && input.a !== '' ? toDecimal(input.a) : undefined;
  const decB = input.b !== undefined && input.b !== '' ? toDecimal(input.b) : undefined;
  const decC = input.c !== undefined && input.c !== '' ? toDecimal(input.c) : undefined;
  const decD = input.d !== undefined && input.d !== '' ? toDecimal(input.d) : undefined;

  const countPresent = [decA, decB, decC, decD].filter((v) => v !== undefined).length;

  if (countPresent < 3) {
    return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Please provide at least 3 values to solve for the unknown proportion.', {});
  }

  let solvedVar: 'A' | 'B' | 'C' | 'D' | 'none' = 'none';
  let valA = decA;
  let valB = decB;
  let valC = decC;
  let valD = decD;

  const trace: CalculationStep[] = [];

  // A / B = C / D  <=>  A * D = B * C
  if (valA === undefined) {
    if (!valD || valD.isZero()) return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Denominator D cannot be zero.', {});
    valA = valB!.times(valC!).div(valD!);
    solvedVar = 'A';
    trace.push({
      stepNumber: 1,
      label: 'Solve for A (Cross-Multiplication)',
      expression: `A = (B × C) ÷ D = (${valB!.toString()} × ${valC!.toString()}) ÷ ${valD!.toString()}`,
      result: `A = ${valA.toDecimalPlaces(4).toString()}`,
      explanation: 'Cross-multiplying proportion terms to isolate unknown numerator A.',
    });
  } else if (valB === undefined) {
    if (!valC || valC.isZero()) return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Term C cannot be zero to solve for B.', {});
    valB = valA!.times(valD!).div(valC!);
    solvedVar = 'B';
    trace.push({
      stepNumber: 1,
      label: 'Solve for B (Cross-Multiplication)',
      expression: `B = (A × D) ÷ C = (${valA!.toString()} × ${valD!.toString()}) ÷ ${valC!.toString()}`,
      result: `B = ${valB.toDecimalPlaces(4).toString()}`,
      explanation: 'Cross-multiplying proportion terms to isolate unknown denominator B.',
    });
  } else if (valC === undefined) {
    if (!valB || valB.isZero()) return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Denominator B cannot be zero.', {});
    valC = valA!.times(valD!).div(valB!);
    solvedVar = 'C';
    trace.push({
      stepNumber: 1,
      label: 'Solve for C (Cross-Multiplication)',
      expression: `C = (A × D) ÷ B = (${valA!.toString()} × ${valD!.toString()}) ÷ ${valB!.toString()}`,
      result: `C = ${valC.toDecimalPlaces(4).toString()}`,
      explanation: 'Cross-multiplying proportion terms to isolate unknown numerator C.',
    });
  } else if (valD === undefined) {
    if (!valA || valA.isZero()) return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Numerator A cannot be zero to solve for D.', {});
    valD = valB!.times(valC!).div(valA!);
    solvedVar = 'D';
    trace.push({
      stepNumber: 1,
      label: 'Solve for D (Cross-Multiplication)',
      expression: `D = (B × C) ÷ A = (${valB!.toString()} × ${valC!.toString()}) ÷ ${valA!.toString()}`,
      result: `D = ${valD.toDecimalPlaces(4).toString()}`,
      explanation: 'Cross-multiplying proportion terms to isolate unknown denominator D.',
    });
  }

  const numA = valA!.toNumber();
  const numB = valB!.toNumber();
  const numC = valC!.toNumber();
  const numD = valD!.toNumber();

  if (numB === 0 || numD === 0) {
    return createErrorOutcome(RATIO_FORMULA_ID, RATIO_FORMULA_VERSION, 'Ratios cannot have zero in the denominator.', {});
  }

  // Ratio simplification of A : B
  const isInts = Number.isInteger(numA) && Number.isInteger(numB);
  let simplified = `${numA} : ${numB}`;
  if (isInts && numA > 0 && numB > 0) {
    const divisor = gcd(numA, numB);
    simplified = `${numA / divisor} : ${numB / divisor}`;
  }

  const decimalEquiv = new Decimal(numA / numB).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber();

  trace.push({
    stepNumber: 2,
    label: 'Simplify Ratio A : B & Decimal Value',
    expression: `${numA} ÷ ${numB}`,
    result: `${simplified} (${decimalEquiv})`,
    explanation: 'Reduced to irreducible integer ratio representation and decimal quotient.',
  });

  return {
    status: 'success',
    value: {
      solvedVariable: solvedVar,
      solvedValue: solvedVar === 'A' ? numA : solvedVar === 'B' ? numB : solvedVar === 'C' ? numC : solvedVar === 'D' ? numD : undefined,
      simplifiedRatio: simplified,
      decimalEquivalent: decimalEquiv,
      a: numA,
      b: numB,
      c: numC,
      d: numD,
      formattedProportion: `${numA} : ${numB} = ${numC} : ${numD}`,
    },
    normalizedInputs: {
      a: numA,
      b: numB,
      c: numC,
      d: numD,
    },
    appliedDefaults: [],
    formulaId: RATIO_FORMULA_ID,
    formulaVersion: RATIO_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
