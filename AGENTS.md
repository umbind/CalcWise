# CalcWise Agent Instructions

This repository implements **CalcWise** according to `/docs/CALCWISE_MASTER.md`.

## Canonical Directive
All autonomous agents working in this repository MUST treat `/docs/CALCWISE_MASTER.md` as the canonical product, architecture, design, and execution specification.

## Core Rules
1. Work strictly in phases: PLAN -> IMPLEMENT -> TEST -> REVIEW -> FIX -> RE-TEST -> DOCUMENT.
2. Maintain decoupled, pure calculation logic in `/src/lib/calculations/` without UI or DOM dependencies.
3. Every formula must have tests covering normal, boundary, zero, negative, decimal, and Golden Dataset cases.
4. Keep client-side JavaScript strictly under the 75KB gzipped budget by leveraging Astro's zero-JS static defaults.
5. Adhere to the binding build order in Section 44; do not scale beyond pilots without passing the Step 6 checkpoint.
