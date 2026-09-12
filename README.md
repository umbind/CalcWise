# CalcWise

> Fast, trustworthy, and verifiable calculation platform.

CalcWise is built using Astro (Islands Architecture), TypeScript, Tailwind CSS, Zod, decimal.js, and Vitest, designed for deployment on Cloudflare Pages.

## Core Pillars
- **Calculation Passport:** Inspectable formula version, authority, assumptions, and review dates.
- **Show Your Work:** Step-by-step mathematical trace for every result.
- **Zero-JS by Default:** Static-first HTML with lightweight hydrated islands (JavaScript budget <= 75KB gzipped).
- **Golden Dataset:** 100% regression and boundary tested.

## Development Scripts
- `pnpm dev`: Start local development server.
- `pnpm build`: Build production static site.
- `pnpm test`: Run Vitest formula and Golden Dataset suite.
- `pnpm check`: Verify TypeScript and Astro types.
