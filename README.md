# Realistic Mart

Monorepo starter for the Realistic Mart ecommerce website and Flutter app.

- `Website/` — Next.js + TypeScript.
- `Application/` — Flutter app, including browser preview.
- `Config/` — shared theme and environment templates.
- `Worker/` — Cloudflare Worker Shopify API gateway.
- `Documentation/` — setup steps and current feature limitations.

The website and Flutter app use the same Cloudflare Worker URL for Shopify product data. Shopify app credentials stay in Cloudflare Worker Secrets, not in either client app.

Read `Documentation/SETUP.md` before deployment. Real credentials are intentionally not included in this ZIP.
