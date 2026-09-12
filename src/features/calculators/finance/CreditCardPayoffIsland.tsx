import { useState, useId } from 'react';
import { calculateCreditCardPayoff } from '../../../lib/calculations/credit_card_payoff';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function CreditCardPayoffIsland() {
  const [currentBalance, setCurrentBalance] = useState<string>('5000');
  const [interestRate, setInterestRate] = useState<string>('18.99');
  const [payoffStrategy, setPayoffStrategy] = useState<'fixed_payment' | 'target_months'>('fixed_payment');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('200');
  const [targetMonths, setTargetMonths] = useState<string>('24');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const balanceId = useId();
  const rateId = useId();
  const paymentId = useId();
  const targetId = useId();

  const outcome = calculateCreditCardPayoff({
    currentBalance,
    interestRate,
    payoffStrategy,
    monthlyPayment,
    targetMonths,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={balanceId} className="block text-sm font-semibold text-brand-dark mb-1">
              Current Credit Card Balance (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
            </label>
            <input
              id={balanceId}
              type="number"
              step="50"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
              Interest Rate (APR %)
            </label>
            <input
              id={rateId}
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-brand-dark mb-1.5">Payoff Strategy</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayoffStrategy('fixed_payment')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                  payoffStrategy === 'fixed_payment'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Fixed Monthly Payment
              </button>
              <button
                type="button"
                onClick={() => setPayoffStrategy('target_months')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                  payoffStrategy === 'target_months'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Target Payoff Goal
              </button>
            </div>
          </div>

          {payoffStrategy === 'fixed_payment' ? (
            <div>
              <label htmlFor={paymentId} className="block text-sm font-semibold text-brand-dark mb-1">
                Monthly Payment Amount (<span translate="no" className="notranslate font-semibold">{currency}</span>)
              </label>
              <input
                id={paymentId}
                type="number"
                step="25"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                translate="no"
                className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          ) : (
            <div>
              <label htmlFor={targetId} className="block text-sm font-semibold text-brand-dark mb-1">
                Target Timeframe (Months)
              </label>
              <input
                id={targetId}
                type="number"
                step="1"
                min="1"
                max="360"
                value={targetMonths}
                onChange={(e) => setTargetMonths(e.target.value)}
                translate="no"
                className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                {payoffStrategy === 'fixed_payment' ? 'Estimated Time to Debt Free' : 'Required Monthly Payment'}
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                <span translate="no" className="notranslate">
                  {payoffStrategy === 'fixed_payment'
                    ? outcome.value.formattedTimeToPayoff
                    : outcome.value.formattedMonthlyPayment}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Total Interest</span>
                  <strong translate="no" className="notranslate block text-rose-600 text-sm mt-0.5">{outcome.value.formattedTotalInterest}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Total Cost</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedTotalPayment}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Monthly Installment</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedMonthlyPayment}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              {outcome.warnings && outcome.warnings[0]
                ? outcome.warnings[0].message
                : 'Please enter valid balance and payment details.'}
            </div>
          )}

          {outcome.status === 'success' && outcome.trace && outcome.trace.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowTrace(!showTrace)}
                className="text-xs font-bold text-brand-primary hover:text-brand-accent transition inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>{showTrace ? 'Hide' : 'Inspect'} Calculation Trace</span>
                <span>{showTrace ? '▲' : '▼'}</span>
              </button>

              {showTrace && (
                <div className="mt-3 space-y-2 bg-white p-3 rounded-lg border border-gray-200 text-xs">
                  {outcome.trace.map((step) => (
                    <div key={step.stepNumber} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-baseline font-mono text-[11px]">
                        <span className="font-semibold text-brand-dark">{step.stepNumber}. {step.label}</span>
                        <span translate="no" className="notranslate text-brand-primary font-bold">{step.result}</span>
                      </div>
                      <div translate="no" className="notranslate font-mono text-gray-500 text-[10px] mt-0.5">{step.expression}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
