# Realistic Mart — Setup

## Requirements
- Node.js 20.9+ and npm
- Flutter stable SDK
- Shopify store with Storefront API access
- Razorpay account (test mode first)
- Firebase project with Email/Password and Google sign-in enabled (enable only providers you intend to use)

## 1. Website
1. Open a terminal in `Website/`.
2. Run `npm install`.
3. Copy `../Config/website.config.example.env` to `Website/.env.local`.
4. Fill Shopify Storefront domain/token, Firebase web config, Razorpay Key ID and secret, Firebase Admin service account, and admin email allowlist.
5. Run `npm run dev`; open http://localhost:3000.

Shopify Storefront API uses the public Storefront token in the browser/server storefront client. Never put Shopify Admin token in client code. Shopify Admin operations must be server-side and protected with least-privilege scopes.

## 2. Shopify
- Create a Storefront API access token in Shopify.
- Enable required Storefront API access scopes for products, collections, carts and checkout.
- Add products, variants, inventory and collections in Shopify Admin.
- The cart page creates a Shopify cart and the checkout button redirects to Shopify's `checkoutUrl`.
- Shopify checkout/payment-provider availability depends on your Shopify plan, country, account and installed payment integrations. Do not assume Razorpay can be inserted into a custom checkout URL. Configure Razorpay using Shopify's supported payment-provider route if available for your store/region. Otherwise use a supported Shopify payment integration or a compliant custom commerce flow after review.

## 3. Razorpay
- Use test keys first.
- `POST /api/payments/create-order` creates a Razorpay order on the server.
- `POST /api/payments/verify` verifies the HMAC signature on the server.
- For production, add a Razorpay webhook endpoint, verify webhook signatures, store payment/order state durably, and make fulfilment idempotent.
- A successful signature response alone must not be treated as proof of captured/settled payment; confirm payment status via API/webhook before fulfilment.

## 4. Firebase
- Create a Firebase Web app and copy its config into `.env.local`.
- Enable Authentication providers.
- For FCM web push, configure a Web Push certificate and place the generated service worker at `Website/public/firebase-messaging-sw.js`; replace its placeholder config.
- Add authorized domains in Firebase Console.
- Server-side admin verification uses Firebase Admin SDK. The starter checks verified Firebase ID tokens and an `ADMIN_EMAILS` allowlist. For larger teams, use Firebase custom claims and role management instead of email allowlists.

## 5. Flutter app
1. From `Application/`, run `flutter pub get`.
2. Create Firebase app registrations for Android/iOS using FlutterFire CLI (`dart pub global activate flutterfire_cli`, then `flutterfire configure`).
3. Add generated `firebase_options.dart` and platform Firebase files; these are intentionally not included because they are project-specific secrets/config.
4. Run `flutter run`.
5. Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` in `Application/lib/config/app_config.dart`.
6. Configure Razorpay Flutter SDK according to current Razorpay docs and your platform's package requirements before enabling native payment UI. This starter exposes a clear payment service placeholder and does not pretend that an unconfigured SDK is live.

## 6. Admin
- Visit `/admin` after signing in with an email in `ADMIN_EMAILS`.
- The starter dashboard is a protected shell, not a full Shopify Admin clone.
- Product/order/customer management should use Shopify Admin GraphQL API from authenticated server routes with least-privilege scopes, audit logs and input validation. Never expose Admin API tokens to browser or mobile app.
- The Shopify Admin dashboard remains the authoritative place for full store control: https://admin.shopify.com/

## 7. Billing reference
`/billing` contains a simple Basic / Pro pricing-card layout inspired by the pricing-card reference shared in chat. It is a visual template only; no subscription billing is configured.

## Important production checklist
- Configure CSP, rate limiting, input validation and CSRF protections where applicable.
- Add database-backed user profiles/roles if needed.
- Add webhook signature verification and idempotency.
- Test payment success, failure, cancellation, refunds and duplicate callbacks.
- Test Shopify cart/checkout with real product variants.
- Add privacy policy, terms, returns, shipping and contact details.
- Do not deploy with placeholder credentials or test keys.
