import { Decimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface StandardDeviationInput {
  dataset: string; // Comma, whitespace, or newline delimited numbers
  type?: 'sample' | 'population';
}

export interface StandardDeviationResult {
  sampleStandardDeviation: number;
  populationStandardDeviation: number;
  sampleVariance: number;
  populationVariance: number;
  mean: number;
  median: number;
  count: number;
  sum: number;
  sumOfSquares: number;
  formattedSampleSd: string;
  formattedPopSd: string;
  formattedMean: string;
}

export const SD_FORMULA_ID = 'formula-math-standard-deviation-v1.0.0';
export const SD_FORMULA_VERSION = '1.0.0';

export function calculateStandardDeviation(input: StandardDeviationInput): CalculationOutcome<StandardDeviationResult> {
  const rawData = input.dataset;
  if (!rawData || !rawData.trim()) {
    return createErrorOutcome(SD_FORMULA_ID, SD_FORMULA_VERSION, 'Please enter a dataset of numerical values separated by commas or spaces.', {});
  }

  // Parse numbers
  const tokens = rawData
    .replace(/,/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 0);

  const numbers: number[] = [];
  for (const t of tokens) {
    const num = Number(t);
    if (isNaN(num)) {
      return createErrorOutcome(SD_FORMULA_ID, SD_FORMULA_VERSION, `Encountered invalid numeric token: "${t}".`, {});
    }
    numbers.push(num);
  }

  const n = numbers.length;
  if (n < 2) {
    return createErrorOutcome(SD_FORMULA_ID, SD_FORMULA_VERSION, 'Dataset must contain at least 2 numbers to compute sample standard deviation.', { count: n });
  }

  const trace: CalculationStep[] = [];

  // Sum and Mean
  let sumDec = new Decimal(0);
  for (const num of numbers) {
    sumDec = sumDec.plus(num);
  }
  const meanDec = sumDec.div(n);
  const mean = meanDec.toNumber();

  // Sum of squared differences from mean: Σ (x - mean)²
  let sumSquaresDec = new Decimal(0);
  for (const num of numbers) {
    const diff = new Decimal(num).minus(meanDec);
    sumSquaresDec = sumSquaresDec.plus(diff.pow(2));
  }

  // Population Variance & SD: σ² = SS / N, σ = √σ²
  const popVarianceDec = sumSquaresDec.div(n);
  const popSd = Math.sqrt(popVarianceDec.toNumber());

  // Sample Variance & SD: s² = SS / (n - 1), s = √s²
  const sampleVarianceDec = sumSquaresDec.div(n - 1);
  const sampleSd = Math.sqrt(sampleVarianceDec.toNumber());

  // Median
  const sorted = [...numbers].sort((a, b) => a - b);
  let median: number;
  const mid = Math.floor(n / 2);
  if (n % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  const round4 = (v: number) => new Decimal(v).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toNumber();

  trace.push({
    stepNumber: 1,
    label: 'Compute Sample Arithmetic Mean',
    expression: `Sum(${numbers.slice(0, 5).join(' + ')}${n > 5 ? ' + ...' : ''}) ÷ ${n}`,
    result: `Mean (x̄) = ${round4(mean)}`,
    explanation: 'Central tendency average of all data points.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Sum of Squared Deviations (SS)',
    expression: `Σ(xᵢ - ${round4(mean)})²`,
    result: `SS = ${round4(sumSquaresDec.toNumber())}`,
    explanation: 'Dispersion metric measuring squared distances from sample mean.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Compute Sample & Population Standard Deviations',
    expression: `Sample: √(SS ÷ (${n}-1)) = ${round4(sampleSd)}; Population: √(SS ÷ ${n}) = ${round4(popSd)}`,
    result: `s = ${round4(sampleSd)}, σ = ${round4(popSd)}`,
    explanation: 'Bessel-corrected sample standard deviation (n-1) and population standard deviation (N).',
  });

  return {
    status: 'success',
    value: {
      sampleStandardDeviation: round4(sampleSd),
      populationStandardDeviation: round4(popSd),
      sampleVariance: round4(sampleVarianceDec.toNumber()),
      populationVariance: round4(popVarianceDec.toNumber()),
      mean: round4(mean),
      median: round4(median),
      count: n,
      sum: round4(sumDec.toNumber()),
      sumOfSquares: round4(sumSquaresDec.toNumber()),
      formattedSampleSd: round4(sampleSd).toString(),
      formattedPopSd: round4(popSd).toString(),
      formattedMean: round4(mean).toString(),
    },
    normalizedInputs: {
      count: n,
      datasetLength: rawData.length,
    },
    appliedDefaults: [],
    formulaId: SD_FORMULA_ID,
    formulaVersion: SD_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
