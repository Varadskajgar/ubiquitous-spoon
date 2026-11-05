# Configuration

Copy `website.config.example.env` to `Website/.env.local` and fill in real values.
Never commit `.env.local`, Razorpay secret, Shopify Admin token, or Firebase service-account JSON.
`theme.json` is the design source of truth. The website currently consumes CSS variables derived from the same values; keep `Application/lib/config/app_theme.dart` aligned when changing colours.
