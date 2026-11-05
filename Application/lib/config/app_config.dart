class AppConfig {
  // Override at build/run time with --dart-define=WORKER_URL=https://...
  static const workerUrl = String.fromEnvironment(
    'WORKER_URL',
    defaultValue: 'https://mute-morning-6227.kajgarvarad.workers.dev',
  );
  static const razorpayKeyId = String.fromEnvironment('RAZORPAY_KEY_ID');
}
