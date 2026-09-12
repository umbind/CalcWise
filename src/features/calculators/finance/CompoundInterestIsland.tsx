import { useState, useId } from 'react';
import { calculateCompoundInterest, type CompoundingFrequency } from '../../../lib/calculations/compound_interest';

export default function CompoundInterestIsland() {
  const [initialPrincipal, setInitialPrincipal] = useState<string>('10000');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('200');
  const [frequency, setFrequency] = useState<CompoundingFrequency>('monthly');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const principalId = useId();
  const rateId = useId();
  const yearsId = useId();
  const pmtId = useId();

  const outcome = calculateCompoundInterest({
    initialPrincipal,
    annualInterestRate: annualRate,
    years,
    monthlyContribution,
    compoundingFrequency: frequency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={principalId} className="block text-sm font-semibold text-brand-dark mb-1">
              Initial Investment Principal ($)
            </label>
            <input
              id={principalId}
              type="number"
              min="0"
              step="500"
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label htmlFor={pmtId} className="block text-sm font-semibold text-brand-dark mb-1">
              Monthly Contribution ($)
            </label>
            <input
              id={pmtId}
              type="number"
              min="0"
              step="50"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
                Annual Return (%)
              </label>
              <input
                id={rateId}
                type="number"
                min="0"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={yearsId} className="block text-sm font-semibold text-brand-dark mb-1">
                Time (Years)
              </label>
              <input
                id={yearsId}
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">
              Compounding Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as CompoundingFrequency)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            >
              <option value="annually">Annually (1x/year)</option>
              <option value="semi_annually">Semi-Annually (2x/year)</option>
              <option value="quarterly">Quarterly (4x/year)</option>
              <option value="monthly">Monthly (12x/year)</option>
              <option value="daily">Daily (365x/year)</option>
            </select>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Future Balance
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedFutureValue}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted font-medium">Starting Principal</span>
                  <span className="text-sm font-bold text-brand-dark">{outcome.value.formattedTotalPrincipal}</span>
                </div>
                <div>
                  <span className="block text-brand-muted font-medium">Total Additions</span>
                  <span className="text-sm font-bold text-brand-dark">{outcome.value.formattedTotalContributions}</span>
                </div>
                <div>
                  <span className="block text-brand-muted font-medium">Total Interest</span>
                  <span className="text-sm font-bold text-emerald-700">{outcome.value.formattedTotalInterest}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid principal and positive term.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-4 text-xs font-semibold text-brand-primary">
            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="hover:underline flex items-center space-x-1"
            >
              <span>{showSchedule ? 'Hide' : 'View'} Annual Growth Table</span>
              <span>{showSchedule ? '▲' : '▼'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="hover:underline text-brand-muted hover:text-brand-primary flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Math Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Annual Schedule Table */}
      {showSchedule && outcome.value && (
        <div className="mt-6 pt-6 border-t border-gray-200 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-brand-dark border-b border-gray-200">
                <th className="py-2 px-3 font-bold">Year</th>
                <th className="py-2 px-3 font-bold">Deposits</th>
                <th className="py-2 px-3 font-bold">Interest Earned</th>
                <th className="py-2 px-3 font-bold">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {outcome.value.growthSchedule.map((row) => (
                <tr key={row.year} className="hover:bg-brand-surface/60">
                  <td className="py-1.5 px-3 font-medium text-brand-muted">{row.year}</td>
                  <td className="py-1.5 px-3">${row.annualDeposits.toLocaleString()}</td>
                  <td className="py-1.5 px-3 text-emerald-700">{row.formattedInterestEarned}</td>
                  <td className="py-1.5 px-3 font-bold text-brand-dark">{row.formattedEndingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trace */}
      {showTrace && outcome.trace && (
        <div className="mt-4 bg-brand-surface p-3 rounded-lg border border-gray-200 text-xs space-y-1">
          {outcome.trace.map((s) => (
            <div key={s.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
              <span className="font-medium text-brand-dark">{s.label}</span>
              <span className="font-mono text-brand-primary font-bold">{s.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
