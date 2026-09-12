import { useState, useId } from 'react';
import { calculateRatio } from '../../../lib/calculations/ratio';

export default function RatioIsland() {
  const [a, setA] = useState<string>('3');
  const [b, setB] = useState<string>('5');
  const [c, setC] = useState<string>('6');
  const [d, setD] = useState<string>('');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const aId = useId();
  const bId = useId();
  const cId = useId();
  const dId = useId();

  const outcome = calculateRatio({
    a,
    b,
    c,
    d,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs text-brand-muted">
            Leave <strong>any one field empty</strong> to solve for that unknown term.
          </div>

          <div className="p-4 bg-brand-surface rounded-xl border border-gray-200">
            <div className="flex items-center justify-between gap-3 text-center">
              <div className="flex-1 space-y-2">
                <div>
                  <label htmlFor={aId} className="block text-[11px] font-bold text-brand-dark mb-1">
                    Term A
                  </label>
                  <input
                    id={aId}
                    type="number"
                    step="any"
                    placeholder="A"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full px-2 py-2 text-center bg-white border border-gray-300 rounded text-sm font-bold text-brand-dark"
                  />
                </div>
                <div className="text-xs text-gray-400 font-bold">∶</div>
                <div>
                  <label htmlFor={bId} className="block text-[11px] font-bold text-brand-dark mb-1">
                    Term B
                  </label>
                  <input
                    id={bId}
                    type="number"
                    step="any"
                    placeholder="B"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full px-2 py-2 text-center bg-white border border-gray-300 rounded text-sm font-bold text-brand-dark"
                  />
                </div>
              </div>

              <div className="text-xl font-extrabold text-brand-primary font-mono">
                =
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label htmlFor={cId} className="block text-[11px] font-bold text-brand-dark mb-1">
                    Term C
                  </label>
                  <input
                    id={cId}
                    type="number"
                    step="any"
                    placeholder="C"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    className="w-full px-2 py-2 text-center bg-white border border-gray-300 rounded text-sm font-bold text-brand-dark"
                  />
                </div>
                <div className="text-xs text-gray-400 font-bold">∶</div>
                <div>
                  <label htmlFor={dId} className="block text-[11px] font-bold text-brand-dark mb-1">
                    Term D
                  </label>
                  <input
                    id={dId}
                    type="number"
                    step="any"
                    placeholder="?"
                    value={d}
                    onChange={(e) => setD(e.target.value)}
                    className="w-full px-2 py-2 text-center bg-white border border-gray-300 rounded text-sm font-bold text-brand-dark"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                {outcome.value.solvedVariable !== 'none'
                  ? `Solved Value for ${outcome.value.solvedVariable}`
                  : 'Proportion Equality'}
              </div>
              <div className="text-4xl font-extrabold text-brand-primary font-mono">
                {outcome.value.solvedVariable !== 'none'
                  ? `${outcome.value.solvedVariable} = ${outcome.value.solvedValue}`
                  : outcome.value.formattedProportion}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Complete Proportion:{' '}
                <strong className="text-brand-dark font-mono font-bold">
                  {outcome.value.a} : {outcome.value.b} = {outcome.value.c} : {outcome.value.d}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Simplified Ratio (A : B)</span>
                  <strong className="block text-brand-dark text-base font-mono mt-0.5">{outcome.value.simplifiedRatio}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Decimal Value (A ÷ B)</span>
                  <strong className="block text-brand-dark text-base font-mono mt-0.5">{outcome.value.decimalEquivalent}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter at least 3 values with non-zero denominators.
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
