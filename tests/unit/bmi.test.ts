import { describe, it, expect } from 'vitest';
import { calculateBmi } from '@/lib/calculations/bmi';

describe('BMI Calculator Engine (Risk Tier T2)', () => {
  it('correctly calculates Metric BMI (Golden Dataset)', () => {
    // 70 kg, 175 cm = 22.86 -> 22.9 Normal Weight
    const out = calculateBmi({
      unitSystem: 'metric',
      weightKg: 70,
      heightCm: 175,
    });

    expect(out.status).toBe('success');
    expect(out.value?.bmi).toBe(22.9);
    expect(out.value?.category.categoryCode).toBe('normal');
    expect(out.value?.healthyWeightRange.minWeightKg).toBeGreaterThan(50);
    expect(out.value?.healthyWeightRange.maxWeightKg).toBeLessThan(80);
    expect(out.value?.disclaimer).toContain('Informational screening only');
  });

  it('correctly calculates Imperial BMI (Golden Dataset)', () => {
    // 160 lbs, 5 ft 10 in (70 in) -> ~22.95 -> 23.0 Normal Weight
    const out = calculateBmi({
      unitSystem: 'imperial',
      weightLbs: 160,
      heightFeet: 5,
      heightInches: 10,
    });

    expect(out.status).toBe('success');
    expect(out.value?.bmi).toBe(23.0);
    expect(out.value?.category.categoryCode).toBe('normal');
  });

  it('classifies overweight and obese thresholds correctly', () => {
    // 95 kg, 175 cm = 95 / 3.0625 = 31.0 -> Obese Class I
    const obeseOut = calculateBmi({
      unitSystem: 'metric',
      weightKg: 95,
      heightCm: 175,
    });
    expect(obeseOut.value?.bmi).toBe(31.0);
    expect(obeseOut.value?.category.categoryCode).toBe('obese_1');
  });

  it('rejects biologically impossible or out-of-range inputs', () => {
    expect(calculateBmi({ unitSystem: 'metric', weightKg: 2, heightCm: 175 }).status).toBe('invalid');
    expect(calculateBmi({ unitSystem: 'metric', weightKg: 70, heightCm: 10 }).status).toBe('invalid');
  });
});
