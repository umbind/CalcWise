import { describe, it, expect } from 'vitest';
import { calculatePercentage } from '@/lib/calculations/percentage';

describe('Percentage Calculator Engine', () => {
  it('correctly calculates percent_of (Golden Dataset)', () => {
    // 20% of 500 = 100
    const out = calculatePercentage({ mode: 'percent_of', valA: 20, valB: 500 });
    expect(out.status).toBe('success');
    expect(out.value?.result).toBe(100);
    expect(out.trace.length).toBeGreaterThan(0);
  });

  it('correctly calculates what_percent (Golden Dataset)', () => {
    // 25 is what percent of 200 = 12.5%
    const out = calculatePercentage({ mode: 'what_percent', valA: 25, valB: 200 });
    expect(out.status).toBe('success');
    expect(out.value?.result).toBe(12.5);
  });

  it('handles division by zero in what_percent', () => {
    const out = calculatePercentage({ mode: 'what_percent', valA: 25, valB: 0 });
    expect(out.status).toBe('invalid');
    expect(out.warnings[0].message).toContain('Cannot divide by zero');
  });

  it('correctly calculates percentage_change (increase & decrease)', () => {
    // 100 to 150 = +50%
    const inc = calculatePercentage({ mode: 'percentage_change', valA: 100, valB: 150 });
    expect(inc.status).toBe('success');
    expect(inc.value?.result).toBe(50);

    // 200 to 150 = -25%
    const dec = calculatePercentage({ mode: 'percentage_change', valA: 200, valB: 150 });
    expect(dec.status).toBe('success');
    expect(dec.value?.result).toBe(-25);
  });

  it('correctly calculates percentage_increase and decrease', () => {
    // 50 increased by 10% = 55
    const inc = calculatePercentage({ mode: 'percentage_increase', valA: 50, valB: 10 });
    expect(inc.status).toBe('success');
    expect(inc.value?.result).toBe(55);

    // 80 decreased by 25% = 60
    const dec = calculatePercentage({ mode: 'percentage_decrease', valA: 80, valB: 25 });
    expect(dec.status).toBe('success');
    expect(dec.value?.result).toBe(60);
  });
});
