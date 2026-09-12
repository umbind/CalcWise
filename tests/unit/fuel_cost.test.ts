import { describe, it, expect } from 'vitest';
import { calculateFuelCost } from '../../src/lib/calculations/fuel_cost';

describe('Fuel Cost Calculator Engine', () => {
  it('correctly calculates 300 mile trip at 30 MPG with $3.50/gal fuel (Golden Dataset)', () => {
    const outcome = calculateFuelCost({
      distance: 300,
      distanceUnit: 'miles',
      fuelEfficiencyMpg: 30,
      fuelPricePerUnit: 3.50,
      isRoundTrip: false,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 300 / 30 = 10 gallons. 10 * 3.50 = $35.00
      expect(outcome.value.fuelNeededGallons).toBe(10);
      expect(outcome.value.totalCost).toBe(35);
      expect(outcome.value.costPerUnit).toBe(0.117);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly doubles distance and cost for round trip', () => {
    const outcome = calculateFuelCost({
      distance: 200,
      distanceUnit: 'miles',
      fuelEfficiencyMpg: 25,
      fuelPricePerUnit: 4.00,
      isRoundTrip: true,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Total dist = 400 miles. 400 / 25 = 16 gallons. 16 * 4 = $64.00
      expect(outcome.value.totalDistance).toBe(400);
      expect(outcome.value.fuelNeededGallons).toBe(16);
      expect(outcome.value.totalCost).toBe(64);
    }
  });

  it('correctly calculates metric km and L/100km', () => {
    const outcome = calculateFuelCost({
      distance: 500,
      distanceUnit: 'km',
      fuelEfficiencyL100km: 8.0,
      fuelPricePerUnit: 1.60,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // (500 / 100) * 8 = 40 Liters. 40 * 1.60 = $64.00
      expect(outcome.value.fuelNeededLiters).toBe(40);
      expect(outcome.value.totalCost).toBe(64);
    }
  });

  it('rejects invalid distances or fuel prices', () => {
    expect(calculateFuelCost({ distance: 0, fuelPricePerUnit: 3.5 }).status).toBe('invalid');
    expect(calculateFuelCost({ distance: 100, fuelPricePerUnit: -1 }).status).toBe('invalid');
  });
});
