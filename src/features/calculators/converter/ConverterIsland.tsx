import { useState, useId } from 'react';
import {
  convertUnit,
  QUANTITY_REGISTRY,
  type QuantityCategory,
} from '../../../lib/calculations/converter';

export default function ConverterIsland() {
  const [category, setCategory] = useState<QuantityCategory>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('mi');
  const [toUnit, setToUnit] = useState<string>('km');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const valueId = useId();
  const fromId = useId();
  const toId = useId();

  // Swap units handler
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Change category handler
  const handleCategoryChange = (newCat: QuantityCategory) => {
    setCategory(newCat);
    const available = Object.keys(QUANTITY_REGISTRY[newCat].units);
    if (available.length >= 2) {
      setFromUnit(available[0]);
      setToUnit(available[1]);
    }
  };

  const outcome = convertUnit({
    category,
    value,
    fromUnit,
    toUnit,
  });

  const availableUnits = Object.values(QUANTITY_REGISTRY[category].units);

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      {/* Category Tabs */}
      <div className="mb-6">
        <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
          Measurement Category
        </span>
        <div className="flex flex-wrap gap-1.5 p-1 bg-brand-surface rounded-xl border border-gray-200">
          {(
            [
              { id: 'length', label: 'Length' },
              { id: 'mass', label: 'Mass & Weight' },
              { id: 'temperature', label: 'Temperature' },
              { id: 'area', label: 'Area' },
              { id: 'volume', label: 'Volume' },
              { id: 'speed', label: 'Speed' },
              { id: 'data', label: 'Digital Data' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition text-center focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                category === cat.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-dark hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Converter Inputs & Swap */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
        {/* Value & From Unit */}
        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label htmlFor={valueId} className="block text-xs font-semibold text-brand-dark mb-1">
              Value
            </label>
            <input
              id={valueId}
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
          <div>
            <label htmlFor={fromId} className="block text-xs font-semibold text-brand-dark mb-1">
              From Unit
            </label>
            <select
              id={fromId}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center pt-3 sm:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap from and to units"
            className="w-10 h-10 rounded-full bg-brand-surface hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/20 flex items-center justify-center transition shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            ⇄
          </button>
        </div>

        {/* To Unit */}
        <div className="md:col-span-5">
          <label htmlFor={toId} className="block text-xs font-semibold text-brand-dark mb-1">
            To Target Unit
          </label>
          <select
            id={toId}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
          >
            {availableUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Display */}
      {outcome.status === 'success' && outcome.value ? (
        <div className="bg-brand-surface border border-brand-primary/20 rounded-xl p-6" aria-live="polite">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
            Conversion Result
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-primary">
              {outcome.value.formattedToValue}
            </span>
            <span className="text-lg font-bold text-brand-dark">
              {outcome.value.toUnit.symbol}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-brand-muted mt-3 pt-3 border-t border-gray-200 gap-2">
            <span className="font-medium text-brand-dark">{outcome.value.equation}</span>
            <span className="text-gray-400 font-mono">{outcome.value.rate}</span>
          </div>

          {/* Toggle Calculation Trace */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Canonical Conversion Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>

            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
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
      ) : (
        <div className="text-sm text-red-700">Please enter a valid numeric value.</div>
      )}
    </div>
  );
}
