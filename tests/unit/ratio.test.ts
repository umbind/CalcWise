import { describe, it, expect } from 'vitest';
import { calculateRatio } from '../../src/lib/calculations/ratio';

describe('Ratio & Proportion Calculator Engine', () => {
  it('correctly solves for D in 3 : 5 = 6 : D (Golden Dataset)', () => {
    const outcome = calculateRatio({
      a: 3,
      b: 5,
      c: 6,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.solvedVariable).toBe('D');
      expect(outcome.value.d).toBe(10);
      expect(outcome.value.simplifiedRatio).toBe('3 : 5');
      expect(outcome.value.decimalEquivalent).toBe(0.6);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly simplifies 24 : 36 to 2 : 3', () => {
    const outcome = calculateRatio({
      a: 24,
      b: 36,
      c: 2,
      d: 3,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.simplifiedRatio).toBe('2 : 3');
      expect(outcome.value.decimalEquivalent).toBeCloseTo(0.6667, 3);
    }
  });

  it('rejects fewer than 3 values or division by zero', () => {
    expect(calculateRatio({ a: 3, b: 5 }).status).toBe('invalid');
    expect(calculateRatio({ a: 0, b: 5, c: 10 }).status).toBe('invalid');
  });
});
