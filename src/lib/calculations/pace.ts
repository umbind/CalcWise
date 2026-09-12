import { Decimal, toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface PaceInput {
  distance: number | string;
  distanceUnit?: 'miles' | 'km' | 'meters';
  hours?: number | string;
  minutes?: number | string;
  seconds?: number | string;
}

export interface PaceSplit {
  event: string;
  distanceKm: number;
  formattedTime: string;
}

export interface PaceResult {
  totalSeconds: number;
  pacePerMileString: string;
  pacePerKmString: string;
  speedMph: number;
  speedKmh: number;
  formattedTotalTime: string;
  standardSplits: PaceSplit[];
}

export const PACE_FORMULA_ID = 'formula-health-running-pace-v1.0.0';
export const PACE_FORMULA_VERSION = '1.0.0';

function formatSecondsToHMS(totalSec: number): string {
  const rounded = Math.round(totalSec);
  const h = Math.floor(rounded / 3600);
  const m = Math.floor((rounded % 3600) / 60);
  const s = rounded % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function calculatePace(input: PaceInput): CalculationOutcome<PaceResult> {
  const dist = toDecimal(input.distance);
  const unit = input.distanceUnit || 'miles';
  const hrs = input.hours !== undefined && input.hours !== '' ? toDecimal(input.hours) : new Decimal(0);
  const mins = input.minutes !== undefined && input.minutes !== '' ? toDecimal(input.minutes) : new Decimal(0);
  const secs = input.seconds !== undefined && input.seconds !== '' ? toDecimal(input.seconds) : new Decimal(0);

  if (!dist || dist.lte(0) || dist.gt(1000)) {
    return createErrorOutcome(PACE_FORMULA_ID, PACE_FORMULA_VERSION, 'Distance must be between 0 and 1,000.', { distance: input.distance });
  }

  const totalSec = (hrs || new Decimal(0)).times(3600)
    .plus((mins || new Decimal(0)).times(60))
    .plus(secs || new Decimal(0));

  if (totalSec.lte(0)) {
    return createErrorOutcome(PACE_FORMULA_ID, PACE_FORMULA_VERSION, 'Total duration must be greater than zero.', {});
  }

  // Normalize distance to miles and kilometers
  let distMiles = new Decimal(0);
  let distKm = new Decimal(0);

  if (unit === 'miles') {
    distMiles = dist;
    distKm = dist.times(1.609344);
  } else if (unit === 'km') {
    distKm = dist;
    distMiles = dist.div(1.609344);
  } else {
    // meters
    distKm = dist.div(1000);
    distMiles = distKm.div(1.609344);
  }

  const totalSecNum = totalSec.toNumber();
  const secPerMile = totalSecNum / distMiles.toNumber();
  const secPerKm = totalSecNum / distKm.toNumber();

  const hoursDecimal = totalSecNum / 3600;
  const speedMph = new Decimal(distMiles.toNumber() / hoursDecimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
  const speedKmh = new Decimal(distKm.toNumber() / hoursDecimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();

  const paceMileStr = `${formatSecondsToHMS(secPerMile)} / mi`;
  const paceKmStr = `${formatSecondsToHMS(secPerKm)} / km`;
  const timeStr = formatSecondsToHMS(totalSecNum);

  // Standard Race Projections at constant pace
  const standardEvents = [
    { event: '5K', distanceKm: 5.0 },
    { event: '10K', distanceKm: 10.0 },
    { event: 'Half Marathon', distanceKm: 21.0975 },
    { event: 'Marathon', distanceKm: 42.195 },
  ];

  const standardSplits: PaceSplit[] = standardEvents.map((ev) => ({
    event: ev.event,
    distanceKm: ev.distanceKm,
    formattedTime: formatSecondsToHMS(secPerKm * ev.distanceKm),
  }));

  const trace: CalculationStep[] = [];
  trace.push({
    stepNumber: 1,
    label: 'Calculate Time in Seconds and Standard Distance',
    expression: `${dist.toString()} ${unit} (${distKm.toFixed(2)} km) in ${timeStr} (${totalSecNum}s)`,
    result: `${totalSecNum} Seconds`,
    explanation: 'Conversion of hours, minutes, seconds into base SI duration.',
  });

  trace.push({
    stepNumber: 2,
    label: 'Compute Pace Per Mile and Per Kilometer',
    expression: `${totalSecNum}s ÷ ${distMiles.toFixed(2)} miles = ${secPerMile.toFixed(1)}s/mi; ${totalSecNum}s ÷ ${distKm.toFixed(2)} km = ${secPerKm.toFixed(1)}s/km`,
    result: `${paceMileStr} | ${paceKmStr}`,
    explanation: 'Time required to complete one mile or one kilometer at sustained pace.',
  });

  return {
    status: 'success',
    value: {
      totalSeconds: totalSecNum,
      pacePerMileString: paceMileStr,
      pacePerKmString: paceKmStr,
      speedMph,
      speedKmh,
      formattedTotalTime: timeStr,
      standardSplits,
    },
    normalizedInputs: {
      distance: dist.toNumber(),
      distanceUnit: unit,
      totalSeconds: totalSecNum,
    },
    appliedDefaults: [],
    formulaId: PACE_FORMULA_ID,
    formulaVersion: PACE_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
