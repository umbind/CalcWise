import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface MulchInput {
  areaLength: number | string;
  areaWidth: number | string;
  depthInches: number | string;
  unit?: 'feet' | 'meters';
}

export interface MulchResult {
  areaSqFt: number;
  cubicFeet: number;
  cubicYards: number;
  bags2CuFt: number;
  bags1Pt5CuFt: number;
  bags3CuFt: number;
  depthInches: number;
  formattedArea: string;
  formattedCubicYards: string;
  formattedCubicFeet: string;
}

export const MULCH_FORMULA_ID = 'formula-construction-mulch-soil-v1.0.0';
export const MULCH_FORMULA_VERSION = '1.0.0';

export function calculateMulch(input: MulchInput): CalculationOutcome<MulchResult> {
  const decL = toDecimal(input.areaLength);
  const decW = toDecimal(input.areaWidth);
  const decD = toDecimal(input.depthInches);
  const unit = input.unit || 'feet';

  if (!decL || decL.lte(0) || !decW || decW.lte(0)) {
    return createErrorOutcome(MULCH_FORMULA_ID, MULCH_FORMULA_VERSION, 'Length and width must be greater than zero.', {});
  }
  if (!decD || decD.lte(0) || decD.gt(36)) {
    return createErrorOutcome(MULCH_FORMULA_ID, MULCH_FORMULA_VERSION, 'Depth must be between 0.25 and 36 inches.', { depthInches: input.depthInches });
  }

  // Convert to feet if meters provided: 1 meter = 3.28084 feet
  let lFt = decL;
  let wFt = decW;
  if (unit === 'meters') {
    lFt = decL.times(3.28084);
    wFt = decW.times(3.28084);
  }

  const areaSqFt = lFt.times(wFt);
  const depthFt = decD.div(12);
  const cubicFeet = areaSqFt.times(depthFt);
  const cubicYards = cubicFeet.div(27);

  const round2 = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();

  const bags2 = cubicFeet.div(2.0).toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();
  const bags15 = cubicFeet.div(1.5).toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();
  const bags3 = cubicFeet.div(3.0).toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Planar Garden Bed Area',
    expression: `${lFt.toDecimalPlaces(1).toString()} ft × ${wFt.toDecimalPlaces(1).toString()} ft`,
    result: `${round2(areaSqFt)} sq ft`,
    explanation: 'Total surface coverage of landscape beds.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Cubic Volume (Feet & Yards)',
    expression: `${round2(areaSqFt)} sq ft × (${decD.toString()}" ÷ 12") = ${round2(cubicFeet)} cu ft ÷ 27`,
    result: `${round2(cubicYards)} Cubic Yards`,
    explanation: 'Standard bulk material ordering volume unit (1 cubic yard = 27 cubic feet).',
  });

  trace.push({
    stepNumber: 3,
    label: 'Determine Bagged Packaging Requirements',
    expression: `ceil(${round2(cubicFeet)} cu ft ÷ 2.0 cu ft/bag)`,
    result: `${bags2} Bags (2 cu ft standard)`,
    explanation: 'Quantity of pre-packaged retail mulch or topsoil bags needed.',
  });

  return {
    status: 'success',
    value: {
      areaSqFt: round2(areaSqFt),
      cubicFeet: round2(cubicFeet),
      cubicYards: round2(cubicYards),
      bags2CuFt: bags2,
      bags1Pt5CuFt: bags15,
      bags3CuFt: bags3,
      depthInches: decD.toNumber(),
      formattedArea: `${round2(areaSqFt)} sq ft`,
      formattedCubicYards: `${round2(cubicYards)} cu yd`,
      formattedCubicFeet: `${round2(cubicFeet)} cu ft`,
    },
    normalizedInputs: {
      areaLength: decL.toNumber(),
      areaWidth: decW.toNumber(),
      depthInches: decD.toNumber(),
      unit,
    },
    appliedDefaults: [],
    formulaId: MULCH_FORMULA_ID,
    formulaVersion: MULCH_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
