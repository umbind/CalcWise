import { useState, useId } from 'react';
import { calculateRoofing } from '../../../lib/calculations/roofing';

export default function RoofingIsland() {
  const [houseLength, setHouseLength] = useState<string>('50');
  const [houseWidth, setHouseWidth] = useState<string>('30');
  const [pitchRiseOver12, setPitchRiseOver12] = useState<string>('6');
  const [wastePercentage, setWastePercentage] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lenId = useId();
  const widId = useId();
  const pitchId = useId();
  const wasteId = useId();

  const outcome = calculateRoofing({
    houseLength,
    houseWidth,
    pitchRiseOver12,
    wastePercentage,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={lenId} className="block text-xs font-semibold text-brand-dark mb-1">
                House Length (ft)
              </label>
              <input
                id={lenId}
                type="number"
                step="1"
                value={houseLength}
                onChange={(e) => setHouseLength(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={widId} className="block text-xs font-semibold text-brand-dark mb-1">
                House Width (ft)
              </label>
              <input
                id={widId}
                type="number"
                step="1"
                value={houseWidth}
                onChange={(e) => setHouseWidth(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={pitchId} className="block text-xs font-semibold text-brand-dark mb-1">
                Roof Pitch (Rise / 12)
              </label>
              <select
                id={pitchId}
                value={pitchRiseOver12}
                onChange={(e) => setPitchRiseOver12(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="0">0/12 (Flat)</option>
                <option value="3">3/12 (Low Slope)</option>
                <option value="4">4/12 (Standard Low)</option>
                <option value="5">5/12 (Medium Slope)</option>
                <option value="6">6/12 (Standard Gable)</option>
                <option value="7">7/12 (Moderate)</option>
                <option value="8">8/12 (Steep)</option>
                <option value="10">10/12 (Very Steep)</option>
                <option value="12">12/12 (45° Mansard/A-frame)</option>
              </select>
            </div>
            <div>
              <label htmlFor={wasteId} className="block text-xs font-semibold text-brand-dark mb-1">
                Waste Allowance
              </label>
              <select
                id={wasteId}
                value={wastePercentage}
                onChange={(e) => setWastePercentage(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="5">5% (Simple Gable)</option>
                <option value="10">10% (Standard Hip)</option>
                <option value="15">15% (Valleys & Dormers)</option>
                <option value="20">20% (Complex Multi-Ridge)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Roofing Material Needed
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedSquares}
                <span className="text-base font-normal text-brand-muted ml-2">({outcome.value.formattedBundles})</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Sloped Roof Surface Area: <strong className="text-brand-dark font-semibold">{outcome.value.formattedRoofArea}</strong>
                {' • '}Pitch Factor: <strong className="text-brand-dark font-mono">{outcome.value.pitchMultiplier}x</strong>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Shingle Bundles</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.shingleBundles}</strong>
                  <span className="text-[10px] text-gray-500">3 bundles / sq</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Roofing Squares</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.roofingSquares}</strong>
                  <span className="text-[10px] text-gray-500">100 sq ft each</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Underlayment Rolls</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.underlaymentRolls}</strong>
                  <span className="text-[10px] text-gray-500">4-sq rolls (400 sq ft)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid dimensions and pitch.
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
