import { useState, useId } from 'react';
import { calculateDiscount } from '../../../lib/calculations/discount';
import { useCurrency } from '../../../lib/i18n/currencies';

export default function DiscountIsland() {
  const [originalPrice, setOriginalPrice] = useState<string>('100');
  const [discountPercentage, setDiscountPercentage] = useState<string>('20');
  const [additionalDiscountPercentage, setAdditionalDiscountPercentage] = useState<string>('10');
  const [salesTaxRate, setSalesTaxRate] = useState<string>('8');
  const [showTrace, setShowTrace] = useState<boolean>(false);
  const { symbol: currency } = useCurrency('$');

  const priceId = useId();
  const d1Id = useId();
  const d2Id = useId();
  const taxId = useId();

  const outcome = calculateDiscount({
    originalPrice,
    discountPercentage,
    additionalDiscountPercentage,
    salesTaxRate,
    currencySymbol: currency,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={priceId} className="block text-sm font-semibold text-brand-dark mb-1">
              Original Retail Price (<span translate="no" className="notranslate font-bold text-brand-primary">{currency}</span>)
            </label>
            <input
              id={priceId}
              type="number"
              step="0.5"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={d1Id} className="block text-xs font-semibold text-brand-dark mb-1">
                Discount Off (%)
              </label>
              <input
                id={d1Id}
                type="number"
                step="5"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={d2Id} className="block text-xs font-semibold text-brand-dark mb-1">
                Extra Coupon (%)
              </label>
              <input
                id={d2Id}
                type="number"
                step="5"
                min="0"
                max="100"
                placeholder="Optional"
                value={additionalDiscountPercentage}
                onChange={(e) => setAdditionalDiscountPercentage(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={taxId} className="block text-xs font-semibold text-brand-dark mb-1">
              Sales Tax (%)
            </label>
            <input
              id={taxId}
              type="number"
              step="0.25"
              min="0"
              max="25"
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Final Out-of-Pocket Price
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                <span translate="no" className="notranslate">{outcome.value.formattedFinalPrice}</span>
              </div>

              <div className="mt-2 text-sm text-brand-muted">
                You Save: <strong translate="no" className="notranslate text-emerald-700 font-semibold">{outcome.value.formattedTotalSavings}</strong>
                {' '}(<span translate="no" className="notranslate">{outcome.value.effectiveSavingsPct}%</span> total discount)
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-xs text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Price After Discount</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">{outcome.value.formattedPriceAfterDiscount}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Total Discount</span>
                  <strong translate="no" className="notranslate block text-emerald-700 text-sm mt-0.5">-{outcome.value.formattedDiscountAmount}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px] font-semibold">Sales Tax</span>
                  <strong translate="no" className="notranslate block text-brand-dark text-sm mt-0.5">+{outcome.value.formattedSalesTax}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid retail price and discount values.
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
