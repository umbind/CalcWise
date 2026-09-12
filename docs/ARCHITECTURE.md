# CalcWise Architecture

## Core Architectural Principles
1. **Zero-JS Static Shell (Astro):** All page headers, footers, SEO metadata, breadcrumbs, formula explanations, Calculation Passports, and FAQs are compiled to pure static HTML.
2. **Interactive Islands (React / Preact):** Only the interactive calculation inputs and dynamic results are hydrated client-side using `client:visible`.
3. **Pure Math Domain:** Mathematical logic resides strictly in `/src/lib/calculations/` without UI or DOM dependencies.
4. **Arbitrary Precision:** All financial calculations use `decimal.js` to avoid floating-point inaccuracies.
5. **Universal Outcome Contract:** All calculators return a typed `CalculationOutcome<T>` with status, normalized inputs, calculation trace, and warnings.
