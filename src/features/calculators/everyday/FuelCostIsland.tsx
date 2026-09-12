import { useState, useId } from 'react';
import { calculateFuelCost } from '../../../lib/calculations/fuel_cost';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function FuelCostIsland() {
  const { symbol: currency } = useCurrency('$');
  const [distance, setDistance] = useState<string>('300');
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [fuelEfficiencyMpg, setFuelEfficiencyMpg] = useState<string>('30');
  const [fuelEfficiencyL100km, setFuelEfficiencyL100km] = useState<string>('7.8');
  const [fuelPricePerUnit, setFuelPricePerUnit] = useState<string>('3.50');
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const distId = useId();
  const effId = useId();
  const priceId = useId();

  const outcome = calculateFuelCost({
    distance,
    distanceUnit,
    fuelEfficiencyMpg: distanceUnit === 'miles' ? fuelEfficiencyMpg : undefined,
    fuelEfficiencyL100km: distanceUnit === 'km' ? fuelEfficiencyL100km : undefined,
    fuelPricePerUnit,
    isRoundTrip,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="block text-xs font-semibold text-brand-dark">Distance Unit</span>
            <div className="flex rounded-lg border border-gray-300 p-0.5 bg-brand-surface text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setDistanceUnit('miles');
                  if (fuelPricePerUnit === '1.60') setFuelPricePerUnit('3.50');
                }}
                className={`px-3 py-1 rounded-md transition ${
                  distanceUnit === 'miles' ? 'bg-brand-primary text-white' : 'text-brand-dark hover:text-brand-primary'
                }`}
              >
                Miles (MPG)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDistanceUnit('km');
                  if (fuelPricePerUnit === '3.50') setFuelPricePerUnit('1.60');
                }}
                className={`px-3 py-1 rounded-md transition ${
                  distanceUnit === 'km' ? 'bg-brand-primary text-white' : 'text-brand-dark hover:text-brand-primary'
                }`}
              >
                Km (L/100km)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor={distId} className="block text-sm font-semibold text-brand-dark mb-1">
              One-Way Trip Distance ({distanceUnit})
            </label>
            <input
              id={distId}
              type="number"
              step="1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="flex items-center space-x-2 pt-0.5">
            <input
              id="roundTripCheck"
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
            />
            <label htmlFor="roundTripCheck" className="text-xs font-semibold text-brand-dark cursor-pointer">
              Include return journey (Round Trip)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={effId} className="block text-xs font-semibold text-brand-dark mb-1">
                Efficiency ({distanceUnit === 'miles' ? 'MPG' : 'L/100km'})
              </label>
              <input
                id={effId}
                type="number"
                step="0.5"
                value={distanceUnit === 'miles' ? fuelEfficiencyMpg : fuelEfficiencyL100km}
                onChange={(e) => {
                  if (distanceUnit === 'miles') setFuelEfficiencyMpg(e.target.value);
                  else setFuelEfficiencyL100km(e.target.value);
                }}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={priceId} className="block text-xs font-semibold text-brand-dark mb-1">
                Gas Price (<span translate="no" className="notranslate">{currency}</span>{distanceUnit === 'miles' ? '/gal' : '/L'})
              </label>
              <input
                id={priceId}
                type="number"
                step="0.05"
                translate="no"
                value={fuelPricePerUnit}
                onChange={(e) => setFuelPricePerUnit(e.target.value)}
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Fuel Expense ({outcome.value.totalDistance} {distanceUnit})
              </div>
              <div translate="no" className="notranslate text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedTotalCost}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Cost per {distanceUnit === 'miles' ? 'mile' : 'km'}: <strong translate="no" className="notranslate text-brand-dark font-semibold">{outcome.value.formattedCostPerUnit}</strong>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Fuel Consumed</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-base mt-0.5">{outcome.value.formattedFuelVolume}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Total Distance Traveled</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-base mt-0.5">{outcome.value.totalDistance} {distanceUnit}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid trip distance and fuel parameters.
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
