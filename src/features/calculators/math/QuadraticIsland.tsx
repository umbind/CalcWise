import { useState, useId } from 'react';
import { calculateQuadratic } from '../../../lib/calculations/quadratic';

export default function QuadraticIsland() {
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('-5');
  const [c, setC] = useState<string>('6');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const aId = useId();
  const bId = useId();
  const cId = useId();

  const outcome = calculateQuadratic({
    a,
    b,
    c,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-sm font-semibold text-brand-dark">
            Equation: <span className="font-mono text-brand-primary font-bold">ax² + bx + c = 0</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={aId} className="block text-xs font-semibold text-brand-dark mb-1">
                Coefficient a
              </label>
              <input
                id={aId}
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={bId} className="block text-xs font-semibold text-brand-dark mb-1">
                Coefficient b
              </label>
              <input
                id={bId}
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={cId} className="block text-xs font-semibold text-brand-dark mb-1">
                Constant c
              </label>
              <input
                id={cId}
                type="number"
                step="any"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="p-3 bg-brand-surface rounded-lg border border-gray-200 text-xs font-mono text-center text-brand-dark">
            {outcome.status === 'success' && outcome.value ? outcome.value.formattedEquation : 'Invalid Equation'}
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Roots / Solutions (x)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary font-mono mt-1">
                {outcome.value.rootType === 'one_real' ? (
                  `x = ${outcome.value.root1}`
                ) : (
                  `x₁ = ${outcome.value.root1}, x₂ = ${outcome.value.root2}`
                )}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Nature of Roots: <strong className="text-brand-dark capitalize">{outcome.value.rootType.replace('_', ' ')}</strong>
                {' • '}Discriminant Δ = <strong className="font-mono text-brand-dark">{outcome.value.discriminant}</strong>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Vertex (h, k)</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">{outcome.value.formattedVertex}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Orientation</span>
                  <strong className="block text-brand-dark text-sm capitalize mt-0.5">Opens {outcome.value.parabolaDirection}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">y-Intercept</span>
                  <strong className="block text-brand-dark text-sm font-mono mt-0.5">(0, {outcome.value.yIntercept})</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid coefficients (coefficient 'a' cannot be zero).
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
