import { describe, it, expect } from 'vitest';
import { calculatePace } from '../../src/lib/calculations/pace';

describe('Running Pace Calculator Engine', () => {
  it('correctly calculates pace for a 10 km run in 50 minutes (Golden Dataset)', () => {
    const outcome = calculatePace({
      distance: 10,
      distanceUnit: 'km',
      hours: 0,
      minutes: 50,
      seconds: 0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 50 mins / 10 km = 5:00 / km
      expect(outcome.value.pacePerKmString).toBe('5:00 / km');
      // 5:00 / km = ~8:03 / mi
      expect(outcome.value.pacePerMileString).toMatch(/8:0[2-4] \/ mi/);
      // Speed = 12 km/h
      expect(outcome.value.speedKmh).toBe(12);
      expect(outcome.value.standardSplits.length).toBe(4);
      // Marathon at 5:00/km = ~3:30:58
      const marathon = outcome.value.standardSplits.find(s => s.event === 'Marathon');
      expect(marathon?.formattedTime).toMatch(/3:30:/);
    }
  });

  it('correctly calculates pace for 13.1 miles (Half Marathon) in 1h 45m', () => {
    const outcome = calculatePace({
      distance: 13.1,
      distanceUnit: 'miles',
      hours: 1,
      minutes: 45,
      seconds: 0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 105 mins / 13.1 = 8.015 min/mi = 8:01/mi
      expect(outcome.value.pacePerMileString).toBe('8:01 / mi');
    }
  });

  it('rejects zero time or zero distance', () => {
    expect(calculatePace({ distance: 0, hours: 1 }).status).toBe('invalid');
    expect(calculatePace({ distance: 5, hours: 0, minutes: 0, seconds: 0 }).status).toBe('invalid');
  });
});
