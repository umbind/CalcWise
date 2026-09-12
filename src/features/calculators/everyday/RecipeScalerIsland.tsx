import { useState, useId } from 'react';
import { calculateRecipeScale } from '../../../lib/calculations/recipe_scaler';

export default function RecipeScalerIsland() {
  const [originalServings, setOriginalServings] = useState<string>('4');
  const [desiredServings, setDesiredServings] = useState<string>('8');
  const [ingredientsText, setIngredientsText] = useState<string>(
    '2 cups all-purpose flour\n1 1/2 tsp baking powder\n1/2 cup granulated sugar\n1/2 tsp salt\n2 large eggs\n1 1/4 cups whole milk'
  );
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const origId = useId();
  const desId = useId();
  const textId = useId();

  const outcome = calculateRecipeScale({
    originalServings,
    desiredServings,
    ingredientsText,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={origId} className="block text-xs font-semibold text-brand-dark mb-1">
                Original Recipe Yield
              </label>
              <input
                id={origId}
                type="number"
                min="1"
                step="1"
                value={originalServings}
                onChange={(e) => setOriginalServings(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
            <div>
              <label htmlFor={desId} className="block text-xs font-semibold text-brand-dark mb-1">
                Desired Servings Yield
              </label>
              <input
                id={desId}
                type="number"
                min="1"
                step="1"
                value={desiredServings}
                onChange={(e) => setDesiredServings(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor={textId} className="block text-xs font-semibold text-brand-dark mb-1">
              Ingredient List (One item per line)
            </label>
            <textarea
              id={textId}
              rows={8}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition leading-relaxed"
              placeholder="e.g. 2 cups flour&#10;1 1/2 tsp vanilla&#10;3 eggs"
            />
            <span className="block text-[11px] text-brand-muted mt-1">
              Supports decimals, whole numbers, and fractions like 1/2, 3/4, or 1 1/2.
            </span>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between" aria-live="polite" aria-atomic="true">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Scaled Ingredient Quantities
                  </div>
                  <div className="text-2xl font-extrabold text-brand-primary mt-0.5">
                    Yield: {outcome.value.desiredServings} Servings
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-brand-primary/10 text-brand-primary font-bold px-2.5 py-1 rounded-full">
                    {outcome.value.formattedScaleFactor}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 mt-4 pt-4 border-t border-gray-200">
                {outcome.value.scaledIngredients.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-brand-dark">{item.scaledLine}</span>
                    <span className="text-[11px] text-gray-400 font-mono line-through ml-2 whitespace-nowrap">
                      {item.originalLine}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-amber-800 text-sm">
              Please enter valid original and desired servings counts.
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
