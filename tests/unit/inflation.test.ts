import { describe, it, expect } from 'vitest';
import { calculateInflation } from '../../src/lib/calculations/inflation';

describe('Inflation Calculator Engine', () => {
  it('correctly calculates future cost and purchasing power for $1,000 at 3% over 10 years (Golden Dataset)', () => {
    const outcome = calculateInflation({
      initialAmount: 1000,
      annualInflationRate: 3.0,
      years: 10,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 1000 * (1.03)^10 = 1343.92
      expect(outcome.value.equivalentFutureCost).toBeCloseTo(1343.92, 1);
      // 1000 / (1.03)^10 = 744.09
      expect(outcome.value.futurePurchasingPowerOfSameAmount).toBeCloseTo(744.09, 1);
      expect(outcome.value.cumulativeInflationPct).toBeCloseTo(34.39, 1);
      expect(outcome.value.purchasingPowerLossPct).toBeCloseTo(25.59, 1);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('rejects invalid inputs like zero amount or negative years', () => {
    expect(calculateInflation({ initialAmount: 0, annualInflationRate: 3, years: 10 }).status).toBe('invalid');
    expect(calculateInflation({ initialAmount: 1000, annualInflationRate: 3, years: 0 }).status).toBe('invalid');
  });
});
