import type { Metadata } from "next";
import Link from "next/link";
import { getRecord } from "@/lib/server/records";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Payment", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Shown after Stripe Checkout. "Payment received" only if Stripe (server-side) says the session is paid AND the
 * amount and currency match the record. The record itself is updated by the webhook, never by this page.
 */
export default async function PaySuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false, folio = "";
  const stripe = getStripe();
  if (stripe && session_id?.startsWith("cs_")) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      folio = (s.metadata?.folio as string) ?? "";
      const rec = folio ? await getRecord(folio) : null;
      paid = s.payment_status === "paid" && !!rec && s.amount_total === rec.expectedCents && s.currency === "usd";
    } catch { /* invalid id or store unavailable */ }
  }
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${paid ? "bg-brand text-white" : "bg-white text-navy ring-1 ring-line"}`} aria-hidden>{paid ? "✓" : "…"}</span>
        <h1 className="mt-5 font-display text-3xl font-bold text-navy">{paid ? "Payment received" : "We're checking your payment"}</h1>
        <p className="mt-3 text-slate-600">{paid ? <>Folio <b className="font-mono">{folio}</b>. Stripe sent your receipt by email and our team has been notified.</> : "If you completed the payment, Stripe will email your receipt and our team will confirm it on WhatsApp."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={SITE.whatsapp} className="btn btn-wa">WhatsApp {SITE.whatsappDisplay}</a>
          <Link href="/" className="btn btn-outline">Home</Link>
        </div>
      </div>
    </div>
  );
}
