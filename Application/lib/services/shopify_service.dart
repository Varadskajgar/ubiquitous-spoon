import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class ShopifyService {
  Future<List<dynamic>> products({int first = 20}) async {
    final uri = Uri.parse('${AppConfig.workerUrl.replaceFirst(RegExp(r'/$'), '')}/products');
    final response = await http.get(uri, headers: {'Accept': 'application/json'});
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Worker HTTP ${response.statusCode}: ${response.body}');
    }
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final products = (data['products'] as List<dynamic>? ?? []);
    return products.take(first).toList();
  }
}
