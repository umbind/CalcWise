import { describe, it, expect } from 'vitest';
import { calculateMortgage } from '@/lib/calculations/mortgage';

describe('Mortgage Calculator Engine', () => {
  it('correctly calculates total monthly payment with 20% down (No PMI)', () => {
    // 400,000 price, 80,000 down (20%), 30-year at 6.5%, 3,600 tax/yr ($300/mo), 1,200 ins/yr ($100/mo)
    // Financed: 320,000 at 6.5% 30-year P&I ~ 2,022.62
    // Total monthly = 2022.62 + 300 + 100 = 2,422.62
    const out = calculateMortgage({
      homePrice: 400000,
      downPayment: 80000,
      loanTermYears: 30,
      interestRate: 6.5,
      annualPropertyTax: 3600,
      annualHomeInsurance: 1200,
    });

    expect(out.status).toBe('success');
    expect(out.value).toBeDefined();
    expect(out.value!.loanAmount).toBe(320000);
    expect(out.value!.monthlyPmi).toBe(0); // 20% down = 0 PMI
    expect(out.value!.monthlyPrincipalInterest).toBeCloseTo(2022.62, 0);
    expect(out.value!.totalMonthlyPayment).toBeCloseTo(2422.62, 0);
  });

  it('includes PMI when down payment is under 20%', () => {
    // 300,000 price, 15,000 down (5%), PMI triggered
    const out = calculateMortgage({
      homePrice: 300000,
      downPayment: 15000,
      loanTermYears: 30,
      interestRate: 7,
    });

    expect(out.value?.downPaymentPercentage).toBe(5);
    expect(out.value?.monthlyPmi).toBeGreaterThan(0);
  });

  it('rejects invalid inputs', () => {
    expect(calculateMortgage({ homePrice: 0, downPayment: 0, loanTermYears: 30, interestRate: 5 }).status).toBe('invalid');
    expect(calculateMortgage({ homePrice: 100000, downPayment: 150000, loanTermYears: 30, interestRate: 5 }).status).toBe('invalid');
  });
});
