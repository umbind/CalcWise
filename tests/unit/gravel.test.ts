import { describe, it, expect } from 'vitest';
import { calculateGravel } from '../../src/lib/calculations/gravel';

describe('Gravel & Aggregate Calculator Engine', () => {
  it('correctly calculates cubic yards and tonnage for 10x40 ft driveway at 4 inches depth (Golden Dataset)', () => {
    const outcome = calculateGravel({
      length: 40,
      width: 10,
      depthInches: 4,
      aggregateType: 'crushed_stone',
      unit: 'feet',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Area = 400 sq ft. Depth = 4/12 = 0.333 ft.
      // Cubic feet = 400 * (1/3) = 133.33 cu ft.
      // Cubic yards = 133.33 / 27 = 4.94 cu yd.
      expect(outcome.value.cubicYards).toBeCloseTo(4.94, 2);
      // Density = 2700 lbs/yd. Total lbs = 4.938 * 2700 = 13333 lbs.
      // Tons US = 13333 / 2000 = 6.67 tons
      expect(outcome.value.tonsUS).toBeCloseTo(6.67, 1);
      // Metric tonnes = 13333 / 2204.62 = 6.05 tonnes
      expect(outcome.value.tonnesMetric).toBeCloseTo(6.05, 1);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates decomposed granite density (3000 lbs/yd)', () => {
    const outcome = calculateGravel({
      length: 20,
      width: 10,
      depthInches: 3,
      aggregateType: 'decomposed_granite',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.densityLbsPerCuYd).toBe(3000);
      expect(outcome.value.tonsUS).toBeGreaterThan(2.5);
    }
  });

  it('rejects zero or negative dimensions', () => {
    expect(calculateGravel({ length: 0, width: 10, depthInches: 4 }).status).toBe('invalid');
  });
});
