import { describe, it, expect } from 'vitest';
import { calculateLogarithm } from '../../src/lib/calculations/logarithm';

describe('Logarithm Calculator Engine', () => {
  it('correctly calculates log10(1000) = 3 (Golden Dataset)', () => {
    const outcome = calculateLogarithm({
      value: 1000,
      base: 10,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.result).toBe(3);
      expect(outcome.value.commonLog).toBe(3);
      expect(outcome.value.binaryLog).toBeCloseTo(9.965784, 5);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly calculates natural log ln(e) = 1', () => {
    const outcome = calculateLogarithm({
      value: Math.E,
      base: 'e',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.result).toBe(1);
      expect(outcome.value.naturalLog).toBe(1);
    }
  });

  it('correctly calculates binary log log2(64) = 6', () => {
    const outcome = calculateLogarithm({
      value: 64,
      base: 2,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.result).toBe(6);
      expect(outcome.value.binaryLog).toBe(6);
    }
  });

  it('rejects non-positive arguments or invalid bases (<= 0 or == 1)', () => {
    expect(calculateLogarithm({ value: 0 }).status).toBe('invalid');
    expect(calculateLogarithm({ value: -5 }).status).toBe('invalid');
    expect(calculateLogarithm({ value: 10, base: 1 }).status).toBe('invalid');
    expect(calculateLogarithm({ value: 10, base: 0 }).status).toBe('invalid');
  });
});
