"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_QTY, clearRequest, setQty, useRequest } from "@/lib/request";

/**
 * Pharmacy request (V5 §5). The request is saved on the server (folio) BEFORE we show a confirmation;
 * the team is notified by CRM, email and internal WhatsApp. WhatsApp here is only for assistance.
 * Nothing is charged. If saving fails we say so and offer WhatsApp instead — never a fake confirmation.
 */
const WA = "https://wa.me/5216242261023";
const LAST = "cmc-request-sent";
const FREE_FROM = 99;

const T = {
  en: {
    areas: ["Cabo San Lucas", "Tourist Corridor", "San José del Cabo", "Other / not sure"],
    windows: ["As soon as possible", "Morning (8 am – 12 pm)", "Afternoon (12 – 6 pm)", "Evening (6 – 11:30 pm)"],
    items: (n: number) => `${n} item${n === 1 ? "" : "s"} in your request`, each: "each", onRequest: "Price on request", rx: "℞ Prescription",
    less: "One less", more: "One more", remove: "Remove", qty: "Quantity for", subtotal: "Catalog subtotal", priced: " (priced items)",
    freeYes: `Free delivery: your catalog subtotal is $${FREE_FROM} or more.`, freeNo: `Delivery is free from $${FREE_FROM}; for smaller orders we confirm the delivery fee before you pay.`,
    refNote: "Catalog prices are a reference. A pharmacist confirms availability, prescription requirements, final price and delivery before anything is charged.",
    keep: "← Keep browsing", byName: "Can't find a product? Request it by name", byNamePh: "Product name, brand or active ingredient (one per line)", byNameHelp: "We'll check availability and price for you.",
    where: "Where should we deliver?", name: "Name", phone: "WhatsApp or phone", email: "Email (optional)", area: "Area", place: "Hotel and room, villa or address", placeHelp: "Some hotels only accept deliveries at the front desk; we coordinate the hand-over with you.",
    time: "Preferred time", rxTitle: "Prescription items", rxLaw: "Mexican law requires a valid prescription for ℞ items.", rxHave: "I have a valid prescription", rxNeed: "I need a doctor consultation",
    instr: "Delivery instructions (optional)", instrPh: "e.g. call on arrival, gate code", noHealth: "Please don't include symptoms or health details.",
    send: "Send pharmacy request", sending: "Sending…", noPay: "No payment now. Your request is saved and our team is notified right away; requests are received 24/7, deliveries 8 am – 11:30 pm.",
    e: { name: "Please enter your name.", phone: "Please enter a WhatsApp or phone number we can reach.", place: "Please tell us your hotel and room, villa or address.", rx: "Some items need a prescription: tell us whether you have one or need a doctor.", empty: "Add a product or write what you need.", save: "We couldn't save your request online right now. Please send it on WhatsApp and we'll take care of it.", generic: "Something went wrong. Please try again." },
    okTitle: "Request received", okBody: "Your pharmacy request is saved and our team has been notified. A pharmacist will contact you to confirm availability, prescription requirements, total and delivery. Nothing has been charged.",
    track: "Track this request", help: "Questions? WhatsApp us with your folio", newReq: "Start a new request",
    emptyTitle: "Your request is empty", emptyBody: "Add products from the catalog, or request a product by name below.", browse: "Browse the pharmacy",
    waFallback: "Send on WhatsApp instead",
  },
  es: {
    areas: ["Cabo San Lucas", "Corredor Turístico", "San José del Cabo", "Otra / no sé"],
    windows: ["Lo antes posible", "Mañana (8 am – 12 pm)", "Tarde (12 – 6 pm)", "Noche (6 – 11:30 pm)"],
    items: (n: number) => `${n} artículo${n === 1 ? "" : "s"} en tu solicitud`, each: "c/u", onRequest: "Precio a consultar", rx: "℞ Con receta",
    less: "Uno menos", more: "Uno más", remove: "Quitar", qty: "Cantidad de", subtotal: "Subtotal de catálogo", priced: " (artículos con precio)",
    freeYes: `Envío gratis: tu subtotal es de $${FREE_FROM} o más.`, freeNo: `El envío es gratis desde $${FREE_FROM}; en pedidos menores confirmamos el costo de envío antes del pago.`,
    refNote: "Los precios del catálogo son de referencia. Un farmacéutico confirma disponibilidad, requisitos de receta, precio final y entrega antes de cobrar.",
    keep: "← Seguir viendo", byName: "¿No encuentras un producto? Pídelo por nombre", byNamePh: "Nombre, marca o principio activo (uno por línea)", byNameHelp: "Revisamos disponibilidad y precio por ti.",
    where: "¿Dónde te lo entregamos?", name: "Nombre", phone: "WhatsApp o teléfono", email: "Correo (opcional)", area: "Zona", place: "Hotel y habitación, villa o dirección", placeHelp: "Algunos hoteles solo reciben en recepción; coordinamos la entrega contigo.",
    time: "Horario preferido", rxTitle: "Artículos con receta", rxLaw: "La ley mexicana exige receta válida para artículos ℞.", rxHave: "Tengo receta válida", rxNeed: "Necesito una consulta médica",
    instr: "Indicaciones de entrega (opcional)", instrPh: "p. ej. llamar al llegar, código de acceso", noHealth: "No incluyas síntomas ni datos de salud.",
    send: "Enviar solicitud de farmacia", sending: "Enviando…", noPay: "Sin pago ahora. Tu solicitud se guarda y nuestro equipo recibe aviso de inmediato; recibimos solicitudes 24/7 y entregamos de 8 am a 11:30 pm.",
    e: { name: "Escribe tu nombre.", phone: "Escribe un WhatsApp o teléfono de contacto.", place: "Indica tu hotel y habitación, villa o dirección.", rx: "Algunos artículos requieren receta: dinos si la tienes o necesitas médico.", empty: "Agrega un producto o escribe lo que necesitas.", save: "No pudimos guardar tu solicitud en línea en este momento. Envíala por WhatsApp y la atendemos.", generic: "Algo salió mal. Intenta de nuevo." },
    okTitle: "Solicitud recibida", okBody: "Tu solicitud de farmacia quedó guardada y nuestro equipo ya recibió el aviso. Un farmacéutico te contactará para confirmar disponibilidad, receta, total y entrega. No se ha cobrado nada.",
    track: "Ver seguimiento", help: "¿Dudas? Escríbenos por WhatsApp con tu folio", newReq: "Nueva solicitud",
    emptyTitle: "Tu solicitud está vacía", emptyBody: "Agrega productos del catálogo o pide un producto por nombre abajo.", browse: "Ver la farmacia",
    waFallback: "Enviar por WhatsApp",
  },
};

