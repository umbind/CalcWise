import { useState, useId } from 'react';
import { calculateAverage } from '../../../lib/calculations/average';

export default function AverageIsland() {
  const [dataset, setDataset] = useState<string>('12, 18, 24, 24, 30, 42, 50');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const inputId = useId();

  const outcome = calculateAverage({ rawDataset: dataset });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={inputId} className="block text-sm font-semibold text-brand-dark mb-1">
              Input Dataset (Separate with commas, spaces, or lines)
            </label>
            <textarea
              id={inputId}
              rows={5}
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
              className="w-full p-3 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-brand-muted">Try sample:</span>
            <button
              type="button"
              onClick={() => setDataset('85, 90, 78, 92, 88, 76, 95')}
              className="text-brand-primary hover:underline font-medium"
            >
              Test Scores
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setDataset('1200, 1450, 980, 2100, 1750')}
              className="text-brand-primary hover:underline font-medium"
            >
              Monthly Costs
            </button>
          </div>
        </div>

        {/* Right Output: Key Stats */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Arithmetic Mean (Average)
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                {outcome.value.formattedMean}
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Median</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.formattedMedian}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Mode</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.modeDescription}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Sample Std Dev</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.sampleStandardDeviation}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Sum</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.sum.toLocaleString()}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Count (N)</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.count}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Range (Max - Min)</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.range}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide a valid list of numbers.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Calculation Trace</span>
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
