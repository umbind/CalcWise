import { toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface PermCombInput {
  n: number | string;
  r: number | string;
}

export interface PermCombResult {
  permutationsNoRepetition: string; // nPr
  combinationsNoRepetition: string; // nCr
  permutationsWithRepetition: string; // n^r
  combinationsWithRepetition: string; // (n+r-1)Cr
  n: number;
  r: number;
}

export const PERM_COMB_FORMULA_ID = 'formula-math-permutation-combination-v1.0.0';
export const PERM_COMB_FORMULA_VERSION = '1.0.0';

function bigFactorial(num: number): bigint {
  let result = 1n;
  for (let i = 2n; i <= BigInt(num); i++) {
    result *= i;
  }
  return result;
}

export function calculatePermutationCombination(input: PermCombInput): CalculationOutcome<PermCombResult> {
  const decN = toDecimal(input.n);
  const decR = toDecimal(input.r);

  if (!decN || !decR || !decN.isInteger() || !decR.isInteger()) {
    return createErrorOutcome(PERM_COMB_FORMULA_ID, PERM_COMB_FORMULA_VERSION, 'Both n and r must be non-negative integers.', {});
  }

  const n = decN.toNumber();
  const r = decR.toNumber();

  if (n < 0 || r < 0) {
    return createErrorOutcome(PERM_COMB_FORMULA_ID, PERM_COMB_FORMULA_VERSION, 'Neither n nor r can be negative.', {});
  }
  if (r > n) {
    return createErrorOutcome(PERM_COMB_FORMULA_ID, PERM_COMB_FORMULA_VERSION, 'r cannot be greater than n for sampling without replacement (r ≤ n).', { n, r });
  }
  if (n > 150 || r > 150) {
    return createErrorOutcome(PERM_COMB_FORMULA_ID, PERM_COMB_FORMULA_VERSION, 'Maximum supported value for n and r is 150 to prevent excessive computational delay.', { n, r });
  }

  const trace: CalculationStep[] = [];

  // nPr = n! / (n - r)!
  const nFact = bigFactorial(n);
  const nMinusRFact = bigFactorial(n - r);
  const rFact = bigFactorial(r);

  const nPr = nFact / nMinusRFact;
  const nCr = nPr / rFact;

  // With repetition:
  // Permutations with repetition = n^r
  const nPowR = BigInt(n) ** BigInt(r);

  // Combinations with repetition = (n + r - 1)! / (r! * (n - 1)!)
  let combWithRep = 1n;
  if (n > 0) {
    const topFact = bigFactorial(n + r - 1);
    const bottomFact = rFact * bigFactorial(n - 1);
    combWithRep = topFact / bottomFact;
  }

  const formatBigInt = (val: bigint) => val.toLocaleString('en-US');

  trace.push({
    stepNumber: 1,
    label: 'Compute Permutations Without Repetition (nPr)',
    expression: `${n}! ÷ (${n} - ${r})!`,
    result: formatBigInt(nPr),
    explanation: 'Total ordered arrangements of r items chosen from a set of n distinct items.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Compute Combinations Without Repetition (nCr)',
    expression: `${n}! ÷ (${r}! × (${n} - ${r})!) = ${formatBigInt(nPr)} ÷ ${formatBigInt(rFact)}`,
    result: formatBigInt(nCr),
    explanation: 'Total unordered subsets of r items chosen from a set of n distinct items.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Compute Repetition Variants',
    expression: `Permutations with Repetition: ${n}^${r} = ${formatBigInt(nPowR)}; Combinations with Repetition: (${n}+${r}-1)! ÷ (${r}! × (${n}-1)!)`,
    result: `${formatBigInt(nPowR)} (Perm) / ${formatBigInt(combWithRep)} (Comb)`,
    explanation: 'Combinatorial selections allowing identical elements to be re-selected.',
  });

  return {
    status: 'success',
    value: {
      permutationsNoRepetition: formatBigInt(nPr),
      combinationsNoRepetition: formatBigInt(nCr),
      permutationsWithRepetition: formatBigInt(nPowR),
      combinationsWithRepetition: formatBigInt(combWithRep),
      n,
      r,
    },
    normalizedInputs: {
      n,
      r,
    },
    appliedDefaults: [],
    formulaId: PERM_COMB_FORMULA_ID,
    formulaVersion: PERM_COMB_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
