import { useState, useId } from 'react';
import { calculateAutoLoan } from '../../../lib/calculations/auto_loan';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function AutoLoanIsland() {
  const [vehiclePrice, setVehiclePrice] = useState<string>('35000');
  const [salesTaxRate, setSalesTaxRate] = useState<string>('6');
  const [downPayment, setDownPayment] = useState<string>('3500');
  const [tradeInValue, setTradeInValue] = useState<string>('5000');
  const [tradeInOwed, setTradeInOwed] = useState<string>('0');
  const [loanTermMonths, setLoanTermMonths] = useState<string>('60');
  const [interestRate, setInterestRate] = useState<string>('5.0');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const priceId = useId();
  const taxId = useId();
  const downId = useId();
  const tradeValId = useId();
  const tradeDebtId = useId();
  const termId = useId();
  const rateId = useId();

  const outcome = calculateAutoLoan({
    vehiclePrice,
    salesTaxRate,
    downPayment,
    tradeInValue,
    tradeInOwed,
    loanTermMonths,
    interestRate,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={priceId} className="block text-sm font-semibold text-brand-dark mb-1">
              Vehicle Price (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
            </label>
            <input
              id={priceId}
              type="number"
              step="500"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={downId} className="block text-xs font-semibold text-brand-dark mb-1">
                Down Payment (<span translate="no" className="notranslate font-semibold">{currency}</span>)
              </label>
              <input
                id={downId}
                type="number"
                step="250"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={taxId} className="block text-xs font-semibold text-brand-dark mb-1">
                Sales Tax (%)
              </label>
              <input
                id={taxId}
                type="number"
                step="0.1"
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={tradeValId} className="block text-xs font-semibold text-brand-dark mb-1">
                Trade-in Value (<span translate="no" className="notranslate font-semibold">{currency}</span>)
              </label>
              <input
                id={tradeValId}
                type="number"
                step="500"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={tradeDebtId} className="block text-xs font-semibold text-brand-dark mb-1">
                Amount Owed on Trade (<span translate="no" className="notranslate font-semibold">{currency}</span>)
              </label>
              <input
                id={tradeDebtId}
                type="number"
                step="250"
                value={tradeInOwed}
                onChange={(e) => setTradeInOwed(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={rateId} className="block text-xs font-semibold text-brand-dark mb-1">
                Interest Rate (APR %)
              </label>
              <input
                id={rateId}
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={termId} className="block text-xs font-semibold text-brand-dark mb-1">
                Term (Months)
              </label>
              <select
                id={termId}
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="36">36 Months (3 Years)</option>
                <option value="48">48 Months (4 Years)</option>
                <option value="60">60 Months (5 Years)</option>
                <option value="72">72 Months (6 Years)</option>
                <option value="84">84 Months (7 Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Estimated Monthly Auto Payment
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                <span translate="no" className="notranslate">{outcome.value.formattedMonthlyPayment}</span>
                <span className="text-sm font-normal text-brand-muted ml-1">/ month</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200 text-xs">
                <div>
                  <span className="block text-brand-muted">Amount Financed</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedTotalFinanced}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Total Interest</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedTotalInterest}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Total Sales Tax</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedTotalSalesTax}</strong>
                </div>
                <div>
                  <span className="block text-brand-muted">Total Overall Cost</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedTotalCostOfVehicle}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please provide valid auto loan details.
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
