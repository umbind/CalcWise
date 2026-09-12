import { useState, useId } from 'react';
import { calculateMulch } from '../../../lib/calculations/mulch';

export default function MulchIsland() {
  const [areaLength, setAreaLength] = useState<string>('10');
  const [areaWidth, setAreaWidth] = useState<string>('30');
  const [depthInches, setDepthInches] = useState<string>('3');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lenId = useId();
  const widId = useId();
  const depthId = useId();

  const outcome = calculateMulch({
    areaLength,
    areaWidth,
    depthInches,
    unit: 'feet',
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={lenId} className="block text-xs font-semibold text-brand-dark mb-1">
                Bed Length (Feet)
              </label>
              <input
                id={lenId}
                type="number"
                step="0.5"
                value={areaLength}
                onChange={(e) => setAreaLength(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={widId} className="block text-xs font-semibold text-brand-dark mb-1">
                Bed Width (Feet)
              </label>
              <input
                id={widId}
                type="number"
                step="0.5"
                value={areaWidth}
                onChange={(e) => setAreaWidth(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={depthId} className="block text-sm font-semibold text-brand-dark mb-1">
              Mulch / Soil Depth (Inches)
            </label>
            <select
              id={depthId}
              value={depthInches}
              onChange={(e) => setDepthInches(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-sm text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="1">1 Inch (Top dressing / Refresh)</option>
              <option value="2">2 Inches (Standard flower beds)</option>
              <option value="3">3 Inches (Recommended weed barrier)</option>
              <option value="4">4 Inches (Heavy suppression / Tree rings)</option>
              <option value="6">6 Inches (Raised garden bed fill)</option>
              <option value="8">8 Inches (Deep vegetable planting)</option>
            </select>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Bulk Volume to Order
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedCubicYards}
                <span className="text-base font-normal text-brand-muted ml-2">({outcome.value.formattedCubicFeet})</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Total Coverage Footprint: <strong className="text-brand-dark font-semibold">{outcome.value.formattedArea}</strong>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">2.0 cu ft Bags</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.bags2CuFt}</strong>
                  <span className="text-[10px] text-gray-500">Most common</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">1.5 cu ft Bags</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.bags1Pt5CuFt}</strong>
                  <span className="text-[10px] text-gray-500">Potting soil</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">3.0 cu ft Bags</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.bags3CuFt}</strong>
                  <span className="text-[10px] text-gray-500">Bark mulch</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid garden bed dimensions and depth.
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
