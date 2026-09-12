import { useState, useId } from 'react';
import { calculatePregnancyDueDate } from '../../../lib/calculations/pregnancy_due_date';

export default function PregnancyDueDateIsland() {
  // Default to ~8 weeks ago for realistic initial view
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 56);
  const defaultDateStr = defaultDate.toISOString().split('T')[0];

  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState<string>(defaultDateStr);
  const [cycleLengthDays, setCycleLengthDays] = useState<string>('28');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lmpId = useId();
  const cycleId = useId();

  const outcome = calculatePregnancyDueDate({
    lastMenstrualPeriod,
    cycleLengthDays,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={lmpId} className="block text-sm font-semibold text-brand-dark mb-1">
              First Day of Last Period (LMP)
            </label>
            <input
              id={lmpId}
              type="date"
              value={lastMenstrualPeriod}
              onChange={(e) => setLastMenstrualPeriod(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={cycleId} className="block text-sm font-semibold text-brand-dark mb-1">
              Average Cycle Length (Days)
            </label>
            <input
              id={cycleId}
              type="number"
              min="20"
              max="45"
              value={cycleLengthDays}
              onChange={(e) => setCycleLengthDays(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <span className="block text-xs text-brand-muted mt-1">
              Standard cycle is 28 days (ovulation at day 14).
            </span>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Delivery Date (EDD)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedDueDate}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Current Gestational Age:{' '}
                <strong className="text-brand-dark font-semibold">{outcome.value.formattedGestationalAge}</strong>
                {' • '}<span className="text-brand-primary font-semibold">{outcome.value.currentTrimester}</span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Gestational Timeline & Milestones
                </span>
                <div className="space-y-2 text-xs">
                  {outcome.value.milestones.map((m) => (
                    <div key={m.label} className="bg-white border border-gray-200 p-2.5 rounded-lg flex items-center justify-between">
                      <div>
                        <strong className="block text-brand-dark">{m.label}</strong>
                        <span className="text-[11px] text-gray-500">{m.description}</span>
                      </div>
                      <span className="font-semibold text-brand-primary text-xs pl-3 whitespace-nowrap">{m.dateString}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter a valid Last Menstrual Period date.
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
