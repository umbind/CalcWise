import { describe, it, expect } from 'vitest';
import { calculateEmi } from '@/lib/calculations/emi';

describe('EMI / Loan Calculator Engine', () => {
  it('correctly calculates reducing EMI for standard mortgage/loan (Golden Dataset)', () => {
    // 100,000 at 8.5% for 10 years (120 months)
    // Formula standard benchmark: EMI ~ 1,239.86
    const out = calculateEmi({
      principal: 100000,
      annualInterestRate: 8.5,
      tenureMonths: 120,
    });

    expect(out.status).toBe('success');
    expect(out.value).toBeDefined();
    // Monthly payment should be within 1 cent of 1239.86
    expect(Math.abs(out.value!.monthlyPayment - 1239.86)).toBeLessThanOrEqual(0.01);
    expect(out.value!.totalRepayment).toBeGreaterThan(100000);
    expect(out.value!.schedule.length).toBe(120);

    // Final month remaining balance must be zero
    const lastRow = out.value!.schedule[out.value!.schedule.length - 1];
    expect(lastRow.remainingBalance).toBe(0);
  });

  it('correctly handles 0% interest rate loan', () => {
    // 12,000 at 0% for 12 months = 1,000 / month
    const out = calculateEmi({
      principal: 12000,
      annualInterestRate: 0,
      tenureMonths: 12,
    });

    expect(out.status).toBe('success');
    expect(out.value?.monthlyPayment).toBe(1000);
    expect(out.value?.totalInterest).toBe(0);
    expect(out.value?.totalRepayment).toBe(12000);
  });

  it('rejects invalid inputs (negative principal, negative rate, zero tenure)', () => {
    expect(calculateEmi({ principal: -5000, annualInterestRate: 5, tenureMonths: 12 }).status).toBe('invalid');
    expect(calculateEmi({ principal: 5000, annualInterestRate: -2, tenureMonths: 12 }).status).toBe('invalid');
    expect(calculateEmi({ principal: 5000, annualInterestRate: 5, tenureMonths: 0 }).status).toBe('invalid');
  });
});
