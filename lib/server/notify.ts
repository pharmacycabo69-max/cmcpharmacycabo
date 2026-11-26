import crypto from "node:crypto";
import { kv } from "@/lib/server/store";
import { BRAND, getRecord, type Rec } from "@/lib/server/records";
import { SITE } from "@/lib/site";

/**
 * Operational notifications (V5 §11): CRM, email and internal WhatsApp.
 * - CRM gets the full record (authorized internal system), signed with HMAC.
 * - Email and WhatsApp get only folio, brand, time, event, status, amount and a link to the concierge record
 *   (login required). No products, symptoms or contact data leave the internal system through them.
 * - Each (event, channel) is delivered once (dedupe key); failures go to the outbox and are retried by
 *   /api/cron/notify. If a channel keeps failing, an "integration_error" event goes to the other channels.
 *
 * Env: CRM_WEBHOOK_URL, CRM_WEBHOOK_SECRET · RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM ·
 *      WHATSAPP_NOTIFY_WEBHOOK (+ WHATSAPP_NOTIFY_SECRET) or WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID + WHATSAPP_INTERNAL_TO
 */
export type EventType =
  | "pharmacy_request" | "booking_request" | "xray_request" | "lab_request" | "quote_pending" | "availability_confirmed"
  | "payment_link_issued" | "payment_succeeded" | "payment_failed" | "cancelled" | "refunded" | "integration_error" | "unattended";
export type Channel = "crm" | "email" | "whatsapp";
export const CHANNELS: Channel[] = ["crm", "email", "whatsapp"];
export type Note = { id: string; type: EventType; folio: string; status: string; amountCents?: number; at: string; detail?: string };

const LABEL: Record<EventType, string> = {
  pharmacy_request: "New pharmacy request", booking_request: "New medical booking", xray_request: "New X-ray request",
  lab_request: "New lab request", quote_pending: "Quote pending", availability_confirmed: "Availability confirmed",
  payment_link_issued: "Payment link issued", payment_succeeded: "Payment succeeded", payment_failed: "Payment failed",
  cancelled: "Cancelled", refunded: "Refunded", integration_error: "Integration error", unattended: "Unattended request",
};

export const channelReady: Record<Channel, () => boolean> = {
  crm: () => !!process.env.CRM_WEBHOOK_URL,
  email: () => !!(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL),
  whatsapp: () => !!(process.env.WHATSAPP_NOTIFY_WEBHOOK || (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_INTERNAL_TO)),
};

const recordLink = (folio: string) => `${SITE.url}/concierge/r/${folio}`;
const money = (c?: number) => (typeof c === "number" ? `$${(c / 100).toFixed(2)} USD` : "");
const cabo = (iso: string) => new Date(iso).toLocaleString("en-US", { timeZone: "America/Mazatlan", dateStyle: "medium", timeStyle: "short" });
/** Minimal text for email and WhatsApp. */
export const shortText = (n: Note) =>
  [`${BRAND} · ${LABEL[n.type]}`, `Folio: ${n.folio}`, `Status: ${n.status}`, n.amountCents !== undefined ? `Amount: ${money(n.amountCents)}` : "", `Time: ${cabo(n.at)} (Cabo)`, n.detail ? `Note: ${n.detail}` : "", `Open: ${recordLink(n.folio)}`].filter(Boolean).join("\n");

const hmac = (secret: string, body: string) => crypto.createHmac("sha256", secret).update(body).digest("hex");
const timeout = (ms: number) => AbortSignal.timeout(ms);

async function sendCrm(n: Note, rec?: Rec) {
  const body = JSON.stringify({ event: n, record: rec ?? null, brand: BRAND, link: recordLink(n.folio) });
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) headers["X-CMC-Signature"] = `sha256=${hmac(process.env.CRM_WEBHOOK_SECRET, body)}`;
  const r = await fetch(process.env.CRM_WEBHOOK_URL!, { method: "POST", headers, body, signal: timeout(8000) });
  if (!r.ok) throw new Error(`crm_${r.status}`);
}
async function sendEmail(n: Note) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": n.id },
    body: JSON.stringify({ from: process.env.NOTIFY_FROM || "CMC Pharmacy <onboarding@resend.dev>", to: process.env.NOTIFY_EMAIL!.split(",").map((x) => x.trim()).filter(Boolean), subject: `${BRAND} · ${LABEL[n.type]} · ${n.folio}`, text: shortText(n) }),
    signal: timeout(8000),
  });
  if (!r.ok) throw new Error(`email_${r.status}`);
}
async function sendWhatsApp(n: Note) {
  const text = shortText(n);
  if (process.env.WHATSAPP_NOTIFY_WEBHOOK) {
    const body = JSON.stringify({ to: "internal", brand: BRAND, folio: n.folio, type: n.type, text });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.WHATSAPP_NOTIFY_SECRET) headers["X-CMC-Signature"] = `sha256=${hmac(process.env.WHATSAPP_NOTIFY_SECRET, body)}`;
    const r = await fetch(process.env.WHATSAPP_NOTIFY_WEBHOOK, { method: "POST", headers, body, signal: timeout(8000) });
    if (!r.ok) throw new Error(`wa_hook_${r.status}`);
    return;
  }
  const r = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: process.env.WHATSAPP_INTERNAL_TO, type: "text", text: { body: text } }),
    signal: timeout(8000),
  });
  if (!r.ok) throw new Error(`wa_cloud_${r.status}`);
}
const SEND: Record<Channel, (n: Note, rec?: Rec) => Promise<void>> = { crm: sendCrm, email: sendEmail, whatsapp: sendWhatsApp };

