import { describe, it, expect } from 'vitest';
import { calculateDiscount } from '../../src/lib/calculations/discount';

describe('Discount & Sales Tax Calculator Engine', () => {
  it('correctly calculates 20% discount on $100 with extra 10% coupon and 8% tax (Golden Dataset)', () => {
    const outcome = calculateDiscount({
      originalPrice: 100,
      discountPercentage: 20,
      additionalDiscountPercentage: 10,
      salesTaxRate: 8,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 100 - 20% = 80. 80 - 10% = 72.
      expect(outcome.value.priceAfterDiscount).toBe(72);
      expect(outcome.value.discountAmount).toBe(28);
      // Tax: 72 * 0.08 = 5.76. Final = 77.76
      expect(outcome.value.salesTaxAmount).toBe(5.76);
      expect(outcome.value.finalPrice).toBe(77.76);
      expect(outcome.value.effectiveSavingsPct).toBe(28);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates simple discount with 0% tax', () => {
    const outcome = calculateDiscount({
      originalPrice: 50,
      discountPercentage: 30,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.finalPrice).toBe(35);
      expect(outcome.value.totalSavings).toBe(15);
    }
  });

  it('rejects invalid prices or negative discounts', () => {
    expect(calculateDiscount({ originalPrice: -10, discountPercentage: 20 }).status).toBe('invalid');
    expect(calculateDiscount({ originalPrice: 100, discountPercentage: -5 }).status).toBe('invalid');
  });
});
