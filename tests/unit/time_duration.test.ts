import { describe, it, expect } from 'vitest';
import { calculateTimeDuration } from '../../src/lib/calculations/time_duration';

describe('Time Duration Calculator Engine', () => {
  it('correctly calculates duration between 2026-01-01 and 2026-01-15 (Golden Dataset)', () => {
    const outcome = calculateTimeDuration({
      startDate: '2026-01-01',
      endDate: '2026-01-15',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.totalDays).toBe(14);
      expect(outcome.value.totalHours).toBe(336);
      expect(outcome.value.breakdown.days).toBe(14);
      // Jan 1, 2026 is Thursday. 14 days later is Thursday Jan 15.
      // Week 1: Thu, Fri (2 days), Sat, Sun (2 days)
      // Week 2: Mon, Tue, Wed, Thu, Fri (5 days), Sat, Sun (2 days)
      // Jan 15: (0 to 14 days span)
      expect(outcome.value.businessDays).toBe(10);
      expect(outcome.value.weekendDays).toBe(4);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates inclusive duration with hours and minutes', () => {
    const outcome = calculateTimeDuration({
      startDate: '2026-03-01',
      startTime: '09:00',
      endDate: '2026-03-01',
      endTime: '17:30',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.totalHours).toBe(8);
      expect(outcome.value.totalMinutes).toBe(510);
      expect(outcome.value.breakdown.hours).toBe(8);
      expect(outcome.value.breakdown.minutes).toBe(30);
    }
  });

  it('rejects end date before start date or malformed strings', () => {
    expect(calculateTimeDuration({ startDate: '2026-05-10', endDate: '2026-05-01' }).status).toBe('invalid');
    expect(calculateTimeDuration({ startDate: 'not-a-date', endDate: '2026-05-01' }).status).toBe('invalid');
  });
});
