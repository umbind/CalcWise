# Testing, Security & Release Standards (40-testing-security-release.md)

1. Testing Discipline:
   - Vitest for unit, invariant, and Golden Dataset tests.
   - Every production defect must receive a permanent regression test.
2. Security & Threat Model:
   - Never use `eval()` or dynamic string evaluation for math expressions.
   - All inputs must be strictly bounded and validated via Zod schemas.
   - Never expose API keys or secrets in client bundles.
3. Release Gates:
   - All unit and golden tests pass.
   - Zero TypeScript or lint errors.
   - Production static build succeeds within the JS budget.
   - Lighthouse score targets: 95+ across Performance, Accessibility, Best Practices, and SEO.
