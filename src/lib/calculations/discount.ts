import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface DiscountInput {
  originalPrice: number | string;
  discountPercentage: number | string;
  additionalDiscountPercentage?: number | string;
  salesTaxRate?: number | string;
  currencySymbol?: string;
}

export interface DiscountResult {
  discountAmount: number;
  priceAfterDiscount: number;
  salesTaxAmount: number;
  finalPrice: number;
  totalSavings: number;
  effectiveSavingsPct: number;
  formattedFinalPrice: string;
  formattedDiscountAmount: string;
  formattedPriceAfterDiscount: string;
  formattedSalesTax: string;
  formattedTotalSavings: string;
}

export const DISCOUNT_FORMULA_ID = 'formula-everyday-discount-tax-v1.0.0';
export const DISCOUNT_FORMULA_VERSION = '1.0.0';

export function calculateDiscount(input: DiscountInput): CalculationOutcome<DiscountResult> {
  const price = toDecimal(input.originalPrice);
  const d1 = toDecimal(input.discountPercentage);
  const d2 = input.additionalDiscountPercentage !== undefined && input.additionalDiscountPercentage !== ''
    ? toDecimal(input.additionalDiscountPercentage)
    : new Decimal(0);
  const taxRate = input.salesTaxRate !== undefined && input.salesTaxRate !== ''
    ? toDecimal(input.salesTaxRate)
    : new Decimal(0);
  const symbol = input.currencySymbol || '$';

  if (!price || price.lte(0)) {
    return createErrorOutcome(DISCOUNT_FORMULA_ID, DISCOUNT_FORMULA_VERSION, 'Original price must be greater than zero.', { originalPrice: input.originalPrice });
  }
  if (!d1 || d1.lt(0) || d1.gt(100)) {
    return createErrorOutcome(DISCOUNT_FORMULA_ID, DISCOUNT_FORMULA_VERSION, 'Discount percentage must be between 0% and 100%.', { discountPercentage: input.discountPercentage });
  }
  if (d2 && (d2.lt(0) || d2.gt(100))) {
    return createErrorOutcome(DISCOUNT_FORMULA_ID, DISCOUNT_FORMULA_VERSION, 'Additional discount must be between 0% and 100%.', { additionalDiscountPercentage: input.additionalDiscountPercentage });
  }
  if (taxRate && (taxRate.lt(0) || taxRate.gt(50))) {
    return createErrorOutcome(DISCOUNT_FORMULA_ID, DISCOUNT_FORMULA_VERSION, 'Sales tax rate must be between 0% and 50%.', { salesTaxRate: input.salesTaxRate });
  }

  const trace: CalculationStep[] = [];

  // First discount
  const d1Multiplier = new Decimal(1).minus(d1.div(100));
  let discountedPrice = price.times(d1Multiplier);

  // Stacked second coupon discount
  if (d2 && d2.gt(0)) {
    const d2Multiplier = new Decimal(1).minus(d2.div(100));
    discountedPrice = discountedPrice.times(d2Multiplier);
  }
  discountedPrice = discountedPrice.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const discountSavings = price.minus(discountedPrice).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Sales tax
  const taxAmount = (taxRate && taxRate.gt(0))
    ? discountedPrice.times(taxRate.div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    : new Decimal(0);

  const finalTotal = discountedPrice.plus(taxAmount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const effectivePct = discountSavings.div(price).times(100).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  trace.push({
    stepNumber: 1,
    label: 'Apply Markdown & Coupon Discounts',
    expression: `${formatCurrency(price, symbol)} - ${d1.toString()}%${d2 && d2.gt(0) ? ` - extra ${d2.toString()}%` : ''}`,
    result: formatCurrency(discountedPrice, symbol),
    explanation: 'Retail discounted price before point-of-sale municipal taxes.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Sales Tax & Final Register Total',
    expression: `${formatCurrency(discountedPrice, symbol)} + (${taxRate?.toString() || 0}% tax = ${formatCurrency(taxAmount, symbol)})`,
    result: formatCurrency(finalTotal, symbol),
    explanation: 'Net out-of-pocket customer checkout payment.',
  });

  return {
    status: 'success',
    value: {
      discountAmount: discountSavings.toNumber(),
      priceAfterDiscount: discountedPrice.toNumber(),
      salesTaxAmount: taxAmount.toNumber(),
      finalPrice: finalTotal.toNumber(),
      totalSavings: discountSavings.toNumber(),
      effectiveSavingsPct: effectivePct.toNumber(),
      formattedFinalPrice: formatCurrency(finalTotal, symbol),
      formattedDiscountAmount: formatCurrency(discountSavings, symbol),
      formattedPriceAfterDiscount: formatCurrency(discountedPrice, symbol),
      formattedSalesTax: formatCurrency(taxAmount, symbol),
      formattedTotalSavings: formatCurrency(discountSavings, symbol),
    },
    normalizedInputs: {
      originalPrice: price.toNumber(),
      discountPercentage: d1.toNumber(),
      additionalDiscountPercentage: d2?.toNumber(),
      salesTaxRate: taxRate?.toNumber(),
    },
    appliedDefaults: [],
    formulaId: DISCOUNT_FORMULA_ID,
    formulaVersion: DISCOUNT_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
