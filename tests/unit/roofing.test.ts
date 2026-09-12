import { describe, it, expect } from 'vitest';
import { calculateRoofing } from '../../src/lib/calculations/roofing';

describe('Roofing Calculator Engine', () => {
  it('correctly calculates roof squares and bundles for 30x50 ft home with 6/12 pitch (Golden Dataset)', () => {
    const outcome = calculateRoofing({
      houseLength: 50,
      houseWidth: 30,
      pitchRiseOver12: 6,
      wastePercentage: 10,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Footprint = 1500 sq ft.
      // Pitch factor for 6/12 = sqrt(1 + 0.25) = sqrt(1.25) = 1.1180
      expect(outcome.value.flatFootprintSqFt).toBe(1500);
      expect(outcome.value.pitchMultiplier).toBeCloseTo(1.118, 3);
      // Area with 10% waste = 1500 * 1.118 * 1.10 = ~1844.7 sq ft
      expect(outcome.value.totalRoofAreaSqFt).toBeCloseTo(1844.7, 0);
      // Squares = 18.45
      expect(outcome.value.roofingSquares).toBeCloseTo(18.45, 1);
      // Bundles = ceil(18.45 * 3) = 56 bundles
      expect(outcome.value.shingleBundles).toBe(56);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly handles flat roof (0/12 pitch)', () => {
    const outcome = calculateRoofing({
      houseLength: 40,
      houseWidth: 25,
      pitchRiseOver12: 0,
      wastePercentage: 5,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.pitchMultiplier).toBe(1);
      expect(outcome.value.totalRoofAreaSqFt).toBe(1050);
      expect(outcome.value.roofingSquares).toBe(10.5);
    }
  });

  it('rejects negative pitch or invalid dimensions', () => {
    expect(calculateRoofing({ houseLength: 0, houseWidth: 20, pitchRiseOver12: 4 }).status).toBe('invalid');
    expect(calculateRoofing({ houseLength: 40, houseWidth: 20, pitchRiseOver12: -2 }).status).toBe('invalid');
  });
});
