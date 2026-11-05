import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function adminAuth() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Firebase Admin service account is not configured.");
  const serviceAccount = JSON.parse(raw);
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  return getAuth(app);
}
export async function verifyAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Authentication required.");
  const decoded = await adminAuth().verifyIdToken(token);
  const allowlist = (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!decoded.email || !allowlist.includes(decoded.email.toLowerCase())) throw new Error("Admin access denied.");
  return decoded;
}
