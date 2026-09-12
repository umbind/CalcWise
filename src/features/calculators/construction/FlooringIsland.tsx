import { useState, useId } from 'react';
import { calculateFlooring } from '../../../lib/calculations/flooring';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function FlooringIsland() {
  const { symbol: currency } = useCurrency('$');
  const [roomLength, setRoomLength] = useState<string>('15');
  const [roomWidth, setRoomWidth] = useState<string>('20');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [wastePercentage, setWastePercentage] = useState<string>('10');
  const [boxCoverageSqFt, setBoxCoverageSqFt] = useState<string>('24');
  const [pricePerSqUnit, setPricePerSqUnit] = useState<string>('3.50');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lenId = useId();
  const widId = useId();
  const wasteId = useId();
  const boxId = useId();
  const priceId = useId();

  const outcome = calculateFlooring({
    roomLength,
    roomWidth,
    unit,
    wastePercentage,
    boxCoverageSqFt,
    pricePerSqUnit,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="block text-xs font-semibold text-brand-dark">Measurement Units</span>
            <div className="flex rounded-lg border border-gray-300 p-0.5 bg-brand-surface text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnit('feet')}
                className={`px-3 py-1 rounded-md transition ${
                  unit === 'feet' ? 'bg-brand-primary text-white' : 'text-brand-dark hover:text-brand-primary'
                }`}
              >
                Feet (sq ft)
              </button>
              <button
                type="button"
                onClick={() => setUnit('meters')}
                className={`px-3 py-1 rounded-md transition ${
                  unit === 'meters' ? 'bg-brand-primary text-white' : 'text-brand-dark hover:text-brand-primary'
                }`}
              >
                Meters (m²)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={lenId} className="block text-xs font-semibold text-brand-dark mb-1">
                Room Length ({unit})
              </label>
              <input
                id={lenId}
                type="number"
                step="0.5"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={widId} className="block text-xs font-semibold text-brand-dark mb-1">
                Room Width ({unit})
              </label>
              <input
                id={widId}
                type="number"
                step="0.5"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={wasteId} className="block text-xs font-semibold text-brand-dark mb-1">
                Waste Factor (%)
              </label>
              <select
                id={wasteId}
                value={wastePercentage}
                onChange={(e) => setWastePercentage(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="5">5% (Simple Rectangles)</option>
                <option value="10">10% (Standard Rooms)</option>
                <option value="15">15% (Diagonal / Angles)</option>
                <option value="20">20% (Herringbone / Complex)</option>
              </select>
            </div>
            <div>
              <label htmlFor={boxId} className="block text-xs font-semibold text-brand-dark mb-1">
                Coverage / Box ({unit === 'meters' ? 'm²' : 'sq ft'})
              </label>
              <input
                id={boxId}
                type="number"
                step="1"
                value={boxCoverageSqFt}
                onChange={(e) => setBoxCoverageSqFt(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={priceId} className="block text-xs font-semibold text-brand-dark mb-1">
              Material Price / {unit === 'meters' ? 'm²' : 'sq ft'} (<span translate="no" className="notranslate">{currency}</span>)
            </label>
            <input
              id={priceId}
              type="number"
              step="0.25"
              translate="no"
              value={pricePerSqUnit}
              onChange={(e) => setPricePerSqUnit(e.target.value)}
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Material to Order
              </div>
              <div translate="no" className="notranslate text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedBoxes}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Total Area with {wastePercentage}% Waste:{' '}
                <strong translate="no" className="notranslate text-brand-dark font-semibold">{outcome.value.formattedTotalArea}</strong>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Net Room Footprint</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedRawArea}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Cut & Scrap Waste</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">+{outcome.value.wasteArea} {outcome.value.unit === 'meters' ? 'm²' : 'sq ft'}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Estimated Material Cost</span>
                  <strong translate="no" className="notranslate block text-emerald-700 text-sm mt-0.5">{outcome.value.formattedCost}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid room dimensions.
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
                        <span translate="no" className="notranslate text-brand-primary font-bold">{step.result}</span>
                      </div>
                      <div translate="no" className="notranslate font-mono text-gray-500 text-[10px] mt-0.5">{step.expression}</div>
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
