---
name: add-calculator
description: Guides adding a new calculator archetype to CalcWise adhering to definition schemas, Golden Datasets, and WCAG AA standards.
---

# Add Calculator Skill

## Process
1. Define metadata, inputs, and outputs in `/src/features/calculators/` conforming to the universal calculator schema.
2. Implement isolated formula in `/src/lib/calculations/` with decimal precision where applicable.
3. Write unit tests in `/tests/unit/` covering normal, min, max, zero, decimal, and invalid cases.
4. Establish authoritative reference data in `/tests/golden/`.
5. Build the UI island and link the CalculationPassport and CalculationTrace components.
6. Run `pnpm test` and verify bundle size limits.
