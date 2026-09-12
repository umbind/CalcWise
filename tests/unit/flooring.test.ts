import { describe, it, expect } from 'vitest';
import { calculateFlooring } from '../../src/lib/calculations/flooring';

describe('Flooring Calculator Engine', () => {
  it('correctly calculates flooring for 15x20 ft room with 10% waste and 24 sq ft boxes (Golden Dataset)', () => {
    const outcome = calculateFlooring({
      roomLength: 15,
      roomWidth: 20,
      unit: 'feet',
      wastePercentage: 10,
      boxCoverageSqFt: 24,
      pricePerSqUnit: 3.5,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.rawArea).toBe(300);
      expect(outcome.value.wasteArea).toBe(30);
      expect(outcome.value.totalAreaWithWaste).toBe(330);
      // 330 / 24 = 13.75 -> ceil = 14 boxes
      expect(outcome.value.boxesNeeded).toBe(14);
      // 14 * 24 * 3.5 = $1,176.00
      expect(outcome.value.totalCost).toBe(1176);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('rejects invalid non-positive dimensions', () => {
    expect(calculateFlooring({ roomLength: 0, roomWidth: 10 }).status).toBe('invalid');
    expect(calculateFlooring({ roomLength: -5, roomWidth: 10 }).status).toBe('invalid');
  });
});
