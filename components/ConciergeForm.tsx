"use client";

import { useState } from "react";

const WA_NUMBER = "5216242261023";
const NEEDS = ["Pharmacy deliveries for guests", "Doctor visits for guests", "IV therapy for guests or groups", "Lab tests or imaging coordination", "Medical support for events or groups"];

/**
 * Corporate contact form for hotels, villas, yachts and concierges (V4 §5). Company data only: it never asks
 * for guest names or health information. Sends one WhatsApp message to the team; nothing is stored.
 */
export function ConciergeForm() {
  const [f, setF] = useState({ company: "", type: "Hotel or resort", contact: "", role: "", phone: "", email: "", needs: [] as string[] });
  const [err, setErr] = useState("");
  const [href, setHref] = useState("");
  const toggle = (n: string) => setF({ ...f, needs: f.needs.includes(n) ? f.needs.filter((x) => x !== n) : [...f.needs, n] });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.company.trim() || !f.contact.trim()) return setErr("Please enter your company and your name.");
    if (f.phone.replace(/\D/g, "").length < 8 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return setErr("Please add a phone or an email so we can reply.");
    setErr("");
    const text = [
      "Partnership request (hotels & concierges)",
      `Company: ${f.company} (${f.type})`,
      `Contact: ${f.contact}${f.role ? `, ${f.role}` : ""}`,
      f.phone && `Phone: ${f.phone}`,
      f.email && `Email: ${f.email}`,
      f.needs.length ? `Interested in: ${f.needs.join("; ")}` : "",
    ].filter(Boolean).join("\n");
    setHref(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`);
  };
  if (href) {
    return (
      <div className="card p-6 md:p-8" role="status">
        <h3 className="font-display text-xl font-bold text-navy">Ready to send</h3>
        <p className="mt-2 text-sm text-slate-600">Tap the button to send your details to our partnerships team on WhatsApp. We reply in English or Spanish.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={href} target="_blank" rel="noopener" className="btn btn-wa">Send on WhatsApp</a>
          <button type="button" className="btn btn-outline" onClick={() => setHref("")}>Edit</button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 md:grid-cols-2 md:p-8" aria-labelledby="b2b-h">
      <h3 id="b2b-h" className="font-display text-xl font-bold text-navy md:col-span-2">Partner with CMC Pharmacy Cabo</h3>
      <div><label htmlFor="b-co" className="text-sm font-medium text-navy">Company or property</label><input id="b-co" autoComplete="organization" className="field mt-1" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></div>
      <div><label htmlFor="b-type" className="text-sm font-medium text-navy">Type</label><select id="b-type" className="field mt-1" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{["Hotel or resort", "Villa or vacation rental manager", "Yacht or charter", "Concierge or travel agency", "Other"].map((t) => <option key={t}>{t}</option>)}</select></div>
      <div><label htmlFor="b-name" className="text-sm font-medium text-navy">Your name</label><input id="b-name" autoComplete="name" className="field mt-1" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></div>
      <div><label htmlFor="b-role" className="text-sm font-medium text-navy">Role <span className="font-normal text-slate-500">(optional)</span></label><input id="b-role" autoComplete="organization-title" className="field mt-1" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></div>
      <div><label htmlFor="b-phone" className="text-sm font-medium text-navy">Phone / WhatsApp</label><input id="b-phone" type="tel" autoComplete="tel" className="field mt-1" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      <div><label htmlFor="b-mail" className="text-sm font-medium text-navy">Email</label><input id="b-mail" type="email" autoComplete="email" className="field mt-1" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium text-navy">What would you like to offer your guests?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {NEEDS.map((n) => <label key={n} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"><input type="checkbox" checked={f.needs.includes(n)} onChange={() => toggle(n)} />{n}</label>)}
        </div>
      </fieldset>
      <p className="text-xs text-slate-500 md:col-span-2">Please don&apos;t include guest names or health information. This form is for business contacts only.</p>
      {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 md:col-span-2">{err}</p>}
      <button className="btn btn-primary md:col-span-2 md:justify-self-start">Continue</button>
    </form>
  );
}
