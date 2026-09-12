import { useState, useId } from 'react';
import { calculateWaterIntake, type ClimateType } from '../../../lib/calculations/water';

export default function WaterIsland() {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [weightKg, setWeightKg] = useState<string>('70');
  const [weightLbs, setWeightLbs] = useState<string>('155');
  const [exercise, setExercise] = useState<string>('30');
  const [climate, setClimate] = useState<ClimateType>('normal');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const weightId = useId();
  const exerciseId = useId();

  const outcome = calculateWaterIntake({
    weightKg: unit === 'kg' ? weightKg : undefined,
    weightLbs: unit === 'lbs' ? weightLbs : undefined,
    exerciseMinutesDaily: exercise,
    climate,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={weightId} className="block text-sm font-semibold text-brand-dark">
                Body Weight ({unit})
              </label>
              <div className="inline-flex text-xs">
                <button
                  type="button"
                  onClick={() => setUnit('kg')}
                  className={`px-2 py-0.5 rounded-l border ${unit === 'kg' ? 'bg-brand-primary text-white font-bold' : 'bg-gray-100 text-brand-muted'}`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('lbs')}
                  className={`px-2 py-0.5 rounded-r border ${unit === 'lbs' ? 'bg-brand-primary text-white font-bold' : 'bg-gray-100 text-brand-muted'}`}
                >
                  lbs
                </button>
              </div>
            </div>
            <input
              id={weightId}
              type="number"
              value={unit === 'kg' ? weightKg : weightLbs}
              onChange={(e) => (unit === 'kg' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value))}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
          </div>

          <div>
            <label htmlFor={exerciseId} className="block text-sm font-semibold text-brand-dark mb-1">
              Daily Physical Exercise (Minutes)
            </label>
            <input
              id={exerciseId}
              type="number"
              min="0"
              max="240"
              step="15"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
            <div className="flex gap-2 mt-2">
              {['0', '30', '45', '60', '90'].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setExercise(mins)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-brand-muted rounded transition"
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">
              Climate Environment
            </label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value as ClimateType)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            >
              <option value="normal">Moderate / Temperate Climate</option>
              <option value="hot">Hot or Dry Climate (+10% hydration)</option>
              <option value="humid">Humid or Tropical Climate (+15% hydration)</option>
            </select>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Recommended Daily Water Intake
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                  {outcome.value.formattedLiters}
                </span>
                <span className="text-lg text-brand-dark font-bold">
                  ({outcome.value.formattedOunces})
                </span>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Equivalent Intake Volume:
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">8 oz Glasses / Day</span>
                    <span className="text-base font-bold text-brand-primary">{outcome.value.formattedCups}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Total Volume (ml)</span>
                    <span className="text-base font-bold text-brand-primary">{outcome.value.dailyMilliliters.toLocaleString()} ml</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-brand-muted mt-4 leading-relaxed">
                Includes water consumed directly, other beverages, and moisture from fruits and vegetables (~20% of total diet).
              </p>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide a valid body weight.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Hydration Breakdown</span>
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
