import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface RoofingInput {
  houseLength: number | string;
  houseWidth: number | string;
  pitchRiseOver12: number | string; // e.g. 4, 6, 8
  wastePercentage?: number | string;
}

export interface RoofingResult {
  flatFootprintSqFt: number;
  pitchMultiplier: number;
  totalRoofAreaSqFt: number;
  roofingSquares: number;
  shingleBundles: number;
  underlaymentRolls: number;
  formattedRoofArea: string;
  formattedSquares: string;
  formattedBundles: string;
}

export const ROOFING_FORMULA_ID = 'formula-construction-roofing-shingles-v1.0.0';
export const ROOFING_FORMULA_VERSION = '1.0.0';

export function calculateRoofing(input: RoofingInput): CalculationOutcome<RoofingResult> {
  const decL = toDecimal(input.houseLength);
  const decW = toDecimal(input.houseWidth);
  const decPitch = toDecimal(input.pitchRiseOver12);
  const wastePct = input.wastePercentage !== undefined && input.wastePercentage !== ''
    ? toDecimal(input.wastePercentage)
    : new Decimal(10);

  if (!decL || decL.lte(0) || !decW || decW.lte(0)) {
    return createErrorOutcome(ROOFING_FORMULA_ID, ROOFING_FORMULA_VERSION, 'House length and width must be positive numbers.', {});
  }
  if (!decPitch || decPitch.lt(0) || decPitch.gt(24)) {
    return createErrorOutcome(ROOFING_FORMULA_ID, ROOFING_FORMULA_VERSION, 'Roof pitch must be between 0/12 (flat) and 24/12 (steep slope).', { pitchRiseOver12: input.pitchRiseOver12 });
  }
  if (!wastePct || wastePct.lt(0) || wastePct.gt(35)) {
    return createErrorOutcome(ROOFING_FORMULA_ID, ROOFING_FORMULA_VERSION, 'Waste allowance must be between 0% and 35%.', { wastePercentage: input.wastePercentage });
  }

  const footprint = decL.times(decW);
  const pitchNum = decPitch.toNumber();

  // Slope factor = sqrt(1 + (pitch / 12)^2)
  const slopeFactor = Math.sqrt(1 + Math.pow(pitchNum / 12, 2));
  const decSlopeFactor = new Decimal(slopeFactor).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);

  const wasteMultiplier = new Decimal(1).plus(wastePct.div(100));
  const trueArea = footprint.times(decSlopeFactor).times(wasteMultiplier).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  // 1 Square = 100 sq ft
  const squaresDec = trueArea.div(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const squares = squaresDec.toNumber();

  // 3 bundles per square
  const bundles = Math.ceil(squares * 3);

  // Standard felt / synthetic underlayment roll covers 400 sq ft (4 squares)
  const underlaymentRolls = Math.ceil(trueArea.toNumber() / 400);

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Geometric Slope Multiplier',
    expression: `√(1 + (${pitchNum} ÷ 12)²) = √(${ (1 + Math.pow(pitchNum / 12, 2)).toFixed(4) })`,
    result: decSlopeFactor.toString(),
    explanation: 'Trigonometric secant multiplier to project planar building footprint into sloped roof surface.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Compute Total Sloped Roof Area with Waste',
    expression: `${footprint.toString()} sq ft × ${decSlopeFactor.toString()} slope × (1 + ${wastePct.toString()}%)`,
    result: `${trueArea.toString()} sq ft`,
    explanation: 'Total actual roofing surface area requiring shingle coverage.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Convert Area to Roofing Squares and Bundles',
    expression: `${trueArea.toString()} sq ft ÷ 100 = ${squares} Squares × 3 bundles/sq`,
    result: `${squares} Squares (${bundles} Bundles)`,
    explanation: 'Standard American roofing unit of measure (1 Square = 100 sq ft).',
  });

  return {
    status: 'success',
    value: {
      flatFootprintSqFt: footprint.toNumber(),
      pitchMultiplier: decSlopeFactor.toNumber(),
      totalRoofAreaSqFt: trueArea.toNumber(),
      roofingSquares: squares,
      shingleBundles: bundles,
      underlaymentRolls,
      formattedRoofArea: `${trueArea.toString()} sq ft`,
      formattedSquares: `${squares} squares`,
      formattedBundles: `${bundles} bundles`,
    },
    normalizedInputs: {
      houseLength: decL.toNumber(),
      houseWidth: decW.toNumber(),
      pitchRiseOver12: pitchNum,
      wastePercentage: wastePct.toNumber(),
    },
    appliedDefaults: [],
    formulaId: ROOFING_FORMULA_ID,
    formulaVersion: ROOFING_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
