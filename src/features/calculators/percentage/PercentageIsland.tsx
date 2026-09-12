import { useState, useId } from 'react';
import { calculatePercentage, type PercentageMode } from '../../../lib/calculations/percentage';

export default function PercentageIsland() {
  const [mode, setMode] = useState<PercentageMode>('percent_of');
  const [valA, setValA] = useState<string>('20');
  const [valB, setValB] = useState<string>('150');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const inputAId = useId();
  const inputBId = useId();
  const modeId = useId();

  const outcome = calculatePercentage({ mode, valA, valB });

  const getLabels = () => {
    switch (mode) {
      case 'percent_of':
        return { labelA: 'Percentage (%)', labelB: 'Of Number', placeholderA: 'e.g. 20', placeholderB: 'e.g. 150' };
      case 'what_percent':
        return { labelA: 'Part Value (X)', labelB: 'Whole Value (Y)', placeholderA: 'e.g. 25', placeholderB: 'e.g. 200' };
      case 'percentage_change':
        return { labelA: 'Initial Value (From)', labelB: 'Final Value (To)', placeholderA: 'e.g. 100', placeholderB: 'e.g. 150' };
      case 'percentage_increase':
        return { labelA: 'Base Value', labelB: 'Increase By (%)', placeholderA: 'e.g. 50', placeholderB: 'e.g. 15' };
      case 'percentage_decrease':
        return { labelA: 'Base Value', labelB: 'Decrease By (%)', placeholderA: 'e.g. 80', placeholderB: 'e.g. 20' };
    }
  };

  const labels = getLabels();

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Mode Selector Tabs */}
      <div className="mb-6">
        <label htmlFor={modeId} className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
          Select Calculation Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 p-1 bg-brand-surface rounded-xl border border-gray-200">
          {[
            { id: 'percent_of', label: '% of Number' },
            { id: 'what_percent', label: 'X is what % of Y' },
            { id: 'percentage_change', label: '% Change' },
            { id: 'percentage_increase', label: '% Increase' },
            { id: 'percentage_decrease', label: '% Decrease' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id as PercentageMode)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all text-center focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                mode === item.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-dark hover:bg-white/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor={inputAId} className="block text-sm font-semibold text-brand-dark mb-1">
            {labels.labelA}
          </label>
          <input
            id={inputAId}
            type="number"
            step="any"
            value={valA}
            onChange={(e) => setValA(e.target.value)}
            placeholder={labels.placeholderA}
            className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
          />
        </div>

        <div>
          <label htmlFor={inputBId} className="block text-sm font-semibold text-brand-dark mb-1">
            {labels.labelB}
          </label>
          <input
            id={inputBId}
            type="number"
            step="any"
            value={valB}
            onChange={(e) => setValB(e.target.value)}
            placeholder={labels.placeholderB}
            className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
          />
        </div>
      </div>

      {/* Dynamic Results Display */}
      {outcome.status === 'success' && outcome.value && (
        <div className="bg-brand-surface border border-brand-primary/20 rounded-xl p-6" aria-live="polite">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
            {outcome.value.modeLabel}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-primary">
              {outcome.value.formattedResult}
              {mode === 'what_percent' || mode === 'percentage_change' ? '%' : ''}
            </span>
          </div>
          <p className="text-sm text-brand-muted mt-2">
            {outcome.value.explanation}
          </p>

          {/* Toggle Calculation Trace */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:text-brand-primary-dark inline-flex items-center space-x-1 focus:outline-none focus:underline"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Step-by-Step Calculation Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>

            {showTrace && (
              <div className="mt-3 space-y-2 bg-white rounded-lg p-4 border border-gray-200 text-xs">
                {outcome.trace.map((step) => (
                  <div key={step.stepNumber} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-brand-dark">Step {step.stepNumber}: {step.label}</span>
                    <span className="font-mono text-brand-primary font-bold">{step.expression} = {step.result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {outcome.status === 'invalid' && outcome.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800" role="alert">
          <strong className="font-bold">Input Error: </strong>
          {outcome.warnings[0].message}
        </div>
      )}
    </div>
  );
}
