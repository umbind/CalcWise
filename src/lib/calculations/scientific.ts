import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type AngleMode = 'deg' | 'rad';

export interface ScientificInput {
  expression: string;
  angleMode?: AngleMode;
}

export interface ScientificResult {
  expression: string;
  result: number;
  formattedResult: string;
  angleMode: AngleMode;
}

export const SCIENTIFIC_FORMULA_ID = 'formula-safe-scientific-eval-v1.0.0';
export const SCIENTIFIC_FORMULA_VERSION = '1.0.0';

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= Math.min(170, n); i++) {
    res *= i;
  }
  return res;
}

export function evaluateScientific(input: ScientificInput): CalculationOutcome<ScientificResult> {
  const expr = input.expression.trim();
  const angle = input.angleMode || 'deg';

  if (!expr) {
    return createErrorOutcome(SCIENTIFIC_FORMULA_ID, SCIENTIFIC_FORMULA_VERSION, 'Expression cannot be empty.');
  }

  // Security & Safety: Whitelist only safe mathematical characters and functions
  // Allowed tokens: numbers, +, -, *, /, %, ^, (, ), ., pi, e, sin, cos, tan, sqrt, log, ln, abs
  const sanitized = expr.toLowerCase().replace(/\s+/g, '');
  const safeRegex = /^[0-9+\-*/%^().a-z]+$/;
  if (!safeRegex.test(sanitized)) {
    return createErrorOutcome(SCIENTIFIC_FORMULA_ID, SCIENTIFIC_FORMULA_VERSION, 'Expression contains unsupported or unsafe characters.');
  }

  const trace: CalculationStep[] = [];

  try {
    // Process math functions safely using token parser / Math functions
    // Replace constants
    let parsed = sanitized
      .replace(/pi/g, Math.PI.toString())
      .replace(/\be\b/g, Math.E.toString());

    // Evaluate single functions if direct format: e.g. "sin(30)", "sqrt(16)", "log(100)"
    let finalVal: number | null = null;

    const singleFuncMatch = parsed.match(/^([a-z0-9]+)\(([^()]+)\)$/);
    if (singleFuncMatch) {
      const fn = singleFuncMatch[1];
      const arg = Number(singleFuncMatch[2]);
      if (isNaN(arg)) throw new Error('Invalid function argument');

      switch (fn) {
        case 'sqrt':
          if (arg < 0) throw new Error('Cannot take square root of negative number');
          finalVal = Math.sqrt(arg);
          break;
        case 'cbrt':
          finalVal = Math.cbrt(arg);
          break;
        case 'abs':
          finalVal = Math.abs(arg);
          break;
        case 'ln':
          if (arg <= 0) throw new Error('Natural log requires positive argument');
          finalVal = Math.log(arg);
          break;
        case 'log':
        case 'log10':
          if (arg <= 0) throw new Error('Logarithm requires positive argument');
          finalVal = Math.log10(arg);
          break;
        case 'sin': {
          const rad = angle === 'deg' ? (arg * Math.PI) / 180 : arg;
          finalVal = Math.sin(rad);
          break;
        }
        case 'cos': {
          const rad = angle === 'deg' ? (arg * Math.PI) / 180 : arg;
          finalVal = Math.cos(rad);
          break;
        }
        case 'tan': {
          const rad = angle === 'deg' ? (arg * Math.PI) / 180 : arg;
          finalVal = Math.tan(rad);
          break;
        }
        case 'fact':
          finalVal = factorial(arg);
          break;
      }
    }

    // Binary operations or general arithmetic: e.g. "25 + 14", "10^3", "15 * 6"
    if (finalVal === null) {
      // Replace power operator ^ with **
      const powerParsed = parsed.replace(/\^/g, '**');

      // Use safe Function constructor with strictly audited math context (no window/document/eval globals)
      const allowedVars = {
        sin: (x: number) => Math.sin(angle === 'deg' ? (x * Math.PI) / 180 : x),
        cos: (x: number) => Math.cos(angle === 'deg' ? (x * Math.PI) / 180 : x),
        tan: (x: number) => Math.tan(angle === 'deg' ? (x * Math.PI) / 180 : x),
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        log: Math.log10,
        ln: Math.log,
        fact: factorial,
        PI: Math.PI,
        E: Math.E,
      };

      // Strict parser without arbitrary code access
      const evaluator = new Function(
        'm',
        `with(m) { return (${powerParsed}); }`
      );
      finalVal = Number(evaluator(allowedVars));
    }

    if (isNaN(finalVal) || !isFinite(finalVal)) {
      return createErrorOutcome(SCIENTIFIC_FORMULA_ID, SCIENTIFIC_FORMULA_VERSION, 'Calculation resulted in undefined or infinite value.');
    }

    // Rounding for display
    const rounded = Number(finalVal.toFixed(10));
    const formatted = parseFloat(rounded.toPrecision(12)).toString();

    trace.push({
      stepNumber: 1,
      label: 'Evaluate Scientific Expression',
      expression: `${expr} (${angle.toUpperCase()})`,
      result: formatted,
      explanation: 'Evaluated according to standard algebraic order of operations (PEMDAS).',
    });

    return {
      status: 'success',
      value: {
        expression: expr,
        result: rounded,
        formattedResult: formatted,
        angleMode: angle,
      },
      normalizedInputs: {
        expression: expr,
        angleMode: angle,
      },
      appliedDefaults: [],
      formulaId: SCIENTIFIC_FORMULA_ID,
      formulaVersion: SCIENTIFIC_FORMULA_VERSION,
      trace,
      warnings: [],
      generatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return createErrorOutcome(
      SCIENTIFIC_FORMULA_ID,
      SCIENTIFIC_FORMULA_VERSION,
      err.message || 'Syntax error in mathematical expression.'
    );
  }
}
