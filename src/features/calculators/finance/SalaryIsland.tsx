import { useState, useId } from 'react';
import { calculateSalary, type SalaryFrequency } from '../../../lib/calculations/salary';

export default function SalaryIsland() {
  const [amount, setAmount] = useState<string>('30');
  const [frequency, setFrequency] = useState<SalaryFrequency>('hourly');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const amountId = useId();
  const freqId = useId();
  const hpwId = useId();

  const outcome = calculateSalary({
    amount,
    frequency,
    hoursPerWeek,
    weeksPerYear,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={amountId} className="block text-sm font-semibold text-brand-dark mb-1">
              Salary / Wage Amount ($)
            </label>
            <input
              id={amountId}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={freqId} className="block text-sm font-semibold text-brand-dark mb-1">
              Payment Frequency
            </label>
            <select
              id={freqId}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as SalaryFrequency)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="hourly">Hourly Wage</option>
              <option value="daily">Daily Rate</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-Weekly (Every 2 weeks)</option>
              <option value="semi_monthly">Semi-Monthly (2x/month)</option>
              <option value="monthly">Monthly Salary</option>
              <option value="annual">Annual Salary</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={hpwId} className="block text-sm font-semibold text-brand-dark mb-1">
                Hours / Week
              </label>
              <input
                id={hpwId}
                type="number"
                min="1"
                max="80"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">
                Weeks / Year
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Conversion Table */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Annual Equivalent Salary
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedAnnual}
                <span className="text-sm font-normal text-brand-muted ml-1">/ year</span>
              </div>

              {/* Breakdown Table */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Equivalent Pay Across Frequencies:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Hourly</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedHourly}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Weekly</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedWeekly}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Bi-Weekly</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedBiWeekly}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Semi-Monthly</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedSemiMonthly}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Monthly</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedMonthly}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-brand-muted text-[11px]">Daily (8h)</span>
                    <span className="font-bold text-brand-dark">{outcome.value.formattedDaily}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please enter a valid salary amount.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Step-by-Step Math Trace</span>
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
