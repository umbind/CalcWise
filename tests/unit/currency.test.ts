import { describe, it, expect } from 'vitest';
import { calculateCurrency } from '../../src/lib/calculations/currency';

describe('Currency Estimator Calculator Engine', () => {
  it('correctly converts 1,000 USD to EUR (Golden Dataset)', () => {
    const outcome = calculateCurrency({
      amount: 1000,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      bankSpreadFeePct: 0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.convertedAmount).toBe(920);
      expect(outcome.value.exchangeRate).toBe(0.92);
      expect(outcome.value.netReceived).toBe(920);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly deducts 2% bank spread fee', () => {
    const outcome = calculateCurrency({
      amount: 1000,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      bankSpreadFeePct: 2,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 920 * 0.02 = 18.40 fee. Net = 901.60
      expect(outcome.value.spreadFeeAmount).toBe(18.4);
      expect(outcome.value.netReceived).toBe(901.6);
    }
  });

  it('correctly handles cross rate: EUR to GBP', () => {
    const outcome = calculateCurrency({
      amount: 100,
      fromCurrency: 'EUR',
      toCurrency: 'GBP',
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // GBP rate 0.79 / EUR rate 0.92 = 0.8587
      expect(outcome.value.exchangeRate).toBeCloseTo(0.8587, 3);
      expect(outcome.value.convertedAmount).toBeCloseTo(85.87, 1);
    }
  });

  it('rejects unsupported currency code or non-positive amount', () => {
    expect(calculateCurrency({ amount: 100, fromCurrency: 'XYZ', toCurrency: 'USD' }).status).toBe('invalid');
    expect(calculateCurrency({ amount: -50, fromCurrency: 'USD', toCurrency: 'EUR' }).status).toBe('invalid');
  });
});
