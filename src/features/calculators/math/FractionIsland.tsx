import { useState } from 'react';
import { calculateFraction, type FractionOperation } from '../../../lib/calculations/fraction';

export default function FractionIsland() {
  const [num1, setNum1] = useState<string>('3');
  const [den1, setDen1] = useState<string>('4');
  const [op, setOp] = useState<FractionOperation>('add');
  const [num2, setNum2] = useState<string>('2');
  const [den2, setDen2] = useState<string>('3');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const outcome = calculateFraction({
    num1,
    den1,
    op,
    num2,
    den2,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Operation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-brand-surface rounded-xl border border-gray-200">
          {(
            [
              { id: 'add', label: 'Add (+)' },
              { id: 'subtract', label: 'Subtract (−)' },
              { id: 'multiply', label: 'Multiply (×)' },
              { id: 'divide', label: 'Divide (÷)' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOp(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                op === item.id ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Fraction Equation Inputs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center w-28">
          <label className="sr-only">Numerator 1</label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full text-center px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-bold text-lg"
          />
          <div className="w-full h-0.5 bg-brand-dark my-1.5"></div>
          <label className="sr-only">Denominator 1</label>
          <input
            type="number"
            value={den1}
            onChange={(e) => setDen1(e.target.value)}
            className="w-full text-center px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-bold text-lg"
          />
        </div>

        {/* Operation Symbol */}
        <div className="text-2xl font-black text-brand-primary">
          {op === 'add' ? '+' : op === 'subtract' ? '−' : op === 'multiply' ? '×' : '÷'}
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center w-28">
          <label className="sr-only">Numerator 2</label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full text-center px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-bold text-lg"
          />
          <div className="w-full h-0.5 bg-brand-dark my-1.5"></div>
          <label className="sr-only">Denominator 2</label>
          <input
            type="number"
            value={den2}
            onChange={(e) => setDen2(e.target.value)}
            className="w-full text-center px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-bold text-lg"
          />
        </div>

        <div className="text-2xl font-black text-brand-dark">=</div>

        {/* Instant Answer Preview */}
        {outcome.status === 'success' && outcome.value && (
          <div className="flex flex-col items-center bg-brand-surface p-3 rounded-xl border border-brand-primary/30 min-w-32 text-center">
            <span className="text-xs text-brand-muted font-semibold mb-1">Result</span>
            <span className="text-2xl font-black text-brand-primary font-mono">
              {outcome.value.formattedResult}
            </span>
            {outcome.value.mixedNumber !== outcome.value.formattedResult && (
              <span className="text-xs font-bold text-brand-dark mt-1">
                = {outcome.value.mixedNumber}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Result Card */}
      {outcome.status === 'success' && outcome.value ? (
        <div className="bg-brand-surface border border-brand-primary/20 rounded-xl p-6" aria-live="polite">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Calculated Equation
              </div>
              <div className="text-xl sm:text-2xl font-bold text-brand-dark">
                {outcome.value.operationString}
              </div>
            </div>

            <div className="flex gap-4 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">
                <span className="block text-brand-muted">Mixed Number</span>
                <span className="font-bold text-sm text-brand-primary">{outcome.value.mixedNumber}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">
                <span className="block text-brand-muted">Decimal Equivalent</span>
                <span className="font-bold text-sm text-brand-primary">{outcome.value.decimalValue}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Step-by-Step Reduction Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
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
      ) : (
        <div className="text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
          {outcome.warnings[0]?.message || 'Please provide valid non-zero denominators.'}
        </div>
      )}
    </div>
  );
}
