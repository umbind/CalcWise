import { describe, it, expect } from 'vitest';
import { calculatePregnancyDueDate } from '../../src/lib/calculations/pregnancy_due_date';

describe('Pregnancy Due Date Calculator Engine', () => {
  it('correctly calculates 280-day due date from LMP with standard 28-day cycle (Golden Dataset)', () => {
    const outcome = calculatePregnancyDueDate({
      lastMenstrualPeriod: '2026-01-01',
      cycleLengthDays: 28,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 2026-01-01 + 280 days is October 8, 2026
      expect(outcome.value.estimatedDueDateIso).toBe('2026-10-08');
      expect(outcome.value.formattedDueDate).toContain('Oct 8, 2026');
      expect(outcome.value.milestones.length).toBe(4);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly adjusts due date for a 32-day menstrual cycle (+4 days)', () => {
    const outcome = calculatePregnancyDueDate({
      lastMenstrualPeriod: '2026-01-01',
      cycleLengthDays: 32,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 2026-01-01 + 284 days is October 12, 2026
      expect(outcome.value.estimatedDueDateIso).toBe('2026-10-12');
    }
  });

  it('rejects invalid date formats or future dates', () => {
    expect(calculatePregnancyDueDate({ lastMenstrualPeriod: 'invalid-date' }).status).toBe('invalid');
    expect(calculatePregnancyDueDate({ lastMenstrualPeriod: '2099-01-01' }).status).toBe('invalid');
  });
});
