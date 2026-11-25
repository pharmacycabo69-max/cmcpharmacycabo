"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_QTY, clearRequest, newRequestId, setQty, useRequest, type RequestItem } from "@/lib/request";

const WA_NUMBER = "5216242261023"; // bot line (V4 §4)
const AREAS = ["Cabo San Lucas", "Tourist Corridor", "San José del Cabo", "Other / not sure"];
const WINDOWS = ["As soon as possible", "Morning (7 am – 12 pm)", "Afternoon (12 – 6 pm)", "Evening (6 – 11 pm)"];
const LAST = "cmc-request-last";

type Contact = { name: string; phone: string; area: string; place: string; window: string; rx: "" | "have" | "need" | "none"; instructions: string };
type Sent = { id: string; createdAt: string; items: RequestItem[]; contact: Contact; opened: boolean };

const money = (n: number) => `$${n.toFixed(2)}`;

function message(s: Sent) {
  const c = s.contact;
  const lines = [
    `Pharmacy request ${s.id}`,
    ...s.items.map((i) => `• ${i.qty} × ${i.name}${i.price > 0 ? ` (${money(i.price)} each)` : " (price on request)"}${i.rx ? " ℞" : ""}`),
    "",
    `Name: ${c.name}`,
    `Delivery: ${c.place}, ${c.area}`,
    `When: ${c.window}`,
  ];
  if (s.items.some((i) => i.rx)) lines.push(`Prescription: ${c.rx === "have" ? "I have one and will send a photo here" : "I need a doctor consultation"}`);
  if (c.instructions) lines.push(`Delivery instructions: ${c.instructions}`);
  lines.push("", "Please confirm availability, total and delivery time.");
  return lines.join("\n");
}

