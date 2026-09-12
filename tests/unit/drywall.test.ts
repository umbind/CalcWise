import { describe, it, expect } from 'vitest';
import { calculateDrywall } from '../../src/lib/calculations/drywall';

describe('Drywall Calculator Engine', () => {
  it('correctly calculates drywall sheets for 12x16 ft room with 8 ft ceiling including ceiling (Golden Dataset)', () => {
    const outcome = calculateDrywall({
      roomLength: 12,
      roomWidth: 16,
      ceilingHeight: 8,
      includeCeiling: true,
      sheetSize: '4x8',
      doorsWindowsDeductionSqFt: 40,
      wastePercentage: 10,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Perimeter = (12+16)*2 = 56. Wall area = 56 * 8 - 40 = 448 - 40 = 408 sq ft.
      // Ceiling area = 12 * 16 = 192 sq ft.
      // Total area = 408 + 192 = 600 sq ft.
      // With 10% waste = 660 sq ft.
      // 4x8 sheet = 32 sq ft. 660 / 32 = 20.625 -> ceil = 21 sheets.
      expect(outcome.value.wallAreaSqFt).toBe(408);
      expect(outcome.value.ceilingAreaSqFt).toBe(192);
      expect(outcome.value.totalAreaSqFt).toBe(600);
      expect(outcome.value.sheetsNeeded).toBe(21);
      expect(outcome.value.screwsCount).toBe(21 * 32);
      expect(outcome.value.tapeRolls).toBeGreaterThanOrEqual(1);
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly calculates 4x12 sheets without ceiling', () => {
    const outcome = calculateDrywall({
      roomLength: 10,
      roomWidth: 10,
      ceilingHeight: 9,
      includeCeiling: false,
      sheetSize: '4x12',
      doorsWindowsDeductionSqFt: 0,
      wastePercentage: 5,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Perimeter = 40. Walls = 40 * 9 = 360 sq ft.
      // With 5% waste = 378 sq ft.
      // 4x12 sheet = 48 sq ft. 378 / 48 = 7.875 -> ceil = 8 sheets.
      expect(outcome.value.ceilingAreaSqFt).toBe(0);
      expect(outcome.value.sheetsNeeded).toBe(8);
    }
  });

  it('rejects invalid dimensions', () => {
    expect(calculateDrywall({ roomLength: -10, roomWidth: 10, ceilingHeight: 8 }).status).toBe('invalid');
  });
});
