import { describe, it, expect } from 'vitest';
import { convertUnit } from '@/lib/calculations/converter';

describe('Canonical Unit Converter Engine (Archetype C)', () => {
  it('correctly converts length with exact factors (Golden Dataset)', () => {
    // 1 mile = 1609.344 meters
    const out = convertUnit({ category: 'length', value: 1, fromUnit: 'mi', toUnit: 'm' });
    expect(out.status).toBe('success');
    expect(out.value?.toValue).toBe(1609.344);

    // 100 cm = 1 m
    const cmOut = convertUnit({ category: 'length', value: 100, fromUnit: 'cm', toUnit: 'm' });
    expect(cmOut.value?.toValue).toBe(1);
  });

  it('correctly converts temperature (affine formulas)', () => {
    // 0 C = 32 F
    const freezing = convertUnit({ category: 'temperature', value: 0, fromUnit: 'c', toUnit: 'f' });
    expect(freezing.value?.toValue).toBe(32);

    // 100 C = 212 F
    const boiling = convertUnit({ category: 'temperature', value: 100, fromUnit: 'c', toUnit: 'f' });
    expect(boiling.value?.toValue).toBe(212);

    // 25 C = 298.15 K
    const kelvin = convertUnit({ category: 'temperature', value: 25, fromUnit: 'c', toUnit: 'k' });
    expect(kelvin.value?.toValue).toBe(298.15);
  });

  it('correctly converts data storage units (binary 1024 base)', () => {
    // 1 GB = 1024 MB
    const out = convertUnit({ category: 'data', value: 1, fromUnit: 'gb', toUnit: 'mb' });
    expect(out.status).toBe('success');
    expect(out.value?.toValue).toBe(1024);
  });

  it('validates round-trip conversion invariance', () => {
    // 50 lbs to kg and back to lbs
    const toKg = convertUnit({ category: 'mass', value: 50, fromUnit: 'lb', toUnit: 'kg' });
    expect(toKg.status).toBe('success');

    const backToLb = convertUnit({
      category: 'mass',
      value: toKg.value!.toValue,
      fromUnit: 'kg',
      toUnit: 'lb',
    });
    expect(backToLb.status).toBe('success');
    expect(backToLb.value?.toValue).toBeCloseTo(50, 5);
  });
});
