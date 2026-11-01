// POST /api/stripe-webhook — emails the owner one message when a Checkout payment is confirmed.
// Env: STRIPE_WEBHOOK_SECRET (whsec_...), RESEND_API_KEY, NOTIFY_EMAIL (comma-separated), NOTIFY_FROM (optional), BUSINESS_NAME (optional).
// Subscribe the Stripe endpoint to: checkout.session.completed, checkout.session.async_payment_succeeded.
import crypto from "node:crypto";

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

type Session = { metadata?: Record<string, string>; customer_details?: { name?: string; phone?: string; email?: string }; amount_total?: number; currency?: string; payment_intent?: string; payment_status?: string };

function compose(s: Session) {
  const m = s.metadata ?? {}, cd = s.customer_details ?? {};
  const paid = (s.amount_total ?? 0) / 100;
  const total = m.service_total_usd ? Number(m.service_total_usd) : null;
  const when = [m.booking_date, m.booking_time === "ASAP" ? "as soon as possible" : m.booking_time].filter(Boolean).join(" ");
  const service = m.service_name || "service";
  const lines = [
    `New paid booking: ${service}`, `When: ${when || "not specified"} (Cabo time)`,
    `Customer: ${m.customer_name || cd.name || "-"}`, `Phone: ${m.customer_phone || cd.phone || "-"}`, `Email: ${cd.email || "-"}`,
  ];
  if (m.location) lines.push(`Location: ${m.location}`);
  if (m.notes) lines.push(`Notes: ${m.notes}`);
  lines.push(`Deposit paid: $${paid.toFixed(2)} ${(s.currency || "usd").toUpperCase()}`);
  if (total !== null && !Number.isNaN(total)) lines.push(`Balance due after service: $${(total - paid).toFixed(2)} (total $${total})`);
  if (s.payment_intent) lines.push(`Stripe: https://dashboard.stripe.com/payments/${s.payment_intent}`);
  const biz = process.env.BUSINESS_NAME ? `${process.env.BUSINESS_NAME} — ` : "";
  return { subject: `${biz}Paid booking: ${service} — ${when || "no date"}`, text: lines.join("\n") };
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.error("Webhook not configured: set STRIPE_WEBHOOK_SECRET, RESEND_API_KEY and NOTIFY_EMAIL");
    return new Response("Webhook not configured", { status: 500 });
  }
  const raw = await req.text(); // exact body, required for signature verification
  if (!verify(raw, req.headers.get("stripe-signature"), secret)) return new Response("Invalid signature", { status: 400 });

  let event: { type: string; data?: { object?: Session } };
  try { event = JSON.parse(raw); } catch { return new Response("Bad JSON", { status: 400 }); }
  const session = event.data?.object;
  const confirmed = event.type === "checkout.session.async_payment_succeeded" || (event.type === "checkout.session.completed" && session?.payment_status === "paid");
  if (!confirmed || !session) return new Response("ignored", { status: 200 });

  const msg = compose(session);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Bookings <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL.split(",").map((x) => x.trim()).filter(Boolean),
      subject: msg.subject, text: msg.text,
    }),
  });
  if (!r.ok) { console.error("notify failed", r.status); return new Response("notify failed", { status: 500 }); } // Stripe retries
  return new Response("ok", { status: 200 });
}
