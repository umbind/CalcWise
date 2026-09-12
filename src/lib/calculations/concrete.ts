import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type ConcreteShape = 'slab' | 'column' | 'footing';

export interface ConcreteInput {
  shape: ConcreteShape;
  // For slab or footing
  length?: number | string;
  width?: number | string;
  thickness?: number | string; // in inches by default
  lengthUnit?: 'feet' | 'inches' | 'meters' | 'cm';
  widthUnit?: 'feet' | 'inches' | 'meters' | 'cm';
  thicknessUnit?: 'inches' | 'feet' | 'cm' | 'meters';

  // For column
  diameter?: number | string;
  height?: number | string;
  diameterUnit?: 'inches' | 'feet' | 'cm' | 'meters';
  heightUnit?: 'feet' | 'inches' | 'meters' | 'cm';
  quantity?: number | string;

  wastePercentage?: number | string; // e.g. 10 for 10%
}

export interface ConcreteResult {
  shape: ConcreteShape;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuM: number;
  wastePercentage: number;
  totalVolumeCuFt: number;
  totalVolumeCuYd: number;
  totalVolumeCuM: number;
  formattedVolumeCuYd: string;
  formattedVolumeCuM: string;
  bags60lb: number;
  bags80lb: number;
  bags50lb: number;
  estimatedWeightLbs: number;
  summary: string;
}

export const CONCRETE_FORMULA_ID = 'formula-construction-concrete-v1.0.0';
export const CONCRETE_FORMULA_VERSION = '1.0.0';

function toFeet(val: Decimal, unit: string): Decimal {
  switch (unit) {
    case 'inches':
      return val.div(12);
    case 'meters':
      return val.times(new Decimal('3.280839895'));
    case 'cm':
      return val.div(100).times(new Decimal('3.280839895'));
    case 'feet':
    default:
      return val;
  }
}

