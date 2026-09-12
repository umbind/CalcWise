import { describe, it, expect } from 'vitest';
import { calculateBmr } from '@/lib/calculations/bmr';

describe('BMR Calculator Engine', () => {
  it('correctly calculates male BMR using Mifflin-St Jeor (Golden Dataset)', () => {
    // Male, 25 yo, 75 kg, 180 cm
    // (10 * 75) + (6.25 * 180) - (5 * 25) + 5 = 750 + 1125 - 125 + 5 = 1755 kcal
    const out = calculateBmr({
      sex: 'male',
      age: 25,
      unitSystem: 'metric',
      weightKg: 75,
      heightCm: 180,
    });

    expect(out.status).toBe('success');
    expect(out.value?.bmrMifflin).toBe(1755);
  });

  it('correctly calculates female BMR using Mifflin-St Jeor (Golden Dataset)', () => {
    // Female, 30 yo, 60 kg, 165 cm
    // (10 * 60) + (6.25 * 165) - (5 * 30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320 kcal
    const out = calculateBmr({
      sex: 'female',
      age: 30,
      unitSystem: 'metric',
      weightKg: 60,
      heightCm: 165,
    });

    expect(out.status).toBe('success');
    expect(out.value?.bmrMifflin).toBe(1320);
  });

  it('rejects invalid biological ages', () => {
    expect(calculateBmr({ sex: 'male', age: 10, unitSystem: 'metric', weightKg: 50, heightCm: 150 }).status).toBe('invalid');
  });
});
