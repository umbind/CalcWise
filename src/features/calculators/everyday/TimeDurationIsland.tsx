import { useState, useId } from 'react';
import { calculateTimeDuration } from '../../../lib/calculations/time_duration';

export default function TimeDurationIsland() {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(today);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endDate, setEndDate] = useState<string>(nextMonth);
  const [endTime, setEndTime] = useState<string>('17:00');
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const sDateId = useId();
  const sTimeId = useId();
  const eDateId = useId();
  const eTimeId = useId();

  const outcome = calculateTimeDuration({
    startDate,
    startTime,
    endDate,
    endTime,
    includeEndDay,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={sDateId} className="block text-xs font-semibold text-brand-dark mb-1">
                Start Date
              </label>
              <input
                id={sDateId}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={sTimeId} className="block text-xs font-semibold text-brand-dark mb-1">
                Start Time
              </label>
              <input
                id={sTimeId}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={eDateId} className="block text-xs font-semibold text-brand-dark mb-1">
                End Date
              </label>
              <input
                id={eDateId}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={eTimeId} className="block text-xs font-semibold text-brand-dark mb-1">
                End Time
              </label>
              <input
                id={eTimeId}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              id="includeEndDayCheck"
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
            />
            <label htmlFor="includeEndDayCheck" className="text-xs font-semibold text-brand-dark cursor-pointer">
              Include end day in calculation (+1 full day)
            </label>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Elapsed Time
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary mt-1">
                {outcome.value.formattedDuration}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Summary: <strong className="text-brand-dark font-semibold">{outcome.value.formattedDaysSummary}</strong>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center font-mono">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted font-sans text-[11px]">Work Days</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.businessDays}</strong>
                  <span className="text-[10px] text-gray-500 font-sans">Mon - Fri</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted font-sans text-[11px]">Weekends</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.weekendDays}</strong>
                  <span className="text-[10px] text-gray-500 font-sans">Sat - Sun</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted font-sans text-[11px]">Total Hours</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.totalHours.toLocaleString()}</strong>
                  <span className="text-[10px] text-gray-500 font-sans">hours</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted font-sans text-[11px]">Total Minutes</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.totalMinutes.toLocaleString()}</strong>
                  <span className="text-[10px] text-gray-500 font-sans">minutes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please select valid start and end dates (end date must be after start date).
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
