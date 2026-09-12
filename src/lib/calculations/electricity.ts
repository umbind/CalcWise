import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface ElectricityInput {
  wattage: number | string;
  hoursPerDay: number | string;
  costPerKwh: number | string; // in dollars, e.g. 0.16 for 16 cents
  currencySymbol?: string;
}

export interface ElectricityResult {
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  formattedDailyCost: string;
  formattedMonthlyCost: string;
  formattedAnnualCost: string;
  formattedMonthlyKwh: string;
  formattedAnnualKwh: string;
}

export const ELECTRICITY_FORMULA_ID = 'formula-everyday-electricity-appliance-v1.0.0';
export const ELECTRICITY_FORMULA_VERSION = '1.0.0';

export function calculateElectricity(input: ElectricityInput): CalculationOutcome<ElectricityResult> {
  const decW = toDecimal(input.wattage);
  const decH = toDecimal(input.hoursPerDay);
  const decRate = toDecimal(input.costPerKwh);
  const symbol = input.currencySymbol || '$';

  if (!decW || decW.lte(0) || decW.gt(100000)) {
    return createErrorOutcome(ELECTRICITY_FORMULA_ID, ELECTRICITY_FORMULA_VERSION, 'Wattage must be between 1 and 100,000 Watts.', { wattage: input.wattage });
  }
  if (!decH || decH.lte(0) || decH.gt(24)) {
    return createErrorOutcome(ELECTRICITY_FORMULA_ID, ELECTRICITY_FORMULA_VERSION, 'Hours per day must be between 0.1 and 24 hours.', { hoursPerDay: input.hoursPerDay });
  }
  if (!decRate || decRate.lte(0) || decRate.gt(5)) {
    return createErrorOutcome(ELECTRICITY_FORMULA_ID, ELECTRICITY_FORMULA_VERSION, 'Electricity rate must be between $0.01 and $5.00 per kWh.', { costPerKwh: input.costPerKwh });
  }

  // Daily kWh = (Watts * Hours) / 1000
  const dailyKwhDec = decW.times(decH).div(1000);
  const monthlyKwhDec = dailyKwhDec.times(30.4167); // Average days in Gregorian month
  const annualKwhDec = dailyKwhDec.times(365);

  const dailyCostDec = dailyKwhDec.times(decRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const monthlyCostDec = monthlyKwhDec.times(decRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const annualCostDec = annualKwhDec.times(decRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const round2 = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Compute Daily Energy Consumption in Kilowatt-Hours',
    expression: `(${decW.toString()} Watts × ${decH.toString()} Hours) ÷ 1,000 = ${round2(dailyKwhDec)} kWh/day`,
    result: `${round2(dailyKwhDec)} kWh / day`,
    explanation: 'Basic electrical work consumed over a 24-hour cycle.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Project Monthly & Annual Consumption and Cost',
    expression: `${round2(monthlyKwhDec)} kWh/mo × ${formatCurrency(decRate, symbol)}/kWh = ${formatCurrency(monthlyCostDec, symbol)}/mo`,
    result: `${formatCurrency(monthlyCostDec, symbol)} / month`,
    explanation: 'Projected utility billing charges across standard billing periods.',
  });

  return {
    status: 'success',
    value: {
      dailyKwh: round2(dailyKwhDec),
      monthlyKwh: round2(monthlyKwhDec),
      annualKwh: round2(annualKwhDec),
      dailyCost: dailyCostDec.toNumber(),
      monthlyCost: monthlyCostDec.toNumber(),
      annualCost: annualCostDec.toNumber(),
      formattedDailyCost: formatCurrency(dailyCostDec, symbol),
      formattedMonthlyCost: formatCurrency(monthlyCostDec, symbol),
      formattedAnnualCost: formatCurrency(annualCostDec, symbol),
      formattedMonthlyKwh: `${round2(monthlyKwhDec)} kWh`,
      formattedAnnualKwh: `${round2(annualKwhDec)} kWh`,
    },
    normalizedInputs: {
      wattage: decW.toNumber(),
      hoursPerDay: decH.toNumber(),
      costPerKwh: decRate.toNumber(),
    },
    appliedDefaults: [],
    formulaId: ELECTRICITY_FORMULA_ID,
    formulaVersion: ELECTRICITY_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
