import { describe, it, expect } from 'vitest';
import { calculateCreditCardPayoff } from '../../src/lib/calculations/credit_card_payoff';

describe('Credit Card Payoff Calculator Engine', () => {
  it('correctly calculates fixed payment payoff: $5,000 at 18.99% APR with $200/mo', () => {
    const outcome = calculateCreditCardPayoff({
      currentBalance: 5000,
      interestRate: 18.99,
      payoffStrategy: 'fixed_payment',
      monthlyPayment: 200,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      // Typically takes ~32-34 months
      expect(outcome.value.monthsToPayoff).toBeGreaterThanOrEqual(30);
      expect(outcome.value.monthsToPayoff).toBeLessThanOrEqual(36);
      expect(outcome.value.totalInterest).toBeGreaterThan(1200);
      expect(outcome.value.totalPayment).toBeGreaterThan(6200);
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly calculates target months payoff: $5,000 at 18.99% APR in 24 months', () => {
    const outcome = calculateCreditCardPayoff({
      currentBalance: 5000,
      interestRate: 18.99,
      payoffStrategy: 'target_months',
      targetMonths: 24,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.monthsToPayoff).toBe(24);
      expect(outcome.value.monthlyPaymentAmount).toBeGreaterThan(240);
      expect(outcome.value.totalInterest).toBeGreaterThan(900);
    }
  });

  it('rejects payments that do not cover monthly interest', () => {
    // $5,000 at 24% APR has $100/mo initial interest. A payment of $50 should fail.
    const outcome = calculateCreditCardPayoff({
      currentBalance: 5000,
      interestRate: 24,
      payoffStrategy: 'fixed_payment',
      monthlyPayment: 50,
    });

    expect(outcome.status).toBe('invalid');
  });
});
