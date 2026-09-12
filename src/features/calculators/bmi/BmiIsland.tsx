import { useState, useId } from 'react';
import { calculateBmi, type BmiUnitSystem } from '../../../lib/calculations/bmi';

export default function BmiIsland() {
  const [unitSystem, setUnitSystem] = useState<BmiUnitSystem>('metric');
  // Metric state
  const [weightKg, setWeightKg] = useState<string>('70');
  const [heightCm, setHeightCm] = useState<string>('175');
  // Imperial state
  const [weightLbs, setWeightLbs] = useState<string>('155');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');

  const [showTrace, setShowTrace] = useState<boolean>(false);

  const weightId = useId();
  const heightId = useId();

  const outcome = calculateBmi({
    unitSystem,
    weightKg,
    heightCm,
    weightLbs,
    heightFeet,
    heightInches,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Unit Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Measurement System</span>
        <div className="inline-flex p-1 bg-brand-surface rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              unitSystem === 'metric'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Metric (kg / cm)
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              unitSystem === 'imperial'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Imperial (lbs / ft+in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-4">
          {unitSystem === 'metric' ? (
            <>
              <div>
                <label htmlFor={weightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Weight (Kilograms)
                </label>
                <div className="relative">
                  <input
                    id={weightId}
                    type="number"
                    min="10"
                    max="500"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-brand-muted">kg</span>
                </div>
              </div>

              <div>
                <label htmlFor={heightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Height (Centimeters)
                </label>
                <div className="relative">
                  <input
                    id={heightId}
                    type="number"
                    min="50"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-brand-muted">cm</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor={weightId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Weight (Pounds)
                </label>
                <div className="relative">
                  <input
                    id={weightId}
                    type="number"
                    min="20"
                    max="1000"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-brand-muted">lbs</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${heightId}-ft`} className="block text-sm font-semibold text-brand-dark mb-1">
                    Feet
                  </label>
                  <input
                    id={`${heightId}-ft`}
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${heightId}-in`} className="block text-sm font-semibold text-brand-dark mb-1">
                    Inches
                  </label>
                  <input
                    id={`${heightId}-in`}
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
              </div>
            </>
          )}

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 leading-relaxed">
            <strong>Health Risk Tier T2:</strong> BMI is an initial population screening tool, not a personalized clinical diagnosis of body fat percentage or metabolic health.
          </div>
        </div>

        {/* Right Side: Primary BMI Result & Health Range */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Body Mass Index (BMI)
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                  {outcome.value.formattedBmi}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: outcome.value.category.color }}
                >
                  {outcome.value.category.classification}
                </span>
              </div>

              <p className="text-xs text-brand-muted mt-2">
                {outcome.value.category.description}
              </p>

              {/* Healthy Weight Guidance */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-semibold text-brand-dark mb-1">
                  WHO Recommended Healthy Weight for Your Height:
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {unitSystem === 'metric'
                    ? outcome.value.healthyWeightRange.formattedRangeMetric
                    : outcome.value.healthyWeightRange.formattedRangeImperial}
                </span>
                <span className="block text-xs text-gray-400 mt-0.5">
                  (Based on standard healthy adult BMI between 18.5 and 24.9)
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid height and weight values.</div>
          )}

          {/* Trace Toggle */}
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
                {outcome.trace.map((step) => (
                  <div key={step.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-brand-dark font-medium">{step.label}</span>
                    <span className="font-mono text-brand-primary font-bold">{step.expression} = {step.result}</span>
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
