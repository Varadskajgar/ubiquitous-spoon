/// Razorpay mobile checkout must be initialized with the official Razorpay Flutter SDK.
/// Add the currently supported SDK package and configure server-created order IDs.
/// Never put RAZORPAY_KEY_SECRET in this app. The secret belongs only on the server.
class PaymentService {
  Future<void> startCheckout() async {
    throw UnimplementedError('Configure the official Razorpay Flutter SDK and server order API before enabling payments.');
  }
}
