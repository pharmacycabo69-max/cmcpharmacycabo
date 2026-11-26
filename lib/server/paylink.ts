import crypto from "node:crypto";

/**
 * Signed, expiring payment links (pattern from PharmacyDoctors V5.1, ported to TypeScript).
 * Only the concierge creates them, after confirming availability and the amount stored on the record.
 * The token carries the folio, the amount in cents and an expiry; the checkout re-checks both against
 * the stored record, so a customer cannot change the service or the price.
 * Env: PAY_LINK_SECRET (≥32 chars). Without it no link can be created or used.
 */
export type PayToken = { v: 1; f: string; a: number; c: "usd"; exp: number; n: string; l: "en" | "es" };
const secret = () => process.env.PAY_LINK_SECRET || "";
export const payLinksReady = () => secret().length >= 32;
const sig = (body: string) => crypto.createHmac("sha256", secret()).update(body).digest("base64url");

export function makePayToken(folio: string, amountCents: number, hours = 24, lang: "en" | "es" = "en") {
  if (!payLinksReady()) return null;
  const p: PayToken = { v: 1, f: folio, a: Math.round(amountCents), c: "usd", exp: Math.floor(Date.now() / 1000) + Math.max(1, Math.min(72, hours)) * 3600, n: crypto.randomBytes(6).toString("base64url"), l: lang };
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  return { token: `${body}.${sig(body)}`, payload: p };
}

export function verifyPayToken(token: string): { ok: true; p: PayToken } | { ok: false; error: "not_configured" | "bad_token" | "expired"; folio?: string } {
  if (!payLinksReady()) return { ok: false, error: "not_configured" };
  if (typeof token !== "string" || token.length > 600 || !/^[\w-]+\.[\w-]+$/.test(token)) return { ok: false, error: "bad_token" };
  const [body, s] = token.split(".");
  const expect = sig(body);
  if (s.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expect))) return { ok: false, error: "bad_token" };
  let p: PayToken;
  try { p = JSON.parse(Buffer.from(body, "base64url").toString()); } catch { return { ok: false, error: "bad_token" }; }
  if (p.v !== 1 || p.c !== "usd" || !Number.isInteger(p.a) || p.a <= 0) return { ok: false, error: "bad_token" };
  if (Date.now() / 1000 > p.exp) return { ok: false, error: "expired", folio: p.f };
  return { ok: true, p };
}

/** Stable id of a token, used as the Stripe idempotency key (same link → same Checkout session). */
export const tokenId = (token: string) => crypto.createHash("sha256").update(token).digest("hex").slice(0, 32);

/**
 * Stripe Mexico lists telemedicine/telehealth, online pharmacies and prescription products as restricted (prior
 * approval required; stripe.com/mx/legal/restricted-businesses, checked 26 Nov 2026). These services stay blocked
 * until the owner has Stripe's written approval and lists them in STRIPE_APPROVED_RESTRICTED (comma-separated ids).
 */
const RESTRICTED = new Set(["video"]);
export const serviceAllowedOnline = (serviceId?: string) => !!serviceId && (!RESTRICTED.has(serviceId) || (process.env.STRIPE_APPROVED_RESTRICTED || "").split(",").map((x) => x.trim()).includes(serviceId));

/** Online payment is off until the owner approves the cancellation policy and Stripe confirms the activity. */
export const paymentsEnabled = () => process.env.PAYMENTS_ENABLED === "true" && /^sk_(test|live)_/.test(process.env.STRIPE_SECRET_KEY || "") && payLinksReady();
