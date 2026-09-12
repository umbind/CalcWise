import { useState, useId } from 'react';
import { calculateBmr, type BiologicalSex, type BmrUnitSystem } from '../../../lib/calculations/bmr';

export default function BmrIsland() {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [unitSystem, setUnitSystem] = useState<BmrUnitSystem>('metric');
  const [age, setAge] = useState<string>('28');
  const [weightKg, setWeightKg] = useState<string>('75');
  const [heightCm, setHeightCm] = useState<string>('178');
  const [weightLbs, setWeightLbs] = useState<string>('165');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const ageId = useId();
  const weightId = useId();
  const heightId = useId();

  const outcome = calculateBmr({
    sex,
    unitSystem,
    age,
    weightKg,
    heightCm,
    weightLbs,
    heightFeet,
    heightInches,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Toggles: Sex & Units */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Biological Sex:</span>
          <div className="inline-flex p-1 bg-brand-surface rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setSex('male')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                sex === 'male' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSex('female')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                sex === 'female' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Units:</span>
          <div className="inline-flex p-1 bg-brand-surface rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                unitSystem === 'metric' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                unitSystem === 'imperial' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Imperial (lbs/in)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={ageId} className="block text-sm font-semibold text-brand-dark mb-1">
              Age (Years)
            </label>
            <input
              id={ageId}
              type="number"
              min="15"
              max="110"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          {unitSystem === 'metric' ? (
            <>
              <div>
                <label htmlFor={weightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Weight (kg)
                </label>
                <input
                  id={weightId}
                  type="number"
                  min="20"
                  max="400"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor={heightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Height (cm)
                </label>
                <input
                  id={heightId}
                  type="number"
                  min="50"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor={weightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Weight (lbs)
                </label>
                <input
                  id={weightId}
                  type="number"
                  min="40"
                  max="900"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1">Feet</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1">Inches</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Basal Metabolic Rate (BMR)
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-brand-primary">
                  {outcome.value.formattedBmr}
                </span>
                <span className="text-sm text-brand-muted font-normal">/ day</span>
              </div>
              <p className="text-xs text-brand-muted mt-2">
                Your body burns approximately this amount of energy every 24 hours at complete rest to sustain vital organs, breathing, and circulation.
              </p>

              <div className="mt-6 pt-5 border-t border-gray-200 text-xs">
                <span className="text-brand-dark font-medium">Comparison Models:</span>
                <div className="mt-2 flex justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <span>Revised Harris-Benedict:</span>
                  <span className="font-bold text-brand-dark">{outcome.value.bmrHarrisBenedict.toLocaleString()} kcal/day</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid age, height, and weight.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Mathematical Step Trace</span>
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
