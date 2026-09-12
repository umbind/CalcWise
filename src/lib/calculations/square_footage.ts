import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface RoomDimension {
  length: number | string;
  width: number | string;
  label?: string;
}

export interface SquareFootageInput {
  rooms: RoomDimension[];
  pricePerSqFt?: number | string;
  currencySymbol?: string;
}

export interface SquareFootageResult {
  totalSqFt: number;
  totalSqMeters: number;
  totalSqYards: number;
  totalMaterialCost: number | null;
  formattedSqFt: string;
  formattedSqMeters: string;
  formattedSqYards: string;
  formattedCost: string | null;
  roomCount: number;
}

export const SQUARE_FOOTAGE_FORMULA_ID = 'formula-square-footage-area-v1.0.0';
export const SQUARE_FOOTAGE_FORMULA_VERSION = '1.0.0';

export function calculateSquareFootage(input: SquareFootageInput): CalculationOutcome<SquareFootageResult> {
  if (!input.rooms || input.rooms.length === 0) {
    return createErrorOutcome(SQUARE_FOOTAGE_FORMULA_ID, SQUARE_FOOTAGE_FORMULA_VERSION, 'At least one room or area dimension is required.');
  }

  const trace: CalculationStep[] = [];
  let totalSqFtDec = new Decimal(0);
  const symbol = input.currencySymbol || '$';

  for (let i = 0; i < input.rooms.length; i++) {
    const room = input.rooms[i];
    const l = toDecimal(room.length);
    const w = toDecimal(room.width);

    if (!l || l.lte(0) || !w || w.lte(0)) {
      return createErrorOutcome(
        SQUARE_FOOTAGE_FORMULA_ID,
        SQUARE_FOOTAGE_FORMULA_VERSION,
        `Room ${i + 1} dimensions must be positive numbers.`
      );
    }

    const roomArea = l.times(w);
    totalSqFtDec = totalSqFtDec.plus(roomArea);

    trace.push({
      stepNumber: i + 1,
      label: `Area for ${room.label || `Room ${i + 1}`}`,
      expression: `${l.toString()} ft × ${w.toString()} ft`,
      result: `${roomArea.toFixed(2)} sq ft`,
      explanation: 'Length times width.',
    });
  }

  // Conversions:
  // 1 sq yard = 9 sq feet
  // 1 sq meter = 10.7639104 sq feet
  const totalSqYardsDec = totalSqFtDec.div(9).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalSqMetersDec = totalSqFtDec.div(new Decimal('10.7639104')).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  let totalCost: number | null = null;
  let formattedCost: string | null = null;

  const unitCost = toDecimal(input.pricePerSqFt);
  if (unitCost && unitCost.gt(0)) {
    const costDec = totalSqFtDec.times(unitCost).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    totalCost = costDec.toNumber();
    formattedCost = formatCurrency(costDec, symbol);

    trace.push({
      stepNumber: trace.length + 1,
      label: 'Calculate Material Cost',
      expression: `${totalSqFtDec.toFixed(2)} sq ft × ${formatCurrency(unitCost, symbol)}/sq ft`,
      result: formattedCost,
      explanation: 'Total area multiplied by price per square foot.',
    });
  }

  return {
    status: 'success',
    value: {
      totalSqFt: totalSqFtDec.toNumber(),
      totalSqMeters: totalSqMetersDec.toNumber(),
      totalSqYards: totalSqYardsDec.toNumber(),
      totalMaterialCost: totalCost,
      formattedSqFt: `${totalSqFtDec.toFixed(2)} sq ft`,
      formattedSqMeters: `${totalSqMetersDec.toFixed(2)} m²`,
      formattedSqYards: `${totalSqYardsDec.toFixed(2)} sq yd`,
      formattedCost,
      roomCount: input.rooms.length,
    },
    normalizedInputs: {
      roomCount: input.rooms.length,
    },
    appliedDefaults: [],
    formulaId: SQUARE_FOOTAGE_FORMULA_ID,
    formulaVersion: SQUARE_FOOTAGE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
