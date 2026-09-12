import { useState, useId } from 'react';
import { calculateConcrete, type ConcreteShape } from '../../../lib/calculations/concrete';

export default function ConcreteIsland() {
  const [shape, setShape] = useState<ConcreteShape>('slab');
  // Slab inputs
  const [length, setLength] = useState<string>('12');
  const [width, setWidth] = useState<string>('10');
  const [thickness, setThickness] = useState<string>('4');
  // Column inputs
  const [diameter, setDiameter] = useState<string>('12');
  const [height, setHeight] = useState<string>('8');
  const [quantity, setQuantity] = useState<string>('4');

  const [wastePct, setWastePct] = useState<string>('10');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const lengthId = useId();
  const widthId = useId();
  const thicknessId = useId();
  const diameterId = useId();
  const heightId = useId();

  const outcome = calculateConcrete({
    shape,
    length,
    width,
    thickness,
    diameter,
    height,
    quantity,
    wastePercentage: wastePct,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Shape Selector */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Structure Type</span>
        <div className="inline-flex p-1 bg-brand-surface rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setShape('slab')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              shape === 'slab' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Slab / Patio / Footing
          </button>
          <button
            type="button"
            onClick={() => setShape('column')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              shape === 'column' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Round Column / Sonotube
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-4">
          {shape === 'slab' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={lengthId} className="block text-sm font-semibold text-brand-dark mb-1">
                    Length (Feet)
                  </label>
                  <input
                    id={lengthId}
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
                <div>
                  <label htmlFor={widthId} className="block text-sm font-semibold text-brand-dark mb-1">
                    Width (Feet)
                  </label>
                  <input
                    id={widthId}
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={thicknessId} className="block text-sm font-semibold text-brand-dark mb-1">
                  Thickness / Depth (Inches)
                </label>
                <input
                  id={thicknessId}
                  type="number"
                  min="1"
                  step="0.5"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                />
                <div className="flex gap-2 mt-2">
                  {['4', '5', '6', '8'].map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setThickness(th)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-brand-muted rounded transition"
                    >
                      {th} in {th === '4' ? '(sidewalk)' : th === '6' ? '(driveway)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={diameterId} className="block text-sm font-semibold text-brand-dark mb-1">
                    Diameter (Inches)
                  </label>
                  <input
                    id={diameterId}
                    type="number"
                    min="4"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
                <div>
                  <label htmlFor={heightId} className="block text-sm font-semibold text-brand-dark mb-1">
                    Height / Depth (Feet)
                  </label>
                  <input
                    id={heightId}
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">Number of Columns</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                />
              </div>
            </>
          )}

          {/* Waste Factor Allowance */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-brand-dark">Waste / Spillage Margin</label>
              <span className="text-xs font-bold text-brand-primary">{wastePct}%</span>
            </div>
            <div className="flex gap-2">
              {['0', '5', '10', '15'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setWastePct(pct)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    wastePct === pct
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-surface text-brand-muted border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-muted mt-1">10% is standard for ground variations & spillage.</p>
          </div>
        </div>

        {/* Right Side: Concrete Volume & Bag Counts */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Concrete Required (with {wastePct}% margin)
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-extrabold text-brand-primary">
                  {outcome.value.formattedVolumeCuYd}
                </span>
                <span className="text-base text-brand-muted font-medium">
                  ({outcome.value.formattedVolumeCuM})
                </span>
              </div>

              {/* Pre-mix Bag Requirements */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
                  Pre-Mixed Bag Requirements:
                </span>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <span className="block text-xs text-brand-muted">80 lb Bags</span>
                    <span className="text-xl font-bold text-brand-dark">{outcome.value.bags80lb}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <span className="block text-xs text-brand-muted">60 lb Bags</span>
                    <span className="text-xl font-bold text-brand-dark">{outcome.value.bags60lb}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <span className="block text-xs text-brand-muted">50 lb Bags</span>
                    <span className="text-xl font-bold text-brand-dark">{outcome.value.bags50lb}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-brand-muted">
                <strong>Estimated dry weight:</strong> ~{outcome.value.estimatedWeightLbs.toLocaleString()} lbs
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide positive dimensional values.</div>
          )}

          {/* Trace Toggle */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Calculation Breakdown</span>
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