type Sent = { folio: string; track: string };
const money = (n: number) => `$${n.toFixed(2)}`;

export function RequestView({ lang = "en" }: { lang?: "en" | "es" }) {
  const t = T[lang];
  const items = useRequest();
  const [c, setC] = useState({ name: "", phone: "", email: "", area: t.areas[0], place: "", window: t.windows[0], rx: "" as "" | "have" | "need", instructions: "", notFound: "", website: "" });
  const [err, setErr] = useState("");
  const [fallback, setFallback] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  useEffect(() => { try { const v = localStorage.getItem(LAST); if (v) setSent(JSON.parse(v)); } catch { /* none */ } }, []);
  const hasRx = items.some((i) => i.rx);
  const priced = items.filter((i) => i.price > 0);
  const subtotal = priced.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const waText = [`${lang === "es" ? "Solicitud de farmacia" : "Pharmacy request"}:`, ...items.map((i) => `• ${i.qty} × ${i.name}`), c.notFound ? `+ ${c.notFound}` : "", `${c.name} · ${c.place}, ${c.area}`].filter(Boolean).join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length && !c.notFound.trim()) return setErr(t.e.empty);
    if (!c.name.trim()) return setErr(t.e.name);
    if (c.phone.replace(/\D/g, "").length < 8) return setErr(t.e.phone);
    if (!c.place.trim()) return setErr(t.e.place);
    if (hasRx && !c.rx) return setErr(t.e.rx);
    setErr(""); setFallback(false); setBusy(true);
    try {
      const r = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...c, lang, items: items.map((i) => ({ id: i.id, qty: i.qty })) }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.folio) {
        const s = { folio: j.folio, track: j.track };
        setSent(s); clearRequest();
        try { localStorage.setItem(LAST, JSON.stringify(s)); } catch { /* private mode */ }
        window.scrollTo({ top: 0 });
      } else if (r.status === 503 || r.status === 429) { setErr(t.e.save); setFallback(true); }
      else setErr(t.e.generic);
    } catch { setErr(t.e.save); setFallback(true); }
    setBusy(false);
  };

  if (sent) {
    return (
      <section className="card mt-8 overflow-hidden" aria-labelledby="req-ok">
        <div className="bg-navy px-6 py-6 text-white md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Folio</p>
          <h2 id="req-ok" className="mt-1 font-mono text-3xl font-bold">{sent.folio}</h2>
          <p className="mt-2 font-semibold">{t.okTitle}</p>
        </div>
        <div className="p-6 md:p-8">
          <p className="max-w-2xl text-slate-700">{t.okBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`${sent.track}${lang === "es" ? "&lang=es" : ""}`} className="btn btn-primary">{t.track}</Link>
            <a href={`${WA}?text=${encodeURIComponent(`Folio ${sent.folio}`)}`} target="_blank" rel="noopener" className="btn btn-outline">{t.help}</a>
            <button type="button" className="text-sm font-semibold text-brand hover:underline" onClick={() => { setSent(null); try { localStorage.removeItem(LAST); } catch { /* none */ } }}>{t.newReq}</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-6">
        {items.length > 0 ? (
          <section aria-labelledby="req-items" className="card overflow-hidden">
            <h2 id="req-items" className="border-b border-line px-6 py-4 font-semibold text-navy">{t.items(count)}</h2>
            <ul className="divide-y divide-line">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 px-6 py-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.img ? <img src={i.img} alt="" width={64} height={64} className="h-full w-full object-contain" /> : <span className="text-navy/20">+</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${i.slug}`} className="line-clamp-2 text-sm font-medium text-navy hover:text-brand">{i.name}</Link>
                    <p className="mt-1 text-sm text-slate-600">{i.price > 0 ? `${money(i.price)} ${t.each}` : t.onRequest}{i.rx && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">{t.rx}</span>}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`q-${i.id}`}>{t.qty} {i.name}</label>
                      <button type="button" aria-label={`${t.less}: ${i.name}`} onClick={() => setQty(i.id, i.qty - 1)} className="h-8 w-8 rounded-lg border border-line text-navy hover:border-brand">−</button>
                      <input id={`q-${i.id}`} inputMode="numeric" value={i.qty} onChange={(e) => setQty(i.id, Math.max(0, Math.min(MAX_QTY, Number(e.target.value.replace(/\D/g, "")) || 0)))} className="h-8 w-12 rounded-lg border border-line text-center text-sm" />
                      <button type="button" aria-label={`${t.more}: ${i.name}`} onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= MAX_QTY} className="h-8 w-8 rounded-lg border border-line text-navy hover:border-brand disabled:opacity-40">+</button>
                      <button type="button" onClick={() => setQty(i.id, 0)} className="ml-2 text-xs font-medium text-slate-500 hover:text-red-700">{t.remove}</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-line bg-surface px-6 py-4 text-sm">
              {priced.length > 0 && <p className="flex justify-between font-semibold text-navy"><span>{t.subtotal}{priced.length < items.length ? t.priced : ""}</span><span>{money(subtotal)}</span></p>}
              <p className="font-medium text-brand-dark">{subtotal >= FREE_FROM ? t.freeYes : t.freeNo}</p>
              <p className="text-slate-600">{t.refNote}</p>
            </div>
            <div className="px-6 py-4"><Link href="/shop" className="text-sm font-semibold text-brand hover:underline">{t.keep}</Link></div>
          </section>
        ) : (
          <div className="card flex flex-col items-center px-6 py-12 text-center">
            <h2 className="font-display text-2xl font-bold text-navy">{t.emptyTitle}</h2>
            <p className="mt-2 max-w-md text-slate-600">{t.emptyBody}</p>
            <Link href="/shop" className="btn btn-primary mt-5">{t.browse}</Link>
          </div>
        )}
        <div className="card p-6">
          <label htmlFor="r-nf" className="font-semibold text-navy">{t.byName}</label>
          <textarea id="r-nf" rows={3} className="field mt-2" placeholder={t.byNamePh} value={c.notFound} onChange={(e) => setC({ ...c, notFound: e.target.value.slice(0, 400) })} />
          <p className="mt-1 text-xs text-slate-500">{t.byNameHelp}</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="card h-fit space-y-4 p-6" aria-labelledby="req-form">
        <h2 id="req-form" className="font-semibold text-navy">{t.where}</h2>
        <div className="hidden" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" value={c.website} onChange={(e) => setC({ ...c, website: e.target.value })} /></label></div>
        <div><label htmlFor="r-name" className="text-sm font-medium text-navy">{t.name}</label><input id="r-name" autoComplete="name" className="field mt-1" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
        <div><label htmlFor="r-phone" className="text-sm font-medium text-navy">{t.phone}</label><input id="r-phone" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" className="field mt-1" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></div>
        <div><label htmlFor="r-email" className="text-sm font-medium text-navy">{t.email}</label><input id="r-email" type="email" autoComplete="email" className="field mt-1" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
        <div><label htmlFor="r-area" className="text-sm font-medium text-navy">{t.area}</label><select id="r-area" className="field mt-1" value={c.area} onChange={(e) => setC({ ...c, area: e.target.value })}>{t.areas.map((a) => <option key={a}>{a}</option>)}</select></div>
        <div><label htmlFor="r-place" className="text-sm font-medium text-navy">{t.place}</label><input id="r-place" className="field mt-1" value={c.place} onChange={(e) => setC({ ...c, place: e.target.value })} /><p className="mt-1 text-xs text-slate-500">{t.placeHelp}</p></div>
        <div><label htmlFor="r-win" className="text-sm font-medium text-navy">{t.time}</label><select id="r-win" className="field mt-1" value={c.window} onChange={(e) => setC({ ...c, window: e.target.value })}>{t.windows.map((w) => <option key={w}>{w}</option>)}</select></div>
        {hasRx && (
          <fieldset className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <legend className="px-1 text-sm font-semibold text-amber-950">{t.rxTitle}</legend>
            <p className="text-xs text-amber-950/80">{t.rxLaw}</p>
            {([["have", t.rxHave], ["need", t.rxNeed]] as const).map(([v, l]) => (
              <label key={v} className="mt-2 flex items-center gap-2 text-sm text-amber-950"><input type="radio" name="rx" checked={c.rx === v} onChange={() => setC({ ...c, rx: v })} />{l}</label>
            ))}
          </fieldset>
        )}
        <div><label htmlFor="r-ins" className="text-sm font-medium text-navy">{t.instr}</label><input id="r-ins" className="field mt-1" placeholder={t.instrPh} value={c.instructions} onChange={(e) => setC({ ...c, instructions: e.target.value })} /><p className="mt-1 text-xs text-slate-500">{t.noHealth}</p></div>
        {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>}
        {fallback && <a href={`${WA}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener" className="btn btn-wa w-full">{t.waFallback}</a>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-3.5 disabled:opacity-60">{busy ? t.sending : t.send}</button>
        <p className="text-xs leading-relaxed text-slate-500">{t.noPay}</p>
      </form>
    </div>
  );
}
