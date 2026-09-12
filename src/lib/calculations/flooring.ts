import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface FlooringInput {
  roomLength: number | string;
  roomWidth: number | string;
  unit?: 'feet' | 'meters';
  wastePercentage?: number | string;
  boxCoverageSqFt?: number | string;
  pricePerSqUnit?: number | string;
  currencySymbol?: string;
}

export interface FlooringResult {
  rawArea: number;
  wasteArea: number;
  totalAreaWithWaste: number;
  boxesNeeded: number;
  totalCost?: number;
  unit: 'feet' | 'meters';
  formattedRawArea: string;
  formattedTotalArea: string;
  formattedBoxes: string;
  formattedCost: string;
}

export const FLOORING_FORMULA_ID = 'formula-construction-flooring-v1.0.0';
export const FLOORING_FORMULA_VERSION = '1.0.0';

export function calculateFlooring(input: FlooringInput): CalculationOutcome<FlooringResult> {
  const decL = toDecimal(input.roomLength);
  const decW = toDecimal(input.roomWidth);
  const unit = input.unit || 'feet';
  const wastePct = input.wastePercentage !== undefined && input.wastePercentage !== ''
    ? toDecimal(input.wastePercentage)
    : new Decimal(10);
  const boxCov = input.boxCoverageSqFt !== undefined && input.boxCoverageSqFt !== ''
    ? toDecimal(input.boxCoverageSqFt)
    : new Decimal(20);
  const price = input.pricePerSqUnit !== undefined && input.pricePerSqUnit !== ''
    ? toDecimal(input.pricePerSqUnit)
    : undefined;
  const symbol = input.currencySymbol || '$';

  if (!decL || decL.lte(0) || !decW || decW.lte(0)) {
    return createErrorOutcome(FLOORING_FORMULA_ID, FLOORING_FORMULA_VERSION, 'Room length and width must be greater than zero.', {});
  }
  if (!wastePct || wastePct.lt(0) || wastePct.gt(50)) {
    return createErrorOutcome(FLOORING_FORMULA_ID, FLOORING_FORMULA_VERSION, 'Waste allowance must be between 0% and 50%.', { wastePercentage: input.wastePercentage });
  }
  if (!boxCov || boxCov.lte(0)) {
    return createErrorOutcome(FLOORING_FORMULA_ID, FLOORING_FORMULA_VERSION, 'Box coverage area must be greater than zero.', { boxCoverageSqFt: input.boxCoverageSqFt });
  }

  const rawAreaDec = decL.times(decW).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const wasteMultiplier = new Decimal(1).plus(wastePct.div(100));
  const totalAreaDec = rawAreaDec.times(wasteMultiplier).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const wasteAreaDec = totalAreaDec.minus(rawAreaDec).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Boxes needed: totalArea / boxCov rounded up
  const boxes = totalAreaDec.div(boxCov).toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();

  let totalCostDec: Decimal | undefined;
  let formattedCost = 'N/A';
  if (price && price.gte(0)) {
    // Total cost based on total purchased area or purchased boxes
    const purchasedArea = new Decimal(boxes).times(boxCov);
    totalCostDec = purchasedArea.times(price).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    formattedCost = formatCurrency(totalCostDec, symbol);
  }

  const unitLabel = unit === 'meters' ? 'm²' : 'sq ft';
  const trace: CalculationStep[] = [];

  trace.push({
    stepNumber: 1,
    label: 'Compute Net Floor Footprint',
    expression: `${decL.toString()} × ${decW.toString()} ${unit}`,
    result: `${rawAreaDec.toString()} ${unitLabel}`,
    explanation: 'Basic rectangular room surface area calculation.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Add Cutting and Layout Waste Allowance',
    expression: `${rawAreaDec.toString()} × (1 + ${wastePct.toString()}%)`,
    result: `${totalAreaDec.toString()} ${unitLabel} (+${wasteAreaDec.toString()} ${unitLabel})`,
    explanation: 'Industry standard material overage for end cuts, staggered seams, and doorway trimming.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Calculate Required Material Packages',
    expression: `ceil(${totalAreaDec.toString()} ÷ ${boxCov.toString()} per box)`,
    result: `${boxes} Boxes`,
    explanation: 'Total whole carton packages to purchase.',
  });

  return {
    status: 'success',
    value: {
      rawArea: rawAreaDec.toNumber(),
      wasteArea: wasteAreaDec.toNumber(),
      totalAreaWithWaste: totalAreaDec.toNumber(),
      boxesNeeded: boxes,
      totalCost: totalCostDec ? totalCostDec.toNumber() : undefined,
      unit,
      formattedRawArea: `${rawAreaDec.toString()} ${unitLabel}`,
      formattedTotalArea: `${totalAreaDec.toString()} ${unitLabel}`,
      formattedBoxes: `${boxes} boxes`,
      formattedCost,
    },
    normalizedInputs: {
      roomLength: decL.toNumber(),
      roomWidth: decW.toNumber(),
      wastePercentage: wastePct.toNumber(),
      boxCoverageSqFt: boxCov.toNumber(),
    },
    appliedDefaults: [],
    formulaId: FLOORING_FORMULA_ID,
    formulaVersion: FLOORING_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
