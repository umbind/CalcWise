# Content, SEO & Localization Standards (30-content-seo-localization.md)

1. Canonical URL Hierarchy:
   - Every public calculator has a stable, descriptive URL: `/{category}/{calculator-slug}/`.
   - Never use hash-based navigation (`/#emi`) or query parameters for indexable pages.
2. People-First Content:
   - Explanatory content must be original, concise, and directly support understanding or acting on the result.
   - Do not generate thin keyword permutations or duplicate pages.
3. Structured Data:
   - Valid JSON-LD schemas matching visible page content (`WebPage`, `BreadcrumbList`, `WebApplication`).
   - No fake review or rating schemas.
4. Localization Separation:
   - Decouple language, locale, currency, units, and legal jurisdiction into separate packs.
