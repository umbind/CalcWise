import { describe, it, expect } from 'vitest';
import { calculateCd } from '../../src/lib/calculations/cd';

describe('Certificate of Deposit (CD) Calculator Engine', () => {
  it('correctly calculates 12-month CD with $10,000 at 5% compounded monthly', () => {
    const outcome = calculateCd({
      initialDeposit: 10000,
      interestRate: 5.0,
      termMonths: 12,
      compoundFrequency: 'monthly',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 10000 * (1 + 0.05/12)^12 = 10511.62
      expect(outcome.value.endBalance).toBeCloseTo(10511.62, 1);
      expect(outcome.value.totalInterest).toBeCloseTo(511.62, 1);
      expect(outcome.value.effectiveApy).toBeCloseTo(5.12, 1);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly calculates 60-month CD with daily compounding', () => {
    const outcome = calculateCd({
      initialDeposit: 25000,
      interestRate: 4.5,
      termMonths: 60,
      compoundFrequency: 'daily',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.endBalance).toBeGreaterThan(31000);
      expect(outcome.value.totalInterest).toBeGreaterThan(6000);
    }
  });

  it('rejects invalid inputs like negative deposit or zero term', () => {
    expect(calculateCd({ initialDeposit: -100, interestRate: 5, termMonths: 12 }).status).toBe('invalid');
    expect(calculateCd({ initialDeposit: 5000, interestRate: 5, termMonths: 0 }).status).toBe('invalid');
  });
});
