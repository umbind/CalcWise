import { useState, useId } from 'react';
import { calculateTargetHeartRate } from '../../../lib/calculations/target_heart_rate';

export default function TargetHeartRateIsland() {
  const [age, setAge] = useState<string>('30');
  const [restingHeartRate, setRestingHeartRate] = useState<string>('60');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const ageId = useId();
  const rhrId = useId();

  const outcome = calculateTargetHeartRate({
    age,
    restingHeartRate,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={ageId} className="block text-sm font-semibold text-brand-dark mb-1">
              Your Age (Years)
            </label>
            <input
              id={ageId}
              type="number"
              min="10"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={rhrId} className="block text-sm font-semibold text-brand-dark mb-1">
              Resting Heart Rate (BPM, Optional)
            </label>
            <input
              id={rhrId}
              type="number"
              min="30"
              max="130"
              placeholder="e.g. 60 (Enables Karvonen Formula)"
              value={restingHeartRate}
              onChange={(e) => setRestingHeartRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <span className="block text-xs text-brand-muted mt-1">
              Measure upon waking for most accurate Heart Rate Reserve (HRR).
            </span>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Estimated Max Heart Rate (Tanaka)
                  </div>
                  <div className="text-4xl font-extrabold text-brand-primary mt-0.5">
                    {outcome.value.maxHeartRateTanaka} <span className="text-base font-normal text-brand-muted">bpm</span>
                  </div>
                </div>
                <div className="text-right text-xs text-brand-muted">
                  Fox (220 - Age): <strong className="text-brand-dark">{outcome.value.maxHeartRateFox} bpm</strong>
                  <span className="block text-[11px] text-brand-primary font-medium mt-0.5">{outcome.value.methodUsed}</span>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                {outcome.value.zones.map((z) => (
                  <div key={z.zoneNumber} className="bg-white border border-gray-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-brand-dark">
                        Zone {z.zoneNumber}: {z.zoneName}
                        <span className="ml-2 font-normal text-brand-muted">({z.intensityRange})</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{z.description}</div>
                    </div>
                    <div className="text-right whitespace-nowrap pl-3">
                      <strong className="text-sm font-extrabold text-brand-primary">{z.minBpm} - {z.maxBpm}</strong>
                      <span className="block text-[10px] text-brand-muted uppercase">bpm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter a valid age between 10 and 100.
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
