import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class ShopifyService {
  Future<List<dynamic>> products({int first = 20}) async {
    if (AppConfig.storeDomain.startsWith('your-') || AppConfig.storefrontToken.startsWith('YOUR_')) {
      throw Exception('Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN using --dart-define.');
    }
    const query = r'''query Products($first:Int!){products(first:$first){nodes{id handle title description featuredImage{url} priceRange{minVariantPrice{amount currencyCode}}}}}''';
    final uri = Uri.https(AppConfig.storeDomain, '/api/${AppConfig.apiVersion}/graphql.json');
    final response = await http.post(uri, headers: {'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':AppConfig.storefrontToken}, body: jsonEncode({'query':query,'variables':{'first':first}}));
    if(response.statusCode < 200 || response.statusCode >= 300) throw Exception('Shopify HTTP ${response.statusCode}');
    final data = jsonDecode(response.body);
    if(data['errors'] != null) throw Exception(data['errors'].toString());
    return data['data']['products']['nodes'] as List<dynamic>;
  }
}
