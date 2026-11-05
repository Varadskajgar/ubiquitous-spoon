import { appConfig } from "@/lib/site-config";

export type WorkerProduct = {
  id: string; handle: string; title: string; desc: string; image: string;
  variants: { id: string; title: string; price: { amount: string; currencyCode: string }; ok: boolean }[];
};

async function workerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!appConfig.workerUrl) throw new Error("Cloudflare Worker URL missing. Set NEXT_PUBLIC_WORKER_URL in Website/.env.local.");
  const response = await fetch(`${appConfig.workerUrl.replace(/\/$/, "")}${path}`, {
    ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, cache: "no-store"
  });
  const data = await response.json();
  if (!response.ok || data?.ok === false || data?.error) throw new Error(data?.error || `Worker request failed (${response.status})`);
  return data as T;
}

export async function getProducts(): Promise<WorkerProduct[]> {
  const result = await workerFetch<{ products: WorkerProduct[] }>("/products");
  return result.products || [];
}

export async function getProduct(handle: string): Promise<WorkerProduct | null> {
  return workerFetch<WorkerProduct | null>(`/product?handle=${encodeURIComponent(handle)}`).catch(() => null);
}

export async function placeOrder(payload: { customer: Record<string, string>; cart: { variantId: string; qty: number }[] }) {
  return workerFetch<{ ok: boolean; order: string }>("/order", { method: "POST", body: JSON.stringify(payload) });
}

export async function getAdminOrders(password: string) {
  return workerFetch<any[]>("/admin/orders", { headers: { Authorization: `Bearer ${password}` } });
}
