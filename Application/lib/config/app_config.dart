class AppConfig {
  static const storeDomain = String.fromEnvironment('SHOPIFY_STORE_DOMAIN', defaultValue: 'your-store.myshopify.com');
  static const storefrontToken = String.fromEnvironment('SHOPIFY_STOREFRONT_TOKEN', defaultValue: 'YOUR_STOREFRONT_TOKEN');
  static const apiVersion = '2026-10';
}
