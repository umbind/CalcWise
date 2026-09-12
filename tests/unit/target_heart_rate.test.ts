import { describe, it, expect } from 'vitest';
import { calculateTargetHeartRate } from '../../src/lib/calculations/target_heart_rate';

describe('Target Heart Rate Calculator Engine', () => {
  it('correctly calculates Tanaka max HR and Karvonen zones for age 30 with 60 bpm resting HR (Golden Dataset)', () => {
    const outcome = calculateTargetHeartRate({
      age: 30,
      restingHeartRate: 60,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Tanaka: 208 - 0.7 * 30 = 208 - 21 = 187 bpm
      expect(outcome.value.maxHeartRateTanaka).toBe(187);
      expect(outcome.value.maxHeartRateFox).toBe(190);
      expect(outcome.value.methodUsed).toBe('Karvonen (Heart Rate Reserve)');
      expect(outcome.value.zones.length).toBe(5);

      // Zone 2 (60-70%): HRR = 187 - 60 = 127. 60 + 127*0.6 = 136 bpm; 60 + 127*0.7 = 149 bpm
      const z2 = outcome.value.zones[1];
      expect(z2.zoneNumber).toBe(2);
      expect(z2.minBpm).toBeCloseTo(136, 0);
      expect(z2.maxBpm).toBeCloseTo(149, 0);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates direct percentage zones when resting HR is omitted', () => {
    const outcome = calculateTargetHeartRate({
      age: 40,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Tanaka: 208 - 0.7 * 40 = 180 bpm
      expect(outcome.value.maxHeartRateTanaka).toBe(180);
      expect(outcome.value.methodUsed).toBe('Fox/Tanaka Percentage');
      // Zone 2 (60-70% of 180): 108 - 126 bpm
      const z2 = outcome.value.zones[1];
      expect(z2.minBpm).toBe(108);
      expect(z2.maxBpm).toBe(126);
    }
  });

  it('rejects out of range age', () => {
    expect(calculateTargetHeartRate({ age: 5 }).status).toBe('invalid');
    expect(calculateTargetHeartRate({ age: 120 }).status).toBe('invalid');
  });
});
