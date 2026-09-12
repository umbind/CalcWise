import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface DrywallInput {
  roomLength: number | string;
  roomWidth: number | string;
  ceilingHeight: number | string;
  includeCeiling?: boolean;
  sheetSize?: '4x8' | '4x12';
  doorsWindowsDeductionSqFt?: number | string;
  wastePercentage?: number | string;
}

export interface DrywallResult {
  wallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalAreaSqFt: number;
  sheetSize: '4x8' | '4x12';
  sheetsNeeded: number;
  jointCompoundGallons: number;
  screwsCount: number;
  tapeRolls: number;
  formattedTotalArea: string;
  formattedSheets: string;
}

export const DRYWALL_FORMULA_ID = 'formula-construction-drywall-v1.0.0';
export const DRYWALL_FORMULA_VERSION = '1.0.0';

export function calculateDrywall(input: DrywallInput): CalculationOutcome<DrywallResult> {
  const decL = toDecimal(input.roomLength);
  const decW = toDecimal(input.roomWidth);
  const decH = toDecimal(input.ceilingHeight);
  const includeCeiling = input.includeCeiling !== false;
  const sheetSize = input.sheetSize || '4x8';
  const decDeduct = input.doorsWindowsDeductionSqFt !== undefined && input.doorsWindowsDeductionSqFt !== ''
    ? toDecimal(input.doorsWindowsDeductionSqFt)
    : new Decimal(40); // default 1 door (20 sq ft) + 1 window (20 sq ft)
  const wastePct = input.wastePercentage !== undefined && input.wastePercentage !== ''
    ? toDecimal(input.wastePercentage)
    : new Decimal(10);

  if (!decL || decL.lte(0) || !decW || decW.lte(0) || !decH || decH.lte(0)) {
    return createErrorOutcome(DRYWALL_FORMULA_ID, DRYWALL_FORMULA_VERSION, 'Room length, width, and ceiling height must be positive numbers.', {});
  }
  if (!wastePct || wastePct.lt(0) || wastePct.gt(30)) {
    return createErrorOutcome(DRYWALL_FORMULA_ID, DRYWALL_FORMULA_VERSION, 'Waste allowance must be between 0% and 30%.', { wastePercentage: input.wastePercentage });
  }

  const perimeter = decL.plus(decW).times(2);
  const rawWallArea = perimeter.times(decH);
  const wallArea = Decimal.max(0, rawWallArea.minus(decDeduct || 0));
  const ceilingArea = includeCeiling ? decL.times(decW) : new Decimal(0);

  const rawTotalArea = wallArea.plus(ceilingArea);
  const wasteMultiplier = new Decimal(1).plus(wastePct.div(100));
  const totalAreaWithWaste = rawTotalArea.times(wasteMultiplier);

  const sheetSqFt = sheetSize === '4x12' ? 48 : 32;
  const sheetsNeeded = totalAreaWithWaste.div(sheetSqFt).toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();

  // Trade estimating guidelines:
  // Joint compound (ready-mixed mud): ~0.053 gallons per sq ft of drywall (or ~1 pail of 4.5 gal per 80-90 sq ft)
  // Or roughly 1 x 4.5-gallon pail per 7-8 sheets (4x8)
  const compoundGallons = new Decimal(sheetsNeeded * 0.6).toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toNumber();

  // Screws: ~32 screws per 4x8 sheet (16" on center studs)
  const screwsPerSheet = sheetSize === '4x12' ? 48 : 32;
  const totalScrews = sheetsNeeded * screwsPerSheet;

  // Tape: 1 roll (250 ft) covers ~10-12 sheets
  const tapeRolls = Math.max(1, Math.ceil(sheetsNeeded / 12));

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Net Wall & Ceiling Areas',
    expression: `Perimeter (${perimeter.toString()} ft) × Height (${decH.toString()} ft) - ${decDeduct?.toString() || 0} sq ft deduct = ${wallArea.toString()} sq ft walls; Ceiling = ${ceilingArea.toString()} sq ft`,
    result: `${rawTotalArea.toString()} sq ft`,
    explanation: 'Geometric interior wall envelope minus openings plus ceiling.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Apply Waste Factor & Sheet Division',
    expression: `ceil((${rawTotalArea.toString()} sq ft × (1 + ${wastePct.toString()}%)) ÷ ${sheetSqFt} sq ft/${sheetSize})`,
    result: `${sheetsNeeded} Sheets (${sheetSize})`,
    explanation: 'Total whole drywall panels to purchase.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Estimate Finishing Accessories',
    expression: `${sheetsNeeded} sheets → ~${compoundGallons} gal Joint Compound, ~${totalScrews} Screws, ${tapeRolls} Tape Rolls`,
    result: `Accessories Packaged`,
    explanation: 'Consumables required for complete tape, mud, and screw fastening.',
  });

  return {
    status: 'success',
    value: {
      wallAreaSqFt: wallArea.toNumber(),
      ceilingAreaSqFt: ceilingArea.toNumber(),
      totalAreaSqFt: rawTotalArea.toNumber(),
      sheetSize,
      sheetsNeeded,
      jointCompoundGallons: compoundGallons,
      screwsCount: totalScrews,
      tapeRolls,
      formattedTotalArea: `${rawTotalArea.toString()} sq ft`,
      formattedSheets: `${sheetsNeeded} sheets (${sheetSize})`,
    },
    normalizedInputs: {
      roomLength: decL.toNumber(),
      roomWidth: decW.toNumber(),
      ceilingHeight: decH.toNumber(),
      includeCeiling,
      sheetSize,
    },
    appliedDefaults: [],
    formulaId: DRYWALL_FORMULA_ID,
    formulaVersion: DRYWALL_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
