import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface QuadraticInput {
  a: number | string;
  b: number | string;
  c: number | string;
}

export interface QuadraticResult {
  discriminant: number;
  rootType: 'two_real' | 'one_real' | 'complex';
  root1: string;
  root2: string;
  vertexX: number;
  vertexY: number;
  yIntercept: number;
  parabolaDirection: 'upward' | 'downward';
  formattedEquation: string;
  formattedVertex: string;
}

export const QUADRATIC_FORMULA_ID = 'formula-math-quadratic-roots-v1.0.0';
export const QUADRATIC_FORMULA_VERSION = '1.0.0';

export function calculateQuadratic(input: QuadraticInput): CalculationOutcome<QuadraticResult> {
  const decA = toDecimal(input.a);
  const decB = (input.b !== undefined && input.b !== '' ? toDecimal(input.b) : new Decimal(0)) ?? new Decimal(0);
  const decC = (input.c !== undefined && input.c !== '' ? toDecimal(input.c) : new Decimal(0)) ?? new Decimal(0);

  if (!decA || decA.isZero()) {
    return createErrorOutcome(QUADRATIC_FORMULA_ID, QUADRATIC_FORMULA_VERSION, 'Coefficient "a" cannot be zero in a quadratic equation (ax² + bx + c = 0).', { a: input.a });
  }

  const a = decA.toNumber();
  const b = decB.toNumber();
  const c = decC.toNumber();

  // Discriminant: Δ = b² - 4ac
  const discDec = decB.pow(2).minus(decA.times(decC).times(4));
  const disc = discDec.toNumber();

  const trace: CalculationStep[] = [];
  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const formattedEq = `${a}x² ${bSign}x ${cSign} = 0`;

  trace.push({
    stepNumber: 1,
    label: 'Compute Discriminant (Δ = b² - 4ac)',
    expression: `(${b})² - 4 × (${a}) × (${c}) = ${disc}`,
    result: `Δ = ${disc}`,
    explanation: 'Discriminant determines the nature and quantity of real or complex roots.',
  });

  let rootType: 'two_real' | 'one_real' | 'complex' = 'two_real';
  let root1 = '';
  let root2 = '';

  const round4 = (n: number) => {
    const d = new Decimal(n).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
    return d.toString();
  };

  if (disc > 0) {
    rootType = 'two_real';
    const sqrtDisc = Math.sqrt(disc);
    const r1 = (-b + sqrtDisc) / (2 * a);
    const r2 = (-b - sqrtDisc) / (2 * a);
    root1 = round4(r1);
    root2 = round4(r2);

    trace.push({
      stepNumber: 2,
      label: 'Solve for Two Real Roots',
      expression: `x = (-(${b}) ± √${disc}) ÷ (2 × ${a})`,
      result: `x₁ = ${root1}, x₂ = ${root2}`,
      explanation: 'Two distinct real intersection points with the x-axis.',
    });
  } else if (disc === 0) {
    rootType = 'one_real';
    const r = -b / (2 * a);
    root1 = round4(r);
    root2 = root1;

    trace.push({
      stepNumber: 2,
      label: 'Solve for Single Repeated Real Root',
      expression: `x = -(${b}) ÷ (2 × ${a})`,
      result: `x = ${root1}`,
      explanation: 'Parabola is tangent to the x-axis at a single vertex point.',
    });
  } else {
    rootType = 'complex';
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-disc) / (2 * Math.abs(a));
    const realStr = round4(realPart);
    const imagStr = round4(imagPart);

    root1 = `${realStr} + ${imagStr}i`;
    root2 = `${realStr} - ${imagStr}i`;

    trace.push({
      stepNumber: 2,
      label: 'Solve for Complex Conjugate Roots',
      expression: `x = -(${b})/(2×${a}) ± i√( ${-disc} )/(2×${a})`,
      result: `x = ${root1}, ${root2}`,
      explanation: 'No real x-intercepts; roots exist in the complex plane.',
    });
  }

  // Vertex: h = -b / (2a), k = c - b² / (4a)
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);

  trace.push({
    stepNumber: 3,
    label: 'Compute Parabola Vertex (h, k)',
    expression: `h = -(${b}) ÷ (2 × ${a}) = ${round4(h)}; k = f(${round4(h)}) = ${round4(k)}`,
    result: `(${round4(h)}, ${round4(k)})`,
    explanation: a > 0 ? 'Minimum turning point of parabola.' : 'Maximum turning point of parabola.',
  });

  return {
    status: 'success',
    value: {
      discriminant: disc,
      rootType,
      root1,
      root2,
      vertexX: new Decimal(h).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber(),
      vertexY: new Decimal(k).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber(),
      yIntercept: c,
      parabolaDirection: a > 0 ? 'upward' : 'downward',
      formattedEquation: formattedEq,
      formattedVertex: `(${round4(h)}, ${round4(k)})`,
    },
    normalizedInputs: {
      a,
      b,
      c,
    },
    appliedDefaults: [],
    formulaId: QUADRATIC_FORMULA_ID,
    formulaVersion: QUADRATIC_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
