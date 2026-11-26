import type { Metadata } from "next";
import Link from "next/link";
import { getBookable } from "@/lib/booking";
import { safeEqual } from "@/lib/server/auth";
import { getRecord, publicView, type Status } from "@/lib/server/records";
import { storeReady } from "@/lib/server/store";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Track your request", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STEPS: { s: Status[]; en: string; es: string }[] = [
  { s: ["received"], en: "Received", es: "Recibida" },
  { s: ["in_review", "quote_sent"], en: "Being reviewed / quote sent", es: "En revisión / cotización enviada" },
  { s: ["confirmed", "payment_link_sent"], en: "Confirmed", es: "Confirmada" },
  { s: ["paid"], en: "Paid", es: "Pagada" },
  { s: ["completed"], en: "Completed", es: "Completada" },
];
const ORDER: Status[] = ["received", "in_review", "quote_sent", "confirmed", "payment_link_sent", "paid", "completed"];

/** Customer tracking: requires the folio AND its private key (from the confirmation). Shows no contact data. */
export default async function Track({ searchParams }: { searchParams: Promise<{ f?: string; k?: string; lang?: string }> }) {
  const { f = "", k = "", lang } = await searchParams;
  const es = lang === "es";
  const rec = storeReady() && f && k ? await getRecord(f.toUpperCase()).catch(() => null) : null;
  const ok = rec && safeEqual(k, rec.trackKey);
  if (!rec || !ok) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-navy">{es ? "No encontramos esa solicitud" : "We couldn't find that request"}</h1>
        <p className="mt-3 text-slate-600">{es ? "Usa el enlace de seguimiento de tu confirmación o escríbenos con tu folio." : "Use the tracking link from your confirmation, or message us with your folio."}</p>
        <a href={SITE.whatsapp} className="btn btn-wa mt-6">WhatsApp {SITE.whatsappDisplay}</a>
      </div>
    );
  }
  const v = publicView(rec);
  const cancelled = v.status === "cancelled" || v.status === "refunded" || v.status === "payment_failed";
  const at = ORDER.indexOf(v.status);
  const svc = v.service ? getBookable(v.service.id) : undefined;
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="eyebrow">{es ? "Seguimiento" : "Tracking"}</p>
        <h1 className="mt-1 font-mono text-3xl font-bold text-navy">{v.folio}</h1>
        <p className="mt-2 text-slate-600">{v.kind === "pharmacy" ? (es ? "Solicitud de farmacia" : "Pharmacy request") : svc?.name ?? "Booking"}{v.service ? ` · ${v.service.date} ${v.service.time}` : ""}</p>
        {cancelled ? (
          <p className="card mt-6 p-5 font-semibold text-navy">{es ? "Estado" : "Status"}: {v.status.replace("_", " ")}</p>
        ) : (
          <ol className="card mt-6 p-6">
            {STEPS.map((st, i) => {
              const done = st.s.some((s) => ORDER.indexOf(s) <= at && at >= 0) && ORDER.indexOf(st.s[0]) <= at;
              return (
                <li key={st.en} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < STEPS.length - 1 && <span aria-hidden className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px bg-line" />}
                  <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-brand text-white" : "border border-line bg-white text-navy/40"}`}>{done ? "✓" : i + 1}</span>
                  <span className={`font-semibold ${done ? "text-navy" : "text-navy/50"}`}>{es ? st.es : st.en}<span className="sr-only">{done ? " (done)" : " (pending)"}</span></span>
                </li>
              );
            })}
          </ol>
        )}
        {v.items && v.items.length > 0 && (
          <ul className="card mt-4 divide-y divide-line p-0 text-sm">{v.items.map((i) => <li key={i.name} className="px-5 py-3">{i.qty} × {i.name}</li>)}</ul>
        )}
        <p className="mt-6 text-sm text-slate-600">{es ? "Nuestro equipo te contacta por WhatsApp o teléfono. Nada se cobra sin tu confirmación." : "Our team contacts you by WhatsApp or phone. Nothing is charged without your confirmation."}</p>
        <div className="mt-4 flex flex-wrap gap-3"><a href={`${SITE.whatsapp}?text=${encodeURIComponent(`${es ? "Hola, mi folio es" : "Hi, my folio is"} ${v.folio}`)}`} className="btn btn-wa">WhatsApp</a><Link href={es ? "/es" : "/"} className="btn btn-outline">{es ? "Inicio" : "Home"}</Link></div>
      </div>
    </div>
  );
}
