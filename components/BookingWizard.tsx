"use client";

import { useEffect, useMemo, useState } from "react";
import { IV, IV_DRIPS, getDrip } from "@/lib/ivtherapy";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const hlabel = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "AM" : "PM"}`;
const tlabel = (t: string) => (t === "ASAP" ? "As soon as possible" : hlabel(+t.split(":")[0]));
const dlabel = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

/** Current date/hour in Cabo, independent of the visitor's timezone */
function caboNow() {
  const p: Record<string, number> = {};
  new Intl.DateTimeFormat("en-US", { timeZone: IV.timezone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric" })
    .formatToParts(new Date()).forEach((x) => { if (x.type !== "literal") p[x.type] = +x.value; });
  return { y: p.year, m: p.month - 1, d: p.day, h: p.hour };
}

type Form = { name: string; phone: string; email: string; loc: string; notes: string };
const ERROR_TEXT: Record<string, string> = {
  invalid: "Something in your booking didn’t validate. Please review it and try again.",
  config: "Online payment is temporarily unavailable. Send your request on WhatsApp instead.",
  stripe: "We couldn’t start the payment. Try again or send your request on WhatsApp.",
};

export function BookingWizard() {
  const now = useMemo(caboNow, []);
  const [step, setStep] = useState(1);
  const [k, setK] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cy, setCy] = useState(now.y);
  const [cm, setCm] = useState(now.m);
  const [f, setF] = useState<Form>({ name: "", phone: "", email: "", loc: "", notes: "" });
  const [err, setErr] = useState("");

  // Preselect a drip from "#book-<id>" links and surface checkout errors from "?error=" (keeps the page static)
  useEffect(() => {
    const read = () => {
      const id = location.hash.replace(/^#book-?/, "");
      if (id && getDrip(id)) { setK(id); setStep(1); document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }); }
    };
    read();
    setError(new URLSearchParams(location.search).get("error") ?? "");
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const svc = getDrip(k);
  const todayIso = iso(now.y, now.m, now.d);
  const lastD = new Date(now.y, now.m, now.d + IV.maxDays);
  const lastIso = iso(lastD.getFullYear(), lastD.getMonth(), lastD.getDate());
  const isToday = date === todayIso;

  const validate = () => {
    if (!f.name.trim()) return "Please enter your name.";
    if (f.phone.replace(/\D/g, "").length < 7) return "Please enter a valid WhatsApp / phone number.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return "Please enter a valid email so we can send your receipt.";
    if (!f.loc.trim()) return "Please tell us your hotel / villa and room, or address.";
    return "";
  };
  const next = () => {
    if (step === 3) { const e = validate(); if (e) return setErr(e); }
    setErr(""); setStep((s) => Math.min(4, s + 1));
  };
  const back = () => { setErr(""); setStep((s) => Math.max(1, s - 1)); };

  const waText = svc
    ? `Hi! I would like to book IV therapy: ${svc.name} (${money(svc.priceUsd)}) on ${dlabel(date)}, ${tlabel(time)} (Cabo time).\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\nLocation: ${f.loc}${f.notes ? `\nNotes: ${f.notes}` : ""}`
    : "";
  const waHref = `https://wa.me/${IV.whatsapp}?text=${encodeURIComponent(waText)}`;

  const first = new Date(cy, cm, 1).getDay();
  const days = new Date(cy, cm + 1, 0).getDate();
  const hours = IV.hours.filter((h) => !(isToday && h <= now.h + 1)); // at least ~1h lead time

  const btn = "rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
  const primary = `${btn} bg-brand text-white hover:bg-brand-dark`;
  const ghost = `${btn} border border-slate-300 bg-white text-slate-700 hover:border-brand`;
  const field = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand";
  const titles = ["Choose your service", "Choose date & time", "Your details", "Review & confirm"];

  return (
    <section id="book" aria-labelledby="wiz-h" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-brand px-6 pb-5 pt-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-100">Book IV therapy online</p>
        <h2 id="wiz-h" className="mt-1 text-2xl font-bold">{titles[step - 1]}</h2>
        <div className="mt-4 flex gap-2" aria-hidden>
          {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${step >= i ? "bg-white" : "bg-white/25"}`} />)}
        </div>
      </div>

      <div className="p-6">
        {error && step === 1 && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{ERROR_TEXT[error] ?? ERROR_TEXT.invalid}</p>}

        {step === 1 && (
          <>
            <div className="grid gap-2.5">
              {IV_DRIPS.map((o) => (
                <button key={o.id} type="button" aria-pressed={k === o.id} onClick={() => setK(o.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition ${k === o.id ? "border-brand bg-brand-soft" : "border-slate-200 hover:border-slate-300"}`}>
                  <span><b className="block text-[0.95rem]">{o.name}</b><span className="mt-0.5 block text-xs text-slate-500">{o.tagline} · {o.duration}</span></span>
                  <span className="whitespace-nowrap font-bold text-brand">{o.from ? "From " : ""}{money(o.priceUsd)}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex"><button type="button" className={`${primary} flex-1`} disabled={!k} onClick={next}>{k ? "Continue" : "Choose a service"}</button></div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="select-none">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" aria-label="Previous month" disabled={cy === now.y && cm === now.m} onClick={() => { const d = new Date(cy, cm - 1, 1); setCy(d.getFullYear()); setCm(d.getMonth()); }} className="h-9 w-9 rounded-full bg-slate-100 text-lg disabled:opacity-30">‹</button>
                <b>{MONTHS[cm]} {cy}</b>
                <button type="button" aria-label="Next month" disabled={iso(cy, cm + 1, 1) > lastIso} onClick={() => { const d = new Date(cy, cm + 1, 1); setCy(d.getFullYear()); setCm(d.getMonth()); }} className="h-9 w-9 rounded-full bg-slate-100 text-lg disabled:opacity-30">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {WD.map((w) => <div key={w} className="py-1 text-[11px] font-bold text-slate-400">{w}</div>)}
                {Array.from({ length: first }, (_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: days }, (_, i) => {
                  const d = i + 1, s = iso(cy, cm, d), dis = s < todayIso || s > lastIso;
                  return (
                    <button key={s} type="button" disabled={dis} aria-pressed={date === s} onClick={() => { setDate(s); setTime(""); }}
                      className={`aspect-square rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 ${date === s ? "bg-brand text-white" : "hover:bg-slate-100"} ${s === todayIso && date !== s ? "ring-2 ring-inset ring-brand/40" : ""}`}>{d}</button>
                  );
                })}
              </div>
            </div>
            {date && (
              <>
                <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred time (Cabo time)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {isToday && <button type="button" aria-pressed={time === "ASAP"} onClick={() => setTime("ASAP")} className={`col-span-3 rounded-lg border-2 py-2.5 text-sm font-bold ${time === "ASAP" ? "border-brand bg-brand-soft" : "border-slate-200"}`}>As soon as possible</button>}
                  {hours.map((h) => { const v = `${pad(h)}:00`; return (
                    <button key={v} type="button" aria-pressed={time === v} onClick={() => setTime(v)} className={`rounded-lg border-2 py-2.5 text-sm font-semibold ${time === v ? "border-brand bg-brand-soft" : "border-slate-200 hover:border-slate-300"}`}>{hlabel(h)}</button>
                  ); })}
                  {isToday && hours.length === 0 && <p className="col-span-3 text-xs text-slate-500">No more regular slots today. Choose “As soon as possible” or another day.</p>}
                </div>
              </>
            )}
            <p className="mt-4 text-xs text-slate-500">Times are preferences. Our team confirms the exact time with you.</p>
            <div className="mt-5 flex gap-3"><button type="button" className={ghost} onClick={back}>← Back</button><button type="button" className={`${primary} flex-1`} disabled={!date || !time} onClick={next}>{date && time ? "Continue" : date ? "Choose a time" : "Choose a date"}</button></div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-3 text-sm font-medium">
              <label className="block">Full name *<input className={field} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="block">WhatsApp / phone *<input className={field} type="tel" autoComplete="tel" placeholder="+1 555 000 0000" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label className="block">Email *<input className={field} type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
              <label className="block">Hotel / villa and room, or address *<input className={field} autoComplete="street-address" value={f.loc} onChange={(e) => setF({ ...f, loc: e.target.value })} /></label>
              <label className="block">Notes (optional)<textarea className={field} rows={2} placeholder="Allergies, medication, anything we should know" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
            </div>
            {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
            <div className="mt-5 flex gap-3"><button type="button" className={ghost} onClick={back}>← Back</button><button type="button" className={`${primary} flex-1`} onClick={next}>Review</button></div>
          </>
        )}

        {step === 4 && svc && (
          <>
            <dl className="rounded-xl bg-slate-50 p-4 text-sm">
              {([["Service", svc.name], ["Date", dlabel(date)], ["Time", tlabel(time)], ["Name", f.name], ["Phone", f.phone], ["Email", f.email], ["Location", f.loc], ["Price", `${svc.from ? "From " : ""}${money(svc.priceUsd)} USD`]] as const).map(([a, b]) => (
                <div key={a} className="flex justify-between gap-4 py-1"><dt className="text-slate-500">{a}</dt><dd className="text-right font-semibold">{b}</dd></div>
              ))}
            </dl>
            <form method="post" action="/api/iv-therapy/checkout" className="mt-5 flex flex-col gap-3">
              <input type="hidden" name="option" value={svc.id} /><input type="hidden" name="date" value={date} /><input type="hidden" name="time" value={time} />
              <input type="hidden" name="name" value={f.name} /><input type="hidden" name="phone" value={f.phone} /><input type="hidden" name="email" value={f.email} />
              <input type="hidden" name="location" value={f.loc} /><input type="hidden" name="notes" value={f.notes} />
              <button className={primary}>Pay {Math.round(IV.depositRate * 100)}% deposit · {money(svc.priceUsd * IV.depositRate)}</button>
              <a href={waHref} target="_blank" rel="noopener" className={`${btn} bg-[#1fa855] text-center text-white hover:bg-[#188a45]`}>Send request on WhatsApp</a>
            </form>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">The deposit is paid by card with Stripe; the balance is paid after the service. This is a booking request: our team confirms availability and the exact time by WhatsApp or phone. Not for emergencies — call 911.</p>
            <div className="mt-4"><button type="button" className={ghost} onClick={back}>← Edit</button></div>
          </>
        )}
      </div>
    </section>
  );
}
