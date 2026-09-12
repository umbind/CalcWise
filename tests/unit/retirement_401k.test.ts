import { describe, it, expect } from 'vitest';
import { calculate401k } from '../../src/lib/calculations/retirement_401k';

describe('401(k) Retirement Calculator Engine', () => {
  it('correctly calculates retirement nest egg for age 30 to 65 with salary and match', () => {
    const outcome = calculate401k({
      currentAge: 30,
      retirementAge: 65,
      currentBalance: 50000,
      annualSalary: 80000,
      salaryGrowthRate: 2.0,
      employeeContributionPct: 8,
      employerMatchPct: 50,
      employerMatchCapPct: 6,
      annualReturnRate: 7.0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.yearsToRetirement).toBe(35);
      expect(outcome.value.totalBalanceAtRetirement).toBeGreaterThan(1500000);
      expect(outcome.value.totalEmployeeContributions).toBeGreaterThan(250000);
      expect(outcome.value.totalEmployerContributions).toBeGreaterThan(100000);
      expect(outcome.value.estimatedMonthlyRetirementIncome).toBeGreaterThan(5000);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('rejects invalid inputs like retirementAge <= currentAge or negative salary', () => {
    expect(calculate401k({ currentAge: 40, retirementAge: 35, annualSalary: 70000, employeeContributionPct: 6, annualReturnRate: 7 }).status).toBe('invalid');
    expect(calculate401k({ currentAge: 30, retirementAge: 65, annualSalary: -5000, employeeContributionPct: 6, annualReturnRate: 7 }).status).toBe('invalid');
  });
});
