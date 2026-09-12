import { useState } from 'react';
import { evaluateScientific, type AngleMode } from '../../../lib/calculations/scientific';

export default function ScientificIsland() {
  const [display, setDisplay] = useState<string>('sin(30) + sqrt(144)');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const outcome = evaluateScientific({ expression: display, angleMode });

  const append = (val: string) => {
    setDisplay((prev) => (prev === '0' ? val : prev + val));
  };

  const clearAll = () => setDisplay('');
  const backspace = () => setDisplay((prev) => prev.slice(0, -1));

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
      {/* Angle Mode Selector */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Scientific Keypad</span>
        <div className="inline-flex p-1 bg-brand-surface rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setAngleMode('deg')}
            className={`px-3 py-1 text-xs font-bold rounded ${
              angleMode === 'deg' ? 'bg-brand-primary text-white shadow-2xs' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            DEG
          </button>
          <button
            type="button"
            onClick={() => setAngleMode('rad')}
            className={`px-3 py-1 text-xs font-bold rounded ${
              angleMode === 'rad' ? 'bg-brand-primary text-white shadow-2xs' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            RAD
          </button>
        </div>
      </div>

      {/* Screen Display */}
      <div className="bg-brand-surface border border-gray-300 rounded-xl p-4 mb-6 text-right">
        <input
          type="text"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent text-right font-mono text-xl sm:text-2xl text-brand-dark focus:outline-none"
        />
        <div className="text-sm font-extrabold text-brand-primary mt-1 font-mono">
          = {outcome.status === 'success' && outcome.value ? outcome.value.formattedResult : '—'}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 text-sm font-semibold">
        {/* Scientific Row 1 */}
        <button type="button" onClick={() => append('sin(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">sin</button>
        <button type="button" onClick={() => append('cos(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">cos</button>
        <button type="button" onClick={() => append('tan(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">tan</button>
        <button type="button" onClick={() => append('(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">(</button>
        <button type="button" onClick={() => append(')')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">)</button>

        {/* Scientific Row 2 */}
        <button type="button" onClick={() => append('sqrt(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">√x</button>
        <button type="button" onClick={() => append('^2')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">x²</button>
        <button type="button" onClick={() => append('^')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">xʸ</button>
        <button type="button" onClick={() => append('log(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">log</button>
        <button type="button" onClick={() => append('ln(')} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs">ln</button>

        {/* Number Row 1 */}
        <button type="button" onClick={() => append('7')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">7</button>
        <button type="button" onClick={() => append('8')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">8</button>
        <button type="button" onClick={() => append('9')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">9</button>
        <button type="button" onClick={backspace} className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm">⌫</button>
        <button type="button" onClick={clearAll} className="p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-bold">C</button>

        {/* Number Row 2 */}
        <button type="button" onClick={() => append('4')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">4</button>
        <button type="button" onClick={() => append('5')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">5</button>
        <button type="button" onClick={() => append('6')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">6</button>
        <button type="button" onClick={() => append(' * ')} className="p-3 bg-blue-50 hover:bg-blue-100 text-brand-primary rounded-lg text-base">×</button>
        <button type="button" onClick={() => append(' / ')} className="p-3 bg-blue-50 hover:bg-blue-100 text-brand-primary rounded-lg text-base">÷</button>

        {/* Number Row 3 */}
        <button type="button" onClick={() => append('1')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">1</button>
        <button type="button" onClick={() => append('2')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">2</button>
        <button type="button" onClick={() => append('3')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">3</button>
        <button type="button" onClick={() => append(' + ')} className="p-3 bg-blue-50 hover:bg-blue-100 text-brand-primary rounded-lg text-base">+</button>
        <button type="button" onClick={() => append(' - ')} className="p-3 bg-blue-50 hover:bg-blue-100 text-brand-primary rounded-lg text-base">−</button>

        {/* Number Row 4 */}
        <button type="button" onClick={() => append('0')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">0</button>
        <button type="button" onClick={() => append('.')} className="p-3 bg-brand-surface hover:bg-gray-200 rounded-lg text-base">.</button>
        <button type="button" onClick={() => append('pi')} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">π</button>
        <button type="button" onClick={() => append('e')} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">e</button>
        <button
          type="button"
          onClick={() => {
            if (outcome.status === 'success' && outcome.value) {
              setDisplay(outcome.value.formattedResult);
            }
          }}
          className="p-3 bg-brand-primary text-white hover:bg-brand-primary-dark rounded-lg text-base font-bold shadow-sm"
        >
          =
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowTrace(!showTrace)}
          className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
        >
          <span>{showTrace ? 'Hide' : 'Show'} Trace</span>
          <span>{showTrace ? '▲' : '▼'}</span>
        </button>
        {showTrace && outcome.trace && (
          <div className="mt-3 bg-brand-surface p-3 rounded-lg border border-gray-200 text-xs space-y-1">
            {outcome.trace.map((s) => (
              <div key={s.stepNumber} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                <span className="text-brand-dark font-medium">{s.label}</span>
                <span className="font-mono text-brand-primary font-bold">{s.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
