import { useState, useId } from 'react';
import { calculatePace } from '../../../lib/calculations/pace';

export default function PaceIsland() {
  const [distance, setDistance] = useState<string>('10');
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('km');
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('50');
  const [seconds, setSeconds] = useState<string>('0');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const distId = useId();
  const unitId = useId();
  const hrsId = useId();
  const minId = useId();
  const secId = useId();

  const outcome = calculatePace({
    distance,
    distanceUnit,
    hours,
    minutes,
    seconds,
  });

  const setPreset = (d: string, u: 'miles' | 'km') => {
    setDistance(d);
    setDistanceUnit(u);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label htmlFor={distId} className="block text-xs font-semibold text-brand-dark mb-1">
                Distance
              </label>
              <input
                id={distId}
                type="number"
                step="0.1"
                min="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={unitId} className="block text-xs font-semibold text-brand-dark mb-1">
                Unit
              </label>
              <select
                id={unitId}
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'miles' | 'km')}
                className="w-full px-2 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-brand-muted mb-1">Quick Events</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPreset('5', 'km')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                5K
              </button>
              <button
                type="button"
                onClick={() => setPreset('10', 'km')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                10K
              </button>
              <button
                type="button"
                onClick={() => setPreset('13.1', 'miles')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Half (13.1 mi)
              </button>
              <button
                type="button"
                onClick={() => setPreset('26.2', 'miles')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Marathon (26.2 mi)
              </button>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-brand-dark mb-1">Time (Hours : Minutes : Seconds)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor={hrsId} className="sr-only">Hours</label>
                <input
                  id={hrsId}
                  type="number"
                  placeholder="HH"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-2 py-2 text-center bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor={minId} className="sr-only">Minutes</label>
                <input
                  id={minId}
                  type="number"
                  placeholder="MM"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-2 py-2 text-center bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor={secId} className="sr-only">Seconds</label>
                <input
                  id={secId}
                  type="number"
                  placeholder="SS"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full px-2 py-2 text-center bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Target Pace
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {distanceUnit === 'miles' ? outcome.value.pacePerMileString : outcome.value.pacePerKmString}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Equivalent: <strong className="text-brand-dark">{distanceUnit === 'miles' ? outcome.value.pacePerKmString : outcome.value.pacePerMileString}</strong>
                {' • '}Speed: <strong className="text-brand-dark">{outcome.value.speedMph} mph</strong> ({outcome.value.speedKmh} km/h)
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Equivalent Race Splits
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {outcome.value.standardSplits.map((split) => (
                    <div key={split.event} className="bg-white border border-gray-200 p-2 rounded-lg text-xs">
                      <span className="block text-brand-muted font-medium text-[11px]">{split.event}</span>
                      <strong className="block text-brand-dark font-bold mt-0.5">{split.formattedTime}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid distance and duration values.
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
