# Feature status

| Feature | Status |
|---|---|
| Shared black/white brand theme | Starter included |
| Next.js website shell and pages | Starter included |
| Flutter app shell and home screen | Starter included |
| Flutter web preview | Supported after web platform generation |
| Cloudflare Worker Shopify gateway | Worker source included; user must deploy and set secrets |
| Product listing through Worker | Implemented in website and Flutter home screen |
| Product details through Worker | Worker route and website page implemented |
| Shopify order creation | Worker endpoint implemented; frontend checkout flow remains to be connected |
| Admin orders/products read endpoints | Worker endpoints implemented; secure dashboard integration remains incomplete |
| Firebase web authentication | Starter config/UI only; Firebase credentials and full flows required |
| FCM web/mobile notifications | Not fully wired; platform setup and token registration required |
| Razorpay | Server API starter only; end-to-end checkout/order reconciliation not complete |
| Full cart persistence and customer order history | Not complete |
| Full admin CRUD for products, inventory, customers, discounts | Not complete |

Do not use as a production-ready store until payment verification, auth authorization, webhook/idempotency, and checkout/order flows are completed and tested.
