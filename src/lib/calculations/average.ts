import { Decimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface AverageInput {
  rawDataset: string;
}

export interface AverageResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  modeDescription: string;
  min: number;
  max: number;
  range: number;
  sampleStandardDeviation: number;
  populationStandardDeviation: number;
  sortedValues: number[];
  formattedMean: string;
  formattedMedian: string;
}

export const AVERAGE_FORMULA_ID = 'formula-descriptive-statistics-v1.0.0';
export const AVERAGE_FORMULA_VERSION = '1.0.0';

export function calculateAverage(input: AverageInput): CalculationOutcome<AverageResult> {
  // Parse numbers from raw input separated by comma, space, newline, or semicolon
  const tokens = input.rawDataset
    .split(/[\s,;\n\t]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const numbers: number[] = [];
  for (const token of tokens) {
    const num = Number(token);
    if (isNaN(num) || !isFinite(num)) {
      return createErrorOutcome(AVERAGE_FORMULA_ID, AVERAGE_FORMULA_VERSION, `Invalid number in dataset: "${token}"`);
    }
    numbers.push(num);
  }

  if (numbers.length === 0) {
    return createErrorOutcome(AVERAGE_FORMULA_ID, AVERAGE_FORMULA_VERSION, 'Please enter at least one valid number.');
  }

  const trace: CalculationStep[] = [];
  const n = numbers.length;

  // Sum
  let sumDec = new Decimal(0);
  for (const num of numbers) {
    sumDec = sumDec.plus(num);
  }
  const sum = sumDec.toNumber();

  // Mean = Sum / N
  const meanDec = sumDec.div(n).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
  const mean = meanDec.toNumber();

  trace.push({
    stepNumber: 1,
    label: 'Calculate Sum of Dataset',
    expression: `Sum of ${n} numbers`,
    result: sum.toString(),
    explanation: 'Sum all values in the dataset.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Mean (Arithmetic Average)',
    expression: `${sum.toString()} ÷ ${n}`,
    result: meanDec.toString(),
    explanation: 'Divide total sum by the count of elements (N).',
  });

  // Sort values
  const sorted = [...numbers].sort((a, b) => a - b);

  // Median
  let median: number;
  if (n % 2 === 1) {
    median = sorted[Math.floor(n / 2)];
  } else {
    const mid1 = sorted[n / 2 - 1];
    const mid2 = sorted[n / 2];
    median = Number(new Decimal(mid1).plus(mid2).div(2).toFixed(4));
  }

  trace.push({
    stepNumber: 3,
    label: 'Calculate Median',
    expression: `Middle element of sorted dataset`,
    result: median.toString(),
    explanation: n % 2 === 1 ? 'Single middle value of sorted set.' : 'Average of the two middle values.',
  });

  // Mode & frequency count
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  for (const num of numbers) {
    const count = (freqMap.get(num) || 0) + 1;
    freqMap.set(num, count);
    if (count > maxFreq) maxFreq = count;
  }

  let modes: number[] = [];
  let modeDesc = 'No unique mode (all values appear with equal frequency)';
  if (maxFreq > 1) {
    modes = Array.from(freqMap.entries())
      .filter(([_, count]) => count === maxFreq)
      .map(([val]) => val)
      .sort((a, b) => a - b);
    
    if (modes.length === numbers.length) {
      modes = [];
      modeDesc = 'No mode (each value appears equally)';
    } else {
      modeDesc = modes.join(', ');
    }
  }

  // Min, Max, Range
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = Number(new Decimal(max).minus(min).toFixed(4));

  // Variance & Standard Deviation
  let sumSquaredDiffs = new Decimal(0);
  for (const num of numbers) {
    const diff = new Decimal(num).minus(meanDec);
    sumSquaredDiffs = sumSquaredDiffs.plus(diff.pow(2));
  }

  const popVariance = sumSquaredDiffs.div(n);
  const popStdDev = Number(popVariance.sqrt().toFixed(4));

  const sampleVariance = n > 1 ? sumSquaredDiffs.div(n - 1) : new Decimal(0);
  const sampleStdDev = n > 1 ? Number(sampleVariance.sqrt().toFixed(4)) : 0;

  return {
    status: 'success',
    value: {
      count: n,
      sum,
      mean,
      median,
      mode: modes,
      modeDescription: modeDesc,
      min,
      max,
      range,
      sampleStandardDeviation: sampleStdDev,
      populationStandardDeviation: popStdDev,
      sortedValues: sorted,
      formattedMean: mean.toString(),
      formattedMedian: median.toString(),
    },
    normalizedInputs: {
      count: n,
    },
    appliedDefaults: [],
    formulaId: AVERAGE_FORMULA_ID,
    formulaVersion: AVERAGE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
