import { describe, it, expect } from 'vitest';
import { calculateSimpleInterest } from '@/lib/calculations/simple_interest';

describe('Simple Interest Calculator Engine', () => {
  it('calculates simple interest accurately (Golden Dataset)', () => {
    // 10,000 at 5% for 3 years: I = (10000 * 5 * 3) / 100 = 1500; Total = 11,500
    const out = calculateSimpleInterest({ principal: 10000, annualRate: 5, timeYears: 3 });
    expect(out.status).toBe('success');
    expect(out.value?.interestEarned).toBe(1500);
    expect(out.value?.totalRepayment).toBe(11500);
  });

  it('handles zero interest rate or zero time', () => {
    const out = calculateSimpleInterest({ principal: 5000, annualRate: 0, timeYears: 5 });
    expect(out.value?.interestEarned).toBe(0);
    expect(out.value?.totalRepayment).toBe(5000);
  });

  it('rejects negative values', () => {
    expect(calculateSimpleInterest({ principal: -100, annualRate: 5, timeYears: 1 }).status).toBe('invalid');
  });
});
