export type CalculationStatus = 'success' | 'incomplete' | 'invalid' | 'unavailable' | 'stale';

export interface CalculationStep {
  stepNumber: number;
  label: string;
  expression: string;
  result: string | number;
  explanation?: string;
}

export interface CalculationWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface CalculationOutcome<T> {
  status: CalculationStatus;
  value?: T;
  normalizedInputs: Record<string, unknown>;
  appliedDefaults: Array<{ inputId: string; value: unknown; rationale: string }>;
  formulaId: string;
  formulaVersion: string;
  trace: CalculationStep[];
  warnings: CalculationWarning[];
  generatedAt: string;
}

export function createErrorOutcome<T>(
  formulaId: string,
  formulaVersion: string,
  message: string,
  normalizedInputs: Record<string, unknown> = {}
): CalculationOutcome<T> {
  return {
    status: 'invalid',
    normalizedInputs,
    appliedDefaults: [],
    formulaId,
    formulaVersion,
    trace: [],
    warnings: [
      {
        code: 'INVALID_INPUT',
        message,
        severity: 'critical',
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}
