import { NextResponse } from "next/server";
import { IV, getDrip } from "@/lib/ivtherapy";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

const clean = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").trim().slice(0, max);
const back = (req: Request, error: string) => NextResponse.redirect(new URL(`/iv-therapy?error=${error}#book`, req.url), 303);

export async function POST(req: Request) {
  const form = await req.formData();
  const service = getDrip(clean(form, "option"));
  const date = clean(form, "date", 10);
  const time = clean(form, "time", 5);
  const name = clean(form, "name", 100);
  const phone = clean(form, "phone", 40);
  const email = clean(form, "email", 150);
  const location = clean(form, "location", 250);
  const notes = clean(form, "notes", 300);

  const today = new Date().setHours(0, 0, 0, 0);
  const when = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`).getTime() : NaN;
  const dateOk = when >= today - 864e5 && when <= today + (IV.maxDays + 1) * 864e5; // ±1 day tolerance for timezones
  if (!service || !name || !phone || !location || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !dateOk || !/^(ASAP|\d{2}:\d{2})$/.test(time)) return back(req, "invalid");

  const stripe = getStripe();
  if (!stripe) return back(req, "config");

  const deposit = Math.round(service.priceUsd * 100 * IV.depositRate); // cents
  // Same metadata keys as the Cabo Walk-In Clinic webhook expects
  const details = {
    option: service.id, service_name: `IV Therapy — ${service.name}`, service_total_usd: String(service.priceUsd),
    booking_date: date, booking_time: time, customer_name: name, customer_phone: phone, location, notes,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      phone_number_collection: { enabled: true },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd", unit_amount: deposit,
          product_data: { name: `Deposit — IV Therapy ${service.name}`, description: `${Math.round(IV.depositRate * 100)}% deposit of $${service.priceUsd} USD. The remaining balance is paid after the service.` },
        },
      }],
      payment_intent_data: { description: `Deposit — IV Therapy ${service.name} (total $${service.priceUsd} USD) — ${date} ${time}`, metadata: details },
      metadata: details,
      success_url: `${SITE.url}/iv-therapy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/iv-therapy#book`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("Stripe checkout failed", e);
    return back(req, "stripe");
  }
}
