import { describe, it, expect } from 'vitest';
import { calculateFraction } from '@/lib/calculations/fraction';

describe('Fraction Calculator Engine', () => {
  it('correctly adds fractions and simplifies (Golden Dataset)', () => {
    // 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2
    const out = calculateFraction({ num1: 1, den1: 3, op: 'add', num2: 1, den2: 6 });
    expect(out.status).toBe('success');
    expect(out.value?.numerator).toBe(1);
    expect(out.value?.denominator).toBe(2);
    expect(out.value?.formattedResult).toBe('1/2');
    expect(out.value?.decimalValue).toBe(0.5);
  });

  it('correctly multiplies fractions and handles mixed numbers', () => {
    // 3/2 * 5/3 = 15/6 = 5/2 = 2 1/2
    const out = calculateFraction({ num1: 3, den1: 2, op: 'multiply', num2: 5, den2: 3 });
    expect(out.value?.formattedResult).toBe('5/2');
    expect(out.value?.mixedNumber).toBe('2 1/2');
  });

  it('correctly divides fractions (invert and multiply)', () => {
    // 2/3 / 4/5 = 2/3 * 5/4 = 10/12 = 5/6
    const out = calculateFraction({ num1: 2, den1: 3, op: 'divide', num2: 4, den2: 5 });
    expect(out.value?.formattedResult).toBe('5/6');
  });

  it('rejects division by zero denominator or division by zero fraction', () => {
    expect(calculateFraction({ num1: 1, den1: 0, op: 'add', num2: 1, den2: 2 }).status).toBe('invalid');
    expect(calculateFraction({ num1: 1, den1: 2, op: 'divide', num2: 0, den2: 1 }).status).toBe('invalid');
  });
});
