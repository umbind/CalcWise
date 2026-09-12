# CalcWise Core Rule (00-calcwise-core.md)

1. Canonical Reference: All product, architectural, and quality decisions defer to `/docs/CALCWISE_MASTER.md`.
2. Operational Discipline: Work in sequence: PLAN -> IMPLEMENT -> TEST -> REVIEW -> FIX -> RE-TEST -> DOCUMENT.
3. No Placeholders: Never create dead buttons, dummy forms, or mock tests claiming PASS.
4. Independent Calculations: Mathematical logic must reside in `/src/lib/calculations/` decoupled from UI components.
5. Binding Order: Follow Section 44 strictly. Complete and validate the 5 pilot calculators before scaling.
6. Blocker Policy: Proceed autonomously on all internal and reversible tasks. Stop only for explicit external blockers (payment, credentials, DNS).
