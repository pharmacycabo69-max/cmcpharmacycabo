import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODE_LABEL, REF_RE, getBookable, priceOf } from "@/lib/booking";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Secure payment", robots: { index: false, follow: false } };

type SP = { ref?: string; option?: string; date?: string; time?: string; error?: string };
const ERRORS: Record<string, string> = {
  invalid: "This payment link is incomplete. Please use the link our team sent you on WhatsApp.",
  config: "Online payment is not available right now. Our team will help you pay another way on WhatsApp.",
  stripe: "The payment page could not be opened. Please try again in a moment or message us on WhatsApp.",
};

/** Payment page for a booking the team already confirmed. Sent by the team as /pay/<service>?ref=CMC-B-…&date=…&time=… */
export default async function PayPage({ params, searchParams }: { params: Promise<{ service: string }>; searchParams: Promise<SP> }) {
  const svc = getBookable((await params).service);
  if (!svc) notFound();
  const sp = await searchParams;
  const ref = (sp.ref ?? "").toUpperCase();
  const opt = svc.options?.find((o) => o.id === sp.option);
  const price = priceOf(svc, opt?.id);
  const payable = svc.pay === "online_after_confirmation" && !!price;
  const now = price ? price * svc.payNow : 0;
  const validRef = REF_RE.test(ref);
  const wa = `${SITE.whatsapp}?text=${encodeURIComponent(`Hi! I have a question about paying booking ${ref || "(no reference)"}.`)}`;
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-xl px-4 py-14">
        <p className="eyebrow">Secure payment</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy">{svc.name}{opt ? ` — ${opt.name}` : ""}</h1>
        {sp.error && ERRORS[sp.error] && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{ERRORS[sp.error]}</p>}
        <div className="card mt-6 p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Booking reference</dt><dd className="font-mono font-semibold text-navy">{validRef ? ref : "—"}</dd></div>
            {sp.date && <div className="flex justify-between gap-4"><dt className="text-slate-500">Confirmed date</dt><dd className="font-semibold text-navy">{sp.date}{sp.time ? `, ${sp.time}` : ""} (Cabo time)</dd></div>}
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Where</dt><dd className="text-navy">{svc.modes.map((m) => MODE_LABEL[m]).join(" / ")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Price</dt><dd className="font-semibold text-navy">{price ? `$${price} USD, taxes included` : "Quote"}</dd></div>
            {payable && <div className="flex justify-between gap-4 border-t border-line pt-3 text-base"><dt className="font-semibold text-navy">{svc.payNow < 1 ? `Deposit now (${Math.round(svc.payNow * 100)}%)` : "Total now"}</dt><dd className="font-display text-2xl font-extrabold text-brand">${now % 1 ? now.toFixed(2) : now}</dd></div>}
          </dl>
          {payable && validRef ? (
            <form method="post" action="/api/checkout" className="mt-6">
              <input type="hidden" name="service" value={svc.id} />
              {opt && <input type="hidden" name="option" value={opt.id} />}
              <input type="hidden" name="ref" value={ref} />
              {sp.date && <input type="hidden" name="date" value={sp.date} />}
              {sp.time && <input type="hidden" name="time" value={sp.time} />}
              <button className="btn btn-primary w-full !py-4 text-base">Pay securely with card</button>
              <p className="mt-3 text-center text-xs text-slate-500">Processed by Stripe. We never see your card number.</p>
            </form>
          ) : (
            <div className="mt-6 rounded-xl bg-surface p-4 text-sm text-slate-700">
              {payable ? "Pay only with the link our team sends you after confirming your appointment." : "This service is quoted after review; nothing is paid online before you approve the quote."}
              <div className="mt-3 flex flex-wrap gap-2"><Link href={`/book?service=${svc.id}`} className="btn btn-primary !py-2.5">Book this service</Link><a href={wa} target="_blank" rel="noopener" className="btn btn-outline !py-2.5">WhatsApp</a></div>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-slate-500">Pay only after our team has confirmed your appointment on WhatsApp. {payable && svc.payNow < 1 ? "The balance is paid after the service. " : ""}Questions about cancellations or changes: <a href={wa} className="font-semibold text-brand">message us</a> before paying. Not an emergency service: call 911.</p>
      </div>
    </div>
  );
}
