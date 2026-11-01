import { NextResponse } from "next/server";
import { getNurseService } from "@/lib/cabonurse";
import { getStripe } from "@/lib/stripe";
import { SITE } from "@/lib/site";

const field = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").trim().slice(0, max);
const back = (req: Request, error: string) => NextResponse.redirect(new URL(`/cabonurse?error=${error}#book`, req.url), 303);

export async function POST(req: Request) {
  const form = await req.formData();
  if (field(form, "website")) return back(req, "invalid"); // honeypot

  const service = getNurseService(field(form, "service"));
  const name = field(form, "name", 100);
  const email = field(form, "email", 150);
  const phone = field(form, "phone", 40);
  const address = field(form, "address", 250);
  const date = field(form, "date", 10);
  const time = field(form, "time", 5);
  const notes = field(form, "notes", 400);

  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(`${date}T00:00:00`).getTime() >= new Date().setHours(0, 0, 0, 0);
  if (!service || !name || !/^\S+@\S+\.\S+$/.test(email) || !phone || !address || !dateOk || !/^\d{2}:\d{2}$/.test(time)) return back(req, "invalid");

  const stripe = getStripe();
  if (!stripe) return back(req, "config");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: service.priceUsd * 100,
          product_data: { name: `CaboNurse — ${service.name}`, description: `${service.duration} · ${date} ${time}` },
        },
      }],
      payment_intent_data: { description: `CaboNurse ${service.name} for ${name} on ${date} ${time}`, receipt_email: email },
      metadata: { service: service.id, name, phone, address, date, time, notes },
      success_url: `${SITE.url}/cabonurse/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/cabonurse#book`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("Stripe checkout failed", e);
    return back(req, "stripe");
  }
}
