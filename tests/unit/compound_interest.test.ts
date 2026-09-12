import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest } from '@/lib/calculations/compound_interest';

describe('Compound Interest Calculator Engine', () => {
  it('correctly calculates compounding without monthly contributions (Golden Dataset)', () => {
    // 10,000 at 7% compounded monthly for 10 years ~ 20,096.61
    const out = calculateCompoundInterest({
      initialPrincipal: 10000,
      annualInterestRate: 7,
      years: 10,
      monthlyContribution: 0,
      compoundingFrequency: 'monthly',
    });

    expect(out.status).toBe('success');
    expect(out.value).toBeDefined();
    expect(out.value!.futureValue).toBeCloseTo(20096.61, 0);
    expect(out.value!.totalPrincipal).toBe(10000);
    expect(out.value!.growthSchedule.length).toBe(10);
  });

  it('correctly handles zero interest scenario', () => {
    // 5,000 with 100/month for 5 years at 0% = 5,000 + 6,000 = 11,000
    const out = calculateCompoundInterest({
      initialPrincipal: 5000,
      annualInterestRate: 0,
      years: 5,
      monthlyContribution: 100,
    });

    expect(out.status).toBe('success');
    expect(out.value?.totalContributions).toBe(6000);
    expect(out.value?.futureValue).toBe(11000);
    expect(out.value?.totalInterest).toBe(0);
  });

  it('rejects negative rates or negative terms', () => {
    expect(calculateCompoundInterest({ initialPrincipal: 1000, annualInterestRate: -5, years: 10 }).status).toBe('invalid');
    expect(calculateCompoundInterest({ initialPrincipal: 1000, annualInterestRate: 5, years: 0 }).status).toBe('invalid');
  });
});
