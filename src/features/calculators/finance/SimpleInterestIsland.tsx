import { useState, useId } from 'react';
import { calculateSimpleInterest } from '../../../lib/calculations/simple_interest';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function SimpleInterestIsland() {
  const [principal, setPrincipal] = useState<string>('5000');
  const [rate, setRate] = useState<string>('5');
  const [time, setTime] = useState<string>('3');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const principalId = useId();
  const rateId = useId();
  const timeId = useId();

  const outcome = calculateSimpleInterest({
    principal,
    annualRate: rate,
    timeYears: time,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={principalId} className="block text-sm font-semibold text-brand-dark mb-1">
              Principal Amount (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
            </label>
            <input
              id={principalId}
              type="number"
              min="0"
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              id={rateId}
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={timeId} className="block text-sm font-semibold text-brand-dark mb-1">
              Time Duration (Years)
            </label>
            <input
              id={timeId}
              type="number"
              min="0"
              step="0.5"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Interest Earned
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                <span translate="no" className="notranslate">{outcome.value.formattedInterest}</span>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-medium text-brand-muted">Total Repayment (P + I)</span>
                <span translate="no" className="notranslate text-2xl font-bold text-brand-dark">{outcome.value.formattedTotal}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid positive numbers.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Math Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                {outcome.trace.map((s) => (
                  <div key={s.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-brand-dark font-medium">{s.label}</span>
                    <span translate="no" className="notranslate font-mono text-brand-primary font-bold">{s.result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
