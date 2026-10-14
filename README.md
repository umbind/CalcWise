# CalcWise 🧮

[![Live Website](https://img.shields.io/badge/Live_Site-calcwise.webcalcapps.workers.dev-008080?style=for-the-badge&logo=cloudflare&logoColor=white)](https://calcwise.webcalcapps.workers.dev/)
[![Tests Passing](https://img.shields.io/badge/Tests-154%20Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/umbind/calcwise)
[![Astro 5](https://img.shields.io/badge/Astro-5.4-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Fast, trustworthy, and verifiable calculation platform with arbitrary precision mathematics.**

🔗 **Live Production URL:** [https://calcwise.webcalcapps.workers.dev/](https://calcwise.webcalcapps.workers.dev/)  
📁 **GitHub Repository:** [https://github.com/umbind/calcwise](https://github.com/umbind/calcwise)

---

## 🌟 Core Features

- **50 Production-Ready Calculators:** Covering Finance, Health & Fitness, Everyday Essentials, Mathematics, and Construction & Home Improvement.
- **Shareable URL Query Parameters:** Instant pre-filled calculation links (e.g., `?p=500000&r=8.5&t=20`) to share custom estimates with clients or friends.
- **Calculation Passport:** Transparent, inspectable formula documentation, citation authorities (CFPB, Federal Reserve, CDC, WHO), assumptions, and review dates.
- **Show Your Work:** Step-by-step deterministic mathematical execution trace for every output.
- **Zero-JS by Default:** Static-first SSG architecture with lightweight React hydrated islands (`client:visible` / `client:idle`).
- **High-Precision Math:** Powered by `decimal.js` to eliminate binary floating-point drift in currency and unit conversions.
- **AEO & Search Optimized:** Full JSON-LD structured data (`FAQPage`, `BreadcrumbList`), OpenGraph social previews, and `llms.txt` for AI answer engines.

---

## 📂 Calculator Categories

| Category | Highlights |
| :--- | :--- |
| **Finance** | EMI & Loan, Mortgage, Compound Interest, Auto Loan, 401(k), Salary, Refinance, ROI, Credit Card Payoff |
| **Health** | Adult BMI, Daily Calorie, BMR, Body Fat, Ideal Weight, Macro Split, Water Intake, Target Heart Rate |
| **Everyday** | Age Calculator, Tip & Split, Discount & Tax, Fuel Cost, Time Duration, Recipe Scaler, Electricity |
| **Math** | Percentage, Fraction, Permutations & Combinations, Ratio, Standard Deviation, Exponent, Quadratic |
| **Construction** | Concrete, Drywall, Flooring, Gravel, Mulch, Paint, Roofing, Square Footage |

---

## 🛠️ Tech Stack

- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation + Islands Architecture)
- **UI Islands:** React 19 + Tailwind CSS
- **Precision Engine:** `decimal.js`
- **Validation:** Zod
- **Testing:** Vitest (154 golden dataset regression tests)
- **Hosting:** Cloudflare Pages / Workers

---

## 🚀 Development Scripts

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest regression test suite (154 tests)
npm test

# Build production static site (58 pages)
npm run build
```

---

## 📄 License

MIT License. Open for development and extension.
