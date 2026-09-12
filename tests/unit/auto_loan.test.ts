import { describe, it, expect } from 'vitest';
import { calculateAutoLoan } from '../../src/lib/calculations/auto_loan';

describe('Auto Loan Calculator Engine', () => {
  it('correctly calculates $35,000 auto loan with 10% down, 6% tax, and 5% interest over 60 months (Golden Dataset)', () => {
    const outcome = calculateAutoLoan({
      vehiclePrice: 35000,
      salesTaxRate: 6,
      downPayment: 3500,
      tradeInValue: 5000,
      tradeInOwed: 0,
      loanTermMonths: 60,
      interestRate: 5.0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Taxable base = 35000 - 5000 = 30000. Tax 6% = 1800.
      expect(outcome.value.totalSalesTax).toBe(1800);
      // Financed = 35000 + 1800 - 3500 - 5000 = 28300.
      expect(outcome.value.totalFinanced).toBe(28300);
      // Monthly payment for 28300 at 5% over 60 mo = 534.06
      expect(outcome.value.monthlyPayment).toBe(534.06);
      expect(outcome.value.formattedMonthlyPayment).toBe('$534.06');
    }
  });

  it('correctly calculates 0% financing loan', () => {
    const outcome = calculateAutoLoan({
      vehiclePrice: 24000,
      salesTaxRate: 0,
      downPayment: 0,
      loanTermMonths: 48,
      interestRate: 0,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.monthlyPayment).toBe(500);
      expect(outcome.value.totalInterest).toBe(0);
    }
  });

  it('rejects negative prices or invalid terms', () => {
    expect(calculateAutoLoan({ vehiclePrice: -1000, loanTermMonths: 60, interestRate: 5 }).status).toBe('invalid');
    expect(calculateAutoLoan({ vehiclePrice: 20000, loanTermMonths: 0, interestRate: 5 }).status).toBe('invalid');
  });
});
