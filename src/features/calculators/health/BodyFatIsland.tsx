import { useState, useId } from 'react';
import { calculateBodyFat } from '../../../lib/calculations/body_fat';

export default function BodyFatIsland() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState<string>('80');
  const [heightCm, setHeightCm] = useState<string>('180');
  const [waistCm, setWaistCm] = useState<string>('88');
  const [neckCm, setNeckCm] = useState<string>('38');
  const [hipCm, setHipCm] = useState<string>('98');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const weightId = useId();
  const heightId = useId();
  const waistId = useId();
  const neckId = useId();
  const hipId = useId();

  const outcome = calculateBodyFat({
    gender,
    weightKg,
    heightCm,
    waistCm,
    neckCm,
    hipCm: gender === 'female' ? hipCm : undefined,
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={weightId} className="block text-xs font-semibold text-brand-dark mb-1">
                Weight (kg)
              </label>
              <input
                id={weightId}
                type="number"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={heightId} className="block text-xs font-semibold text-brand-dark mb-1">
                Height (cm)
              </label>
              <input
                id={heightId}
                type="number"
                step="0.5"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={waistId} className="block text-xs font-semibold text-brand-dark mb-1">
                Waist (cm, at navel)
              </label>
              <input
                id={waistId}
                type="number"
                step="0.5"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={neckId} className="block text-xs font-semibold text-brand-dark mb-1">
                Neck (cm, narrowest)
              </label>
              <input
                id={neckId}
                type="number"
                step="0.5"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          {gender === 'female' && (
            <div>
              <label htmlFor={hipId} className="block text-xs font-semibold text-brand-dark mb-1">
                Hips (cm, widest point)
              </label>
              <input
                id={hipId}
                type="number"
                step="0.5"
                value={hipCm}
                onChange={(e) => setHipCm(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Body Fat Percentage
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedBodyFat}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Category: <strong className="text-brand-dark font-semibold">{outcome.value.category}</strong> (ACE Guidelines)
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Body Fat Mass</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.formattedFatMass}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Lean Body Mass</span>
                  <strong className="block text-emerald-700 text-base mt-0.5">{outcome.value.formattedLeanMass}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid body circumference measurements.
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
