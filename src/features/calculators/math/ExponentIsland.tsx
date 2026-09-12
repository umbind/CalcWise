import { useState, useId } from 'react';
import { calculateExponent } from '../../../lib/calculations/exponent';

export default function ExponentIsland() {
  const [base, setBase] = useState<string>('2');
  const [exponent, setExponent] = useState<string>('8');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const baseId = useId();
  const expId = useId();

  const outcome = calculateExponent({
    base,
    exponent,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={baseId} className="block text-xs font-semibold text-brand-dark mb-1">
                Base (b)
              </label>
              <input
                id={baseId}
                type="number"
                step="any"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={expId} className="block text-xs font-semibold text-brand-dark mb-1">
                Exponent / Power (x)
              </label>
              <input
                id={expId}
                type="number"
                step="any"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-brand-muted mb-1">Common Powers</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { setBase('2'); setExponent('10'); }}
                className="px-2 py-1 text-[11px] font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                2¹⁰ (1024)
              </button>
              <button
                type="button"
                onClick={() => { setBase('10'); setExponent('6'); }}
                className="px-2 py-1 text-[11px] font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                10⁶ (Million)
              </button>
              <button
                type="button"
                onClick={() => { setBase('27'); setExponent('0.333333'); }}
                className="px-2 py-1 text-[11px] font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Cube Root (b⅓)
              </button>
              <button
                type="button"
                onClick={() => { setBase('2'); setExponent('-1'); }}
                className="px-2 py-1 text-[11px] font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Reciprocal (b⁻¹)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Result: {base}<sup>{exponent}</sup>
              </div>
              <div className="text-4xl font-extrabold text-brand-primary font-mono mt-1 break-words">
                {outcome.value.formattedResult}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Scientific Notation: <strong className="font-mono text-brand-dark">{outcome.value.scientificNotation}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Power Classification</span>
                  <strong className="block text-brand-dark text-sm capitalize mt-0.5">
                    {outcome.value.isNegativeExponent ? 'Negative (Reciprocal)' : outcome.value.isFractionalExponent ? 'Fractional (Radical/Root)' : 'Integer Exponent'}
                  </strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Base</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">{outcome.value.base}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid numeric values for base and exponent.
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
