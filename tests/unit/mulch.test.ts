import { describe, it, expect } from 'vitest';
import { calculateMulch } from '../../src/lib/calculations/mulch';

describe('Mulch & Topsoil Calculator Engine', () => {
  it('correctly calculates mulch for 10x30 ft bed at 3 inches depth (Golden Dataset)', () => {
    const outcome = calculateMulch({
      areaLength: 10,
      areaWidth: 30,
      depthInches: 3,
      unit: 'feet',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Area = 300 sq ft. Depth = 3/12 = 0.25 ft.
      // Cubic feet = 300 * 0.25 = 75 cu ft.
      expect(outcome.value.areaSqFt).toBe(300);
      expect(outcome.value.cubicFeet).toBe(75);
      // Cubic yards = 75 / 27 = 2.78 cu yd
      expect(outcome.value.cubicYards).toBeCloseTo(2.78, 2);
      // Bags 2 cu ft = ceil(75 / 2) = 38 bags
      expect(outcome.value.bags2CuFt).toBe(38);
      // Bags 3 cu ft = ceil(75 / 3) = 25 bags
      expect(outcome.value.bags3CuFt).toBe(25);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('rejects non-positive dimensions or depth > 36 inches', () => {
    expect(calculateMulch({ areaLength: 0, areaWidth: 10, depthInches: 3 }).status).toBe('invalid');
    expect(calculateMulch({ areaLength: 10, areaWidth: 10, depthInches: 48 }).status).toBe('invalid');
  });
});
