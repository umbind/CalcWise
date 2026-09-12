import { describe, it, expect } from 'vitest';
import { calculateTip } from '@/lib/calculations/tip';

describe('Tip Calculator Engine', () => {
  it('correctly calculates 20% tip on $85.00 bill split 2 ways (Golden Dataset)', () => {
    // 85 * 0.20 = $17.00 tip; Total = $102.00
    // Per person: $51.00 total, $8.50 tip
    const out = calculateTip({ billAmount: 85, tipPercentage: 20, numberOfPeople: 2 });
    expect(out.status).toBe('success');
    expect(out.value?.tipAmount).toBe(17);
    expect(out.value?.totalBill).toBe(102);
    expect(out.value?.totalPerPerson).toBe(51);
    expect(out.value?.tipPerPerson).toBe(8.5);
  });

  it('correctly rounds up to nearest dollar', () => {
    // Bill $42.30 with 15% tip ($6.345 -> $6.35) = $48.65
    // Rounded up = $49.00 (tip becomes $6.70)
    const out = calculateTip({ billAmount: 42.3, tipPercentage: 15, roundUpToNearestDollar: true });
    expect(out.value?.totalBill).toBe(49);
    expect(out.value?.tipAmount).toBe(6.7);
  });

  it('rejects negative bill amounts or invalid people counts', () => {
    expect(calculateTip({ billAmount: -20, tipPercentage: 15 }).status).toBe('invalid');
    expect(calculateTip({ billAmount: 50, tipPercentage: 15, numberOfPeople: 0 }).status).toBe('invalid');
  });
});
