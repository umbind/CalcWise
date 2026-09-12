import { describe, it, expect } from 'vitest';
import { calculateCalories } from '@/lib/calculations/calorie';

describe('Calorie & TDEE Calculator Engine', () => {
  it('correctly calculates TDEE for moderate activity (Golden Dataset)', () => {
    // Male, 25 yo, 75 kg, 180 cm -> BMR = 1755 kcal
    // Moderate activity (1.55x) -> TDEE = 1755 * 1.55 = 2720.25 -> 2720 kcal
    const out = calculateCalories({
      sex: 'male',
      age: 25,
      unitSystem: 'metric',
      weightKg: 75,
      heightCm: 180,
      activityLevel: 'moderate',
    });

    expect(out.status).toBe('success');
    expect(out.value?.bmr).toBe(1755);
    expect(out.value?.tdee).toBe(2720);
    expect(out.value?.targets.weightLoss).toBe(2220); // 2720 - 500
    expect(out.value?.targets.weightGain).toBe(3220); // 2720 + 500
  });

  it('enforces safety floor on extreme calorie deficit (at least 1200 kcal)', () => {
    // Female, 65 yo, 45 kg, 150 cm -> low BMR (~950 kcal), sedentary (1.2x) -> TDEE ~ 1140 kcal
    const out = calculateCalories({
      sex: 'female',
      age: 65,
      unitSystem: 'metric',
      weightKg: 45,
      heightCm: 150,
      activityLevel: 'sedentary',
    });

    // Extreme deficit should not dip below clinical floor of 1200 kcal
    expect(out.value?.targets.extremeWeightLoss).toBeGreaterThanOrEqual(1200);
  });
});
