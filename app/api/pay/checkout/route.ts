import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/server/http";
import { paymentsEnabled, tokenId, verifyPayToken } from "@/lib/server/paylink";
import { getRecord, updateRecord } from "@/lib/server/records";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

/**
 * POST /api/pay/checkout (form: t, accept) — creates the Stripe Checkout session for a confirmed booking.
 * Checks: signed token, expiry, record status, amount = record amount, not already paid (record + Stripe search),
 * terms accepted. Idempotency key = token id (same link → same session). Metadata carries no health or personal data.
 */
export async function POST(req: Request) {
  const f = await req.formData();
  const t = String(f.get("t") ?? "");
  const back = (error: string) => NextResponse.redirect(new URL(`/pay?t=${encodeURIComponent(t)}&error=${error}`, req.url), 303);
  if (!sameOrigin(req)) return back("state");
  const v = verifyPayToken(t);
  if (!v.ok) return back("state");
  if (f.get("accept") !== "1") return back("accept");
  const stripe = getStripe();
  if (!paymentsEnabled() || !stripe) return back("state");
  const rec = await getRecord(v.p.f).catch(() => null);
  if (!rec || rec.kind !== "booking" || rec.expectedCents !== v.p.a || !["confirmed", "payment_link_sent"].includes(rec.status) || rec.payment?.status === "paid") return back("state");
  try {
    const found = await stripe.paymentIntents.search({ query: `metadata['folio']:'${rec.folio}' AND status:'succeeded'`, limit: 1 });
    if (found.data.length) return back("state");
  } catch { /* search unavailable in some accounts: the record check above still applies */ }
  const metadata = { folio: rec.folio, brand: "CMC", expected_cents: String(v.p.a), token_id: tokenId(t) };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: rec.folio,
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: v.p.a, product_data: { name: `CMC Pharmacy service · ${rec.folio}` } } }],
      payment_intent_data: { description: `CMC Pharmacy · ${rec.folio}`, metadata },
      metadata,
      expires_at: Math.max(Math.floor(Date.now() / 1000) + 31 * 60, Math.min(v.p.exp, Math.floor(Date.now() / 1000) + 23 * 3600)), // Stripe: 30 min – 24 h
      success_url: `${SITE.url}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/pay?t=${encodeURIComponent(t)}`,
    }, { idempotencyKey: `cmc-${tokenId(t)}` });
    await updateRecord(rec.folio, { payment: { sessionId: session.id, status: "pending", amountCents: v.p.a, currency: "usd", updatedAt: new Date().toISOString() } }, { type: "checkout_opened", by: "customer", amountCents: v.p.a });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("checkout failed", (e as Error).message);
    return back("stripe");
  }
}
