import { useState, useId } from 'react';
import { calculatePaint } from '../../../lib/calculations/paint';

export default function PaintIsland() {
  const [length, setLength] = useState<string>('14');
  const [width, setWidth] = useState<string>('12');
  const [height, setHeight] = useState<string>('9');
  const [doors, setDoors] = useState<string>('1');
  const [windows, setWindows] = useState<string>('2');
  const [coats, setCoats] = useState<string>('2');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lengthId = useId();
  const widthId = useId();
  const heightId = useId();

  const outcome = calculatePaint({
    roomLengthFeet: length,
    roomWidthFeet: width,
    ceilingHeightFeet: height,
    doorsCount: doors,
    windowsCount: windows,
    coats,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={lengthId} className="block text-sm font-semibold text-brand-dark mb-1">
                Room Length (ft)
              </label>
              <input
                id={lengthId}
                type="number"
                min="1"
                step="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
              />
            </div>
            <div>
              <label htmlFor={widthId} className="block text-sm font-semibold text-brand-dark mb-1">
                Room Width (ft)
              </label>
              <input
                id={widthId}
                type="number"
                min="1"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor={heightId} className="block text-sm font-semibold text-brand-dark mb-1">
              Ceiling Height (ft)
            </label>
            <input
              id={heightId}
              type="number"
              min="6"
              max="20"
              step="0.5"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
            <div className="flex gap-2 mt-2">
              {['8', '9', '10', '12'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHeight(h)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-brand-muted rounded transition"
                >
                  {h} ft
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">Number of Doors</label>
              <input
                type="number"
                min="0"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">Number of Windows</label>
              <input
                type="number"
                min="0"
                value={windows}
                onChange={(e) => setWindows(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1">Number of Coats</label>
            <div className="flex gap-2">
              {['1', '2', '3'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCoats(c)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    coats === c
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-surface text-brand-muted border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {c} {c === '1' ? 'Coat' : 'Coats'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output: Gallons Needed */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Paint Needed
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-primary">
                  {outcome.value.gallonsNeeded}
                </span>
                <span className="text-xl font-bold text-brand-dark">
                  Gallon{outcome.value.gallonsNeeded === 1 ? '' : 's'}
                </span>
                <span className="text-xs text-brand-muted">
                  ({outcome.value.formattedLiters})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Net Wall Surface</span>
                  <span className="text-sm font-bold text-brand-dark">{outcome.value.netWallAreaSqFt} sq ft</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Coated Area ({coats}x)</span>
                  <span className="text-sm font-bold text-brand-dark">{outcome.value.totalCoatedAreaSqFt} sq ft</span>
                </div>
              </div>

              <p className="text-xs text-brand-muted mt-4">
                Assumes standard coverage of ~350 sq ft per gallon. Rounded up to the nearest whole gallon can.
              </p>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid room dimensions.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Paint Surface Breakdown</span>
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
