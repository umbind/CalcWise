import { describe, it, expect } from 'vitest';
import { calculateRecipeScale } from '../../src/lib/calculations/recipe_scaler';

describe('Recipe Scaler Calculator Engine', () => {
  it('correctly scales 4 servings to 8 servings (2x scale) with fractions (Golden Dataset)', () => {
    const outcome = calculateRecipeScale({
      originalServings: 4,
      desiredServings: 8,
      ingredientsText: `2 cups flour\n1 1/2 tsp vanilla\n1/2 cup sugar\n3 eggs`,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.scaleFactor).toBe(2);
      expect(outcome.value.scaledIngredients.length).toBe(4);
      // 2 cups -> 4 cups
      expect(outcome.value.scaledIngredients[0].scaledLine).toBe('4 cups flour');
      // 1 1/2 tsp -> 3 tsp
      expect(outcome.value.scaledIngredients[1].scaledLine).toBe('3 tsp vanilla');
      // 1/2 cup -> 1 cup
      expect(outcome.value.scaledIngredients[2].scaledLine).toBe('1 cup sugar');
      // 3 eggs -> 6 eggs
      expect(outcome.value.scaledIngredients[3].scaledLine).toBe('6 eggs');
      expect(outcome.trace.length).toBe(2);
    }
  });

  it('correctly scales 6 servings down to 3 servings (0.5x scale)', () => {
    const outcome = calculateRecipeScale({
      originalServings: 6,
      desiredServings: 3,
      ingredientsText: `1 cup milk\n2 tbsp butter`,
    });

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success' && outcome.value) {
      expect(outcome.value.scaleFactor).toBe(0.5);
      expect(outcome.value.scaledIngredients[0].scaledLine).toBe('1/2 cup milk');
      expect(outcome.value.scaledIngredients[1].scaledLine).toBe('1 tbsp butter');
    }
  });

  it('rejects zero or negative servings', () => {
    expect(calculateRecipeScale({ originalServings: 0, desiredServings: 4, ingredientsText: '1 cup flour' }).status).toBe('invalid');
  });
});
