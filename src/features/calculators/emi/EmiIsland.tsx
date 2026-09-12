import { useState, useId } from 'react';
import { calculateEmi } from '../../../lib/calculations/emi';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function EmiIsland() {
  const [principal, setPrincipal] = useState<string>('250000');
  const [annualRate, setAnnualRate] = useState<string>('7.5');
  const [tenureYears, setTenureYears] = useState<string>('15');
  const { symbol: currency } = useCurrency('$');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const principalId = useId();
  const rateId = useId();
  const tenureId = useId();

  // Convert tenure years to months
  const tenureMonths = Math.max(1, Math.round((parseFloat(tenureYears) || 0) * 12));

  const outcome = calculateEmi({
    principal,
    annualInterestRate: annualRate,
    tenureMonths,
    currencySymbol: currency,
  });

  const principalNum = parseFloat(principal) || 0;
  const totalRepaidNum = outcome.value?.totalRepayment || 1;
  const principalPct = Math.round((principalNum / totalRepaidNum) * 100);
  const interestPct = 100 - principalPct;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor={principalId} className="block text-sm font-semibold text-brand-dark mb-1">
              Loan Principal Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-brand-muted font-bold text-sm">{currency}</span>
              <input
                id={principalId}
                type="number"
                min="1"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {['50000', '100000', '250000', '500000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPrincipal(amt)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-brand-muted rounded transition"
                >
                  {currency}{parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
              Annual Interest Rate (% per year)
            </label>
            <input
              id={rateId}
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={tenureId} className="block text-sm font-semibold text-brand-dark">
                Loan Tenure (Years)
              </label>
              <span className="text-xs text-brand-muted font-mono">{tenureMonths} Months</span>
            </div>
            <input
              id={tenureId}
              type="number"
              min="1"
              max="40"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <div className="flex gap-2 mt-2">
              {['5', '10', '15', '20', '30'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-brand-muted rounded transition"
                >
                  {yr} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Key Outputs & Visual Ratio */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Monthly Payment (EMI)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedMonthlyPayment}
                <span className="text-sm font-normal text-brand-muted ml-1">/ month</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <span className="block text-xs text-brand-muted font-medium">Total Interest Paid</span>
                  <span className="text-lg font-bold text-brand-dark">{outcome.value.formattedTotalInterest}</span>
                </div>
                <div>
                  <span className="block text-xs text-brand-muted font-medium">Total Repayment (P + I)</span>
                  <span className="text-lg font-bold text-brand-dark">{outcome.value.formattedTotalRepayment}</span>
                </div>
              </div>

              {/* Principal vs Interest Ratio Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-brand-muted mb-1">
                  <span>Principal: {principalPct}%</span>
                  <span>Interest: {interestPct}%</span>
                </div>
                <div className="w-full h-3 bg-amber-500 rounded-full overflow-hidden flex" aria-hidden="true">
                  <div className="bg-brand-primary h-full" style={{ width: `${principalPct}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide positive principal, rate, and tenure values.</div>
          )}

          {/* Action Links: Amortization & Trace */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs font-semibold text-brand-primary">
            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="hover:underline flex items-center space-x-1"
            >
              <span>{showSchedule ? 'Hide' : 'View'} Amortization Schedule</span>
              <span>{showSchedule ? '▲' : '▼'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="hover:underline flex items-center space-x-1 text-brand-muted hover:text-brand-primary"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Calculation Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Amortization Schedule */}
      {showSchedule && outcome.value && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-brand-dark">Monthly Repayment Breakdown (First 12 Months)</h3>
            <span className="text-xs text-brand-muted">Total periods: {outcome.value.tenureMonths}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-brand-dark border-b border-gray-200">
                  <th className="py-2.5 px-3 font-bold">Month</th>
                  <th className="py-2.5 px-3 font-bold">Payment</th>
                  <th className="py-2.5 px-3 font-bold">Principal Paid</th>
                  <th className="py-2.5 px-3 font-bold">Interest Paid</th>
                  <th className="py-2.5 px-3 font-bold">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {outcome.value.schedule.slice(0, 12).map((row) => (
                  <tr key={row.month} className="hover:bg-brand-surface/50">
                    <td className="py-2 px-3 font-medium text-brand-muted">{row.month}</td>
                    <td className="py-2 px-3 font-semibold text-brand-dark">{row.formattedPayment}</td>
                    <td className="py-2 px-3 text-emerald-700">{row.formattedPrincipalPaid}</td>
                    <td className="py-2 px-3 text-amber-700">{row.formattedInterestPaid}</td>
                    <td className="py-2 px-3 font-mono">{row.formattedRemainingBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expandable Calculation Trace */}
      {showTrace && outcome.trace && (
        <div className="mt-6 bg-brand-surface p-4 rounded-xl border border-gray-200 text-xs space-y-2">
          <strong className="text-brand-dark block text-xs uppercase tracking-wider mb-2">Deterministic Math Trace:</strong>
          {outcome.trace.map((step) => (
            <div key={step.stepNumber} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-1.5 last:border-0">
              <span className="font-medium text-brand-dark">Step {step.stepNumber}: {step.label}</span>
              <span className="font-mono text-brand-primary font-bold">{step.expression} = {step.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
