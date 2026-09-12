import { useState, useId } from 'react';
import { calculate401k } from '../../../lib/calculations/retirement_401k';

export default function Retirement401kIsland() {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('65');
  const [currentBalance, setCurrentBalance] = useState<string>('50000');
  const [annualSalary, setAnnualSalary] = useState<string>('80000');
  const [salaryGrowthRate, setSalaryGrowthRate] = useState<string>('2.0');
  const [employeeContributionPct, setEmployeeContributionPct] = useState<string>('8');
  const [employerMatchPct, setEmployerMatchPct] = useState<string>('50');
  const [employerMatchCapPct, setEmployerMatchCapPct] = useState<string>('6');
  const [annualReturnRate, setAnnualReturnRate] = useState<string>('7.0');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const curAgeId = useId();
  const retAgeId = useId();
  const balanceId = useId();
  const salaryId = useId();
  const growthId = useId();
  const empContribId = useId();
  const matchPctId = useId();
  const matchCapId = useId();
  const returnId = useId();

  const outcome = calculate401k({
    currentAge,
    retirementAge,
    currentBalance,
    annualSalary,
    salaryGrowthRate,
    employeeContributionPct,
    employerMatchPct,
    employerMatchCapPct,
    annualReturnRate,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={curAgeId} className="block text-xs font-semibold text-brand-dark mb-1">
                Current Age
              </label>
              <input
                id={curAgeId}
                type="number"
                min="16"
                max="90"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={retAgeId} className="block text-xs font-semibold text-brand-dark mb-1">
                Retirement Age
              </label>
              <input
                id={retAgeId}
                type="number"
                min="18"
                max="100"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={salaryId} className="block text-xs font-semibold text-brand-dark mb-1">
                Annual Salary ($)
              </label>
              <input
                id={salaryId}
                type="number"
                step="1000"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={balanceId} className="block text-xs font-semibold text-brand-dark mb-1">
                Current 401(k) ($)
              </label>
              <input
                id={balanceId}
                type="number"
                step="1000"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={empContribId} className="block text-xs font-semibold text-brand-dark mb-1">
                Your Contribution (%)
              </label>
              <input
                id={empContribId}
                type="number"
                step="1"
                min="0"
                max="100"
                value={employeeContributionPct}
                onChange={(e) => setEmployeeContributionPct(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={growthId} className="block text-xs font-semibold text-brand-dark mb-1">
                Salary Growth (%/yr)
              </label>
              <input
                id={growthId}
                type="number"
                step="0.5"
                value={salaryGrowthRate}
                onChange={(e) => setSalaryGrowthRate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={matchPctId} className="block text-xs font-semibold text-brand-dark mb-1">
                Employer Match (%)
              </label>
              <input
                id={matchPctId}
                type="number"
                step="5"
                value={employerMatchPct}
                onChange={(e) => setEmployerMatchPct(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={matchCapId} className="block text-xs font-semibold text-brand-dark mb-1">
                Match Up To (% salary)
              </label>
              <input
                id={matchCapId}
                type="number"
                step="1"
                value={employerMatchCapPct}
                onChange={(e) => setEmployerMatchCapPct(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={returnId} className="block text-xs font-semibold text-brand-dark mb-1">
              Expected Annual Return (% CAGR)
            </label>
            <input
              id={returnId}
              type="number"
              step="0.5"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(e.target.value)}
              className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Projected Balance at Age {retirementAge} ({outcome.value.yearsToRetirement} Years)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedTotalBalance}
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                Est. Sustainable Income (4% Rule): <strong className="text-brand-dark">{outcome.value.formattedMonthlyIncome}</strong> / month
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Your Contributions</span>
                  <strong className="block text-brand-dark text-sm mt-0.5">{outcome.value.formattedEmployeeContributions}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Employer Match</span>
                  <strong className="block text-brand-dark text-sm mt-0.5">{outcome.value.formattedEmployerContributions}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Investment Growth</span>
                  <strong className="block text-emerald-700 text-sm mt-0.5">{outcome.value.formattedInvestmentGrowth}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid 401(k) retirement parameters.
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
