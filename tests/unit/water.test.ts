import { describe, it, expect } from 'vitest';
import { calculateWaterIntake } from '@/lib/calculations/water';

describe('Water Intake Calculator Engine', () => {
  it('correctly calculates baseline water intake for 70 kg adult (Golden Dataset)', () => {
    // 70 kg at 35 ml/kg = 2450 ml = 2.45 Liters (~83 oz)
    const out = calculateWaterIntake({ weightKg: 70, exerciseMinutesDaily: 0, climate: 'normal' });
    expect(out.status).toBe('success');
    expect(out.value?.dailyLiters).toBe(2.45);
    expect(out.value?.dailyMilliliters).toBe(2450);
  });

  it('correctly adds exercise hydration allowance', () => {
    // 70 kg + 60 mins exercise: 2450 ml + (2 * 350) = 3150 ml = 3.15 L
    const out = calculateWaterIntake({ weightKg: 70, exerciseMinutesDaily: 60, climate: 'normal' });
    expect(out.value?.dailyLiters).toBe(3.15);
  });

  it('rejects missing or out-of-range weights', () => {
    expect(calculateWaterIntake({ weightKg: 5 }).status).toBe('invalid');
  });
});
