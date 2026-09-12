import { describe, it, expect } from 'vitest';
import { calculateSquareFootage } from '@/lib/calculations/square_footage';

describe('Square Footage Calculator Engine', () => {
  it('correctly calculates single room square footage and material cost (Golden Dataset)', () => {
    // 12 ft x 15 ft = 180 sq ft = 20 sq yds
    // Price at $3.50/sq ft = $630.00
    const out = calculateSquareFootage({
      rooms: [{ length: 12, width: 15 }],
      pricePerSqFt: 3.5,
    });

    expect(out.status).toBe('success');
    expect(out.value?.totalSqFt).toBe(180);
    expect(out.value?.totalSqYards).toBe(20);
    expect(out.value?.totalMaterialCost).toBe(630);
  });

  it('correctly sums multiple rooms', () => {
    // Room 1: 10 x 10 = 100, Room 2: 20 x 10 = 200 -> Total = 300 sq ft
    const out = calculateSquareFootage({
      rooms: [
        { length: 10, width: 10, label: 'Bedroom' },
        { length: 20, width: 10, label: 'Living Room' },
      ],
    });

    expect(out.value?.totalSqFt).toBe(300);
    expect(out.value?.roomCount).toBe(2);
  });

  it('rejects invalid or zero dimensions', () => {
    expect(calculateSquareFootage({ rooms: [{ length: 0, width: 10 }] }).status).toBe('invalid');
  });
});
