import { useState, useId } from 'react';
import { calculateTip } from '../../../lib/calculations/tip';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function TipIsland() {
  const [bill, setBill] = useState<string>('75.00');
  const [tipPct, setTipPct] = useState<string>('18');
  const [people, setPeople] = useState<string>('2');
  const [roundUp, setRoundUp] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const billId = useId();
  const peopleId = useId();

  const outcome = calculateTip({
    billAmount: bill,
    tipPercentage: tipPct,
    numberOfPeople: people,
    roundUpToNearestDollar: roundUp,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={billId} className="block text-sm font-semibold text-brand-dark mb-1">
              Bill Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-brand-muted font-bold text-sm">{currency}</span>
              <input
                id={billId}
                type="number"
                min="0"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">
              Tip Percentage (%)
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {['10', '15', '18', '20', '25'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPct(pct)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    tipPct === pct
                      ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                      : 'bg-brand-surface text-brand-muted border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={tipPct}
              onChange={(e) => setTipPct(e.target.value)}
              placeholder="Custom %"
              className="w-full px-3 py-1.5 bg-brand-surface border border-gray-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label htmlFor={peopleId} className="block text-sm font-semibold text-brand-dark mb-1">
              Split Between People
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPeople((prev) => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                className="w-9 h-9 rounded-lg bg-gray-100 text-brand-dark font-bold hover:bg-gray-200"
              >
                −
              </button>
              <input
                id={peopleId}
                type="number"
                min="1"
                max="50"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="flex-1 text-center py-1.5 bg-brand-surface border border-gray-300 rounded-lg font-bold text-sm"
              />
              <button
                type="button"
                onClick={() => setPeople((prev) => ((parseInt(prev) || 1) + 1).toString())}
                className="w-9 h-9 rounded-lg bg-gray-100 text-brand-dark font-bold hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs font-medium text-brand-dark cursor-pointer">
              <input
                type="checkbox"
                checked={roundUp}
                onChange={(e) => setRoundUp(e.target.checked)}
                className="rounded text-brand-primary focus:ring-brand-primary"
              />
              <span>Round up total bill to nearest whole dollar</span>
            </label>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                {outcome.value.numberOfPeople > 1 ? 'Total Per Person' : 'Total Payment'}
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                {outcome.value.numberOfPeople > 1 ? outcome.value.formattedTotalPerPerson : outcome.value.formattedTotal}
              </div>

              {outcome.value.numberOfPeople > 1 && (
                <p className="text-xs text-brand-muted mt-1">
                  Includes {outcome.value.formattedTipPerPerson} tip per person.
                </p>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Tip ({tipPct}%)</span>
                  <span className="text-base font-bold text-emerald-700">{outcome.value.formattedTip}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Bill (with Tip)</span>
                  <span className="text-base font-bold text-brand-dark">{outcome.value.formattedTotal}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide a valid bill amount.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                {outcome.trace.map((s) => (
                  <div key={s.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-brand-dark font-medium">{s.label}</span>
                    <span className="font-mono text-brand-primary font-bold">{s.result}</span>
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
