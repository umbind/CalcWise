import { describe, it, expect } from 'vitest';
import { calculateAge } from '@/lib/calculations/age';

describe('Age Calculator Engine', () => {
  it('correctly calculates exact chronological age across leap years (Golden Dataset)', () => {
    // Birth: 2000-02-29 (Leap year leap day)
    // As of: 2024-03-01 -> 24 years, 0 months, 1 day
    const out = calculateAge({ birthDate: '2000-02-29', asOfDate: '2024-03-01' });
    expect(out.status).toBe('success');
    expect(out.value?.years).toBe(24);
    expect(out.value?.months).toBe(0);
    expect(out.value?.days).toBe(1);
    expect(out.value?.birthDayOfWeek).toBe('Tuesday');
  });

  it('correctly calculates next birthday countdown', () => {
    const out = calculateAge({ birthDate: '1995-06-15', asOfDate: '2024-06-10' });
    expect(out.value?.daysUntilNextBirthday).toBe(5);
  });

  it('rejects future birth dates or invalid date formats', () => {
    expect(calculateAge({ birthDate: '2050-01-01', asOfDate: '2024-01-01' }).status).toBe('invalid');
    expect(calculateAge({ birthDate: 'invalid-date' }).status).toBe('invalid');
  });
});
