# Realistic Mart — setup

## Architecture
- `Website/`: Next.js website.
- `Application/`: Flutter app (web preview supported).
- `Config/`: shared theme/brand settings and safe environment templates.
- `Worker/worker.js`: Cloudflare Worker that talks to Shopify Admin GraphQL.
- Shopify Admin credentials live only in Cloudflare Worker Secrets. Website and Flutter call the Worker URL.

## 1. Deploy the Cloudflare Worker
1. Open Cloudflare Dashboard → Workers & Pages → `mute-morning-6227`.
2. Open Edit Code and replace the Worker code with `Worker/worker.js` from this project, then Deploy.
3. Settings → Variables and Secrets: add `SHOP_DOMAIN`, `CLIENT_ID`, `CLIENT_SECRET`, `ADMIN_PASSWORD`, and `ALLOWED_ORIGIN`.
4. Set `ALLOWED_ORIGIN` to the deployed website origin. For local development use `http://localhost:3000`. If you need both production and local origins, update the Worker CORS logic to allow an explicit allowlist before deployment.
5. The Shopify app must have the Admin API scopes required for reading products, reading orders, and creating orders. Reinstall/update the app after changing scopes if Shopify requests it.
6. Check `https://mute-morning-6227.kajgarvarad.workers.dev/` and `/products` in a browser.

The Worker obtains a short-lived Admin API access token from the Shopify app client credentials. No Storefront API token is used by the app in this architecture. The Shopify app must support the client-credentials token exchange for the store and app type; if Shopify rejects it, use the supported app authentication flow for that app rather than exposing an Admin token in the browser.

## 2. Website
1. `cd Website && npm install`.
2. Copy `Config/website.env.example` to `Website/.env.local`.
3. Keep `NEXT_PUBLIC_WORKER_URL=https://mute-morning-6227.kajgarvarad.workers.dev`.
4. Add Firebase web app values and Razorpay keys when ready. Keep `RAZORPAY_KEY_SECRET` and `FIREBASE_SERVICE_ACCOUNT_JSON` server-only.
5. `npm run dev` then open the forwarded port 3000 in Codespaces.

## 3. Flutter web preview
1. `cd Application && flutter pub get`.
2. `flutter config --enable-web`.
3. `flutter create --platforms web .` (only if `Application/web` does not exist).
4. `flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080`.
5. Open forwarded port 8080 in Codespaces.

Flutter uses the same Worker URL from `Application/lib/config/app_config.dart`; override with `--dart-define=WORKER_URL=https://...` if required. No Android SDK is needed for browser preview.

## 4. Credentials and security
- Never put Shopify `CLIENT_SECRET`, Admin API token, Razorpay secret, Firebase service-account JSON, or `ADMIN_PASSWORD` in public source code or GitHub.
- Add secrets in Cloudflare or the hosting provider's server environment.
- `NEXT_PUBLIC_*` values are public in the browser; only Firebase web config and Razorpay Key ID belong there, never secrets.
- `ADMIN_PASSWORD` is a basic Worker API gate in this starter. For production, replace it with Firebase ID-token verification and role-based authorization; do not use a shared password for a public admin panel.

## 5. Current functional scope / limitations
- Worker routes: `/`, `/products`, `/product?handle=...`, `/order`, `/admin/orders`, `/admin/products`.
- Website shop/product pages and Flutter home screen read products through the Worker.
- Worker `/order` creates a Shopify order with pending financial status; it is not a complete Razorpay payment checkout. Do not treat payment as verified based only on order creation.
- Cart persistence, customer order history, full admin CRUD, Firebase login/FCM wiring in Flutter, and end-to-end Razorpay checkout still need implementation and credential/provider setup.
- API version is set to `2026-10` in the supplied Worker; confirm Shopify exposes this version for the app before production deployment.
