import { describe, it, expect } from 'vitest';
import { calculateRefinance } from '../../src/lib/calculations/refinance';

describe('Loan Refinance Calculator Engine', () => {
  it('correctly calculates refinance savings with closing costs (Golden Dataset)', () => {
    // Current: $300,000 balance, $2,200/mo payment, 240 months remaining.
    // New: 5.5% interest rate over 180 months (15 years), $4,000 closing costs not rolled.
    const outcome = calculateRefinance({
      currentBalance: 300000,
      currentMonthlyPayment: 2200,
      currentRemainingMonths: 240,
      newInterestRate: 5.5,
      newLoanTermMonths: 180,
      closingCosts: 4000,
      rollCostsIntoLoan: false,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // 300k at 5.5% for 180 mo = 2451.25/mo
      expect(outcome.value.newMonthlyPayment).toBe(2451.25);
      // Remaining current = 2200 * 240 = 528,000.
      expect(outcome.value.totalCurrentRemainingCost).toBe(528000);
      // New total = (2451.25 * 180) + 4000 = 441225 + 4000 = 445225
      expect(outcome.value.totalNewLoanCost).toBe(445225);
      // Lifetime savings = 528000 - 445225 = 82775
      expect(outcome.value.lifetimeSavings).toBe(82775);
    }
  });

  it('correctly identifies break-even point when monthly payment drops', () => {
    // Current: $250,000 balance, $1,800/mo, 300 months left.
    // New: 4.5% for 360 months ($1,266.71/mo), $3,000 closing costs.
    const outcome = calculateRefinance({
      currentBalance: 250000,
      currentMonthlyPayment: 1800,
      currentRemainingMonths: 300,
      newInterestRate: 4.5,
      newLoanTermMonths: 360,
      closingCosts: 3000,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.monthlySavings).toBeGreaterThan(500);
      expect(outcome.value.breakEvenMonths).toBe(6); // 3000 / 533.29 = ~5.6 -> 6 months
    }
  });

  it('rejects invalid inputs', () => {
    expect(calculateRefinance({ currentBalance: -100, currentMonthlyPayment: 1000, currentRemainingMonths: 120, newInterestRate: 5, newLoanTermMonths: 120 }).status).toBe('invalid');
  });
});
