---
name: release-candidate
description: Prepares and audits a release candidate against all Section 37 and 42 release gates before deployment.
---

# Release Candidate Skill

## Release Checklist
1. All unit and golden tests pass in CI.
2. Static build succeeds with zero errors.
3. No broken internal links or missing routes.
4. Calculation Passports and disclaimers present for all active calculators.
5. Lighthouse target verification (95+ across metrics).
