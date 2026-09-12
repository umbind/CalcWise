# CalcWise — Production Deployment & Operations Runbook

This document details the production deployment, edge caching configuration, custom domain binding, and operational monitoring standards for **CalcWise**.

---

## 1. Architecture Overview

CalcWise is architected as an ultra-fast, zero-overhead static platform:
- **Engine:** Astro 5.x Static Site Generation (SSG).
- **Interactive Islands:** Isolated React micro-islands hydrated only where user interaction is required (`client:visible` or `client:idle`).
- **Client JS Budget:** $\le 75\text{ KB}$ gzipped client runtime across all calculator routes.
- **Edge Deployment Target:** Cloudflare Pages (Free Tier) with global CDN distribution across 300+ edge points of presence.

---

## 2. Cloudflare Pages Deployment (Primary Target)

### Step 1: Git Integration
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Select your repository (`calcwise`).

### Step 2: Build & Output Settings
Configure the build settings:
- **Framework Preset:** `Astro`
- **Build Command:** `pnpm build`
- **Build Output Directory:** `dist`
- **Root Directory:** `/` (default)

Under **Environment Variables**, configure:
| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_VERSION` | `24.19.0` | Ensures exact LTS compatibility |
| `PNPM_VERSION` | `12.4.1` | Matches workspace package manager |

Click **Save and Deploy**. Cloudflare Pages will build all 58 static routes in approximately ~15–25 seconds.

### Step 3: Custom Domain & SSL/TLS
1. In Cloudflare Pages, go to **Custom Domains** → **Set up a custom domain**.
2. Enter your domain (e.g. `calcwise.com` and `www.calcwise.com`).
3. Cloudflare will automatically provision a free universal SSL/TLS certificate with HTTP/2 and HTTP/3 enabled.

---

## 3. Edge Caching & Security Headers (`_headers`)

CalcWise includes a pre-configured `public/_headers` file that Cloudflare Pages automatically mounts onto the edge network:

```http
# Universal Security Headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=(), camera=(), microphone=(), geolocation=()
  Cache-Control: public, max-age=0, must-revalidate

# Immutable Cache for Vite Bundles
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Search Crawl & Sitemaps
/robots.txt
  Cache-Control: public, max-age=86400

/sitemap.xml
  Cache-Control: public, max-age=86400
```

---

## 4. Canonical Routing & Redirects (`_redirects`)

The included `public/_redirects` guarantees canonical URL normalization:
- Non-trailing slash category paths (`/finance`, `/health`, etc.) 301-redirect to their trailing-slash canonical URLs (`/finance/`).
- Common keyword aliases (e.g. `/loan-calculator` → `/finance/emi-calculator/`, `/mortgage` → `/finance/mortgage-calculator/`) resolve smoothly without broken links.

---

## 5. Alternative Hosting Environments

### Vercel
```bash
pnpm build
npx vercel --prod
```
- Framework: Astro
- Output directory: `dist`

### Netlify
```bash
pnpm build
npx netlify deploy --prod --dir=dist
```

### Self-Hosted Nginx / Docker
Sample Nginx block:
```nginx
server {
    listen 80;
    server_name calcwise.com;
    root /var/www/calcwise/dist;
    index index.html;

    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /404.html;
    }

    error_page 404 /404.html;
}
```

---

## 6. Pre-Launch Verification Checklist

Before announcing production launch, confirm each of the following:

- [x] **Test Coverage:** All unit test suites pass (`pnpm test --run` $\to$ 154/154 green).
- [x] **Static Compilation:** Zero TypeScript or Astro build errors (`pnpm build`).
- [x] **404 Handling:** Visiting an invalid path (e.g. `/unknown-path`) serves `404.html` with category navigation.
- [x] **Sitemap:** Google Search Console can fetch `https://calcwise.com/sitemap.xml` with 57 canonical URLs.
- [x] **Robots.txt:** Accessible at `/robots.txt` pointing cleanly to `/sitemap.xml`.
- [x] **Accessibility:** WCAG 2.2 AA audit passes keyboard focus, color contrast ($\ge 4.5:1$), and `aria-live` tests.
- [x] **Print Stylesheet:** Printing any calculator page (`Ctrl + P` or "Print / PDF" button) isolates clean math reports.
- [x] **Community Feedback:** "Report / Feedback" button renders modal and preserves local feedback audit logs.
