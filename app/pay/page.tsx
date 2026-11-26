import type { Metadata } from "next";
import { getBookable } from "@/lib/booking";
import { paymentsEnabled, verifyPayToken } from "@/lib/server/paylink";
import { getRecord } from "@/lib/server/records";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Secure payment", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const T = {
  en: { title: "Secure payment", folio: "Folio", service: "Service", when: "Confirmed time", total: "Total (USD, taxes included)", accept: "I confirm the service, time and amount, and I accept the cancellation terms sent by the concierge.", pay: "Pay securely", off: "Online payment is not active yet. Our team will tell you how to pay.", expired: "This payment link has expired. Ask our team for a new one.", invalid: "This payment link is not valid.", paid: "This booking is already paid.", stripe: "Processed by Stripe. We never see your card number.", err: { stripe: "The payment page could not be opened. Try again or message us.", accept: "Please accept the terms to continue.", state: "This booking can't be paid right now. Message our team." } },
  es: { title: "Pago seguro", folio: "Folio", service: "Servicio", when: "Horario confirmado", total: "Total (USD, impuestos incluidos)", accept: "Confirmo el servicio, el horario y el importe, y acepto las condiciones de cancelación que me envió el concierge.", pay: "Pagar de forma segura", off: "El pago en línea aún no está activo. Nuestro equipo te indicará cómo pagar.", expired: "Este enlace de pago venció. Pide uno nuevo a nuestro equipo.", invalid: "Este enlace de pago no es válido.", paid: "Esta reserva ya está pagada.", stripe: "Procesado por Stripe. Nunca vemos el número de tu tarjeta.", err: { stripe: "No se pudo abrir la página de pago. Intenta de nuevo o escríbenos.", accept: "Acepta las condiciones para continuar.", state: "Esta reserva no se puede pagar ahora. Escribe a nuestro equipo." } },
};

/** /pay?t=<signed token> — the only way to pay. The amount comes from the record, checked against the token. */
export default async function Pay({ searchParams }: { searchParams: Promise<{ t?: string; error?: string }> }) {
  const { t = "", error } = await searchParams;
  const v = verifyPayToken(t);
  const rec = v.ok ? await getRecord(v.p.f).catch(() => null) : null;
  const L = T[v.ok ? v.p.l : "en"];
  const box = (msg: string) => (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-navy">{L.title}</h1>
      <p className="mt-3 text-slate-600">{msg}</p>
      <a href={SITE.whatsapp} className="btn btn-wa mt-6">WhatsApp {SITE.whatsappDisplay}</a>
    </div>
  );
  if (!v.ok) return box(v.error === "expired" ? L.expired : L.invalid);
  if (!rec || rec.expectedCents !== v.p.a) return box(L.invalid);
  if (rec.payment?.status === "paid" || rec.status === "paid") return box(L.paid);
  if (!["confirmed", "payment_link_sent"].includes(rec.status)) return box(L.err.state);
  if (!paymentsEnabled()) return box(L.off);
  const svc = rec.service ? getBookable(rec.service.id) : undefined;
  const opt = svc?.options?.find((o) => o.id === rec.service?.option);
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-lg px-4 py-14">
        <h1 className="font-display text-3xl font-bold text-navy">{L.title}</h1>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{L.err[error as keyof typeof L.err] ?? L.err.stripe}</p>}
        <dl className="card mt-6 space-y-3 p-6 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">{L.folio}</dt><dd className="font-mono font-semibold text-navy">{rec.folio}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">{L.service}</dt><dd className="text-right font-semibold text-navy">{svc?.name}{opt ? ` — ${opt.name}` : ""}</dd></div>
          {rec.service && <div className="flex justify-between gap-4"><dt className="text-slate-500">{L.when}</dt><dd className="text-navy">{rec.service.date} {rec.service.time} (Cabo)</dd></div>}
          <div className="flex justify-between gap-4 border-t border-line pt-3 text-base"><dt className="font-semibold text-navy">{L.total}</dt><dd className="font-display text-2xl font-extrabold text-brand">${(v.p.a / 100).toFixed(2)}</dd></div>
        </dl>
        <form method="post" action="/api/pay/checkout" className="mt-6">
          <input type="hidden" name="t" value={t} />
          <label className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" name="accept" value="1" required className="mt-1" />{L.accept}</label>
          <button className="btn btn-primary mt-5 w-full !py-4 text-base">{L.pay}</button>
          <p className="mt-3 text-center text-xs text-slate-500">{L.stripe}</p>
        </form>
      </div>
    </div>
  );
}
