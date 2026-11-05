export const appConfig = {
  workerUrl: process.env.NEXT_PUBLIC_WORKER_URL || "https://mute-morning-6227.kajgarvarad.workers.dev",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
};
