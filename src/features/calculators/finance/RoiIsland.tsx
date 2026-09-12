import { useState, useId } from 'react';
import { calculateRoi } from '../../../lib/calculations/roi';

export default function RoiIsland() {
  const [initialInvestment, setInitialInvestment] = useState<string>('10000');
  const [finalValue, setFinalValue] = useState<string>('15000');
  const [investmentPeriodYears, setInvestmentPeriodYears] = useState<string>('3');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const initId = useId();
  const finalId = useId();
  const yearsId = useId();

  const outcome = calculateRoi({
    initialInvestment,
    finalValue,
    investmentPeriodYears,
  });

  const isProfit = outcome.status === 'success' && outcome.value && outcome.value.netProfit >= 0;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={initId} className="block text-sm font-semibold text-brand-dark mb-1">
              Initial Investment Capital ($)
            </label>
            <input
              id={initId}
              type="number"
              step="100"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={finalId} className="block text-sm font-semibold text-brand-dark mb-1">
              Final Value / Total Return ($)
            </label>
            <input
              id={finalId}
              type="number"
              step="100"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={yearsId} className="block text-sm font-semibold text-brand-dark mb-1">
              Holding Period (Years, Optional)
            </label>
            <input
              id={yearsId}
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 3"
              value={investmentPeriodYears}
              onChange={(e) => setInvestmentPeriodYears(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Return on Investment (ROI)
              </div>
              <div className={`text-4xl font-extrabold ${isProfit ? 'text-emerald-700' : 'text-rose-600'}`}>
                {outcome.value.formattedRoiPercentage}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Net Profit / Gain</span>
                  <strong className={`block text-base mt-0.5 ${isProfit ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {outcome.value.formattedNetProfit}
                  </strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Annualized ROI (CAGR)</span>
                  <strong className="block text-brand-dark text-base mt-0.5">
                    {outcome.value.formattedAnnualizedRoi}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid initial and final investment amounts.
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
