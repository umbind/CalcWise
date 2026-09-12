import { useState, useId } from 'react';
import { calculateLogarithm } from '../../../lib/calculations/logarithm';

export default function LogarithmIsland() {
  const [value, setValue] = useState<string>('1000');
  const [base, setBase] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const valId = useId();
  const baseId = useId();

  const outcome = calculateLogarithm({
    value,
    base,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={valId} className="block text-sm font-semibold text-brand-dark mb-1">
              Number / Argument (x &gt; 0)
            </label>
            <input
              id={valId}
              type="number"
              step="any"
              min="0.000001"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={baseId} className="block text-sm font-semibold text-brand-dark mb-1">
              Logarithm Base (b &gt; 0, b ≠ 1)
            </label>
            <input
              id={baseId}
              type="text"
              placeholder="10, 2, or e"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-brand-muted mb-1">Quick Presets</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setBase('10')}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Base 10 (log₁₀)
              </button>
              <button
                type="button"
                onClick={() => setBase('e')}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Natural (ln)
              </button>
              <button
                type="button"
                onClick={() => setBase('2')}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Binary (log₂)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                log<sub>{outcome.value.baseUsed}</sub>({outcome.value.value})
              </div>
              <div className="text-4xl font-extrabold text-brand-primary font-mono mt-1 break-words">
                {outcome.value.formattedResult}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Common log₁₀(x)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">{outcome.value.commonLog}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Natural ln(x)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">{outcome.value.naturalLog}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Binary log₂(x)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">{outcome.value.binaryLog}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter an argument x &gt; 0 and a base b &gt; 0 (b ≠ 1).
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
