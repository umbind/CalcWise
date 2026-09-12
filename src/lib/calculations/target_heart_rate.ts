import { toDecimal } from './decimal';
import type { CalculationOutcome, CalculationStep } from './outcome';
import { createErrorOutcome } from './outcome';

export interface TargetHeartRateInput {
  age: number | string;
  restingHeartRate?: number | string;
}

export interface HeartRateZone {
  zoneNumber: number;
  zoneName: string;
  intensityRange: string;
  minBpm: number;
  maxBpm: number;
  description: string;
}

export interface TargetHeartRateResult {
  maxHeartRateTanaka: number;
  maxHeartRateFox: number;
  methodUsed: 'Karvonen (Heart Rate Reserve)' | 'Fox/Tanaka Percentage';
  zones: HeartRateZone[];
}

export const TARGET_HR_FORMULA_ID = 'formula-health-target-heart-rate-v1.0.0';
export const TARGET_HR_FORMULA_VERSION = '1.0.0';

export function calculateTargetHeartRate(input: TargetHeartRateInput): CalculationOutcome<TargetHeartRateResult> {
  const age = toDecimal(input.age);
  const rhr = input.restingHeartRate !== undefined && input.restingHeartRate !== ''
    ? toDecimal(input.restingHeartRate)
    : undefined;

  if (!age || age.lt(10) || age.gt(100)) {
    return createErrorOutcome(TARGET_HR_FORMULA_ID, TARGET_HR_FORMULA_VERSION, 'Age must be between 10 and 100.', { age: input.age });
  }

  if (rhr && (rhr.lt(30) || rhr.gt(130))) {
    return createErrorOutcome(TARGET_HR_FORMULA_ID, TARGET_HR_FORMULA_VERSION, 'Resting heart rate must be between 30 and 130 bpm.', { restingHeartRate: input.restingHeartRate });
  }

  const ageNum = age.toNumber();
  // Tanaka formula: 208 - 0.7 * age
  const maxTanaka = Math.round(208 - 0.7 * ageNum);
  // Fox formula: 220 - age
  const maxFox = Math.round(220 - ageNum);

  const maxHr = maxTanaka;
  const trace: CalculationStep[] = [];

  trace.push({
    stepNumber: 1,
    label: 'Estimate Maximum Heart Rate (Tanaka & Fox)',
    expression: `Tanaka: 208 - (0.7 × ${ageNum}) = ${maxTanaka} bpm; Fox: 220 - ${ageNum} = ${maxFox} bpm`,
    result: `${maxTanaka} bpm (Tanaka)`,
    explanation: 'Tanaka formula provides superior empirical correlation across diverse age ranges.',
  });

  const rawZones = [
    { num: 1, name: 'Active Recovery', minPct: 0.50, maxPct: 0.60, desc: 'Promotes recovery, warm-up, and general cardiovascular circulation.' },
    { num: 2, name: 'Aerobic / Base Building', minPct: 0.60, maxPct: 0.70, desc: 'Optimal fat oxidation, capillary density, and mitochondrial development.' },
    { num: 3, name: 'Aerobic Endurance / Tempo', minPct: 0.70, maxPct: 0.80, desc: 'Improves aerobic power, blood volume, and sustained race endurance.' },
    { num: 4, name: 'Lactate Threshold', minPct: 0.80, maxPct: 0.90, desc: 'Raises anaerobic threshold, clearing lactate efficiently during intense efforts.' },
    { num: 5, name: 'Neuromuscular / VO2 Max', minPct: 0.90, maxPct: 1.00, desc: 'Peak cardiac output, sprinting speed, and anaerobic power capacity.' },
  ];

  let methodUsed: 'Karvonen (Heart Rate Reserve)' | 'Fox/Tanaka Percentage' = 'Fox/Tanaka Percentage';

  let zones: HeartRateZone[] = [];

  if (rhr && rhr.gt(0)) {
    methodUsed = 'Karvonen (Heart Rate Reserve)';
    const rhrVal = rhr.toNumber();
    const hrr = maxHr - rhrVal;

    zones = rawZones.map((z) => ({
      zoneNumber: z.num,
      zoneName: z.name,
      intensityRange: `${Math.round(z.minPct * 100)}% - ${Math.round(z.maxPct * 100)}%`,
      minBpm: Math.round(rhrVal + hrr * z.minPct),
      maxBpm: Math.round(rhrVal + hrr * z.maxPct),
      description: z.desc,
    }));

    trace.push({
      stepNumber: 2,
      label: 'Apply Karvonen Heart Rate Reserve (HRR) Equation',
      expression: `HRR = ${maxHr} max - ${rhrVal} resting = ${hrr} bpm; Target = Resting + (Intensity × HRR)`,
      result: `Zone 2: ${zones[1].minBpm} - ${zones[1].maxBpm} bpm`,
      explanation: 'Individualized cardiac zones adjusted for resting fitness level.',
    });
  } else {
    zones = rawZones.map((z) => ({
      zoneNumber: z.num,
      zoneName: z.name,
      intensityRange: `${Math.round(z.minPct * 100)}% - ${Math.round(z.maxPct * 100)}%`,
      minBpm: Math.round(maxHr * z.minPct),
      maxBpm: Math.round(maxHr * z.maxPct),
      description: z.desc,
    }));

    trace.push({
      stepNumber: 2,
      label: 'Apply Direct Maximum Heart Rate Percentages',
      expression: `Target = Intensity × ${maxHr} bpm`,
      result: `Zone 2: ${zones[1].minBpm} - ${zones[1].maxBpm} bpm`,
      explanation: 'Standard physiological percentage brackets of predicted maximum heart rate.',
    });
  }

  return {
    status: 'success',
    value: {
      maxHeartRateTanaka: maxTanaka,
      maxHeartRateFox: maxFox,
      methodUsed,
      zones,
    },
    normalizedInputs: {
      age: ageNum,
      restingHeartRate: rhr ? rhr.toNumber() : undefined,
    },
    appliedDefaults: [],
    formulaId: TARGET_HR_FORMULA_ID,
    formulaVersion: TARGET_HR_FORMULA_VERSION,
    trace,
    warnings: [],
    generatedAt: new Date().toISOString(),
  };
}
