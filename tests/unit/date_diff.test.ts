import { describe, it, expect } from 'vitest';
import { calculateDateDifference } from '@/lib/calculations/date_diff';

describe('Date Difference Calculator Engine', () => {
  it('correctly calculates difference and business days (Golden Dataset)', () => {
    // 2024-01-01 (Mon) to 2024-01-08 (Mon) = 7 days (5 business days, 2 weekend days)
    const out = calculateDateDifference({ startDate: '2024-01-01', endDate: '2024-01-08' });
    expect(out.status).toBe('success');
    expect(out.value?.totalDays).toBe(7);
    expect(out.value?.totalWeeks).toBe(1);
    expect(out.value?.businessDays).toBe(5);
    expect(out.value?.weekendDays).toBe(2);
  });

  it('correctly handles includeEndDay toggle', () => {
    // 2024-01-01 to 2024-01-02 including end day = 2 days
    const out = calculateDateDifference({ startDate: '2024-01-01', endDate: '2024-01-02', includeEndDay: true });
    expect(out.value?.totalDays).toBe(2);
  });

  it('rejects invalid dates', () => {
    expect(calculateDateDifference({ startDate: 'bad-date', endDate: '2024-01-01' }).status).toBe('invalid');
  });
});
