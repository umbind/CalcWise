import { useState, useId } from 'react';
import { calculateElectricity } from '../../../lib/calculations/electricity';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function ElectricityIsland() {
  const { symbol: currency } = useCurrency('$');
  const [wattage, setWattage] = useState<string>('1500');
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');
  const [costPerKwh, setCostPerKwh] = useState<string>('0.16');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const wattId = useId();
  const hrsId = useId();
  const costId = useId();

  const outcome = calculateElectricity({
    wattage,
    hoursPerDay,
    costPerKwh,
    currencySymbol: currency,
  });

  const setPreset = (w: string, h: string) => {
    setWattage(w);
    setHoursPerDay(h);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={wattId} className="block text-sm font-semibold text-brand-dark mb-1">
              Appliance Power Rating (Watts)
            </label>
            <input
              id={wattId}
              type="number"
              step="50"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-brand-muted mb-1">Quick Appliance Presets</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPreset('1500', '6')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Space Heater (1500W)
              </button>
              <button
                type="button"
                onClick={() => setPreset('3500', '8')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Central AC (3500W)
              </button>
              <button
                type="button"
                onClick={() => setPreset('200', '24')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                Refrigerator (200W)
              </button>
              <button
                type="button"
                onClick={() => setPreset('100', '8')}
                className="px-2 py-1 text-[11px] font-medium bg-brand-surface hover:bg-gray-200 rounded border border-gray-200 text-brand-dark"
              >
                TV / Monitor (100W)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={hrsId} className="block text-xs font-semibold text-brand-dark mb-1">
                Hours Used per Day
              </label>
              <input
                id={hrsId}
                type="number"
                step="0.5"
                min="0.1"
                max="24"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={costId} className="block text-xs font-semibold text-brand-dark mb-1">
                Electricity Rate (<span translate="no" className="notranslate">{currency}</span>/kWh)
              </label>
              <input
                id={costId}
                type="number"
                step="0.01"
                translate="no"
                value={costPerKwh}
                onChange={(e) => setCostPerKwh(e.target.value)}
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
                Estimated Monthly Electricity Cost
              </div>
              <div translate="no" className="notranslate text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedMonthlyCost}
                <span className="text-base font-normal text-brand-muted ml-2">/ month</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Annual Cost: <strong translate="no" className="notranslate text-brand-dark font-semibold">{outcome.value.formattedAnnualCost}</strong>
                {' '}(<span translate="no" className="notranslate">{outcome.value.formattedAnnualKwh}</span> per year)
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Daily Cost</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-base mt-0.5">{outcome.value.formattedDailyCost}</strong>
                  <span translate="no" className="notranslate text-[10px] text-gray-500">{outcome.value.dailyKwh} kWh / day</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Monthly Energy</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-base mt-0.5">{outcome.value.monthlyKwh}</strong>
                  <span className="text-[10px] text-gray-500">kWh / mo</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Annual Energy</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-base mt-0.5">{outcome.value.annualKwh}</strong>
                  <span className="text-[10px] text-gray-500">kWh / yr</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid wattage, hours, and electricity rate.
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
