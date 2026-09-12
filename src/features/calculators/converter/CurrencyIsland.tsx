import { useState, useId } from 'react';
import { calculateCurrency, BENCHMARK_USD_RATES } from '../../../lib/calculations/currency';

export default function CurrencyIsland() {
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [bankSpreadFeePct, setBankSpreadFeePct] = useState<string>('0');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const amountId = useId();
  const fromId = useId();
  const toId = useId();
  const feeId = useId();

  const currencies = Object.keys(BENCHMARK_USD_RATES);

  const outcome = calculateCurrency({
    amount,
    fromCurrency,
    toCurrency,
    bankSpreadFeePct,
  });

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={amountId} className="block text-sm font-semibold text-brand-dark mb-1">
              Amount to Convert
            </label>
            <input
              id={amountId}
              type="number"
              step="10"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <label htmlFor={fromId} className="block text-xs font-semibold text-brand-dark mb-1">
                From
              </label>
              <select
                id={fromId}
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1 flex justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Currencies"
                className="p-2 rounded-full border border-gray-300 bg-brand-surface hover:bg-white text-brand-dark hover:text-brand-primary hover:border-brand-primary transition"
              >
                ⇄
              </button>
            </div>

            <div className="col-span-2">
              <label htmlFor={toId} className="block text-xs font-semibold text-brand-dark mb-1">
                To
              </label>
              <select
                id={toId}
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                translate="no"
                className="notranslate w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={feeId} className="block text-xs font-semibold text-brand-dark mb-1">
              Bank / Broker Markup Fee (%)
            </label>
            <input
              id={feeId}
              type="number"
              step="0.25"
              min="0"
              max="20"
              value={bankSpreadFeePct}
              onChange={(e) => setBankSpreadFeePct(e.target.value)}
              translate="no"
              className="notranslate w-full px-4 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Set 0% for mid-market interbank rate, or 2–4% for typical credit cards and retail bureaus.
            </p>
          </div>
        </div>

        {/* Right Output Display */}
        <div className="lg:col-span-7 bg-brand-surface rounded-xl p-6 border border-brand-border flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-primary block mb-1">
                  Net Amount Received
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
                  <span translate="no" className="notranslate">{outcome.value.formattedNetReceived}</span>
                </div>
                <div translate="no" className="notranslate text-sm text-gray-600 mt-1 font-medium">
                  {outcome.value.formattedExchangeRate}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-brand-border">
                  <span className="text-[11px] text-gray-500 block uppercase font-medium">Interbank Total</span>
                  <span translate="no" className="notranslate text-sm font-bold text-brand-dark">{outcome.value.formattedConverted}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-brand-border">
                  <span className="text-[11px] text-gray-500 block uppercase font-medium">Spread / Fee</span>
                  <span translate="no" className="notranslate text-sm font-bold text-rose-600">
                    {outcome.value.spreadFeeAmount > 0 ? `-${outcome.value.spreadFeeAmount} ${outcome.value.toCurrency}` : 'None (0)'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-brand-border">
                  <span className="text-[11px] text-gray-500 block uppercase font-medium">Inverse Rate</span>
                  <span translate="no" className="notranslate text-xs font-bold text-brand-dark">{outcome.value.formattedInverseRate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTrace(!showTrace)}
                  className="text-xs font-semibold text-brand-primary hover:underline focus:outline-none flex items-center gap-1"
                >
                  {showTrace ? 'Hide Step-by-Step Calculation Trace ▲' : 'Inspect Audit Calculation Trace ▼'}
                </button>

                {showTrace && (
                  <div className="mt-3 space-y-2 text-xs bg-white p-4 rounded-lg border border-brand-border">
                    <p className="font-semibold text-brand-dark">Deterministic Interbank Math Trace:</p>
                    {outcome.trace.map((step) => (
                      <div key={step.stepNumber} className="border-l-2 border-brand-primary pl-3 py-1">
                        <span className="font-bold text-gray-700">Step {step.stepNumber}: {step.label}</span>
                        <div translate="no" className="notranslate font-mono text-gray-600">{step.expression} = {step.result}</div>
                        <div className="text-[11px] text-gray-500">{step.explanation}</div>
                      </div>
                    ))}
                    <div className="text-[10px] text-gray-400 font-mono mt-2">
                      Formula ID: {outcome.formulaId} (v{outcome.formulaVersion})
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-rose-600 font-medium text-sm">
              {(outcome.status === 'invalid' && outcome.warnings?.[0]?.message) || 'Please enter valid exchange parameters.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
