import { describe, it, expect } from 'vitest';
import { calculateSalary } from '@/lib/calculations/salary';

describe('Salary & Wage Converter Engine', () => {
  it('correctly converts hourly to annual salary (Golden Dataset)', () => {
    // $25/hr at 40 hrs/wk, 52 wks/yr = $52,000/yr
    const out = calculateSalary({ amount: 25, frequency: 'hourly', hoursPerWeek: 40, weeksPerYear: 52 });
    expect(out.status).toBe('success');
    expect(out.value?.annual).toBe(52000);
    expect(out.value?.weekly).toBe(1000);
    expect(out.value?.biWeekly).toBe(2000);
    expect(out.value?.monthly).toBeCloseTo(4333.33, 1);
  });

  it('correctly converts annual to hourly wage', () => {
    // $100,000/yr at 40 hrs/wk (2,080 hrs) ~ $48.08/hr
    const out = calculateSalary({ amount: 100000, frequency: 'annual', hoursPerWeek: 40, weeksPerYear: 52 });
    expect(out.value?.hourly).toBeCloseTo(48.08, 1);
  });

  it('rejects negative salary or impossible hours', () => {
    expect(calculateSalary({ amount: -50, frequency: 'hourly' }).status).toBe('invalid');
    expect(calculateSalary({ amount: 50, frequency: 'hourly', hoursPerWeek: 200 }).status).toBe('invalid');
  });
});
