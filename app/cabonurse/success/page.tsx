import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { NURSE } from "@/lib/cabonurse";

export const metadata: Metadata = { title: "Booking received", robots: { index: false, follow: false } };

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  let m: Record<string, string> = {};
  const stripe = getStripe();
  if (stripe && session_id?.startsWith("cs_")) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      paid = s.payment_status === "paid";
      m = (s.metadata ?? {}) as Record<string, string>;
    } catch { /* invalid id, or the API key can't read sessions */ }
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">{paid ? "Deposit received. Thank you!" : "Thanks for your booking"}</h1>
      <p className="mt-4 text-slate-600">
        {paid && m.booking_date ? `Your request for ${m.service_name} on ${m.booking_date} (${m.booking_time === "ASAP" ? "as soon as possible" : m.booking_time}) is in. ` : "We’re confirming your payment. "}
        Our team will confirm availability and the exact time with you by WhatsApp or phone. A receipt was sent to your email.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <a href={`https://wa.me/${NURSE.whatsapp}`} className="btn btn-primary">WhatsApp {NURSE.phoneDisplay}</a>
        <Link href="/" className="btn btn-outline">Back home</Link>
      </div>
    </div>
  );
}
