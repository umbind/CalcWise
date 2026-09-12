# Architecture Decision Records (ADR)

## ADR 001: Web Framework Selection
- **Decision:** Astro with React islands.
- **Context:** CalcWise requires strict per-page JavaScript budgets (<= 75KB gzipped) and 95+ Core Web Vitals.
- **Consequences:** Pages render static HTML with zero client JS by default. Only interactive widgets hydrate client-side.

## ADR 002: Math & Precision Strategy
- **Decision:** `decimal.js` for financial and currency formulas; native math with strict epsilon guards for general geometry and direct ratios.
- **Context:** Financial rounding errors must be eliminated.
- **Consequences:** EMI, interest, and loan amortization schedules are provably exact to the cent/penny.

## ADR 003: Calculator Architecture & Decoupling
- **Decision:** Pure TypeScript functions in `/src/lib/calculations/` returning `CalculationOutcome<T>`.
- **Context:** Calculations must be independently testable without rendering DOM components.
- **Consequences:** Test suite runs in milliseconds via Vitest without needing browser emulators.