export function RequestView() {
  const items = useRequest();
  const [c, setC] = useState<Contact>({ name: "", phone: "", area: AREAS[0], place: "", window: WINDOWS[0], rx: "", instructions: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const v = localStorage.getItem(LAST); if (v) setSent(JSON.parse(v)); } catch { /* nothing saved */ }
    setReady(true);
  }, []);
  const save = (s: Sent | null) => {
    setSent(s);
    try { if (s) localStorage.setItem(LAST, JSON.stringify(s)); else localStorage.removeItem(LAST); } catch { /* private mode */ }
  };

  const hasRx = items.some((i) => i.rx);
  const priced = items.filter((i) => i.price > 0);
  const subtotal = priced.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!c.name.trim()) return setErr("Please enter your name.");
    if (c.phone.replace(/\D/g, "").length < 8) return setErr("Please enter a WhatsApp or phone number we can reach.");
    if (!c.place.trim()) return setErr("Please tell us your hotel and room, villa or address.");
    if (hasRx && !c.rx) return setErr("Some items need a prescription: tell us whether you have one or need a doctor.");
    setErr("");
    save({ id: newRequestId(), createdAt: new Date().toISOString(), items, contact: { ...c, name: c.name.trim(), place: c.place.trim() }, opened: false });
    window.scrollTo({ top: 0 });
  };

  if (!ready) return <div className="mt-10 h-48 animate-pulse rounded-2xl bg-surface" aria-hidden />;

  if (sent) {
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message(sent))}`;
    const steps: [string, string, boolean][] = [
      ["Request created", `Reference ${sent.id}`, true],
      ["Sent to our team on WhatsApp", sent.opened ? "Opened WhatsApp: make sure you pressed Send." : "Tap the button to send it.", sent.opened],
      ["Pharmacist review", "Availability, prescription check and total price.", false],
      ["Confirmation & payment", "We confirm the total and how to pay before we go.", false],
      ["Delivery", "To your hotel, villa or home.", false],
    ];
    return (
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="card p-6 md:p-8" aria-labelledby="req-ready">
          <p className="eyebrow">Your reference</p>
          <h2 id="req-ready" className="mt-1 font-display text-3xl font-bold text-navy">{sent.id}</h2>
          <p className="mt-3 text-slate-600">Your request is ready. <strong>It is not an order yet and nothing has been charged.</strong> Send it to our team on WhatsApp: a pharmacist replies with availability, prescription requirements and the total.</p>
          <a href={href} target="_blank" rel="noopener" onClick={() => save({ ...sent, opened: true })} className="btn btn-wa mt-6 w-full !py-4 text-base sm:w-auto">
            {sent.opened ? "Open WhatsApp again" : "Send request on WhatsApp"}
          </a>
          <ol className="mt-8 space-y-0">
            {steps.map(([t, d, done], i) => (
              <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
                {i < steps.length - 1 && <span aria-hidden className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px bg-line" />}
                <span aria-hidden className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-brand text-white" : "border border-line bg-white text-navy/40"}`}>{done ? "✓" : i + 1}</span>
                <div><p className={`font-semibold ${done ? "text-navy" : "text-navy/60"}`}>{t}<span className="sr-only">{done ? " (done)" : " (pending)"}</span></p><p className="text-sm text-slate-500">{d}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-slate-500">This page only shows what happened on this device. Our team confirms each step in the WhatsApp chat.</p>
        </section>
        <aside className="card h-fit p-6">
          <h3 className="font-semibold text-navy">Summary</h3>
          <ul className="mt-3 divide-y divide-line text-sm">
            {sent.items.map((i) => <li key={i.id} className="flex justify-between gap-3 py-2"><span>{i.qty} × {i.name}</span>{i.rx && <span className="text-amber-800">℞</span>}</li>)}
          </ul>
          <p className="mt-3 text-sm text-slate-600">{sent.contact.place}, {sent.contact.area} · {sent.contact.window}</p>
          <div className="mt-6 grid gap-2">
            <button type="button" className="btn btn-outline" onClick={() => save(null)}>Edit this request</button>
            <button type="button" className="text-sm font-semibold text-brand hover:underline" onClick={() => { clearRequest(); save(null); }}>Start a new request</button>
          </div>
        </aside>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-2xl text-brand" aria-hidden>+</span>
        <h2 className="mt-4 font-display text-2xl font-bold text-navy">Your request is empty</h2>
        <p className="mt-2 max-w-md text-slate-600">Add products from the catalog, or just send us a photo or a list on WhatsApp: we&apos;ll check availability and price for you.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Browse the pharmacy</Link>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to check availability of some medicines.")}`} target="_blank" rel="noopener" className="btn btn-outline">Send a list on WhatsApp</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
      <section aria-labelledby="req-items" className="card overflow-hidden">
        <h2 id="req-items" className="border-b border-line px-6 py-4 font-semibold text-navy">{count} item{count === 1 ? "" : "s"} in your request</h2>
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 px-6 py-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {i.img ? <img src={i.img} alt="" width={64} height={64} className="h-full w-full object-contain" /> : <span className="text-navy/20">+</span>}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${i.slug}`} className="line-clamp-2 text-sm font-medium text-navy hover:text-brand">{i.name}</Link>
                <p className="mt-1 text-sm text-slate-600">{i.price > 0 ? `${money(i.price)} each` : "Price on request"}{i.rx && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">℞ Prescription</span>}</p>
                <div className="mt-2 flex items-center gap-2">
                  <label className="sr-only" htmlFor={`q-${i.id}`}>Quantity for {i.name}</label>
                  <button type="button" aria-label={`One less ${i.name}`} onClick={() => setQty(i.id, i.qty - 1)} className="h-8 w-8 rounded-lg border border-line text-navy hover:border-brand">−</button>
                  <input id={`q-${i.id}`} inputMode="numeric" value={i.qty} onChange={(e) => setQty(i.id, Math.max(0, Math.min(MAX_QTY, Number(e.target.value.replace(/\D/g, "")) || 0)))} className="h-8 w-12 rounded-lg border border-line text-center text-sm" />
                  <button type="button" aria-label={`One more ${i.name}`} onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= MAX_QTY} className="h-8 w-8 rounded-lg border border-line text-navy hover:border-brand disabled:opacity-40">+</button>
                  <button type="button" onClick={() => setQty(i.id, 0)} className="ml-2 text-xs font-medium text-slate-500 hover:text-red-700">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-line bg-surface px-6 py-4 text-sm">
          {priced.length > 0 && <p className="flex justify-between font-semibold text-navy"><span>Catalog subtotal{priced.length < items.length ? " (priced items)" : ""}</span><span>{money(subtotal)}</span></p>}
          <p className="text-slate-600">Catalog prices are a reference. The pharmacist confirms availability, final price and delivery fee (free on orders of $59 or more) before anything is charged.</p>
        </div>
        <div className="px-6 py-4"><Link href="/shop" className="text-sm font-semibold text-brand hover:underline">← Keep browsing</Link></div>
      </section>

      <form onSubmit={submit} noValidate className="card h-fit space-y-4 p-6" aria-labelledby="req-form">
        <h2 id="req-form" className="font-semibold text-navy">Where should we deliver?</h2>
        <div><label htmlFor="r-name" className="text-sm font-medium text-navy">Name</label><input id="r-name" autoComplete="name" className="field mt-1" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
        <div><label htmlFor="r-phone" className="text-sm font-medium text-navy">WhatsApp or phone</label><input id="r-phone" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" className="field mt-1" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></div>
        <div><label htmlFor="r-area" className="text-sm font-medium text-navy">Area</label><select id="r-area" className="field mt-1" value={c.area} onChange={(e) => setC({ ...c, area: e.target.value })}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
        <div><label htmlFor="r-place" className="text-sm font-medium text-navy">Hotel and room, villa or address</label><input id="r-place" className="field mt-1" value={c.place} onChange={(e) => setC({ ...c, place: e.target.value })} /><p className="mt-1 text-xs text-slate-500">Some hotels only accept deliveries at the front desk; we coordinate the hand-over with you.</p></div>
        <div><label htmlFor="r-win" className="text-sm font-medium text-navy">Preferred time</label><select id="r-win" className="field mt-1" value={c.window} onChange={(e) => setC({ ...c, window: e.target.value })}>{WINDOWS.map((w) => <option key={w}>{w}</option>)}</select></div>
        {hasRx && (
          <fieldset className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <legend className="px-1 text-sm font-semibold text-amber-950">Prescription items</legend>
            <p className="text-xs text-amber-950/80">Mexican law requires a valid prescription for ℞ items.</p>
            {([["have", "I have a valid prescription"], ["need", "I need a doctor consultation"]] as const).map(([v, l]) => (
              <label key={v} className="mt-2 flex items-center gap-2 text-sm text-amber-950"><input type="radio" name="rx" checked={c.rx === v} onChange={() => setC({ ...c, rx: v })} />{l}</label>
            ))}
          </fieldset>
        )}
        <div><label htmlFor="r-ins" className="text-sm font-medium text-navy">Delivery instructions <span className="font-normal text-slate-500">(optional)</span></label><input id="r-ins" className="field mt-1" placeholder="e.g. call on arrival, gate code" value={c.instructions} onChange={(e) => setC({ ...c, instructions: e.target.value })} /><p className="mt-1 text-xs text-slate-500">Please don&apos;t include symptoms or health details here.</p></div>
        {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>}
        <button type="submit" className="btn btn-primary w-full !py-3.5">Submit order request</button>
        <p className="text-xs leading-relaxed text-slate-500">No payment now. Your details stay on this device until you send the request on WhatsApp.</p>
      </form>
    </div>
  );
}
