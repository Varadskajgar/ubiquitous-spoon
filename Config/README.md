# Realistic Mart configuration

This folder contains the shared, non-secret project configuration and examples.

- `brand.json`: brand name and theme colours.
- `theme.json`: design tokens.
- `worker.env.example`: Cloudflare Worker secret/variable names. Copy values into Cloudflare Dashboard; never commit real values.
- `website.env.example`: environment variable template for `Website/.env.local`.

The deployed Cloudflare Worker is the Shopify API gateway. The website and Flutter app call the Worker URL; neither app stores Shopify Admin credentials or Storefront tokens.

Secret values must stay in Cloudflare Worker Secrets or local/server environment variables. Do not commit `.env.local`, API secrets, access tokens, Firebase service-account JSON, or Razorpay secret.
