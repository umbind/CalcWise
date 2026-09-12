import { useState, useId } from 'react';
import { calculateRefinance } from '../../../lib/calculations/refinance';

export default function RefinanceIsland() {
  const [currentBalance, setCurrentBalance] = useState<string>('250000');
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState<string>('1800');
  const [currentRemainingMonths, setCurrentRemainingMonths] = useState<string>('300');
  const [newInterestRate, setNewInterestRate] = useState<string>('5.5');
  const [newLoanTermMonths, setNewLoanTermMonths] = useState<string>('360');
  const [closingCosts, setClosingCosts] = useState<string>('3500');
  const [rollCosts, setRollCosts] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const balId = useId();
  const curPayId = useId();
  const curMonthsId = useId();
  const newRateId = useId();
  const newTermId = useId();
  const closeId = useId();

  const outcome = calculateRefinance({
    currentBalance,
    currentMonthlyPayment,
    currentRemainingMonths,
    newInterestRate,
    newLoanTermMonths,
    closingCosts,
    rollCostsIntoLoan: rollCosts,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-3 bg-brand-surface rounded-xl border border-gray-200">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">Current Loan</span>
            <div className="space-y-3">
              <div>
                <label htmlFor={balId} className="block text-xs font-semibold text-brand-dark mb-1">
                  Remaining Principal ($)
                </label>
                <input
                  id={balId}
                  type="number"
                  step="5000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={curPayId} className="block text-xs font-semibold text-brand-dark mb-1">
                    Current Payment ($/mo)
                  </label>
                  <input
                    id={curPayId}
                    type="number"
                    step="50"
                    value={currentMonthlyPayment}
                    onChange={(e) => setCurrentMonthlyPayment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label htmlFor={curMonthsId} className="block text-xs font-semibold text-brand-dark mb-1">
                    Months Left
                  </label>
                  <input
                    id={curMonthsId}
                    type="number"
                    step="12"
                    value={currentRemainingMonths}
                    onChange={(e) => setCurrentRemainingMonths(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-brand-surface rounded-xl border border-gray-200">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">New Loan Options</span>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={newRateId} className="block text-xs font-semibold text-brand-dark mb-1">
                    New Rate (%)
                  </label>
                  <input
                    id={newRateId}
                    type="number"
                    step="0.1"
                    value={newInterestRate}
                    onChange={(e) => setNewInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label htmlFor={newTermId} className="block text-xs font-semibold text-brand-dark mb-1">
                    New Term
                  </label>
                  <select
                    id={newTermId}
                    value={newLoanTermMonths}
                    onChange={(e) => setNewLoanTermMonths(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="120">10 Years (120 mo)</option>
                    <option value="180">15 Years (180 mo)</option>
                    <option value="240">20 Years (240 mo)</option>
                    <option value="360">30 Years (360 mo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={closeId} className="block text-xs font-semibold text-brand-dark mb-1">
                  Estimated Closing Costs ($)
                </label>
                <input
                  id={closeId}
                  type="number"
                  step="250"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-brand-dark cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rollCosts}
                  onChange={(e) => setRollCosts(e.target.checked)}
                  className="rounded text-brand-primary focus:ring-brand-primary"
                />
                <span>Roll closing costs into new loan balance</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                New Monthly Payment
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedNewMonthlyPayment}
                <span className="text-sm font-normal text-brand-muted ml-1">/ month</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Monthly Difference</span>
                  <strong className={`block text-sm mt-0.5 ${outcome.value.monthlySavings >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {outcome.value.monthlySavings >= 0 ? `Save ${outcome.value.formattedMonthlySavings}/mo` : `Pay $${Math.abs(outcome.value.monthlySavings)}/mo more`}
                  </strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Break-Even Horizon</span>
                  <strong className="block text-brand-dark text-sm mt-0.5">{outcome.value.formattedBreakEven}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Lifetime Net Delta</span>
                  <strong className={`block text-sm mt-0.5 ${outcome.value.lifetimeSavings >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {outcome.value.lifetimeSavings >= 0 ? `Save ${outcome.value.formattedLifetimeSavings}` : `Cost $${Math.abs(outcome.value.lifetimeSavings)} more`}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid loan refinance numbers.
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
