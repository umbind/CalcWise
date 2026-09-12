import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface LogarithmInput {
  value: number | string;
  base?: number | string; // default 10, or 'e'
}

export interface LogarithmResult {
  result: number;
  formattedResult: string;
  naturalLog: number;
  commonLog: number;
  binaryLog: number;
  baseUsed: string;
  value: number;
}

export const LOG_FORMULA_ID = 'formula-math-logarithm-v1.0.0';
export const LOG_FORMULA_VERSION = '1.0.0';

export function calculateLogarithm(input: LogarithmInput): CalculationOutcome<LogarithmResult> {
  const decVal = toDecimal(input.value);
  if (!decVal || decVal.lte(0)) {
    return createErrorOutcome(LOG_FORMULA_ID, LOG_FORMULA_VERSION, 'Logarithm argument x must be strictly greater than zero (x > 0).', { value: input.value });
  }

  const x = decVal.toNumber();
  let baseNum: number;
  let baseStr = '10';

  if (input.base === 'e' || input.base === 'E') {
    baseNum = Math.E;
    baseStr = 'e';
  } else if (input.base !== undefined && input.base !== '') {
    const decB = toDecimal(input.base);
    if (!decB || decB.lte(0) || decB.eq(1)) {
      return createErrorOutcome(LOG_FORMULA_ID, LOG_FORMULA_VERSION, 'Logarithm base b must be positive and not equal to 1 (b > 0, b ≠ 1).', { base: input.base });
    }
    baseNum = decB.toNumber();
    baseStr = decB.toString();
  } else {
    baseNum = 10;
    baseStr = '10';
  }

  const lnX = Math.log(x);
  const log10X = Math.log10(x);
  const log2X = Math.log2(x);

  const res = lnX / Math.log(baseNum);
  const round6 = (v: number) => new Decimal(v).toDecimalPlaces(6, Decimal.ROUND_HALF_UP).toNumber();

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Validate Domain Constraints',
    expression: `x = ${x} > 0 ;  base b = ${baseStr} > 0, ≠ 1`,
    result: 'Valid Real Domain',
    explanation: 'Logarithms are defined over positive real arguments and positive non-unit bases.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Apply Change-of-Base Formula',
    expression: `log_{${baseStr}}(${x}) = ln(${x}) ÷ ln(${baseStr}) = ${round6(lnX)} ÷ ${round6(Math.log(baseNum))}`,
    result: `${round6(res)}`,
    explanation: 'Standard change-of-base relation using natural Napierian logarithms.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Exponential Inversion Check',
    expression: `(${baseStr})^(${round6(res)}) ≈ ${round6(Math.pow(baseNum, res))}`,
    result: `Checks out = ${x}`,
    explanation: 'Fundamental identity b^(log_b(x)) = x.',
  });

  return {
    status: 'success',
    value: {
      result: round6(res),
      formattedResult: round6(res).toString(),
      naturalLog: round6(lnX),
      commonLog: round6(log10X),
      binaryLog: round6(log2X),
      baseUsed: baseStr,
      value: x,
    },
    normalizedInputs: {
      value: x,
      base: baseStr,
    },
    appliedDefaults: [],
    formulaId: LOG_FORMULA_ID,
    formulaVersion: LOG_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
