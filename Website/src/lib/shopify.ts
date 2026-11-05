const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2026-10";

export async function shopify<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !token) throw new Error("Shopify is not configured. Add Storefront domain and token to .env.local.");
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });
  const json = await response.json();
  if (!response.ok || json.errors) throw new Error(json.errors?.[0]?.message || "Shopify request failed");
  return json.data as T;
}

export const PRODUCTS_QUERY = `query Products($first: Int!) {
  products(first: $first) { nodes { id handle title description priceRange { minVariantPrice { amount currencyCode } } featuredImage { url altText } } }
}`;
export const PRODUCT_QUERY = `query Product($handle: String!) {
  product(handle: $handle) { id handle title description images(first: 10) { nodes { url altText } } variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } } } }
}`;
export const CREATE_CART = `mutation CartCreate($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) { cart { id checkoutUrl totalQuantity } userErrors { field message } }
}`;
