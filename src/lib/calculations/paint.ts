import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface PaintInput {
  roomLengthFeet: number | string;
  roomWidthFeet: number | string;
  ceilingHeightFeet: number | string;
  doorsCount?: number | string;
  windowsCount?: number | string;
  coats?: number | string;
  coverageSqFtPerGallon?: number | string; // default 350 sq ft
}

export interface PaintResult {
  grossWallAreaSqFt: number;
  deductionsSqFt: number;
  netWallAreaSqFt: number;
  totalCoatedAreaSqFt: number;
  gallonsNeeded: number;
  litersNeeded: number;
  quartsNeeded: number;
  formattedGallons: string;
  formattedLiters: string;
  coats: number;
}

export const PAINT_FORMULA_ID = 'formula-architectural-paint-v1.0.0';
export const PAINT_FORMULA_VERSION = '1.0.0';

export function calculatePaint(input: PaintInput): CalculationOutcome<PaintResult> {
  const l = toDecimal(input.roomLengthFeet);
  const w = toDecimal(input.roomWidthFeet);
  const h = toDecimal(input.ceilingHeightFeet);
  const doors = toDecimal(input.doorsCount || 0) || new Decimal(0);
  const windows = toDecimal(input.windowsCount || 0) || new Decimal(0);
  const coats = toDecimal(input.coats || 2) || new Decimal(2);
  const coverage = toDecimal(input.coverageSqFtPerGallon || 350) || new Decimal(350);

  if (!l || l.lte(0) || !w || w.lte(0) || !h || h.lte(0)) {
    return createErrorOutcome(PAINT_FORMULA_ID, PAINT_FORMULA_VERSION, 'Room length, width, and ceiling height must be positive numbers.');
  }

  const trace: CalculationStep[] = [];

  // Perimeter = 2 * (L + W)
  const perimeter = l.plus(w).times(2);
  // Gross Wall Area = Perimeter * Height
  const grossArea = perimeter.times(h);

  trace.push({
    stepNumber: 1,
    label: 'Calculate Gross Wall Area',
    expression: `2 × (${l.toString()} ft + ${w.toString()} ft) × ${h.toString()} ft ceiling`,
    result: `${grossArea.toFixed(1)} sq ft`,
    explanation: 'Perimeter times ceiling height gives total gross wall surface.',
  });

  // Deductions: standard door ~ 21 sq ft (3x7 ft), standard window ~ 15 sq ft (3x5 ft)
  const doorArea = doors.times(21);
  const windowArea = windows.times(15);
  const totalDeductions = doorArea.plus(windowArea);

  trace.push({
    stepNumber: 2,
    label: 'Subtract Doors and Windows Deductions',
    expression: `(${doors.toString()} doors × 21 sq ft) + (${windows.toString()} windows × 15 sq ft)`,
    result: `-${totalDeductions.toFixed(0)} sq ft`,
    explanation: 'Deduct non-painted surface areas for doors and windows.',
  });

  const netArea = grossArea.minus(totalDeductions);
  if (netArea.lte(0)) {
    return createErrorOutcome(PAINT_FORMULA_ID, PAINT_FORMULA_VERSION, 'Deductions cannot exceed total wall area.');
  }

  // Total coated area = netArea * coats
  const totalCoatedArea = netArea.times(coats);

  trace.push({
    stepNumber: 3,
    label: `Multiply by ${coats.toString()} Coats of Paint`,
    expression: `${netArea.toFixed(1)} net sq ft × ${coats.toString()} coats`,
    result: `${totalCoatedArea.toFixed(1)} sq ft total coverage`,
    explanation: 'Multiple coats double or triple the required paint volume.',
  });

  // Gallons = totalCoatedArea / coverage (350 sq ft per gallon)
  const exactGallons = totalCoatedArea.div(coverage);
  // Practical purchase: round up to nearest whole gallon or quarts
  const wholeGallons = Math.ceil(exactGallons.toNumber());
  // 1 gallon = 3.78541 liters
  const exactLiters = exactGallons.times(new Decimal('3.78541'));
  const litersRounded = Number(exactLiters.toFixed(1));

  // Quarts needed if small room: 1 gallon = 4 quarts
  const quartsNeeded = Math.ceil(exactGallons.times(4).toNumber());

  trace.push({
    stepNumber: 4,
    label: 'Calculate Paint Can Requirements',
    expression: `${totalCoatedArea.toFixed(1)} sq ft ÷ ${coverage.toString()} sq ft/gal`,
    result: `${exactGallons.toFixed(2)} gal (Purchase ${wholeGallons} gallon cans)`,
    explanation: 'Standard paint coverage rounded up to ensure sufficient paint.',
  });

  return {
    status: 'success',
    value: {
      grossWallAreaSqFt: Number(grossArea.toFixed(1)),
      deductionsSqFt: Number(totalDeductions.toFixed(1)),
      netWallAreaSqFt: Number(netArea.toFixed(1)),
      totalCoatedAreaSqFt: Number(totalCoatedArea.toFixed(1)),
      gallonsNeeded: wholeGallons,
      litersNeeded: litersRounded,
      quartsNeeded,
      formattedGallons: `${wholeGallons} gallon${wholeGallons === 1 ? '' : 's'} (${exactGallons.toFixed(1)} gal exact)`,
      formattedLiters: `~${litersRounded} liters`,
      coats: coats.toNumber(),
    },
    normalizedInputs: {
      roomLength: l.toNumber(),
      roomWidth: w.toNumber(),
      ceilingHeight: h.toNumber(),
      doors: doors.toNumber(),
      windows: windows.toNumber(),
      coats: coats.toNumber(),
    },
    appliedDefaults: [],
    formulaId: PAINT_FORMULA_ID,
    formulaVersion: PAINT_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
