// POST /api/stripe-webhook — the only place that marks a booking as paid, failed, expired or refunded.
// Verifies the Stripe signature, ignores events already processed, checks amount and currency against the
// stored record, updates the record and notifies CRM / email / internal WhatsApp.
// Env: STRIPE_WEBHOOK_SECRET. Subscribe to: checkout.session.completed, checkout.session.async_payment_succeeded,
// checkout.session.async_payment_failed, checkout.session.expired, charge.refunded.
import crypto from "node:crypto";
import { getStripe } from "@/lib/stripe";
import { kv, storeReady } from "@/lib/server/store";
import { notify } from "@/lib/server/notify";
import { getRecord, updateRecord, type Rec } from "@/lib/server/records";

const TOLERANCE_SECONDS = 300;

function verify(raw: string, header: string | null, secret: string) {
  if (!header) return false;
  const pairs = header.split(",").map((p) => p.trim().split("="));
  const t = pairs.find((p) => p[0] === "t")?.[1];
  const sigs = pairs.filter((p) => p[0] === "v1").map((p) => p[1]);
  if (!t || !sigs.length || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_SECONDS) return false;
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex"));
  return sigs.some((s) => { const b = Buffer.from(s); return b.length === expected.length && crypto.timingSafeEqual(expected, b); });
}

type Obj = { id?: string; metadata?: Record<string, string>; amount_total?: number; amount?: number; amount_refunded?: number; currency?: string; payment_status?: string; payment_intent?: string; refunded?: boolean };

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !storeReady()) return new Response("not configured", { status: 500 }); // Stripe retries
  const raw = await req.text();
  if (!verify(raw, req.headers.get("stripe-signature"), secret)) return new Response("invalid signature", { status: 400 });
  let event: { id: string; type: string; data?: { object?: Obj } };
  try { event = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }
  // Idempotency: each event is processed once
  if (!(await kv.set(`stripe:evt:${event.id}`, "1", { nx: true, ex: 60 * 60 * 24 * 30 }))) return new Response("duplicate", { status: 200 });

  const o = event.data?.object ?? {};
  let folio = o.metadata?.folio;
  // Charges (refunds) do not carry the Checkout metadata: read it from the PaymentIntent
  if (!folio && o.payment_intent) {
    try { folio = (await getStripe()?.paymentIntents.retrieve(o.payment_intent))?.metadata?.folio; } catch { /* reconciliation alert below */ }
  }
  const rec: Rec | null = folio ? await getRecord(folio).catch(() => null) : null;
  const now = new Date().toISOString();
  try {
    if (!rec) {
      // A payment we can't match to a folio: alert the team (reconciliation)
      if (event.type.startsWith("checkout.session") || event.type === "charge.refunded") await notify("integration_error", { folio: folio || "UNKNOWN", status: "unmatched" }, { amountCents: o.amount_total ?? o.amount, detail: `Stripe ${event.type} without a matching folio` });
      return new Response("ok", { status: 200 });
    }
    const amount = o.amount_total ?? o.amount;
    const expected = Number(o.metadata?.expected_cents ?? rec.expectedCents);
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      if (o.payment_status !== "paid") return new Response("pending", { status: 200 });
      const matches = amount === expected && amount === rec.expectedCents && (o.currency ?? "").toLowerCase() === "usd";
      const r2 = await updateRecord(rec.folio, { payment: { sessionId: o.id, status: "paid", amountCents: amount, currency: o.currency, paymentIntent: o.payment_intent, updatedAt: now } }, { type: matches ? "payment_succeeded" : "payment_amount_mismatch", status: "paid", by: "stripe", amountCents: amount });
      await notify(matches ? "payment_succeeded" : "integration_error", r2, { amountCents: amount, detail: matches ? undefined : `Amount/currency mismatch: expected ${expected}` });
    } else if (event.type === "checkout.session.async_payment_failed") {
      const r2 = await updateRecord(rec.folio, { payment: { ...rec.payment, status: "failed", updatedAt: now } }, { type: "payment_failed", status: "payment_failed", by: "stripe", amountCents: amount });
      await notify("payment_failed", r2, { amountCents: amount });
    } else if (event.type === "checkout.session.expired") {
      if (rec.payment?.status !== "paid") await updateRecord(rec.folio, { payment: { ...rec.payment, status: "expired", updatedAt: now } }, { type: "checkout_expired", by: "stripe" });
    } else if (event.type === "charge.refunded") {
      const full = o.refunded === true;
      const r2 = await updateRecord(rec.folio, { payment: { ...rec.payment, status: full ? "refunded" : "partially_refunded", updatedAt: now } }, { type: full ? "refunded" : "partially_refunded", status: full ? "refunded" : rec.status, by: "stripe", amountCents: o.amount_refunded });
      await notify("refunded", r2, { amountCents: o.amount_refunded });
    }
  } catch (e) {
    await kv.del(`stripe:evt:${event.id}`); // let Stripe retry
    console.error("webhook processing failed", (e as Error).message);
    return new Response("error", { status: 500 });
  }
  return new Response("ok", { status: 200 });
}
