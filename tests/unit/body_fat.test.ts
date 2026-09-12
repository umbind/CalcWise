import { describe, it, expect } from 'vitest';
import { calculateBodyFat } from '../../src/lib/calculations/body_fat';

describe('Body Fat Calculator Engine (US Navy)', () => {
  it('correctly calculates body fat for male: 180cm, 80kg, waist 88cm, neck 38cm', () => {
    const outcome = calculateBodyFat({
      gender: 'male',
      heightCm: 180,
      weightKg: 80,
      waistCm: 88,
      neckCm: 38,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Typically ~17-18%
      expect(outcome.value.bodyFatPercentage).toBeGreaterThanOrEqual(16);
      expect(outcome.value.bodyFatPercentage).toBeLessThanOrEqual(19);
      expect(outcome.value.fatMassKg).toBeGreaterThan(12);
      expect(outcome.value.leanMassKg).toBeGreaterThan(60);
      expect(outcome.value.category).toBe('Average');
    }
  });

  it('correctly calculates body fat for female: 165cm, 62kg, waist 72cm, neck 32cm, hip 96cm', () => {
    const outcome = calculateBodyFat({
      gender: 'female',
      heightCm: 165,
      weightKg: 62,
      waistCm: 72,
      neckCm: 32,
      hipCm: 96,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Typically ~23-26%
      expect(outcome.value.bodyFatPercentage).toBeGreaterThanOrEqual(22);
      expect(outcome.value.bodyFatPercentage).toBeLessThanOrEqual(27);
      expect(outcome.value.category).toMatch(/Fitness|Average/);
    }
  });

  it('rejects invalid inputs like waist <= neck for male', () => {
    expect(calculateBodyFat({
      gender: 'male',
      heightCm: 180,
      weightKg: 80,
      waistCm: 35,
      neckCm: 38,
    }).status).toBe('invalid');
  });
});