export type Delivery = { channel: Channel; ok: boolean; skipped?: boolean; error?: string };

async function deliverOne(n: Note, ch: Channel, rec?: Rec): Promise<Delivery> {
  if (!channelReady[ch]()) return { channel: ch, ok: false, skipped: true, error: "not_configured" };
  const done = `ntf:done:${n.id}:${ch}`;
  if (await kv.get(done)) return { channel: ch, ok: true };
  try {
    await SEND[ch](n, rec);
    await kv.set(done, "1", { ex: 60 * 60 * 24 * 30 });
    return { channel: ch, ok: true };
  } catch (e) {
    const error = (e as Error).message.slice(0, 120);
    // Outbox: retried by the cron with backoff (attempt counter in the payload)
    await kv.set(`ntf:job:${n.id}:${ch}`, JSON.stringify({ n, ch, attempts: 1, error }), { ex: 60 * 60 * 24 * 7 });
    await kv.zadd("ntf:outbox", Date.now() + 60_000, `${n.id}:${ch}`);
    console.error("notify failed", ch, n.type, n.folio, error);
    return { channel: ch, ok: false, error };
  }
}

/** Sends one event to every configured channel. Never throws: the record is already saved. */
export async function notify(type: EventType, rec: Pick<Rec, "folio" | "status"> & Partial<Rec>, opts: { amountCents?: number; detail?: string } = {}) {
  const n: Note = { id: `${rec.folio}:${type}:${crypto.randomBytes(4).toString("hex")}`, type, folio: rec.folio, status: rec.status, amountCents: opts.amountCents, at: new Date().toISOString(), detail: opts.detail };
  const results = await Promise.all(CHANNELS.map((ch) => deliverOne(n, ch, rec as Rec).catch((e) => ({ channel: ch, ok: false, error: String(e) }) as Delivery)));
  try {
    await kv.set(`ntf:log:${n.id}`, JSON.stringify({ n, results }), { ex: 60 * 60 * 24 * 90 });
    await kv.zadd(`ntf:byfolio:${rec.folio}`, Date.now(), n.id);
  } catch { /* logging must not break the flow */ }
  // Opportunistic retry of earlier failures (the daily cron is the safety net)
  if (type !== "integration_error") await retryOutbox(5).catch(() => undefined);
  return results;
}

/** Retry pass for the outbox (called by the cron). Exponential backoff, 8 attempts, then an integration error. */
export async function retryOutbox(limit = 25) {
  const due = await kv.zrangeByScore("ntf:outbox", Date.now(), limit);
  const out: { job: string; ok: boolean }[] = [];
  for (const job of due) {
    const raw = await kv.get(`ntf:job:${job}`);
    await kv.zrem("ntf:outbox", job);
    if (!raw) continue;
    const { n, ch, attempts } = JSON.parse(raw) as { n: Note; ch: Channel; attempts: number };
    try {
      if (!channelReady[ch]()) throw new Error("not_configured");
      await SEND[ch](n, ch === "crm" ? (await getRecord(n.folio)) ?? undefined : undefined);
      await kv.set(`ntf:done:${n.id}:${ch}`, "1", { ex: 60 * 60 * 24 * 30 });
      await kv.del(`ntf:job:${job}`);
      out.push({ job, ok: true });
    } catch (e) {
      if (attempts >= 8) {
        await kv.del(`ntf:job:${job}`);
        if (n.type !== "integration_error") await notify("integration_error", { folio: n.folio, status: n.status }, { detail: `${ch} failed 8 times for ${n.type}` });
      } else {
        await kv.set(`ntf:job:${job}`, JSON.stringify({ n, ch, attempts: attempts + 1, error: (e as Error).message }), { ex: 60 * 60 * 24 * 7 });
        await kv.zadd("ntf:outbox", Date.now() + 60_000 * 2 ** attempts, job);
      }
      out.push({ job, ok: false });
    }
  }
  return out;
}
