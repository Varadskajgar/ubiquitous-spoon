// Realistic Mart Cloudflare Worker.
// Configure these in Cloudflare Worker > Settings > Variables and Secrets:
// SHOP_DOMAIN, CLIENT_ID, CLIENT_SECRET, ADMIN_PASSWORD, ALLOWED_ORIGIN
const API_VERSION = "2026-10";
let cached = { token: "", exp: 0 };

async function getToken(env) {
  if (cached.token && cached.exp > Date.now() + 120000) return cached.token;
  const response = await fetch(`https://${env.SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: env.CLIENT_ID, client_secret: env.CLIENT_SECRET })
  });
  const text = await response.text(); let data = {};
  try { data = JSON.parse(text); } catch (_) {}
  if (!response.ok || !data.access_token) throw new Error(`Shopify authentication failed (${response.status}): ${text.slice(0, 180)}`);
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in || 86000) * 1000 };
  return cached.token;
}

async function gql(env, query, variables = {}) {
  const response = await fetch(`https://${env.SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await getToken(env) },
    body: JSON.stringify({ query, variables })
  });
  const data = await response.json();
  if (!response.ok || data.errors) throw new Error(`Shopify API error: ${JSON.stringify(data.errors || data).slice(0, 250)}`);
  return data.data;
}

function mapProduct(p) {
  return { id: p.id, handle: p.handle, title: p.title, desc: p.description || "", image: p.featuredImage?.url || "",
    variants: (p.variants?.nodes || []).map(v => ({ id: v.id, title: v.title, price: v.price, ok: v.availableForSale })) };
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = { "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin === allowed ? origin : allowed),
      "Vary": "Origin", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
    const out = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url); const path = url.pathname;
    try {
      if (path === "/" && req.method === "GET") return out({ ok: true, service: "Realistic Mart API", routes: ["/products", "/product?handle=...", "/order", "/admin/orders", "/admin/products"] });
      if (path === "/products" && req.method === "GET") {
        const data = await gql(env, `{ shop { currencyCode } products(first:100, query:"status:active") { nodes { id handle title description featuredImage { url } variants(first:30) { nodes { id title price { amount currencyCode } availableForSale } } } } }`);
        return out({ ok: true, currency: data.shop.currencyCode, products: data.products.nodes.map(mapProduct) });
      }
      if (path === "/product" && req.method === "GET") {
        const handle = url.searchParams.get("handle");
        if (!handle) return out({ ok: false, error: "Product handle is required" }, 400);
        const data = await gql(env, `query ProductByHandle($search:String!){ products(first:1, query:$search){ nodes { id handle title description featuredImage{url} variants(first:30){nodes{id title price{amount currencyCode} availableForSale}} } } }`, { search: `handle:${handle}` });
        const product = data.products.nodes[0];
        return product ? out({ ok: true, ...mapProduct(product) }) : out({ ok: false, error: "Product not found" }, 404);
      }
      if (path === "/order" && req.method === "POST") {
        const body = await req.json(); if (body.website) return out({ ok: true });
        const customer = body.customer || {}; const required = ["name", "email", "phone", "address", "city", "zip", "country"];
        for (const key of required) if (!String(customer[key] || "").trim()) return out({ ok: false, error: `Missing customer field: ${key}` }, 400);
        const items = (body.cart || []).filter(c => /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(c.variantId)).map(c => ({ variantId: c.variantId, quantity: Math.max(1, Math.min(50, parseInt(c.qty, 10) || 1)) }));
        if (!items.length) return out({ ok: false, error: "Cart is empty or invalid" }, 400);
        const names = customer.name.trim().split(/\s+/); const firstName = names.shift();
        const data = await gql(env, `mutation($o:OrderCreateOrderInput!){orderCreate(order:$o){order{name} userErrors{message}}}`, { o: {
          email: customer.email, phone: customer.phone, lineItems: items, financialStatus: "PENDING", tags: ["website"], note: "Placed from Realistic Mart website",
          shippingAddress: { firstName, lastName: names.join(" ") || "-", address1: customer.address, city: customer.city, zip: customer.zip, countryCode: String(customer.country).slice(0,2).toUpperCase(), phone: customer.phone }
        }});
        const result = data.orderCreate; if (result.userErrors?.length) return out({ ok: false, error: result.userErrors[0].message }, 400);
        return out({ ok: true, order: result.order.name });
      }
      if (path.startsWith("/admin/")) {
        if (!env.ADMIN_PASSWORD || req.headers.get("Authorization") !== `Bearer ${env.ADMIN_PASSWORD}`) return out({ ok: false, error: "Unauthorized" }, 401);
        if (path === "/admin/orders" && req.method === "GET") {
          const data = await gql(env, `{ orders(first:50, sortKey:CREATED_AT, reverse:true){nodes{name createdAt email displayFinancialStatus displayFulfillmentStatus totalPriceSet{shopMoney{amount currencyCode}} shippingAddress{name address1 city zip phone} lineItems(first:10){nodes{title quantity}}}} }`);
          return out(data.orders.nodes);
        }
        if (path === "/admin/products" && req.method === "GET") {
          const data = await gql(env, `{ products(first:100){nodes{id title handle status totalInventory priceRangeV2{minVariantPrice{amount currencyCode}}}} }`);
          return out(data.products.nodes);
        }
      }
      return out({ ok: false, error: "Not found" }, 404);
    } catch (error) { return out({ ok: false, error: String(error?.message || error) }, 500); }
  }
};
