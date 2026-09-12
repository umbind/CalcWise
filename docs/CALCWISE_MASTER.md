# CalcWise --- Master AI Development Workflow v3.3 (Worldwide Benchmark and Antigravity-Native Edition)

**Document status:** Canonical product, architecture, quality, operating and autonomous-execution specification  
**Product Name:** CalcWise  
**Research baseline:** 10 September 2026  
**Intended use:** Submit this document as the initial instruction for the CalcWise project. No supplementary product brief is required.

# 0. One-Shot Project Initialization Directive

This document is the complete canonical CalcWise project brief and execution contract for an AI-agent-driven implementation.

The agent MUST treat this document as authorization to plan, scaffold, implement, test, verify, document and prepare the project for deployment within the limits of available credentials and external services.

### 0.1 Default behavior

Do not ask the owner to restate requirements already defined here. Do not stop merely because the repository is empty, a minor implementation detail is unspecified, or several technically sound options exist. Use the decision hierarchy and defaults in this document, record material decisions, and continue.

Ask the owner only when at least one of these hard blockers exists:
1. A secret, account credential, payment authorization, domain/DNS action or third-party approval is required and cannot be completed from the available environment.
2. A legal, regulatory or business-policy choice would materially change the product and cannot safely be inferred.
3. Two mutually exclusive product requirements remain after applying this document's precedence rules.
4. An irreversible destructive action would affect data or infrastructure outside the project workspace.
5. The requested action is technically impossible with the tools or permissions available.

### 0.1.1 Scope of routine autonomy

Running and re-running builds, tests, and linters; installing or updating packages; committing code; triggering local builds; and any other reversible action confined to the project workspace are routine operations and never require owner check-in.

### 0.2 Instruction precedence

1. Security, privacy, legal and user-safety requirements.
2. Calculation correctness and formula governance.
3. Explicit requirements in this master document.
4. Existing production behavior and backwards compatibility.
5. Existing repository conventions and architecture.
6. The default technical decisions in Section 46.
7. Agent preference.

### 0.4 Binding build order, mandatory checkpoint, and pacing

Section 44's build order is binding, not advisory. The agent must not begin work on Sections 58-74 until Step 6 of Section 44 (pilot validation) has passed. After Step 6, the agent must pause and report pilot results before proceeding to Step 8.

---

# 1. Mission

CalcWise is a scalable global knowledge-and-calculation platform.
It MUST NOT be built as a collection of disconnected calculator pages.

The platform architecture is:
Discovery Hub → Topic Hub → Category Hub → Calculator Landing Page → Calculation Engine → Explanation and Knowledge Layer → Related Tools → Optional Conversion or Monetization

Primary product goal:
Become a fast, trustworthy and easy-to-use destination for people who need to calculate, convert, estimate, compare or understand something.

---

# 8. Calculator Engine Architecture

Never build each calculator as a completely independent implementation.
Use a reusable calculator definition:
Intent and Mode -> Calculator Definition -> Variable Dependency Graph -> Input Schema -> Validation and Normalization -> Formula/Data Version Selection -> Deterministic Calculation -> Calculation Trace -> Result Schema -> Formatting -> Explanation -> Scenario/Visualization -> Calculation Passport -> SEO/Knowledge Content -> Analytics and Feedback

Rules:
- UI components must not contain hidden formula logic.
- Formula logic must be independently testable.
- Input validation must be reusable.
- Units must be normalized internally.
- Display formatting must be separated from raw calculation values.

---

# 10. Numerical Precision

Define precision intentionally:
- internal precision
- display precision
- rounding mode
- tolerance for test comparisons
- currency decimal rules (arbitrary-precision decimal library required for financial math)

---

# 24. Accessibility Standard

Target WCAG 2.2 AA:
- keyboard-only use
- focus visibility
- semantic HTML
- form labels and accessible error summaries
- color contrast >= 4.5:1
- screen-reader compatibility and spoken linear summaries of formulas
- data-table alternatives for charts

---

# 25. Performance Standards

- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Per-page initial JavaScript budget: at most 75KB gzipped for a simple calculator page, at most 130KB gzipped for a complex page.
- Lighthouse 95+ target across Performance, Accessibility, Best Practices, and SEO.

---

# 44. Binding Build Order

STEP 1: Audit repository.
STEP 2: Fix routing and avoid invalid hash navigation.
STEP 3: Canonical URL architecture.
STEP 4: Reusable calculator registry and calculation engine.
STEP 5: Implement 5 pilot calculators:
  - Percentage Calculator (Direct Formula)
  - EMI / Loan Payment Calculator (Multi-output + Amortization Schedule)
  - BMI Calculator (Health screening, Risk Tier T2)
  - Concrete Calculator (Dimensional construction + waste factor)
  - Unit Converter (Canonical quantity conversion graph)
STEP 6: Validate whether one architecture supports all pilots (Mandatory Checkpoint).
STEP 7: Refine engine based on checkpoint.
STEP 8: Scale to first 20 calculators.
STEP 9: Category hubs, search, internal linking.
STEP 10: SEO, accessibility, security, and performance hardening.
STEP 11: Expand to ~50 calculators.
STEP 12: Launch, monitor, and prioritize expansion using real data.

---

# 46. Default Web Stack

- Current stable Node.js LTS (v24+)
- pnpm package manager
- Astro with islands architecture (static-first HTML, islands hydrated with client:visible)
- React / Preact for interactive calculator components
- TypeScript with strict type checking
- Tailwind CSS with custom design tokens
- Zod for schema validation
- decimal.js for arbitrary-precision arithmetic
- Vitest for unit, invariant, and Golden Dataset tests
- Cloudflare Pages Free plan as deployment target
