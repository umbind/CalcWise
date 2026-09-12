---
name: bootstrap-calcwise
description: Bootstraps the CalcWise workspace, toolchains, Astro foundation, design tokens, and core directory structure.
---

# Bootstrap CalcWise Skill

Use this skill when initializing the CalcWise workspace or repairing the foundation.

## Steps
1. Verify Node.js (LTS) and pnpm environments.
2. Initialize Astro with TypeScript strict mode, Tailwind CSS, Zod, and decimal.js.
3. Configure Vitest test harness.
4. Establish `/src/lib/calculations/` for pure mathematical formulas.
5. Create baseline layout and shared components (CalculationPassport, CalculationTrace).
6. Verify development server and production build pass without errors.
