import { describe, it, expect } from 'vitest';
import { calculateAverage } from '@/lib/calculations/average';

describe('Average & Statistics Calculator Engine', () => {
  it('correctly calculates mean, median, mode for standard dataset (Golden Dataset)', () => {
    // Dataset: 10, 20, 20, 40, 50
    // Count = 5
    // Sum = 140
    // Mean = 28
    // Median = 20
    // Mode = [20]
    // Range = 50 - 10 = 40
    const out = calculateAverage({ rawDataset: '10, 20, 20, 40, 50' });
    expect(out.status).toBe('success');
    expect(out.value?.count).toBe(5);
    expect(out.value?.sum).toBe(140);
    expect(out.value?.mean).toBe(28);
    expect(out.value?.median).toBe(20);
    expect(out.value?.mode).toEqual([20]);
    expect(out.value?.range).toBe(40);
  });

  it('correctly handles even count median averaging', () => {
    // Dataset: 2, 4, 6, 8 -> Median = (4 + 6)/2 = 5
    const out = calculateAverage({ rawDataset: '2 4 6 8' });
    expect(out.value?.median).toBe(5);
  });

  it('rejects invalid non-numeric inputs or empty string', () => {
    expect(calculateAverage({ rawDataset: '' }).status).toBe('invalid');
    expect(calculateAverage({ rawDataset: '1, 2, abc' }).status).toBe('invalid');
  });
});
