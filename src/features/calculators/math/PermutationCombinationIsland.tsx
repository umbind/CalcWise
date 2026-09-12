import { useState, useId } from 'react';
import { calculatePermutationCombination } from '../../../lib/calculations/permutation_combination';

export default function PermutationCombinationIsland() {
  const [n, setN] = useState<string>('10');
  const [r, setR] = useState<string>('3');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const nId = useId();
  const rId = useId();

  const outcome = calculatePermutationCombination({
    n,
    r,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={nId} className="block text-sm font-semibold text-brand-dark mb-1">
              Total Number of Items (n)
            </label>
            <input
              id={nId}
              type="number"
              min="0"
              max="150"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <span className="block text-xs text-brand-muted mt-1">
              The total size of the set from which selections are made.
            </span>
          </div>

          <div>
            <label htmlFor={rId} className="block text-sm font-semibold text-brand-dark mb-1">
              Number of Items Chosen (r)
            </label>
            <input
              id={rId}
              type="number"
              min="0"
              max="150"
              value={r}
              onChange={(e) => setR(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <span className="block text-xs text-brand-muted mt-1">
              The sample size selected (r ≤ n for non-repeating selections).
            </span>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Combinations: nCr (Order Ignored)
                  </span>
                  <div className="text-3xl font-extrabold text-brand-primary font-mono mt-1 break-words">
                    {outcome.value.combinationsNoRepetition}
                  </div>
                  <span className="text-[11px] text-brand-muted mt-1 block">
                    C({n}, {r}) = {n}! / ({r}!({n}-{r})!)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Permutations: nPr (Order Matters)
                  </span>
                  <div className="text-3xl font-extrabold text-brand-dark font-mono mt-1 break-words">
                    {outcome.value.permutationsNoRepetition}
                  </div>
                  <span className="text-[11px] text-brand-muted mt-1 block">
                    P({n}, {r}) = {n}! / ({n}-{r})!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">With Repetition (Permutations)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5 break-words">
                    {outcome.value.permutationsWithRepetition}
                  </strong>
                  <span className="text-[10px] text-gray-500 font-mono">n^r = {n}^{r}</span>
                </div>
                <div>
                  <span className="block text-brand-muted">With Repetition (Combinations)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5 break-words">
                    {outcome.value.combinationsWithRepetition}
                  </strong>
                  <span className="text-[10px] text-gray-500 font-mono">(n+r-1)Cr</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter non-negative integers where r ≤ n.
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
