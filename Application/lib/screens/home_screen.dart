import 'package:flutter/material.dart';
import '../services/shopify_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<dynamic>> _products;
  @override
  void initState() { super.initState(); _products = ShopifyService().products(); }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('REALISTIC MART', style: TextStyle(fontWeight: FontWeight.w900)), actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.shopping_bag_outlined))]),
    body: ListView(padding: const EdgeInsets.all(18), children: [
      const SizedBox(height: 20),
      const Text('Find your next\nfavourite.', style: TextStyle(fontSize: 42, fontWeight: FontWeight.w900, height: 1.05)),
      const SizedBox(height: 24),
      Container(height: 170, decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(18)), child: const Center(child: Text('REALISTIC MART', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)))),
      const SizedBox(height: 28), const Text('Trending now', style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold)), const SizedBox(height: 12),
      FutureBuilder<List<dynamic>>(future: _products, builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
        if (snapshot.hasError) return Text('Products: ${snapshot.error}');
        final items = snapshot.data ?? [];
        return GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: .72, crossAxisSpacing: 12, mainAxisSpacing: 12), itemCount: items.length, itemBuilder: (context, i) {
          final p = items[i] as Map<String, dynamic>;
          final variants = (p['variants'] as List<dynamic>? ?? []);
          final firstVariant = variants.isNotEmpty ? variants.first as Map<String, dynamic> : <String, dynamic>{};
          final price = firstVariant['price'] as Map<String, dynamic>? ?? {};
          final image = (p['image'] ?? '').toString();
          return Card(clipBehavior: Clip.antiAlias, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(child: Container(color: const Color(0xFFF5F5F5), width: double.infinity, child: image.isNotEmpty ? Image.network(image, fit: BoxFit.contain) : const Icon(Icons.shopping_bag_outlined, size: 40))),
            Padding(padding: const EdgeInsets.all(10), child: Text(p['title'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis)),
            Padding(padding: const EdgeInsets.fromLTRB(10, 0, 10, 10), child: Text('${price['currencyCode'] ?? 'INR'} ${price['amount'] ?? ''}')),
          ]));
        });
      }),
    ]),
  );
}
