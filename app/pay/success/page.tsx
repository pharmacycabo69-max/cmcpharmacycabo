import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Payment received", robots: { index: false, follow: false } };

/** Shown after Stripe Checkout. The status is read from Stripe, never assumed from the URL. */
export default async function PaySuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  let m: Record<string, string> = {};
  const stripe = getStripe();
  if (stripe && session_id?.startsWith("cs_")) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      paid = s.payment_status === "paid";
      m = (s.metadata ?? {}) as Record<string, string>;
    } catch { /* invalid id */ }
  }
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${paid ? "bg-brand text-white" : "bg-white text-navy ring-1 ring-line"}`} aria-hidden>{paid ? "✓" : "…"}</span>
        <h1 className="mt-5 font-display text-3xl font-bold text-navy">{paid ? "Payment received" : "We're checking your payment"}</h1>
        <p className="mt-3 text-slate-600">
          {paid ? <>Booking <b className="font-mono">{m.booking_ref}</b> · {m.service_name}{m.booking_date ? ` · ${m.booking_date} ${m.booking_time === "ASAP" ? "(as soon as possible)" : m.booking_time}` : ""}. Stripe sent your receipt by email.</> : "If you completed the payment, you'll receive a Stripe receipt by email. Our team confirms it on WhatsApp."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={SITE.whatsapp} className="btn btn-wa">WhatsApp {SITE.whatsappDisplay}</a>
          <Link href="/" className="btn btn-outline">Back home</Link>
        </div>
      </div>
    </div>
  );
}
