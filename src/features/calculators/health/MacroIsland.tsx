import { useState, useId } from 'react';
import { calculateMacros } from '../../../lib/calculations/macro';
import type { MacroGoal } from '../../../lib/calculations/macro';

export default function MacroIsland() {
  const [dailyCalories, setDailyCalories] = useState<string>('2000');
  const [goal, setGoal] = useState<MacroGoal>('maintenance');
  const [customProteinPct, setCustomProteinPct] = useState<string>('30');
  const [customCarbsPct, setCustomCarbsPct] = useState<string>('40');
  const [customFatPct, setCustomFatPct] = useState<string>('30');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const calId = useId();
  const pId = useId();
  const cId = useId();
  const fId = useId();

  const outcome = calculateMacros({
    dailyCalories,
    goal,
    customProteinPct,
    customCarbsPct,
    customFatPct,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={calId} className="block text-sm font-semibold text-brand-dark mb-1">
              Target Daily Calories (kcal)
            </label>
            <input
              id={calId}
              type="number"
              step="50"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-brand-dark mb-1.5">Dietary Objective / Protocol</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGoal('maintenance')}
                className={`px-3 py-2 rounded-lg border transition ${
                  goal === 'maintenance'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Maintenance (30/40/30)
              </button>
              <button
                type="button"
                onClick={() => setGoal('cutting')}
                className={`px-3 py-2 rounded-lg border transition ${
                  goal === 'cutting'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Fat Loss / Cut (40/30/30)
              </button>
              <button
                type="button"
                onClick={() => setGoal('bulking')}
                className={`px-3 py-2 rounded-lg border transition ${
                  goal === 'bulking'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Muscle Gain / Bulk (25/55/20)
              </button>
              <button
                type="button"
                onClick={() => setGoal('keto')}
                className={`px-3 py-2 rounded-lg border transition ${
                  goal === 'keto'
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                }`}
              >
                Ketogenic (25/5/70)
              </button>
            </div>
            <button
              type="button"
              onClick={() => setGoal('custom')}
              className={`mt-2 w-full px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                goal === 'custom'
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
              }`}
            >
              Custom Percentages
            </button>
          </div>

          {goal === 'custom' && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div>
                <label htmlFor={pId} className="block text-[11px] font-semibold text-brand-dark mb-1">
                  Protein %
                </label>
                <input
                  id={pId}
                  type="number"
                  step="5"
                  value={customProteinPct}
                  onChange={(e) => setCustomProteinPct(e.target.value)}
                  className="w-full px-2 py-1.5 bg-brand-surface border border-gray-300 rounded text-xs text-brand-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor={cId} className="block text-[11px] font-semibold text-brand-dark mb-1">
                  Carbs %
                </label>
                <input
                  id={cId}
                  type="number"
                  step="5"
                  value={customCarbsPct}
                  onChange={(e) => setCustomCarbsPct(e.target.value)}
                  className="w-full px-2 py-1.5 bg-brand-surface border border-gray-300 rounded text-xs text-brand-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor={fId} className="block text-[11px] font-semibold text-brand-dark mb-1">
                  Fat %
                </label>
                <input
                  id={fId}
                  type="number"
                  step="5"
                  value={customFatPct}
                  onChange={(e) => setCustomFatPct(e.target.value)}
                  className="w-full px-2 py-1.5 bg-brand-surface border border-gray-300 rounded text-xs text-brand-dark font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Daily Macronutrient Targets ({dailyCalories} kcal)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary mt-1">
                {outcome.value.proteinGrams}g P / {outcome.value.carbsGrams}g C / {outcome.value.fatGrams}g F
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                  <span className="block font-semibold text-blue-900">Protein ({outcome.value.proteinPct}%)</span>
                  <strong className="block text-blue-800 text-base mt-1">{outcome.value.proteinGrams}g</strong>
                  <span className="text-[11px] text-blue-700">{outcome.value.proteinCalories} kcal</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center">
                  <span className="block font-semibold text-amber-900">Carbs ({outcome.value.carbsPct}%)</span>
                  <strong className="block text-amber-800 text-base mt-1">{outcome.value.carbsGrams}g</strong>
                  <span className="text-[11px] text-amber-700">{outcome.value.carbsCalories} kcal</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-center">
                  <span className="block font-semibold text-rose-900">Fat ({outcome.value.fatPct}%)</span>
                  <strong className="block text-rose-800 text-base mt-1">{outcome.value.fatGrams}g</strong>
                  <span className="text-[11px] text-rose-700">{outcome.value.fatCalories} kcal</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              {outcome.warnings && outcome.warnings[0] ? outcome.warnings[0].message : 'Please check calorie and percentage targets.'}
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
