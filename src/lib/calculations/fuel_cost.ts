import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface FuelCostInput {
  distance: number | string;
  distanceUnit?: 'miles' | 'km';
  fuelEfficiencyMpg?: number | string;
  fuelEfficiencyL100km?: number | string;
  fuelPricePerUnit: number | string; // $/gal or $/L based on distanceUnit
  isRoundTrip?: boolean;
  currencySymbol?: string;
}

export interface FuelCostResult {
  totalDistance: number;
  fuelNeededGallons: number;
  fuelNeededLiters: number;
  totalCost: number;
  costPerUnit: number;
  distanceUnit: 'miles' | 'km';
  formattedTotalCost: string;
  formattedFuelVolume: string;
  formattedCostPerUnit: string;
}

export const FUEL_COST_FORMULA_ID = 'formula-everyday-fuel-cost-trip-v1.0.0';
export const FUEL_COST_FORMULA_VERSION = '1.0.0';

export function calculateFuelCost(input: FuelCostInput): CalculationOutcome<FuelCostResult> {
  const decDist = toDecimal(input.distance);
  const unit = input.distanceUnit || 'miles';
  const isRound = input.isRoundTrip === true;
  const decPrice = toDecimal(input.fuelPricePerUnit);
  const symbol = input.currencySymbol || '$';

  if (!decDist || decDist.lte(0)) {
    return createErrorOutcome(FUEL_COST_FORMULA_ID, FUEL_COST_FORMULA_VERSION, 'Trip distance must be greater than zero.', {});
  }
  if (!decPrice || decPrice.lte(0)) {
    return createErrorOutcome(FUEL_COST_FORMULA_ID, FUEL_COST_FORMULA_VERSION, 'Fuel price must be greater than zero.', {});
  }

  const effectiveDistance = isRound ? decDist.times(2) : decDist;
  let fuelNeededGallonsDec = new Decimal(0);
  let fuelNeededLitersDec = new Decimal(0);

  if (unit === 'miles') {
    const mpg = toDecimal(input.fuelEfficiencyMpg);
    if (!mpg || mpg.lte(0) || mpg.gt(150)) {
      return createErrorOutcome(FUEL_COST_FORMULA_ID, FUEL_COST_FORMULA_VERSION, 'Fuel efficiency (MPG) must be between 1 and 150 MPG.', { fuelEfficiencyMpg: input.fuelEfficiencyMpg });
    }
    // Gallons = miles / mpg
    fuelNeededGallonsDec = effectiveDistance.div(mpg);
    fuelNeededLitersDec = fuelNeededGallonsDec.times(3.78541);
  } else {
    // km and L/100km
    const l100 = toDecimal(input.fuelEfficiencyL100km);
    if (!l100 || l100.lte(0) || l100.gt(50)) {
      return createErrorOutcome(FUEL_COST_FORMULA_ID, FUEL_COST_FORMULA_VERSION, 'Fuel consumption (L/100km) must be between 1 and 50.', { fuelEfficiencyL100km: input.fuelEfficiencyL100km });
    }
    // Liters = (km / 100) * L/100km
    fuelNeededLitersDec = effectiveDistance.div(100).times(l100);
    fuelNeededGallonsDec = fuelNeededLitersDec.div(3.78541);
  }

  // Cost: if unit is miles, price is $/gallon; if km, price is $/liter
  const primaryVolume = unit === 'miles' ? fuelNeededGallonsDec : fuelNeededLitersDec;
  const totalCostDec = primaryVolume.times(decPrice).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const costPerDistDec = totalCostDec.div(effectiveDistance).toDecimalPlaces(3, Decimal.ROUND_HALF_UP);

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Effective Itinerary Distance',
    expression: isRound ? `${decDist.toString()} ${unit} × 2 (Round Trip)` : `${decDist.toString()} ${unit} (One Way)`,
    result: `${effectiveDistance.toString()} ${unit}`,
    explanation: 'Total odometer miles/kilometers traveled.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Calculate Fuel Volume Needed',
    expression: unit === 'miles'
      ? `${effectiveDistance.toString()} miles ÷ ${input.fuelEfficiencyMpg} MPG`
      : `(${effectiveDistance.toString()} km ÷ 100) × ${input.fuelEfficiencyL100km} L/100km`,
    result: unit === 'miles'
      ? `${fuelNeededGallonsDec.toDecimalPlaces(2).toString()} Gallons`
      : `${fuelNeededLitersDec.toDecimalPlaces(2).toString()} Liters`,
    explanation: 'Fuel consumed based on vehicle thermal efficiency.',
  });

  trace.push({
    stepNumber: 3,
    label: 'Calculate Total Fuel Cost',
    expression: `${primaryVolume.toDecimalPlaces(2).toString()} ${unit === 'miles' ? 'gal' : 'L'} × ${formatCurrency(decPrice, symbol)}/${unit === 'miles' ? 'gal' : 'L'}`,
    result: formatCurrency(totalCostDec, symbol),
    explanation: 'Projected financial expense at the pump.',
  });

  return {
    status: 'success',
    value: {
      totalDistance: effectiveDistance.toNumber(),
      fuelNeededGallons: fuelNeededGallonsDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      fuelNeededLiters: fuelNeededLitersDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalCost: totalCostDec.toNumber(),
      costPerUnit: costPerDistDec.toNumber(),
      distanceUnit: unit,
      formattedTotalCost: formatCurrency(totalCostDec, symbol),
      formattedFuelVolume: unit === 'miles'
        ? `${fuelNeededGallonsDec.toFixed(2)} gal (${fuelNeededLitersDec.toFixed(1)} L)`
        : `${fuelNeededLitersDec.toFixed(2)} L (${fuelNeededGallonsDec.toFixed(1)} gal)`,
      formattedCostPerUnit: `${formatCurrency(costPerDistDec, symbol)} / ${unit === 'miles' ? 'mi' : 'km'}`,
    },
    normalizedInputs: {
      distance: decDist.toNumber(),
      distanceUnit: unit,
      fuelPricePerUnit: decPrice.toNumber(),
      isRoundTrip: isRound,
    },
    appliedDefaults: [],
    formulaId: FUEL_COST_FORMULA_ID,
    formulaVersion: FUEL_COST_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
