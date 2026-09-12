import { describe, it, expect } from 'vitest';
import { calculateExponent } from '../../src/lib/calculations/exponent';

describe('Exponent Calculator Engine', () => {
  it('correctly calculates positive integer power: 2^8 = 256 (Golden Dataset)', () => {
    const outcome = calculateExponent({
      base: 2,
      exponent: 8,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.resultNumber).toBe(256);
      expect(outcome.value.formattedResult).toBe('256');
      expect(outcome.trace.length).toBe(1);
    }
  });

  it('correctly calculates negative exponent: 5^-2 = 0.04', () => {
    const outcome = calculateExponent({
      base: 5,
      exponent: -2,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.resultNumber).toBe(0.04);
      expect(outcome.value.isNegativeExponent).toBe(true);
    }
  });

  it('correctly calculates fractional exponent: 27^(1/3) = 3', () => {
    const outcome = calculateExponent({
      base: 27,
      exponent: 1 / 3,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.resultNumber).toBeCloseTo(3, 5);
      expect(outcome.value.isFractionalExponent).toBe(true);
    }
  });

  it('rejects division by zero or negative base with fractional exponent', () => {
    expect(calculateExponent({ base: 0, exponent: -2 }).status).toBe('invalid');
    expect(calculateExponent({ base: -4, exponent: 0.5 }).status).toBe('invalid');
  });
});
