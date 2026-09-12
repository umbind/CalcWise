import { useState, useId } from 'react';
import { calculateIdealWeight } from '../../../lib/calculations/ideal_weight';

export default function IdealWeightIsland() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<string>('178');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const heightId = useId();

  const outcome = calculateIdealWeight({
    gender,
    heightCm,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="block text-xs font-semibold text-brand-dark mb-1.5">Biological Sex</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                  gender === 'male'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                  gender === 'female'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label htmlFor={heightId} className="block text-sm font-semibold text-brand-dark mb-1">
              Height (cm)
            </label>
            <input
              id={heightId}
              type="number"
              step="1"
              min="140"
              max="230"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <div className="text-xs text-brand-muted mt-1">
              Approx. {Math.floor(Number(heightCm || 0) / 30.48)} ft {Math.round((Number(heightCm || 0) % 30.48) / 2.54)} in
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Ideal Body Weight
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedAverageKg}
                <span className="text-lg font-normal text-brand-muted ml-2">({outcome.value.formattedAverageLbs})</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Healthy BMI Range (18.5 - 24.9):{' '}
                <strong className="text-brand-dark">
                  {outcome.value.healthyBmiRangeKg.min} - {outcome.value.healthyBmiRangeKg.max} kg
                </strong>{' '}
                ({outcome.value.healthyBmiRangeLbs.min} - {outcome.value.healthyBmiRangeLbs.max} lbs)
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Clinical Formula Comparison
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {outcome.value.clinicalFormulas.map((f) => (
                    <div key={f.formulaName} className="bg-white border border-gray-200 p-2.5 rounded-lg">
                      <span className="block text-brand-muted text-[11px] truncate">{f.formulaName}</span>
                      <strong className="block text-brand-dark text-sm mt-0.5">{f.formattedKg} ({f.formattedLbs})</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter a valid height between 140 cm and 230 cm.
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
