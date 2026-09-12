import { describe, it, expect } from 'vitest';
import { calculateRoi } from '../../src/lib/calculations/roi';

describe('ROI Calculator Engine', () => {
  it('correctly calculates positive return and annualized ROI (Golden Dataset)', () => {
    const outcome = calculateRoi({
      initialInvestment: 10000,
      finalValue: 15000,
      investmentPeriodYears: 3,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.netProfit).toBe(5000);
      expect(outcome.value.roiPercentage).toBe(50);
      expect(outcome.value.formattedNetProfit).toBe('$5,000.00');
      expect(outcome.value.formattedRoiPercentage).toBe('50.00%');
      // CAGR for 1.5^(1/3) - 1 = 14.47%
      expect(outcome.value.annualizedRoiPercentage).toBeCloseTo(14.47, 1);
    }
  });

  it('correctly calculates negative return (loss)', () => {
    const outcome = calculateRoi({
      initialInvestment: 20000,
      finalValue: 16000,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.netProfit).toBe(-4000);
      expect(outcome.value.roiPercentage).toBe(-20);
    }
  });

  it('rejects invalid inputs such as negative or zero initial investment', () => {
    expect(calculateRoi({ initialInvestment: 0, finalValue: 1000 }).status).toBe('invalid');
    expect(calculateRoi({ initialInvestment: -500, finalValue: 1000 }).status).toBe('invalid');
  });
});
