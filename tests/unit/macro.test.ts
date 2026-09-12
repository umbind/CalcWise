import { describe, it, expect } from 'vitest';
import { calculateMacros } from '../../src/lib/calculations/macro';

describe('Macronutrient Split Calculator Engine', () => {
  it('correctly calculates maintenance split for 2,000 kcal diet (Golden Dataset)', () => {
    const outcome = calculateMacros({
      dailyCalories: 2000,
      goal: 'maintenance',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 30% Protein = 600 kcal / 4 = 150g
      expect(outcome.value.proteinGrams).toBe(150);
      // 40% Carbs = 800 kcal / 4 = 200g
      expect(outcome.value.carbsGrams).toBe(200);
      // 30% Fat = 600 kcal / 9 = 67g
      expect(outcome.value.fatGrams).toBe(67);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates keto split for 2,400 kcal diet', () => {
    const outcome = calculateMacros({
      dailyCalories: 2400,
      goal: 'keto',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 25% Protein = 600 kcal / 4 = 150g
      expect(outcome.value.proteinGrams).toBe(150);
      // 5% Carbs = 120 kcal / 4 = 30g
      expect(outcome.value.carbsGrams).toBe(30);
      // 70% Fat = 1680 kcal / 9 = 187g
      expect(outcome.value.fatGrams).toBe(187);
    }
  });

  it('rejects custom macros that do not sum to 100%', () => {
    const outcome = calculateMacros({
      dailyCalories: 2000,
      goal: 'custom',
      customProteinPct: 40,
      customCarbsPct: 40,
      customFatPct: 30, // Sum = 110%
    });

    expect(outcome.status).toBe('invalid');
  });
});
