import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Concierge authentication (V5 §12). Two roles from environment secrets:
 *   CONCIERGE_KEY → "staff" (view, confirm, quote, issue payment links, update status)
 *   ADMIN_KEY     → "admin" (staff + cancellations/refund records)
 * Sessions are HMAC-signed cookies (SESSION_SECRET, ≥32 chars), HttpOnly, Secure, 12 h. Every action is
 * recorded in the record's event log with the role and the name the person typed at login.
 * Without these variables the concierge area is closed.
 */
export type Role = "staff" | "admin";
export type Session = { role: Role; name: string; exp: number };
const COOKIE = "cmc_concierge";
const secret = () => process.env.SESSION_SECRET || "";
export const authReady = () => secret().length >= 32 && (process.env.CONCIERGE_KEY || "").length >= 16;

const b64u = (s: string | Buffer) => Buffer.from(s).toString("base64url");
const sign = (body: string) => crypto.createHmac("sha256", secret()).update(body).digest("base64url");
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

export function roleForKey(key: string): Role | null {
  if (!authReady()) return null;
  if (process.env.ADMIN_KEY && (process.env.ADMIN_KEY.length >= 16) && safeEqual(key, process.env.ADMIN_KEY)) return "admin";
  if (safeEqual(key, process.env.CONCIERGE_KEY || "")) return "staff";
  return null;
}

export function sessionToken(role: Role, name: string) {
  const body = b64u(JSON.stringify({ role, name: name.slice(0, 40), exp: Math.floor(Date.now() / 1000) + 12 * 3600 } satisfies Session));
  return `${body}.${sign(body)}`;
}

export async function getSession(): Promise<Session | null> {
  if (!authReady()) return null;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v || !/^[\w-]+\.[\w-]+$/.test(v)) return null;
  const [body, sig] = v.split(".");
  if (!safeEqual(sig, sign(body))) return null;
  try {
    const s = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    return s.exp > Date.now() / 1000 ? s : null;
  } catch { return null; }
}

export const COOKIE_NAME = COOKIE;
export const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", maxAge: 12 * 3600 };
