import { NextResponse } from "next/server";
import { REF_RE, getBookable, priceOf } from "@/lib/booking";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

/**
 * Online payment for a booking our team has already confirmed (link sent on WhatsApp: /pay/[service]?ref=…).
 * The amount always comes from lib/booking (never from the form). Quote-only and partner services cannot be paid
 * here. Health privacy (V4 §11): Stripe metadata carries only service, reference and time — no name, phone,
 * location or medical details; Stripe collects the payer's email itself.
 */
const val = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const f = await req.formData();
  const svc = getBookable(val(f, "service", 40));
  const option = val(f, "option", 60);
  const ref = val(f, "ref", 24).toUpperCase();
  const date = val(f, "date", 10);
  const time = val(f, "time", 5);
  const back = (error: string) => NextResponse.redirect(new URL(`/pay/${svc?.id ?? "unknown"}?error=${error}&ref=${encodeURIComponent(ref)}`, req.url), 303);

  const price = svc ? priceOf(svc, option) : null;
  if (!svc || svc.pay !== "online_after_confirmation" || !price || !REF_RE.test(ref)) return back("invalid");
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return back("invalid");
  if (time && !/^(ASAP|\d{2}:\d{2})$/.test(time)) return back("invalid");

  const stripe = getStripe();
  if (!stripe) return back("config");

  const opt = svc.options?.find((o) => o.id === option);
  const name = `${svc.name}${opt ? ` — ${opt.name}` : ""}`;
  const amount = Math.round(price * svc.payNow * 100);
  const deposit = svc.payNow < 1;
  const metadata = {
    booking_ref: ref, option: opt?.id ?? svc.id, service_name: name, service_total_usd: String(price),
    booking_date: date, booking_time: time,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: ref,
      phone_number_collection: { enabled: true },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd", unit_amount: amount,
          product_data: { name: `${deposit ? `${Math.round(svc.payNow * 100)}% deposit — ` : ""}${name}`, description: `Booking ${ref}. ${deposit ? `Total $${price} USD; the balance is paid after the service.` : `$${price} USD, taxes included.`}` },
        },
      }],
      payment_intent_data: { description: `${name} — ${ref}`, metadata },
      metadata,
      success_url: `${SITE.url}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/pay/${svc.id}?ref=${encodeURIComponent(ref)}${option ? `&option=${encodeURIComponent(option)}` : ""}`,
    }, { idempotencyKey: `checkout-${ref}-${svc.id}-${option || "base"}-${amount}` });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("Stripe checkout failed", (e as Error).message);
    return back("stripe");
  }
}
