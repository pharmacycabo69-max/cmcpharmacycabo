import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Booking received", robots: { index: false, follow: false } };

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  let summary: { service?: string; date?: string; time?: string } = {};
  const stripe = getStripe();
  if (stripe && session_id?.startsWith("cs_")) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      paid = s.payment_status === "paid";
      summary = { service: s.metadata?.service, date: s.metadata?.date, time: s.metadata?.time };
    } catch { /* invalid or foreign session id */ }
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">{paid ? "Payment received. Thank you!" : "Thanks for your booking"}</h1>
      <p className="mt-4 text-slate-600">
        {paid ? `Your CaboNurse visit${summary.date ? ` on ${summary.date} at ${summary.time}` : ""} is booked. ` : "We’re confirming your payment. "}
        We’ll contact you by phone or WhatsApp to confirm the details. A receipt was sent to your email.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <a href={SITE.tel} className="btn btn-primary">Call {SITE.phone}</a>
        <Link href="/" className="btn btn-outline">Back home</Link>
      </div>
    </div>
  );
}
