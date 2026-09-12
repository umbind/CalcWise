import { useState, useId } from 'react';
import { calculateInflation } from '../../../lib/calculations/inflation';

export default function InflationIsland() {
  const [initialAmount, setInitialAmount] = useState<string>('1000');
  const [annualInflationRate, setAnnualInflationRate] = useState<string>('3.0');
  const [years, setYears] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const amountId = useId();
  const rateId = useId();
  const yearsId = useId();

  const outcome = calculateInflation({
    initialAmount,
    annualInflationRate,
    years,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={amountId} className="block text-sm font-semibold text-brand-dark mb-1">
              Initial Amount ($)
            </label>
            <input
              id={amountId}
              type="number"
              step="50"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
              Average Annual Inflation Rate (%)
            </label>
            <input
              id={rateId}
              type="number"
              step="0.1"
              value={annualInflationRate}
              onChange={(e) => setAnnualInflationRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={yearsId} className="block text-sm font-semibold text-brand-dark mb-1">
              Number of Years
            </label>
            <input
              id={yearsId}
              type="number"
              step="1"
              min="1"
              max="100"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Future Cost for Same Goods in {years} Years
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedFutureCost}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Cumulative Inflation: <strong className="text-brand-dark">{outcome.value.formattedCumulativeInflation}</strong>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Future Value of ${initialAmount}</span>
                  <strong className="block text-rose-600 text-base mt-0.5">{outcome.value.formattedFuturePurchasingPower}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Purchasing Power Erosion</span>
                  <strong className="block text-rose-600 text-base mt-0.5">{outcome.value.formattedPurchasingPowerLoss}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid amount, rate, and year parameters.
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
