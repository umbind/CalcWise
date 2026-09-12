import { useState, useId } from 'react';
import { calculateDateDifference } from '../../../lib/calculations/date_diff';

export default function DateDiffIsland() {
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const startId = useId();
  const endId = useId();

  const outcome = calculateDateDifference({
    startDate,
    endDate,
    includeEndDay,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={startId} className="block text-sm font-semibold text-brand-dark mb-1">
              Start Date
            </label>
            <input
              id={startId}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
          </div>

          <div>
            <label htmlFor={endId} className="block text-sm font-semibold text-brand-dark mb-1">
              End Date
            </label>
            <input
              id={endId}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs font-medium text-brand-dark cursor-pointer">
              <input
                type="checkbox"
                checked={includeEndDay}
                onChange={(e) => setIncludeEndDay(e.target.checked)}
                className="rounded text-brand-primary focus:ring-brand-primary"
              />
              <span>Include end day in total (+1 day)</span>
            </label>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Calendar Days Difference
              </div>
              <div className="text-4xl sm:text-5xl font-black text-brand-primary">
                {outcome.value.totalDays.toLocaleString()}{' '}
                <span className="text-xl font-bold text-brand-dark">Days</span>
              </div>

              <div className="text-sm font-semibold text-brand-dark mt-2">
                = {outcome.value.formattedDuration}
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Weeks</span>
                  <span className="font-bold text-sm text-brand-dark">
                    {outcome.value.totalWeeks} wks, {outcome.value.remainingDays} days
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Business Days</span>
                  <span className="font-bold text-sm text-emerald-700">
                    {outcome.value.businessDays.toLocaleString()} days
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Weekend Days</span>
                  <span className="font-bold text-sm text-brand-dark">
                    {outcome.value.weekendDays.toLocaleString()} days
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid start and end dates.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Calendar Step Trace</span>
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