export function calculateConcrete(input: ConcreteInput): CalculationOutcome<ConcreteResult> {
  const trace: CalculationStep[] = [];
  const wastePct = toDecimal(input.wastePercentage || 10) || new Decimal(10);
  const qty = toDecimal(input.quantity || 1) || new Decimal(1);

  let netCuFt: Decimal;

  if (input.shape === 'slab' || input.shape === 'footing') {
    const l = toDecimal(input.length);
    const w = toDecimal(input.width);
    const t = toDecimal(input.thickness);

    if (!l || l.lte(0) || !w || w.lte(0) || !t || t.lte(0)) {
      return createErrorOutcome(
        CONCRETE_FORMULA_ID,
        CONCRETE_FORMULA_VERSION,
        'Length, width, and thickness must be positive numbers.',
        { length: input.length, width: input.width, thickness: input.thickness }
      );
    }

    const lFt = toFeet(l, input.lengthUnit || 'feet');
    const wFt = toFeet(w, input.widthUnit || 'feet');
    const tFt = toFeet(t, input.thicknessUnit || 'inches');

    trace.push({
      stepNumber: 1,
      label: 'Convert Dimensions to Feet',
      expression: `L = ${l.toString()} ${input.lengthUnit || 'ft'} -> ${lFt.toFixed(3)} ft, W = ${w.toString()} ${input.widthUnit || 'ft'} -> ${wFt.toFixed(3)} ft, T = ${t.toString()} ${input.thicknessUnit || 'in'} -> ${tFt.toFixed(3)} ft`,
      result: `${lFt.toFixed(2)} × ${wFt.toFixed(2)} × ${tFt.toFixed(3)} ft`,
      explanation: 'Normalize all dimensions into standard feet.',
    });

    netCuFt = lFt.times(wFt).times(tFt).times(qty);

    trace.push({
      stepNumber: 2,
      label: 'Calculate Net Cubic Feet Volume',
      expression: `${lFt.toFixed(3)} × ${wFt.toFixed(3)} × ${tFt.toFixed(3)}${qty.gt(1) ? ` × ${qty.toString()}` : ''}`,
      result: `${netCuFt.toFixed(2)} cu ft`,
      explanation: 'Length × Width × Thickness (× quantity).',
    });
  } else {
    // Column / Cylinder: V = pi * (d/2)^2 * h
    const d = toDecimal(input.diameter);
    const h = toDecimal(input.height);

    if (!d || d.lte(0) || !h || h.lte(0)) {
      return createErrorOutcome(
        CONCRETE_FORMULA_ID,
        CONCRETE_FORMULA_VERSION,
        'Diameter and height must be positive numbers.',
        { diameter: input.diameter, height: input.height }
      );
    }

    const dFt = toFeet(d, input.diameterUnit || 'inches');
    const hFt = toFeet(h, input.heightUnit || 'feet');
    const radiusFt = dFt.div(2);

    trace.push({
      stepNumber: 1,
      label: 'Convert Column Dimensions to Feet',
      expression: `Diameter = ${d.toString()} -> Radius = ${radiusFt.toFixed(3)} ft, Height = ${hFt.toFixed(3)} ft`,
      result: `Radius = ${radiusFt.toFixed(3)} ft`,
      explanation: 'Calculate radius in feet (Diameter / 2).',
    });

    // Pi approx 3.141592653589793
    const pi = new Decimal('3.141592653589793');
    netCuFt = pi.times(radiusFt.pow(2)).times(hFt).times(qty);

    trace.push({
      stepNumber: 2,
      label: 'Calculate Cylinder Volume in Cubic Feet',
      expression: `π × (${radiusFt.toFixed(3)})² × ${hFt.toFixed(3)}${qty.gt(1) ? ` × ${qty.toString()}` : ''}`,
      result: `${netCuFt.toFixed(2)} cu ft`,
      explanation: 'Volume = π × r² × h (× quantity).',
    });
  }

  // 1 Cubic Yard = 27 Cubic Feet
  const netCuYd = netCuFt.div(27);
  // 1 Cubic Meter = 35.3146667 Cubic Feet
  const netCuM = netCuFt.div(new Decimal('35.3146667'));

  // Waste factor: Volume * (1 + wastePct / 100)
  const wasteMultiplier = new Decimal(1).plus(wastePct.div(100));
  const totalCuFt = netCuFt.times(wasteMultiplier);
  const totalCuYd = totalCuFt.div(27);
  const totalCuM = totalCuFt.div(new Decimal('35.3146667'));

  trace.push({
    stepNumber: 3,
    label: `Apply ${wastePct.toString()}% Waste / Spillage Allowance`,
    expression: `${netCuYd.toFixed(3)} cu yd × (1 + ${wastePct.toString()} ÷ 100)`,
    result: `${totalCuYd.toFixed(2)} cu yd (${totalCuFt.toFixed(1)} cu ft)`,
    explanation: 'Recommended 5-10% allowance for spillage, subgrade settlement, and formwork flexing.',
  });

  // Bag estimates (based on total volume including waste):
  // 80 lb bag yields ~0.60 cu ft
  // 60 lb bag yields ~0.45 cu ft
  // 50 lb bag yields ~0.375 cu ft
  const bags80 = Math.ceil(totalCuFt.div(new Decimal('0.60')).toNumber());
  const bags60 = Math.ceil(totalCuFt.div(new Decimal('0.45')).toNumber());
  const bags50 = Math.ceil(totalCuFt.div(new Decimal('0.375')).toNumber());

  // Density: ~140 lbs per cubic foot
  const estWeightLbs = Math.round(totalCuFt.times(140).toNumber());

  trace.push({
    stepNumber: 4,
    label: 'Calculate Pre-Mixed Bag Requirements',
    expression: `80lb: ${totalCuFt.toFixed(2)} ÷ 0.60 = ${bags80} bags; 60lb: ${totalCuFt.toFixed(2)} ÷ 0.45 = ${bags60} bags`,
    result: `${bags80} bags (80 lb)`,
    explanation: 'Standard dry mix coverage rounded up to the nearest whole bag.',
  });

  const summary = `You need approximately ${totalCuYd.toFixed(2)} cubic yards (${totalCuM.toFixed(2)} m³) of concrete, or about ${bags80} bags of 80 lb pre-mix (including a ${wastePct.toString()}% waste margin).`;

  return {
    status: 'success',
    value: {
      shape: input.shape,
      volumeCuFt: Number(netCuFt.toFixed(2)),
      volumeCuYd: Number(netCuYd.toFixed(2)),
      volumeCuM: Number(netCuM.toFixed(2)),
      wastePercentage: wastePct.toNumber(),
      totalVolumeCuFt: Number(totalCuFt.toFixed(2)),
      totalVolumeCuYd: Number(totalCuYd.toFixed(2)),
      totalVolumeCuM: Number(totalCuM.toFixed(2)),
      formattedVolumeCuYd: `${totalCuYd.toFixed(2)} cu yd`,
      formattedVolumeCuM: `${totalCuM.toFixed(2)} m³`,
      bags80lb: bags80,
      bags60lb: bags60,
      bags50lb: bags50,
      estimatedWeightLbs: estWeightLbs,
      summary,
    },
    normalizedInputs: {
      shape: input.shape,
      wastePercentage: wastePct.toNumber(),
      quantity: qty.toNumber(),
    },
    appliedDefaults: [],
    formulaId: CONCRETE_FORMULA_ID,
    formulaVersion: CONCRETE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
