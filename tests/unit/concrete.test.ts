import { describe, it, expect } from 'vitest';
import { calculateConcrete } from '@/lib/calculations/concrete';

describe('Concrete Calculator Engine (Archetype B)', () => {
  it('correctly calculates slab volume & bags with 10% waste (Golden Dataset)', () => {
    // 10 ft x 10 ft x 4 in thickness, 10% waste
    // Net: 10 * 10 * (4/12) = 33.33 cu ft = 1.23 cu yd
    // Total with 10% waste: 36.67 cu ft = 1.36 cu yd
    // 80lb bags: ceil(36.67 / 0.60) = 62 bags
    const out = calculateConcrete({
      shape: 'slab',
      length: 10,
      width: 10,
      thickness: 4,
      lengthUnit: 'feet',
      widthUnit: 'feet',
      thicknessUnit: 'inches',
      wastePercentage: 10,
    });

    expect(out.status).toBe('success');
    expect(out.value).toBeDefined();
    expect(out.value?.totalVolumeCuYd).toBeCloseTo(1.36, 1);
    expect(out.value?.bags80lb).toBe(62);
    expect(out.value?.bags60lb).toBe(82);
    expect(out.trace.length).toBeGreaterThanOrEqual(4);
  });

  it('correctly calculates column cylinder volume', () => {
    // Column: 12 in diameter (1 ft diam, 0.5 ft radius), 8 ft height, 10% waste
    // V = pi * 0.5^2 * 8 = pi * 0.25 * 8 = 2 * pi = 6.283 cu ft
    const out = calculateConcrete({
      shape: 'column',
      diameter: 12,
      height: 8,
      diameterUnit: 'inches',
      heightUnit: 'feet',
      wastePercentage: 10,
    });

    expect(out.status).toBe('success');
    expect(out.value?.volumeCuFt).toBeCloseTo(6.28, 1);
    expect(out.value?.bags80lb).toBeGreaterThan(0);
  });

  it('rejects invalid or zero dimensions', () => {
    expect(calculateConcrete({ shape: 'slab', length: 0, width: 10, thickness: 4 }).status).toBe('invalid');
    expect(calculateConcrete({ shape: 'slab', length: 10, width: -5, thickness: 4 }).status).toBe('invalid');
  });
});
