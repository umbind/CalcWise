import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export type QuantityCategory = 'length' | 'mass' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // Multiplier to canonical base SI unit, or custom transform for temperature
  factorToBase?: string;
  isExact?: boolean;
}

export interface ConverterInput {
  category: QuantityCategory;
  value: number | string;
  fromUnit: string;
  toUnit: string;
}

export interface ConverterResult {
  category: QuantityCategory;
  fromValue: number;
  fromUnit: UnitDefinition;
  toValue: number;
  formattedToValue: string;
  toUnit: UnitDefinition;
  isExact: boolean;
  rate: string;
  equation: string;
}

export const CONVERTER_FORMULA_ID = 'formula-canonical-converter-v1.0.0';
export const CONVERTER_FORMULA_VERSION = '1.0.0';

export const QUANTITY_REGISTRY: Record<QuantityCategory, { baseUnit: string; units: Record<string, UnitDefinition> }> = {
  length: {
    baseUnit: 'm',
    units: {
      m: { id: 'm', name: 'Meter', symbol: 'm', factorToBase: '1', isExact: true },
      km: { id: 'km', name: 'Kilometer', symbol: 'km', factorToBase: '1000', isExact: true },
      cm: { id: 'cm', name: 'Centimeter', symbol: 'cm', factorToBase: '0.01', isExact: true },
      mm: { id: 'mm', name: 'Millimeter', symbol: 'mm', factorToBase: '0.001', isExact: true },
      in: { id: 'in', name: 'Inch', symbol: 'in', factorToBase: '0.0254', isExact: true },
      ft: { id: 'ft', name: 'Foot', symbol: 'ft', factorToBase: '0.3048', isExact: true },
      yd: { id: 'yd', name: 'Yard', symbol: 'yd', factorToBase: '0.9144', isExact: true },
      mi: { id: 'mi', name: 'Mile', symbol: 'mi', factorToBase: '1609.344', isExact: true },
    },
  },
  mass: {
    baseUnit: 'kg',
    units: {
      kg: { id: 'kg', name: 'Kilogram', symbol: 'kg', factorToBase: '1', isExact: true },
      g: { id: 'g', name: 'Gram', symbol: 'g', factorToBase: '0.001', isExact: true },
      mg: { id: 'mg', name: 'Milligram', symbol: 'mg', factorToBase: '0.000001', isExact: true },
      lb: { id: 'lb', name: 'Pound', symbol: 'lb', factorToBase: '0.45359237', isExact: true },
      oz: { id: 'oz', name: 'Ounce', symbol: 'oz', factorToBase: '0.028349523125', isExact: true },
      ton: { id: 'ton', name: 'Metric Ton', symbol: 't', factorToBase: '1000', isExact: true },
    },
  },
  temperature: {
    baseUnit: 'c',
    units: {
      c: { id: 'c', name: 'Celsius', symbol: '°C', isExact: true },
      f: { id: 'f', name: 'Fahrenheit', symbol: '°F', isExact: true },
      k: { id: 'k', name: 'Kelvin', symbol: 'K', isExact: true },
    },
  },
  area: {
    baseUnit: 'sq_m',
    units: {
      sq_m: { id: 'sq_m', name: 'Square Meter', symbol: 'm²', factorToBase: '1', isExact: true },
      sq_km: { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', factorToBase: '1000000', isExact: true },
      sq_ft: { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', factorToBase: '0.09290304', isExact: true },
      sq_in: { id: 'sq_in', name: 'Square Inch', symbol: 'in²', factorToBase: '0.00064516', isExact: true },
      acre: { id: 'acre', name: 'Acre', symbol: 'ac', factorToBase: '4046.8564224', isExact: false },
      hectare: { id: 'hectare', name: 'Hectare', symbol: 'ha', factorToBase: '10000', isExact: true },
    },
  },
  volume: {
    baseUnit: 'l',
    units: {
      l: { id: 'l', name: 'Liter', symbol: 'L', factorToBase: '1', isExact: true },
      ml: { id: 'ml', name: 'Milliliter', symbol: 'mL', factorToBase: '0.001', isExact: true },
      cu_m: { id: 'cu_m', name: 'Cubic Meter', symbol: 'm³', factorToBase: '1000', isExact: true },
      cu_ft: { id: 'cu_ft', name: 'Cubic Foot', symbol: 'ft³', factorToBase: '28.316846592', isExact: true },
      us_gal: { id: 'us_gal', name: 'US Gallon', symbol: 'gal', factorToBase: '3.785411784', isExact: true },
    },
  },
  speed: {
    baseUnit: 'm_s',
    units: {
      m_s: { id: 'm_s', name: 'Meters per Second', symbol: 'm/s', factorToBase: '1', isExact: true },
      km_h: { id: 'km_h', name: 'Kilometers per Hour', symbol: 'km/h', factorToBase: '0.2777777777777778', isExact: false },
      mph: { id: 'mph', name: 'Miles per Hour', symbol: 'mph', factorToBase: '0.44704', isExact: true },
      knot: { id: 'knot', name: 'Knot', symbol: 'kn', factorToBase: '0.5144444444444444', isExact: false },
    },
  },
  data: {
    baseUnit: 'b',
    units: {
      b: { id: 'b', name: 'Byte', symbol: 'B', factorToBase: '1', isExact: true },
      kb: { id: 'kb', name: 'Kilobyte', symbol: 'KB', factorToBase: '1024', isExact: true },
      mb: { id: 'mb', name: 'Megabyte', symbol: 'MB', factorToBase: '1048576', isExact: true },
      gb: { id: 'gb', name: 'Gigabyte', symbol: 'GB', factorToBase: '1073741824', isExact: true },
      tb: { id: 'tb', name: 'Terabyte', symbol: 'TB', factorToBase: '1099511627776', isExact: true },
    },
  },
};

export function convertUnit(input: ConverterInput): CalculationOutcome<ConverterResult> {
  const val = toDecimal(input.value);
  if (!val) {
    return createErrorOutcome(CONVERTER_FORMULA_ID, CONVERTER_FORMULA_VERSION, 'Value must be a valid number.', {
      value: input.value,
    });
  }

  const cat = QUANTITY_REGISTRY[input.category];
  if (!cat) {
    return createErrorOutcome(CONVERTER_FORMULA_ID, CONVERTER_FORMULA_VERSION, 'Unknown quantity category.', {
      category: input.category,
    });
  }

  const fromDef = cat.units[input.fromUnit];
  const toDef = cat.units[input.toUnit];

  if (!fromDef || !toDef) {
    return createErrorOutcome(
      CONVERTER_FORMULA_ID,
      CONVERTER_FORMULA_VERSION,
      `Invalid unit selected. (${input.fromUnit} or ${input.toUnit})`,
      { fromUnit: input.fromUnit, toUnit: input.toUnit }
    );
  }

  const trace: CalculationStep[] = [];
  let resultDec: Decimal;
  let isExact = (fromDef.isExact ?? false) && (toDef.isExact ?? false);

  if (input.category === 'temperature') {
    // Special handling for affine temperature formulas
    let baseCelsius: Decimal;

    // Convert fromUnit to Celsius
    if (input.fromUnit === 'c') {
      baseCelsius = val;
    } else if (input.fromUnit === 'f') {
      baseCelsius = val.minus(32).times(5).div(9);
      trace.push({
        stepNumber: 1,
        label: 'Convert Fahrenheit to Celsius',
        expression: `(${val.toString()} - 32) × 5 ÷ 9`,
        result: baseCelsius.toFixed(4),
        explanation: 'Standard Fahrenheit to Celsius conversion.',
      });
    } else {
      // Kelvin
      baseCelsius = val.minus('273.15');
      trace.push({
        stepNumber: 1,
        label: 'Convert Kelvin to Celsius',
        expression: `${val.toString()} - 273.15`,
        result: baseCelsius.toFixed(4),
        explanation: 'Subtract absolute zero offset 273.15.',
      });
    }

    // Convert Celsius to toUnit
    if (input.toUnit === 'c') {
      resultDec = baseCelsius;
    } else if (input.toUnit === 'f') {
      resultDec = baseCelsius.times(9).div(5).plus(32);
      trace.push({
        stepNumber: trace.length + 1,
        label: 'Convert Celsius to Fahrenheit',
        expression: `(${baseCelsius.toFixed(4)} × 9 ÷ 5) + 32`,
        result: resultDec.toFixed(2),
        explanation: 'Multiply by 9/5 and add 32.',
      });
    } else {
      // Kelvin
      resultDec = baseCelsius.plus('273.15');
      trace.push({
        stepNumber: trace.length + 1,
        label: 'Convert Celsius to Kelvin',
        expression: `${baseCelsius.toFixed(4)} + 273.15`,
        result: resultDec.toFixed(2),
        explanation: 'Add 273.15 for absolute temperature in Kelvin.',
      });
    }
  } else {
    // Standard proportional conversions via factorToBase
    const factorFrom = new Decimal(fromDef.factorToBase || '1');
    const factorTo = new Decimal(toDef.factorToBase || '1');

    // Base value = input * factorFrom
    const baseVal = val.times(factorFrom);
    trace.push({
      stepNumber: 1,
      label: `Convert ${fromDef.name} to Canonical Base (${cat.baseUnit})`,
      expression: `${val.toString()} × ${factorFrom.toString()}`,
      result: baseVal.toFixed(6),
      explanation: `Multiply by exact conversion factor to base unit ${cat.baseUnit}.`,
    });

    // Result value = baseVal / factorTo
    resultDec = baseVal.div(factorTo);
    trace.push({
      stepNumber: 2,
      label: `Convert Base (${cat.baseUnit}) to ${toDef.name}`,
      expression: `${baseVal.toFixed(6)} ÷ ${factorTo.toString()}`,
      result: resultDec.toFixed(6),
      explanation: `Divide canonical base value by target unit factor.`,
    });
  }

  const formattedToValue = resultDec.toDecimalPlaces(6, Decimal.ROUND_HALF_UP).toString();
  const equation = `${val.toString()} ${fromDef.symbol} = ${formattedToValue} ${toDef.symbol}`;

  return {
    status: 'success',
    value: {
      category: input.category,
      fromValue: val.toNumber(),
      fromUnit: fromDef,
      toValue: resultDec.toNumber(),
      formattedToValue,
      toUnit: toDef,
      isExact,
      rate: `1 ${fromDef.symbol} = ${resultDec.div(val).toDecimalPlaces(6, Decimal.ROUND_HALF_UP).toString()} ${toDef.symbol}`,
      equation,
    },
    normalizedInputs: {
      category: input.category,
      value: val.toNumber(),
      fromUnit: input.fromUnit,
      toUnit: input.toUnit,
    },
    appliedDefaults: [],
    formulaId: CONVERTER_FORMULA_ID,
    formulaVersion: CONVERTER_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
