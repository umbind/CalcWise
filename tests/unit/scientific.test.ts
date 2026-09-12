import { describe, it, expect } from 'vitest';
import { evaluateScientific } from '@/lib/calculations/scientific';

describe('Scientific Calculator Engine', () => {
  it('evaluates basic arithmetic following order of operations (PEMDAS)', () => {
    // 2 + 3 * 4 = 14 (not 20)
    const out = evaluateScientific({ expression: '2 + 3 * 4' });
    expect(out.status).toBe('success');
    expect(out.value?.result).toBe(14);
  });

  it('evaluates square roots, powers, and logarithms (Golden Dataset)', () => {
    expect(evaluateScientific({ expression: 'sqrt(144)' }).value?.result).toBe(12);
    expect(evaluateScientific({ expression: '2^10' }).value?.result).toBe(1024);
    expect(evaluateScientific({ expression: 'log(1000)' }).value?.result).toBe(3);
  });

  it('evaluates trigonometry in degrees and radians', () => {
    // sin(30 deg) = 0.5
    const sinDeg = evaluateScientific({ expression: 'sin(30)', angleMode: 'deg' });
    expect(sinDeg.value?.result).toBeCloseTo(0.5, 5);

    // cos(0 rad) = 1
    const cosRad = evaluateScientific({ expression: 'cos(0)', angleMode: 'rad' });
    expect(cosRad.value?.result).toBe(1);
  });

  it('rejects unsafe evaluation strings', () => {
    expect(evaluateScientific({ expression: 'alert(1)' }).status).toBe('invalid');
    expect(evaluateScientific({ expression: 'window.location' }).status).toBe('invalid');
  });
});
