import { describe, it, expect } from 'vitest';
import { calculateIdealWeight } from '../../src/lib/calculations/ideal_weight';

describe('Ideal Weight Calculator Engine', () => {
  it('correctly calculates Devine and average ideal weight for male: 178 cm (5\'10") (Golden Dataset)', () => {
    const outcome = calculateIdealWeight({
      gender: 'male',
      heightCm: 178,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 178 cm = 70.07 inches -> ~10 inches over 60. Devine: 50 + 2.3*10 = 73 kg
      const devine = outcome.value.clinicalFormulas.find(f => f.formulaName.includes('Devine'));
      expect(devine?.weightKg).toBeCloseTo(73.2, 0);
      expect(outcome.value.averageWeightKg).toBeGreaterThan(68);
      expect(outcome.value.averageWeightKg).toBeLessThan(76);
      expect(outcome.value.healthyBmiRangeKg.min).toBeCloseTo(58.6, 0);
      expect(outcome.value.healthyBmiRangeKg.max).toBeCloseTo(78.9, 0);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly calculates for female: 165 cm (5\'5")', () => {
    const outcome = calculateIdealWeight({
      gender: 'female',
      heightCm: 165,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 165 cm = 64.96 inches -> ~5 inches over 60. Devine: 45.5 + 2.3*5 = 57 kg
      const devine = outcome.value.clinicalFormulas.find(f => f.formulaName.includes('Devine'));
      expect(devine?.weightKg).toBeCloseTo(56.9, 0);
      expect(outcome.value.averageWeightKg).toBeGreaterThan(54);
      expect(outcome.value.averageWeightKg).toBeLessThan(62);
    }
  });

  it('rejects extreme height values', () => {
    expect(calculateIdealWeight({ gender: 'male', heightCm: 100 }).status).toBe('invalid');
    expect(calculateIdealWeight({ gender: 'female', heightCm: 250 }).status).toBe('invalid');
  });
});
