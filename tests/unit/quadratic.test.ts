import { describe, it, expect } from 'vitest';
import { calculateQuadratic } from '../../src/lib/calculations/quadratic';

describe('Quadratic Formula Calculator Engine', () => {
  it('correctly solves two real roots: x² - 5x + 6 = 0 (Golden Dataset)', () => {
    const outcome = calculateQuadratic({
      a: 1,
      b: -5,
      c: 6,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.discriminant).toBe(1);
      expect(outcome.value.rootType).toBe('two_real');
      expect(outcome.value.root1).toBe('3');
      expect(outcome.value.root2).toBe('2');
      expect(outcome.value.vertexX).toBe(2.5);
      expect(outcome.value.vertexY).toBe(-0.25);
      expect(outcome.value.parabolaDirection).toBe('upward');
      expect(outcome.trace.length).toBe(3);
    }
  });

  it('correctly solves one repeated real root: x² + 4x + 4 = 0', () => {
    const outcome = calculateQuadratic({
      a: 1,
      b: 4,
      c: 4,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.discriminant).toBe(0);
      expect(outcome.value.rootType).toBe('one_real');
      expect(outcome.value.root1).toBe('-2');
      expect(outcome.value.root2).toBe('-2');
    }
  });

  it('correctly solves complex conjugate roots: x² + 2x + 5 = 0', () => {
    const outcome = calculateQuadratic({
      a: 1,
      b: 2,
      c: 5,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.discriminant).toBe(-16);
      expect(outcome.value.rootType).toBe('complex');
      expect(outcome.value.root1).toBe('-1 + 2i');
      expect(outcome.value.root2).toBe('-1 - 2i');
    }
  });

  it('rejects a = 0 (not quadratic)', () => {
    expect(calculateQuadratic({ a: 0, b: 2, c: 3 }).status).toBe('invalid');
  });
});
