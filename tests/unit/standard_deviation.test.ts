import { describe, it, expect } from 'vitest';
import { calculateStandardDeviation } from '../../src/lib/calculations/standard_deviation';

describe('Standard Deviation Calculator Engine', () => {
  it('correctly calculates sample and population SD for dataset [10, 12, 23, 23, 16, 23, 21, 16] (Golden Dataset)', () => {
    const outcome = calculateStandardDeviation({
      dataset: '10, 12, 23, 23, 16, 23, 21, 16',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.count).toBe(8);
      expect(outcome.value.sum).toBe(144);
      expect(outcome.value.mean).toBe(18);
      // Sum of squares = (10-18)^2 + (12-18)^2 + ... = 64 + 36 + 25 + 25 + 4 + 25 + 9 + 4 = 192
      expect(outcome.value.sumOfSquares).toBe(192);
      // Sample Variance = 192 / 7 = 27.4286
      expect(outcome.value.sampleVariance).toBeCloseTo(27.4286, 3);
      // Sample SD = sqrt(192/7) = 5.2372
      expect(outcome.value.sampleStandardDeviation).toBeCloseTo(5.2372, 3);
      // Population Variance = 192 / 8 = 24
      expect(outcome.value.populationVariance).toBe(24);
      // Population SD = sqrt(24) = 4.8990
      expect(outcome.value.populationStandardDeviation).toBeCloseTo(4.8990, 3);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly handles space-separated datasets', () => {
    const outcome = calculateStandardDeviation({
      dataset: '2 4 4 4 5 5 7 9',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.mean).toBe(5);
      expect(outcome.value.median).toBe(4.5);
      // Pop SD = 2
      expect(outcome.value.populationStandardDeviation).toBe(2);
    }
  });

  it('rejects datasets with fewer than 2 numbers or invalid non-numeric inputs', () => {
    expect(calculateStandardDeviation({ dataset: '42' }).status).toBe('invalid');
    expect(calculateStandardDeviation({ dataset: '10, apple, 30' }).status).toBe('invalid');
  });
});
