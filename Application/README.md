# Flutter app

Run `flutter pub get`, configure Firebase with FlutterFire CLI, then run:

```bash
flutter run --dart-define=SHOPIFY_STORE_DOMAIN=your-store.myshopify.com --dart-define=SHOPIFY_STOREFRONT_TOKEN=your_token
```

Shopify product listing is implemented. Login/FCM platform initialization and Razorpay native checkout require your Firebase app files and current Razorpay Flutter SDK setup; see `../Documentation/SETUP.md`.
