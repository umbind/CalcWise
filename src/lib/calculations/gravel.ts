import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type AggregateType = 'crushed_stone' | 'pea_gravel' | 'sand' | 'decomposed_granite';

export interface GravelInput {
  length: number | string;
  width: number | string;
  depthInches: number | string;
  unit?: 'feet' | 'meters';
  aggregateType?: AggregateType;
  customDensityLbsPerCuYd?: number | string;
}

export interface GravelResult {
  cubicFeet: number;
  cubicYards: number;
  tonsUS: number;
  tonnesMetric: number;
  densityLbsPerCuYd: number;
  formattedCubicYards: string;
  formattedTonsUS: string;
  formattedTonnesMetric: string;
}

export const GRAVEL_FORMULA_ID = 'formula-construction-gravel-aggregate-v1.0.0';
export const GRAVEL_FORMULA_VERSION = '1.0.0';

export function calculateGravel(input: GravelInput): CalculationOutcome<GravelResult> {
  const decL = toDecimal(input.length);
  const decW = toDecimal(input.width);
  const decD = toDecimal(input.depthInches);
  const unit = input.unit || 'feet';
  const aggType = input.aggregateType || 'crushed_stone';

  if (!decL || decL.lte(0) || !decW || decW.lte(0)) {
    return createErrorOutcome(GRAVEL_FORMULA_ID, GRAVEL_FORMULA_VERSION, 'Length and width must be positive numbers.', {});
  }
  if (!decD || decD.lte(0) || decD.gt(48)) {
    return createErrorOutcome(GRAVEL_FORMULA_ID, GRAVEL_FORMULA_VERSION, 'Depth must be between 0.25 and 48 inches.', { depthInches: input.depthInches });
  }

  // Determine density in lbs per cubic yard
  let densityLbsPerCuYd: number;
  if (input.customDensityLbsPerCuYd !== undefined && input.customDensityLbsPerCuYd !== '') {
    const customD = toDecimal(input.customDensityLbsPerCuYd);
    if (!customD || customD.lt(1000) || customD.gt(5000)) {
      return createErrorOutcome(GRAVEL_FORMULA_ID, GRAVEL_FORMULA_VERSION, 'Density must be between 1,000 and 5,000 lbs per cubic yard.', {});
    }
    densityLbsPerCuYd = customD.toNumber();
  } else {
    switch (aggType) {
      case 'pea_gravel':
        densityLbsPerCuYd = 2800; // 1.4 tons/yd
        break;
      case 'sand':
        densityLbsPerCuYd = 2600; // 1.3 tons/yd
        break;
      case 'decomposed_granite':
        densityLbsPerCuYd = 3000; // 1.5 tons/yd
        break;
      case 'crushed_stone':
      default:
        densityLbsPerCuYd = 2700; // 1.35 tons/yd
        break;
    }
  }

  // Convert to feet if meters provided
  let lFt = decL;
  let wFt = decW;
  if (unit === 'meters') {
    lFt = decL.times(3.28084);
    wFt = decW.times(3.28084);
  }

  const areaSqFt = lFt.times(wFt);
  const depthFt = decD.div(12);
  const cubicFeetDec = areaSqFt.times(depthFt);
  const cubicYardsDec = cubicFeetDec.div(27);

  // Weight
  const totalLbs = cubicYardsDec.times(densityLbsPerCuYd);
  const tonsUSDec = totalLbs.div(2000).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const tonnesMetricDec = totalLbs.div(2204.62).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const round2 = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Aggregate Volume (Cu Ft & Cu Yd)',
    expression: `${lFt.toDecimalPlaces(1).toString()} ft × ${wFt.toDecimalPlaces(1).toString()} ft × (${decD.toString()}" ÷ 12) = ${round2(cubicFeetDec)} cu ft ÷ 27`,
    result: `${round2(cubicYardsDec)} Cubic Yards`,
    explanation: 'Geometric volumetric space to fill.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Convert Bulk Volume to Tonnage Weight',
    expression: `${round2(cubicYardsDec)} cu yd × ${densityLbsPerCuYd} lbs/cu yd = ${round2(totalLbs)} lbs ÷ 2,000 lbs/ton`,
    result: `${tonsUSDec.toString()} US Short Tons (${tonnesMetricDec.toString()} Metric Tonnes)`,
    explanation: 'Quarry billable weight based on aggregate compaction density.',
  });

  return {
    status: 'success',
    value: {
      cubicFeet: round2(cubicFeetDec),
      cubicYards: round2(cubicYardsDec),
      tonsUS: tonsUSDec.toNumber(),
      tonnesMetric: tonnesMetricDec.toNumber(),
      densityLbsPerCuYd,
      formattedCubicYards: `${round2(cubicYardsDec)} cu yd`,
      formattedTonsUS: `${tonsUSDec.toString()} US Tons`,
      formattedTonnesMetric: `${tonnesMetricDec.toString()} Tonnes`,
    },
    normalizedInputs: {
      length: decL.toNumber(),
      width: decW.toNumber(),
      depthInches: decD.toNumber(),
      aggregateType: aggType,
      unit,
    },
    appliedDefaults: [],
    formulaId: GRAVEL_FORMULA_ID,
    formulaVersion: GRAVEL_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
