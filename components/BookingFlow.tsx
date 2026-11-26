"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BOOKABLE, MODE_LABEL, getBookable, priceOf, type Bookable, type Mode } from "@/lib/booking";

const WA = "5216242261023"; // bot line (V4 §4)
const TZ = "America/Mazatlan";
const LAST = "cmc-booking-v5";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const AREAS = ["Cabo San Lucas", "Tourist Corridor", "San José del Cabo", "Other / not sure"];
const HOURS: Record<Mode, number[]> = { video: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], clinic: [9, 10, 11, 12, 13, 14, 15, 16], hotel: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] };

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const hlabel = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "am" : "pm"}`;
const dlabel = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
function caboNow() {
  const p: Record<string, number> = {};
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric" })
    .formatToParts(new Date()).forEach((x) => { if (x.type !== "literal") p[x.type] = +x.value; });
  return { y: p.year, m: p.month - 1, d: p.day, h: p.hour };
}

type Details = { name: string; phone: string; email: string; area: string; place: string };
type Sent = { folio: string; track: string; service: string; option?: string; mode: Mode; date: string; time: string };

export function BookingFlow({ initial, initialOption }: { initial?: string; initialOption?: string }) {
  const now = useMemo(caboNow, []);
  const [svcId, setSvcId] = useState(getBookable(initial ?? "") ? initial! : "");
  const svc = getBookable(svcId);
  const [opt, setOpt] = useState(initialOption && svc?.options?.some((o) => o.id === initialOption) ? initialOption : "");
  const [mode, setMode] = useState<Mode | "">(svc?.modes.length === 1 ? svc.modes[0] : "");
  const [step, setStep] = useState(svc ? 2 : 1);
  const [cy, setCy] = useState(now.y);
  const [cm, setCm] = useState(now.m);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [d, setD] = useState<Details>({ name: "", phone: "", email: "", area: AREAS[0], place: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);

  useEffect(() => { try { const v = localStorage.getItem(LAST); if (v && !initial) setSent(JSON.parse(v)); } catch { /* nothing saved */ } }, [initial]);
  const save = (s: Sent | null) => { setSent(s); try { if (s) localStorage.setItem(LAST, JSON.stringify(s)); else localStorage.removeItem(LAST); } catch { /* private mode */ } };

  const choose = (b: Bookable) => { setSvcId(b.id); setOpt(""); setMode(b.modes.length === 1 ? b.modes[0] : ""); setErr(""); setStep(2); window.scrollTo({ top: 0 }); };
  const todayIso = iso(now.y, now.m, now.d);
  const last = new Date(now.y, now.m, now.d + 60);
  const lastIso = iso(last.getFullYear(), last.getMonth(), last.getDate());
  const hours = mode ? HOURS[mode].filter((h) => !(date === todayIso && h <= now.h + 1)) : [];
  const price = svc ? priceOf(svc, opt) : null;

  const toDetails = () => {
    if (!svc) return;
    if (svc.options && !opt) return setErr("Choose an option.");
    if (!mode) return setErr("Choose where you'd like to be seen.");
    if (!date || !time) return setErr("Choose a preferred date and time.");
    setErr(""); setStep(3);
  };
  const [busy, setBusy] = useState(false);
  const [fallback, setFallback] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name.trim()) return setErr("Please enter your name.");
    if (d.phone.replace(/\D/g, "").length < 8) return setErr("Please enter a WhatsApp or phone number.");
    if (mode === "hotel" && !d.place.trim()) return setErr("Please tell us your hotel and room, villa or address.");
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return setErr("Please check your email.");
    setErr(""); setFallback(false); setBusy(true);
    try {
      const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service: svcId, option: opt || undefined, mode, date, time, ...d, lang: "en" }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.folio) { save({ folio: j.folio, track: j.track, service: svcId, option: opt || undefined, mode: mode as Mode, date, time }); window.scrollTo({ top: 0 }); }
      else if (r.status === 503 || r.status === 429) { setErr("We couldn't save your booking online right now. Please send it on WhatsApp and we'll take care of it."); setFallback(true); }
      else setErr("Please check the details and try again.");
    } catch { setErr("We couldn't save your booking online right now. Please send it on WhatsApp and we'll take care of it."); setFallback(true); }
    setBusy(false);
  };

  if (sent) {
    const b = getBookable(sent.service)!;
    const o = b.options?.find((x) => x.id === sent.option);
    const p = priceOf(b, sent.option);
    const steps: [string, string, boolean][] = [
      ["Booking received", "Saved with your folio; our team has been notified.", true],
      [b.pay === "quote" ? "Review & quote" : "Availability confirmed", b.provider === "partner" ? "We validate the study with the partner and send you a quote." : "Our team confirms the exact time and suitability with you.", false],
      [b.pay === "quote" ? "You approve the quote" : "Pay online", b.pay === "quote" ? "Nothing is charged before you approve." : `We send you a secure payment link (full price${p ? `, ${money(p)}` : ""}).`, false],
      ["Appointment confirmed", "You receive the confirmation and the receipt.", false],
    ];
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="card overflow-hidden" aria-labelledby="bk-ref">
          <div className="bg-navy px-6 py-6 text-white md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Folio</p>
            <h2 id="bk-ref" className="mt-1 font-mono text-3xl font-bold">{sent.folio}</h2>
            <p className="mt-2 text-sm text-white/75">Booking received. Nothing has been charged; we contact you to confirm availability.</p>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-3">
              <Link href={sent.track} className="btn btn-primary">Track this booking</Link>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Folio ${sent.folio}`)}`} target="_blank" rel="noopener" className="btn btn-outline">Questions? WhatsApp us</a>
            </div>
            <ol className="mt-8">
              {steps.map(([t, s, done], i) => (
                <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < steps.length - 1 && <span aria-hidden className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px bg-line" />}
                  <span aria-hidden className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-brand text-white" : "border border-line bg-white text-navy/40"}`}>{done ? "✓" : i + 1}</span>
                  <div><p className={`font-semibold ${done ? "text-navy" : "text-navy/60"}`}>{t}<span className="sr-only">{done ? " (done)" : " (pending)"}</span></p><p className="text-sm text-slate-500">{s}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <aside className="card h-fit p-6">
          <h3 className="font-semibold text-navy">Summary</h3>
          <dl className="mt-3 space-y-2 text-sm">
            {[["Service", `${b.name}${o ? ` — ${o.name}` : ""}`], ["Where", MODE_LABEL[sent.mode]], ["Preferred", `${dlabel(sent.date)}, ${sent.time === "ASAP" ? "ASAP" : hlabel(+sent.time.split(":")[0])}`], ["Price", p ? `$${p} USD, taxes incl.` : "Quote"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-slate-500">{k}</dt><dd className="text-right font-medium text-navy">{v}</dd></div>
            ))}
          </dl>
          <button type="button" className="mt-6 text-sm font-semibold text-brand hover:underline" onClick={() => { save(null); setSvcId(""); setStep(1); }}>Book another service</button>
          <p className="mt-4 text-xs text-slate-500">Not an emergency service. In an emergency call 911.</p>
        </aside>
      </div>
    );
  }

  const groups = ["Doctor", "IV therapy", "Tests", "Aesthetics"] as const;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <ol className="mb-6 flex gap-2 text-xs font-semibold" aria-label="Booking steps">
          {["Service", "Date & place", "Your details"].map((t, i) => (
            <li key={t} className={`flex flex-1 items-center gap-2 rounded-full px-3 py-2 ${step === i + 1 ? "bg-navy text-white" : step > i + 1 ? "bg-brand-soft text-brand-dark" : "bg-surface text-navy/50"}`} aria-current={step === i + 1 ? "step" : undefined}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">{step > i + 1 ? "✓" : i + 1}</span><span className="truncate">{t}</span>
            </li>
          ))}
        </ol>

        {step === 1 && groups.map((g) => (
          <section key={g} className="mb-8" aria-label={g}>
            <h2 className="eyebrow">{g}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {BOOKABLE.filter((b) => b.group === g).map((b) => (
                <button key={b.id} type="button" onClick={() => choose(b)} className="card card-hover flex flex-col p-5 text-left">
                  <span className="flex items-start justify-between gap-3"><span className="font-display text-lg font-bold text-navy">{b.name}</span><span className="shrink-0 font-display text-lg font-extrabold text-brand">{b.price ? `${b.options ? "From " : ""}$${b.price}` : "Quote"}</span></span>
                  <span className="mt-1 text-sm text-slate-600">{b.summary}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    {b.modes.map((m) => <span key={m} className="rounded-full bg-surface px-2 py-1 text-navy/70">{MODE_LABEL[m]}</span>)}
                    <span className={`rounded-full px-2 py-1 ${b.pay === "quote" ? "bg-amber-50 text-amber-900" : "bg-brand-soft text-brand-dark"}`}>{b.pay === "quote" ? (b.provider === "partner" ? "Partner · quote first" : "Assessment first") : "Pay online after confirmation"}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        {step === 2 && svc && (
          <div className="card space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">{svc.group}</p><h2 className="mt-1 font-display text-2xl font-bold text-navy">{svc.name}</h2><p className="mt-1 text-sm text-slate-600">{svc.summary}</p></div>
              <button type="button" onClick={() => setStep(1)} className="shrink-0 text-sm font-semibold text-brand hover:underline">Change</button>
            </div>
            {svc.options && (
              <fieldset>
                <legend className="text-sm font-semibold text-navy">Choose your IV</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {svc.options.map((o) => (
                    <label key={o.id} className={`flex cursor-pointer items-start justify-between gap-3 rounded-xl border-2 p-3 text-sm transition ${opt === o.id ? "border-brand bg-brand-soft" : "border-line hover:border-slate-300"}`}>
                      <span className="flex gap-2"><input type="radio" name="opt" className="mt-1" checked={opt === o.id} onChange={() => setOpt(o.id)} /><span><b className="block text-navy">{o.name}</b>{o.note && <span className="text-xs text-slate-500">{o.note}</span>}</span></span>
                      <span className="font-bold text-brand">${o.price}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {svc.modes.length > 1 && (
              <fieldset>
                <legend className="text-sm font-semibold text-navy">Where</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {svc.modes.map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); setTime(""); }} className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold ${mode === m ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-navy"}`}>{MODE_LABEL[m]}</button>)}
                </div>
              </fieldset>
            )}
            <div>
              <p className="text-sm font-semibold text-navy">Preferred date</p>
              <div className="mt-2 max-w-sm select-none">
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" aria-label="Previous month" disabled={cy === now.y && cm === now.m} onClick={() => { const x = new Date(cy, cm - 1, 1); setCy(x.getFullYear()); setCm(x.getMonth()); }} className="h-9 w-9 rounded-full bg-surface text-lg disabled:opacity-30">‹</button>
                  <b className="text-navy">{MONTHS[cm]} {cy}</b>
                  <button type="button" aria-label="Next month" disabled={iso(cy, cm + 1, 1) > lastIso} onClick={() => { const x = new Date(cy, cm + 1, 1); setCy(x.getFullYear()); setCm(x.getMonth()); }} className="h-9 w-9 rounded-full bg-surface text-lg disabled:opacity-30">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {WD.map((w) => <div key={w} className="py-1 text-[11px] font-bold text-slate-400">{w}</div>)}
                  {Array.from({ length: new Date(cy, cm, 1).getDay() }, (_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: new Date(cy, cm + 1, 0).getDate() }, (_, i) => {
                    const s = iso(cy, cm, i + 1), dis = s < todayIso || s > lastIso;
                    return <button key={s} type="button" disabled={dis} aria-pressed={date === s} aria-label={dlabel(s)} onClick={() => { setDate(s); setTime(""); }} className={`aspect-square rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 ${date === s ? "bg-brand text-white" : "hover:bg-surface"} ${s === todayIso && date !== s ? "ring-2 ring-inset ring-brand/40" : ""}`}>{i + 1}</button>;
                  })}
                </div>
              </div>
            </div>
            {date && mode && (
              <div>
                <p className="text-sm font-semibold text-navy">Preferred time <span className="font-normal text-slate-500">(Cabo time)</span></p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {date === todayIso && <button type="button" aria-pressed={time === "ASAP"} onClick={() => setTime("ASAP")} className={`col-span-3 rounded-lg border-2 py-2.5 text-sm font-bold sm:col-span-5 ${time === "ASAP" ? "border-brand bg-brand-soft" : "border-line"}`}>As soon as possible</button>}
                  {hours.map((h) => { const v = `${pad(h)}:00`; return <button key={v} type="button" aria-pressed={time === v} onClick={() => setTime(v)} className={`rounded-lg border-2 py-2.5 text-sm font-semibold ${time === v ? "border-brand bg-brand-soft" : "border-line hover:border-slate-300"}`}>{hlabel(h)}</button>; })}
                </div>
                <p className="mt-2 text-xs text-slate-500">These are preferences: the team confirms the exact time before anything is charged.</p>
              </div>
            )}
            {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>}
            <button type="button" onClick={toDetails} className="btn btn-primary w-full sm:w-auto">Continue</button>
          </div>
        )}

        {step === 3 && svc && (
          <form onSubmit={submit} noValidate className="card grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="font-display text-2xl font-bold text-navy sm:col-span-2">Your details</h2>
            <div><label htmlFor="b-name" className="text-sm font-medium text-navy">Full name</label><input id="b-name" autoComplete="name" className="field mt-1" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></div>
            <div><label htmlFor="b-phone" className="text-sm font-medium text-navy">WhatsApp or phone</label><input id="b-phone" type="tel" autoComplete="tel" className="field mt-1" placeholder="+1 555 123 4567" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} /></div>
            <div className="sm:col-span-2"><label htmlFor="b-email" className="text-sm font-medium text-navy">Email <span className="font-normal text-slate-500">(for your receipt, optional)</span></label><input id="b-email" type="email" autoComplete="email" className="field mt-1" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
            {mode === "hotel" && (
              <>
                <div><label htmlFor="b-area" className="text-sm font-medium text-navy">Area</label><select id="b-area" className="field mt-1" value={d.area} onChange={(e) => setD({ ...d, area: e.target.value })}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
                <div><label htmlFor="b-place" className="text-sm font-medium text-navy">Hotel and room, villa or address</label><input id="b-place" className="field mt-1" value={d.place} onChange={(e) => setD({ ...d, place: e.target.value })} /></div>
              </>
            )}
            {mode === "clinic" && <p className="rounded-xl bg-surface p-4 text-sm text-slate-600 sm:col-span-2">Clinic in Centro, Cabo San Lucas, 9 am – 5 pm by appointment (other times by appointment too). We send the exact address with the confirmation.</p>}
            {mode === "video" && <p className="rounded-xl bg-surface p-4 text-sm text-slate-600 sm:col-span-2">We send the video link by WhatsApp. You only need a phone with a camera.</p>}
            <p className="text-xs text-slate-500 sm:col-span-2">Please don&apos;t write symptoms or medical details here: the doctor asks you privately.</p>
            {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 sm:col-span-2">{err}</p>}
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button type="submit" disabled={busy} className="btn btn-primary flex-1 sm:flex-none disabled:opacity-60">{busy ? "Sending…" : "Send booking request"}</button>
              {fallback && <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Booking request: ${svc.name} · ${date} ${time} · ${d.name}`)}`} target="_blank" rel="noopener" className="btn btn-wa">Send on WhatsApp</a>}
            </div>
          </form>
        )}
      </div>

      <aside className="h-fit lg:sticky lg:top-28">
        <div className="card p-6">
          <p className="eyebrow">Your booking</p>
          {svc ? (
            <>
              <p className="mt-2 font-display text-xl font-bold text-navy">{svc.name}</p>
              {opt && <p className="text-sm text-slate-600">{svc.options?.find((o) => o.id === opt)?.name}</p>}
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Price</dt><dd className="font-semibold text-navy">{price ? `$${price} USD` : "Quote"}</dd></div>
                {price ? <div className="flex justify-between"><dt className="text-slate-500">Paid online after confirmation</dt><dd className="font-semibold text-navy">{money(price * svc.payNow)}</dd></div> : null}
                {mode && <div className="flex justify-between"><dt className="text-slate-500">Where</dt><dd className="text-navy">{MODE_LABEL[mode]}</dd></div>}
                {date && <div className="flex justify-between"><dt className="text-slate-500">When</dt><dd className="text-navy">{dlabel(date)}{time ? `, ${time === "ASAP" ? "ASAP" : hlabel(+time.split(":")[0])}` : ""}</dd></div>}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">{svc.pay === "quote" ? "Quoted after review. Nothing is charged before you approve." : `Taxes included. ${svc.payNow < 1 ? `A ${Math.round(svc.payNow * 100)}% deposit is paid online once your time is confirmed; the balance after the service.` : "Paid online once your time is confirmed."}`}</p>
              <Link href={svc.page} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">About this service →</Link>
            </>
          ) : <p className="mt-2 text-sm text-slate-600">Choose a service to see the price and how payment works.</p>}
        </div>
        <p className="mt-4 px-2 text-xs text-slate-500">US &amp; Canadian travel insurance: <Link href="/international-insurance" className="font-semibold text-brand">verify before your visit</Link>.</p>
      </aside>
    </div>
  );
}
