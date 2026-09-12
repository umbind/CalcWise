import { useState, useId } from 'react';
import { calculateGravel } from '../../../lib/calculations/gravel';
import type { AggregateType } from '../../../lib/calculations/gravel';

export default function GravelIsland() {
  const [length, setLength] = useState<string>('40');
  const [width, setWidth] = useState<string>('10');
  const [depthInches, setDepthInches] = useState<string>('4');
  const [aggregateType, setAggregateType] = useState<AggregateType>('crushed_stone');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lenId = useId();
  const widId = useId();
  const depthId = useId();
  const typeId = useId();

  const outcome = calculateGravel({
    length,
    width,
    depthInches,
    aggregateType,
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
                Length (Feet)
              </label>
              <input
                id={lenId}
                type="number"
                step="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={widId} className="block text-xs font-semibold text-brand-dark mb-1">
                Width (Feet)
              </label>
              <input
                id={widId}
                type="number"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={depthId} className="block text-xs font-semibold text-brand-dark mb-1">
              Compacted Depth (Inches)
            </label>
            <select
              id={depthId}
              value={depthInches}
              onChange={(e) => setDepthInches(e.target.value)}
              className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="2">2 Inches (Walkway / Pathway)</option>
              <option value="3">3 Inches (Patio Base / Decorative)</option>
              <option value="4">4 Inches (Residential Driveway Standard)</option>
              <option value="6">6 Inches (Heavy Vehicle Driveway / Sub-base)</option>
              <option value="8">8 Inches (Structural Foundation Pad)</option>
            </select>
          </div>

          <div>
            <label htmlFor={typeId} className="block text-xs font-semibold text-brand-dark mb-1">
              Aggregate Material Type & Density
            </label>
            <select
              id={typeId}
              value={aggregateType}
              onChange={(e) => setAggregateType(e.target.value as AggregateType)}
              className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="crushed_stone">Crushed Stone / Gravel (~2,700 lbs/yd³ = 1.35 tons/yd³)</option>
              <option value="pea_gravel">Pea Gravel (~2,800 lbs/yd³ = 1.40 tons/yd³)</option>
              <option value="sand">Coarse Masonry Sand (~2,600 lbs/yd³ = 1.30 tons/yd³)</option>
              <option value="decomposed_granite">Decomposed Granite (~3,000 lbs/yd³ = 1.50 tons/yd³)</option>
            </select>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Quarry Order Weight
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedTonsUS}
                <span className="text-base font-normal text-brand-muted ml-2">({outcome.value.formattedTonnesMetric})</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Bulk Volume: <strong className="text-brand-dark font-semibold">{outcome.value.formattedCubicYards}</strong>
                {' '}({outcome.value.cubicFeet} cubic feet)
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">US Short Tons (2,000 lbs)</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.tonsUS} tons</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Standard Dump Truck Loads</span>
                  <strong className="block text-brand-dark text-base mt-0.5">
                    ~{Math.max(1, Math.ceil(outcome.value.tonsUS / 14))} Tri-Axle Load{outcome.value.tonsUS > 14 ? 's' : ''} (14T)
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid dimensions and depth.
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
