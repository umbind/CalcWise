import { describe, it, expect } from 'vitest';
import { calculatePermutationCombination } from '../../src/lib/calculations/permutation_combination';

describe('Permutation & Combination Calculator Engine', () => {
  it('correctly calculates 10P3 and 10C3 (Golden Dataset)', () => {
    const outcome = calculatePermutationCombination({
      n: 10,
      r: 3,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 10P3 = 10 * 9 * 8 = 720
      expect(outcome.value.permutationsNoRepetition).toBe('720');
      // 10C3 = 720 / 6 = 120
      expect(outcome.value.combinationsNoRepetition).toBe('120');
      // 10^3 = 1000
      expect(outcome.value.permutationsWithRepetition).toBe('1,000');
      // (10+3-1)C3 = 12C3 = (12*11*10)/6 = 220
      expect(outcome.value.combinationsWithRepetition).toBe('220');
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly handles 52C5 (standard poker hand combinations)', () => {
    const outcome = calculatePermutationCombination({
      n: 52,
      r: 5,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 52C5 = 2,598,960
      expect(outcome.value.combinationsNoRepetition).toBe('2,598,960');
    }
  });

  it('rejects r > n or non-integers', () => {
    expect(calculatePermutationCombination({ n: 5, r: 8 }).status).toBe('invalid');
    expect(calculatePermutationCombination({ n: 5.5, r: 2 }).status).toBe('invalid');
  });
});
