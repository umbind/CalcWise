import { useState, useId } from 'react';
import { calculateCd } from '../../../lib/calculations/cd';

export default function CdIsland() {
  const [initialDeposit, setInitialDeposit] = useState<string>('10000');
  const [interestRate, setInterestRate] = useState<string>('5.0');
  const [termMonths, setTermMonths] = useState<string>('12');
  const [compoundFrequency, setCompoundFrequency] = useState<'daily' | 'monthly' | 'annually'>('monthly');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const depositId = useId();
  const rateId = useId();
  const termId = useId();
  const freqId = useId();

  const outcome = calculateCd({
    initialDeposit,
    interestRate,
    termMonths,
    compoundFrequency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={depositId} className="block text-sm font-semibold text-brand-dark mb-1">
              Initial CD Deposit ($)
            </label>
            <input
              id={depositId}
              type="number"
              step="500"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={rateId} className="block text-xs font-semibold text-brand-dark mb-1">
                Interest Rate (APR %)
              </label>
              <input
                id={rateId}
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={termId} className="block text-xs font-semibold text-brand-dark mb-1">
                Term Length
              </label>
              <select
                id={termId}
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
                <option value="60">60 Months (5 Years)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={freqId} className="block text-xs font-semibold text-brand-dark mb-1">
              Compounding Frequency
            </label>
            <select
              id={freqId}
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value as 'daily' | 'monthly' | 'annually')}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="daily">Daily Compounding (365/yr)</option>
              <option value="monthly">Monthly Compounding (12/yr)</option>
              <option value="annually">Annual Compounding (1/yr)</option>
            </select>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Balance at Maturity ({termMonths} Months)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedEndBalance}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Total Interest Earned</span>
                  <strong className="block text-emerald-700 text-base mt-0.5">{outcome.value.formattedTotalInterest}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Effective APY</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.formattedEffectiveApy}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid deposit and interest rate values.
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
                        <span className="text-brand-primary font-bold">{step.result}</span>
                      </div>
                      <div className="font-mono text-gray-500 text-[10px] mt-0.5">{step.expression}</div>
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
