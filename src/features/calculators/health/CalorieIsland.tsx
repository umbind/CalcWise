import { useState, useId } from 'react';
import {
  calculateCalories,
  ACTIVITY_MULTIPLIERS,
  type ActivityLevel,
} from '../../../lib/calculations/calorie';
import type { BiologicalSex, BmrUnitSystem } from '../../../lib/calculations/bmr';

export default function CalorieIsland() {
  const [sex, setSex] = useState<BiologicalSex>('female');
  const [unitSystem, setUnitSystem] = useState<BmrUnitSystem>('metric');
  const [age, setAge] = useState<string>('30');
  const [weightKg, setWeightKg] = useState<string>('65');
  const [heightCm, setHeightCm] = useState<string>('168');
  const [weightLbs, setWeightLbs] = useState<string>('145');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('6');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const ageId = useId();
  const actId = useId();

  const outcome = calculateCalories({
    sex,
    unitSystem,
    age,
    weightKg,
    heightCm,
    weightLbs,
    heightFeet,
    heightInches,
    activityLevel: activity,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Sex:</span>
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
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
          </div>

          {unitSystem === 'metric' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">Weight (lbs)</label>
                <input
                  type="number"
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
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1">Inches</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor={actId} className="block text-sm font-semibold text-brand-dark mb-1">
              Physical Activity Level
            </label>
            <select
              id={actId}
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.description})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Output: Caloric Targets Table */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Daily Energy Expenditure (TDEE)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedTdee}
                <span className="text-sm font-normal text-brand-muted ml-1">/ day to maintain</span>
              </div>

              {/* Goal Targets Grid */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
                  Calorie Targets for Your Goals:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-[11px] text-brand-muted">Weight Maintenance</span>
                    <span className="font-bold text-sm text-brand-dark">{outcome.value.targets.maintenance} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 bg-emerald-50/20">
                    <span className="block text-[11px] text-emerald-800 font-medium">Mild Fat Loss (-0.5lb/wk)</span>
                    <span className="font-bold text-sm text-emerald-700">{outcome.value.targets.mildWeightLoss} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-300 bg-emerald-50/40">
                    <span className="block text-[11px] text-emerald-900 font-bold">Standard Loss (-1lb/wk)</span>
                    <span className="font-bold text-sm text-emerald-800">{outcome.value.targets.weightLoss} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <span className="block text-[11px] text-blue-800">Mild Gain (+0.5lb/wk)</span>
                    <span className="font-bold text-sm text-blue-700">{outcome.value.targets.mildWeightGain} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-300">
                    <span className="block text-[11px] text-blue-900">Muscle Gain (+1lb/wk)</span>
                    <span className="font-bold text-sm text-blue-800">{outcome.value.targets.weightGain} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-[11px] text-gray-500">Resting BMR</span>
                    <span className="font-bold text-sm text-gray-600">{outcome.value.bmr} kcal</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid inputs.</div>
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
