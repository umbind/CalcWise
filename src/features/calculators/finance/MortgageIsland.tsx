import { useState, useId } from 'react';
import { calculateMortgage } from '../../../lib/calculations/mortgage';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function MortgageIsland() {
  const [homePrice, setHomePrice] = useState<string>('400000');
  const [downPayment, setDownPayment] = useState<string>('80000');
  const [termYears, setTermYears] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [propertyTax, setPropertyTax] = useState<string>('3600');
  const [homeInsurance, setHomeInsurance] = useState<string>('1200');
  const [hoa, setHoa] = useState<string>('0');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const priceId = useId();
  const downId = useId();
  const termId = useId();
  const rateId = useId();

  const outcome = calculateMortgage({
    homePrice,
    downPayment,
    loanTermYears: termYears,
    interestRate,
    annualPropertyTax: propertyTax,
    annualHomeInsurance: homeInsurance,
    monthlyHoa: hoa,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={priceId} className="block text-sm font-semibold text-brand-dark mb-1">
              Home Purchase Price (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
            </label>
            <input
              id={priceId}
              type="number"
              step="5000"
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={downId} className="block text-sm font-semibold text-brand-dark">
                Down Payment (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
              </label>
              {outcome.value && (
                <span translate="no" className="notranslate text-xs font-bold text-brand-primary">
                  {outcome.value.downPaymentPercentage}% down
                </span>
              )}
            </div>
            <input
              id={downId}
              type="number"
              step="1000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={rateId} className="block text-sm font-semibold text-brand-dark mb-1">
                Interest Rate (%)
              </label>
              <input
                id={rateId}
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                translate="no"
                className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={termId} className="block text-sm font-semibold text-brand-dark mb-1">
                Loan Term
              </label>
              <select
                id={termId}
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
          </div>

          {/* Escrow Inputs */}
          <div className="pt-2 border-t border-gray-100">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
              Property Taxes & Fees (Annual)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-brand-muted mb-1">Tax (<span translate="no" className="notranslate">{currency}</span>/yr)</label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  translate="no"
                  className="notranslate w-full px-2.5 py-1.5 bg-brand-surface border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-muted mb-1">Ins. (<span translate="no" className="notranslate">{currency}</span>/yr)</label>
                <input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(e.target.value)}
                  translate="no"
                  className="notranslate w-full px-2.5 py-1.5 bg-brand-surface border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-muted mb-1">HOA (<span translate="no" className="notranslate">{currency}</span>/mo)</label>
                <input
                  type="number"
                  value={hoa}
                  onChange={(e) => setHoa(e.target.value)}
                  translate="no"
                  className="notranslate w-full px-2.5 py-1.5 bg-brand-surface border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Monthly Payment (PITI + Fees)
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                <span translate="no" className="notranslate">{outcome.value.formattedTotalMonthly}</span>
                <span className="text-sm font-normal text-brand-muted ml-1">/ month</span>
              </div>

              {/* Monthly Cost Breakdown */}
              <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-brand-dark font-medium">Principal & Interest (P&I)</span>
                  <span translate="no" className="notranslate font-bold text-brand-dark">{outcome.value.formattedPrincipalInterest}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-brand-dark font-medium">Property Taxes</span>
                  <span><span translate="no" className="notranslate">{outcome.value.formattedPropertyTax}</span> / mo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-brand-dark font-medium">Homeowners Insurance</span>
                  <span><span translate="no" className="notranslate">{outcome.value.formattedHomeInsurance}</span> / mo</span>
                </div>
                {outcome.value.monthlyPmi > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100 text-amber-700 font-semibold">
                    <span>Private Mortgage Insurance (PMI)</span>
                    <span><span translate="no" className="notranslate">{outcome.value.formattedPmi}</span> / mo</span>
                  </div>
                )}
              </div>

              <div className="mt-6 text-xs text-brand-muted">
                <strong>Financed Loan Amount:</strong> <span translate="no" className="notranslate">{outcome.value.formattedLoanAmount}</span> | <strong>Total Interest over Life:</strong> <span translate="no" className="notranslate">{outcome.value.formattedTotalInterest}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide a valid home price and down payment.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Mathematical Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                {outcome.trace.map((s) => (
                  <div key={s.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-brand-dark font-medium">{s.label}</span>
                    <span translate="no" className="notranslate font-mono text-brand-primary font-bold">{s.result}</span>
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
