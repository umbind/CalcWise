import { z } from 'zod';

export const RiskTierSchema = z.enum(['T0', 'T1', 'T2', 'T3']);
export type RiskTier = z.infer<typeof RiskTierSchema>;

export const ArchetypeSchema = z.enum([
  'direct',
  'decision',
  'converter',
  'date-time',
  'schedule',
  'scenario',
  'statistics',
  'interactive',
  'data-backed',
  'professional',
]);
export type Archetype = z.infer<typeof ArchetypeSchema>;

export const CalculatorInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'integer', 'decimal', 'money', 'percent', 'unit', 'select', 'date']),
  required: z.boolean().default(true),
  default: z.union([z.number(), z.string(), z.boolean()]).nullable().default(null),
  min: z.number().optional(),
  max: z.number().optional(),
  units: z.array(z.string()).optional(),
  help: z.string().optional(),
});
export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;

export const CalculatorOutputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'money', 'percent', 'unit', 'series', 'text']),
  primary: z.boolean().default(false),
  unit: z.string().optional(),
});
export type CalculatorOutput = z.infer<typeof CalculatorOutputSchema>;

export const CalculationPassportSchema = z.object({
  calculatorId: z.string(),
  calculatorName: z.string(),
  formulaId: z.string(),
  formulaVersion: z.string(),
  methodology: z.string(),
  riskTier: RiskTierSchema,
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().optional(),
      authority: z.string(),
    })
  ),
  assumptions: z.array(z.string()),
  limitations: z.array(z.string()),
  lastReviewed: z.string(),
  reviewerStatus: z.string(),
  disclaimer: z.string().optional(),
});
export type CalculationPassportData = z.infer<typeof CalculationPassportSchema>;
