import { Decimal, toDecimal, formatCurrency } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface TipInput {
  billAmount: number | string;
  tipPercentage: number | string;
  numberOfPeople?: number | string;
  roundUpToNearestDollar?: boolean;
  currencySymbol?: string;
}

export interface TipResult {
  tipAmount: number;
  totalBill: number;
  tipPerPerson: number;
  totalPerPerson: number;
  formattedTip: string;
  formattedTotal: string;
  formattedTipPerPerson: string;
  formattedTotalPerPerson: string;
  numberOfPeople: number;
}

export const TIP_FORMULA_ID = 'formula-gratuity-bill-split-v1.0.0';
export const TIP_FORMULA_VERSION = '1.0.0';

export function calculateTip(input: TipInput): CalculationOutcome<TipResult> {
  const bill = toDecimal(input.billAmount);
  const tipPct = toDecimal(input.tipPercentage);
  const people = input.numberOfPeople !== undefined ? toDecimal(input.numberOfPeople) : new Decimal(1);
  const symbol = input.currencySymbol || '$';

  if (!bill || bill.lt(0)) {
    return createErrorOutcome(TIP_FORMULA_ID, TIP_FORMULA_VERSION, 'Bill amount cannot be negative.', { billAmount: input.billAmount });
  }
  if (!tipPct || tipPct.lt(0)) {
    return createErrorOutcome(TIP_FORMULA_ID, TIP_FORMULA_VERSION, 'Tip percentage cannot be negative.', { tipPercentage: input.tipPercentage });
  }
  if (!people || people.lt(1) || !people.isInteger()) {
    return createErrorOutcome(TIP_FORMULA_ID, TIP_FORMULA_VERSION, 'Number of people must be at least 1 integer.', { numberOfPeople: input.numberOfPeople });
  }

  const trace: CalculationStep[] = [];
  const nPeople = people.toNumber();

  // Tip Amount = Bill * (TipPct / 100)
  let tipDec = bill.times(tipPct.div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  let totalDec = bill.plus(tipDec);

  trace.push({
    stepNumber: 1,
    label: 'Calculate Gratuity Amount',
    expression: `${formatCurrency(bill, symbol)} × (${tipPct.toString()}% ÷ 100)`,
    result: formatCurrency(tipDec, symbol),
    explanation: 'Multiply bill by tip percentage.',
  });

  if (input.roundUpToNearestDollar) {
    const roundedTotal = totalDec.ceil();
    const extraTip = roundedTotal.minus(totalDec);
    tipDec = tipDec.plus(extraTip);
    totalDec = roundedTotal;

    trace.push({
      stepNumber: 2,
      label: 'Round Up to Nearest Dollar',
      expression: `Ceiling to ${formatCurrency(roundedTotal, symbol)}`,
      result: formatCurrency(totalDec, symbol),
      explanation: 'Adjust tip so final bill is a round integer.',
    });
  }

  // Per person
  const totalPerPersonDec = totalDec.div(people).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const tipPerPersonDec = tipDec.div(people).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  if (nPeople > 1) {
    trace.push({
      stepNumber: trace.length + 1,
      label: `Split Between ${nPeople} People`,
      expression: `${formatCurrency(totalDec, symbol)} ÷ ${nPeople}`,
      result: `${formatCurrency(totalPerPersonDec, symbol)} per person`,
      explanation: 'Divide total bill evenly.',
    });
  }

  return {
    status: 'success',
    value: {
      tipAmount: tipDec.toNumber(),
      totalBill: totalDec.toNumber(),
      tipPerPerson: tipPerPersonDec.toNumber(),
      totalPerPerson: totalPerPersonDec.toNumber(),
      formattedTip: formatCurrency(tipDec, symbol),
      formattedTotal: formatCurrency(totalDec, symbol),
      formattedTipPerPerson: formatCurrency(tipPerPersonDec, symbol),
      formattedTotalPerPerson: formatCurrency(totalPerPersonDec, symbol),
      numberOfPeople: nPeople,
    },
    normalizedInputs: {
      billAmount: bill.toNumber(),
      tipPercentage: tipPct.toNumber(),
      numberOfPeople: nPeople,
    },
    appliedDefaults: [],
    formulaId: TIP_FORMULA_ID,
    formulaVersion: TIP_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
