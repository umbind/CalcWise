import { useState, useId } from 'react';
import { calculateDrywall } from '../../../lib/calculations/drywall';

export default function DrywallIsland() {
  const [roomLength, setRoomLength] = useState<string>('12');
  const [roomWidth, setRoomWidth] = useState<string>('16');
  const [ceilingHeight, setCeilingHeight] = useState<string>('8');
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [sheetSize, setSheetSize] = useState<'4x8' | '4x12'>('4x8');
  const [doorsWindowsDeductionSqFt, setDoorsWindowsDeductionSqFt] = useState<string>('40');
  const [wastePercentage, setWastePercentage] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lenId = useId();
  const widId = useId();
  const hId = useId();
  const deductId = useId();
  const wasteId = useId();

  const outcome = calculateDrywall({
    roomLength,
    roomWidth,
    ceilingHeight,
    includeCeiling,
    sheetSize,
    doorsWindowsDeductionSqFt,
    wastePercentage,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={lenId} className="block text-xs font-semibold text-brand-dark mb-1">
                Length (ft)
              </label>
              <input
                id={lenId}
                type="number"
                step="0.5"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                className="w-full px-2.5 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={widId} className="block text-xs font-semibold text-brand-dark mb-1">
                Width (ft)
              </label>
              <input
                id={widId}
                type="number"
                step="0.5"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                className="w-full px-2.5 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={hId} className="block text-xs font-semibold text-brand-dark mb-1">
                Height (ft)
              </label>
              <input
                id={hId}
                type="number"
                step="0.5"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(e.target.value)}
                className="w-full px-2.5 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              id="includeCeilingCheckbox"
              type="checkbox"
              checked={includeCeiling}
              onChange={(e) => setIncludeCeiling(e.target.checked)}
              className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
            />
            <label htmlFor="includeCeilingCheckbox" className="text-xs font-semibold text-brand-dark cursor-pointer">
              Include Ceiling Drywall
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs font-semibold text-brand-dark mb-1.5">Sheet Panel Size</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSheetSize('4x8')}
                  className={`py-1.5 rounded-lg border transition ${
                    sheetSize === '4x8'
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  4' × 8' (32 sq ft)
                </button>
                <button
                  type="button"
                  onClick={() => setSheetSize('4x12')}
                  className={`py-1.5 rounded-lg border transition ${
                    sheetSize === '4x12'
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-surface text-brand-dark border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  4' × 12' (48 sq ft)
                </button>
              </div>
            </div>
            <div>
              <label htmlFor={wasteId} className="block text-xs font-semibold text-brand-dark mb-1">
                Waste Factor (%)
              </label>
              <select
                id={wasteId}
                value={wastePercentage}
                onChange={(e) => setWastePercentage(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="5">5% (Simple)</option>
                <option value="10">10% (Standard)</option>
                <option value="15">15% (Many Corners)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={deductId} className="block text-xs font-semibold text-brand-dark mb-1">
              Doors & Windows Deduction (sq ft)
            </label>
            <input
              id={deductId}
              type="number"
              step="5"
              value={doorsWindowsDeductionSqFt}
              onChange={(e) => setDoorsWindowsDeductionSqFt(e.target.value)}
              className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <span className="block text-[11px] text-brand-muted mt-0.5">
              Standard door ~20 sq ft; window ~15-20 sq ft.
            </span>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Drywall Sheets Required
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedSheets}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Net Drywall Surface Area: <strong className="text-brand-dark font-semibold">{outcome.value.formattedTotalArea}</strong>
                {' '}(Walls: {outcome.value.wallAreaSqFt} sq ft{includeCeiling ? `, Ceiling: ${outcome.value.ceilingAreaSqFt} sq ft` : ''})
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Joint Compound</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.jointCompoundGallons} gal</strong>
                  <span className="text-[10px] text-gray-500">~{Math.ceil(outcome.value.jointCompoundGallons / 4.5)} pails (4.5 gal)</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Drywall Screws</span>
                  <strong className="block text-brand-dark text-base mt-0.5">~{outcome.value.screwsCount}</strong>
                  <span className="text-[10px] text-gray-500">1-1/4" coarse thread</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Joint Tape</span>
                  <strong className="block text-brand-dark text-base mt-0.5">{outcome.value.tapeRolls} roll{outcome.value.tapeRolls > 1 ? 's' : ''}</strong>
                  <span className="text-[10px] text-gray-500">250 ft rolls</span>
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
