import { describe, it, expect } from 'vitest';
import { calculatePaint } from '@/lib/calculations/paint';

describe('Paint Calculator Engine', () => {
  it('correctly calculates gallons needed with door and window deductions (Golden Dataset)', () => {
    // Room: 14 ft length, 12 ft width, 8 ft ceiling, 1 door (21 sq ft), 2 windows (30 sq ft), 2 coats
    // Perimeter = 2 * (14 + 12) = 52 ft
    // Gross = 52 * 8 = 416 sq ft
    // Deductions = 21 + 30 = 51 sq ft
    // Net = 416 - 51 = 365 sq ft
    // 2 coats = 730 sq ft
    // At 350 sq ft/gal: 730 / 350 = 2.08 gal -> 3 whole gallons
    const out = calculatePaint({
      roomLengthFeet: 14,
      roomWidthFeet: 12,
      ceilingHeightFeet: 8,
      doorsCount: 1,
      windowsCount: 2,
      coats: 2,
    });

    expect(out.status).toBe('success');
    expect(out.value?.grossWallAreaSqFt).toBe(416);
    expect(out.value?.deductionsSqFt).toBe(51);
    expect(out.value?.netWallAreaSqFt).toBe(365);
    expect(out.value?.totalCoatedAreaSqFt).toBe(730);
    expect(out.value?.gallonsNeeded).toBe(3);
  });

  it('rejects impossible deductions exceeding wall area', () => {
    // 10 doors on a 5x5 room
    const out = calculatePaint({
      roomLengthFeet: 5,
      roomWidthFeet: 5,
      ceilingHeightFeet: 8,
      doorsCount: 10,
    });
    expect(out.status).toBe('invalid');
  });
});
