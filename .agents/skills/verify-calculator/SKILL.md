---
name: verify-calculator
description: Validates calculation correctness, invariants, Golden Datasets, accessibility, and bundle budgets for a calculator.
---

# Verify Calculator Skill

## Verification Matrix
1. Run Vitest suite: `pnpm test`.
2. Check Golden Dataset assertions against authoritative sources.
3. Validate keyboard navigation and screen-reader accessibility labels.
4. Verify JS bundle size remains <= 75KB gzipped.
5. Confirm CalculationPassport and CalculationTrace render accurate metadata.
