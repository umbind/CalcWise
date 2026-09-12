import { describe, it, expect } from 'vitest';
import { calculateElectricity } from '../../src/lib/calculations/electricity';

describe('Electricity Cost Calculator Engine', () => {
  it('correctly calculates energy cost for 1500W space heater running 8 hours/day at $0.16/kWh (Golden Dataset)', () => {
    const outcome = calculateElectricity({
      wattage: 1500,
      hoursPerDay: 8,
      costPerKwh: 0.16,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Daily kWh = 1500 * 8 / 1000 = 12 kWh
      expect(outcome.value.dailyKwh).toBe(12);
      // Daily cost = 12 * 0.16 = $1.92
      expect(outcome.value.dailyCost).toBe(1.92);
      // Monthly kWh = 12 * 30.4167 = 365 kWh
      expect(outcome.value.monthlyKwh).toBeCloseTo(365, 0);
      // Monthly cost = 365 * 0.16 = $58.40
      expect(outcome.value.monthlyCost).toBeCloseTo(58.4, 0);
      // Annual cost = 12 * 365 * 0.16 = $700.80
      expect(outcome.value.annualCost).toBeCloseTo(700.8, 1);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('rejects invalid non-positive wattage or hours > 24', () => {
    expect(calculateElectricity({ wattage: 0, hoursPerDay: 5, costPerKwh: 0.15 }).status).toBe('invalid');
    expect(calculateElectricity({ wattage: 100, hoursPerDay: 26, costPerKwh: 0.15 }).status).toBe('invalid');
  });
});
