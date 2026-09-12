# Calculation & Data Standards (10-calculation-and-data.md)

1. Formula Purity: All calculation formulas are pure TypeScript functions returning a typed `CalculationOutcome<T>`.
2. Decimal Precision: Currency, interest, and exact financial calculations MUST use `decimal.js` rather than native floating-point math.
3. Test Coverage: Every formula must be accompanied by unit tests covering:
   - Valid standard inputs
   - Min / max boundary values
   - Zero and decimal boundaries
   - Invalid or negative inputs (gracefully returning error outcomes)
   - Golden Dataset reference values
4. Calculation Passport: Every calculator must expose a Calculation Passport specifying formula ID, version, methodology, source authority, and review date.
5. Calculation Trace: Every calculation must produce a human-readable, step-by-step trace showing normalized inputs, formulas used, and intermediate values.
6. Risk Tiers:
   - T0: General math & unit conversions
   - T1: Everyday decision support (construction, tip)
   - T2: High-impact (BMI, loans, financial planning) requiring explicit disclaimers and authoritative references
   - T3: Regulated/safety-critical (unpublished without certified human review)
