"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type IvItem = { id: string; name: string; category: string; tagline: string; price: number; duration: string; image: string; alt: string; formula: string };

const MAX_COMPARE = 3;
const NAD_NOTE = "Evidence for the benefits of IV NAD+ is limited. Our doctor explains what it can and cannot do before you decide.";
const bookHref = (id: string, people: number) => (id === "nad-performance" ? `/book?service=nad&people=${people}` : `/book?service=iv-therapy&option=${encodeURIComponent(id)}&people=${people}`);

/**
 * Interactive IV menu (V5 §7): category filter, compare up to 3, number of people with the total at list
 * price. No symptom-based recommendation; group discounts are not published (pending validation).
 */
export function IvMenu({ items }: { items: IvItem[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [cat, setCat] = useState("All");
  const [people, setPeople] = useState(1);
  const [cmp, setCmp] = useState<string[]>([]);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);
  const toggle = (id: string) => setCmp((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= MAX_COMPARE ? c : [...c, id]));
  const compared = items.filter((i) => cmp.includes(i.id));
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-line md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filter IV menu">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${cat === c ? "bg-navy text-white" : "bg-surface text-navy hover:bg-brand-soft"}`}>{c}</button>)}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="iv-people" className="text-sm font-medium text-navy">People</label>
          <div className="flex items-center rounded-xl ring-1 ring-line">
            <button type="button" aria-label="One person less" onClick={() => setPeople((p) => Math.max(1, p - 1))} className="h-10 w-10 text-lg text-navy">−</button>
            <input id="iv-people" inputMode="numeric" value={people} onChange={(e) => setPeople(Math.max(1, Math.min(10, Number(e.target.value.replace(/\D/g, "")) || 1)))} className="h-10 w-10 text-center text-sm font-semibold" />
            <button type="button" aria-label="One person more" onClick={() => setPeople((p) => Math.min(10, p + 1))} className="h-10 w-10 text-lg text-navy">+</button>
          </div>
        </div>
      </div>
      {people > 1 && <p className="mt-2 text-xs text-slate-500">Totals shown at list price for {people} people. Group discounts are not published; conditions are confirmed case by case.</p>}

      <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((d, i) => (
          <li key={d.id} className="card card-hover flex flex-col overflow-hidden">
            <Image src={d.image} alt={d.alt} width={768} height={768} loading={i < 3 ? "eager" : "lazy"} sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-brand">{d.category}</p><h3 className="mt-1 font-display text-xl font-bold text-navy">{d.name}</h3></div>
                <p className="text-right"><span className="block font-display text-2xl font-extrabold text-navy">${d.price * people}</span><span className="text-[11px] text-slate-500">{people > 1 ? `$${d.price} × ${people}` : "per person"}</span></p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{d.tagline}</p>
              <dl className="mt-3 space-y-1 text-sm"><div className="flex gap-2"><dt className="text-slate-500">Duration</dt><dd className="text-navy">{d.duration}</dd></div><div className="flex gap-2"><dt className="text-slate-500">Formula</dt><dd className="text-navy">{d.formula}</dd></div></dl>
              {d.id === "nad-performance" && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-950">{NAD_NOTE}</p>}
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <Link href={bookHref(d.id, people)} className="btn btn-primary !py-2.5">Book</Link>
                <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" checked={cmp.includes(d.id)} disabled={!cmp.includes(d.id) && cmp.length >= MAX_COMPARE} onChange={() => toggle(d.id)} />Compare</label>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {compared.length > 1 && (
        <section className="card mt-8 overflow-x-auto p-5" aria-labelledby="iv-cmp">
          <h3 id="iv-cmp" className="font-display text-lg font-bold text-navy">Compare</h3>
          <table className="mt-3 w-full min-w-[32rem] text-left text-sm">
            <thead><tr><th className="py-2 pr-4 text-slate-500" scope="col">&nbsp;</th>{compared.map((c) => <th key={c.id} scope="col" className="py-2 pr-4 font-semibold text-navy">{c.name}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              <tr><th scope="row" className="py-2 pr-4 text-slate-500">Price{people > 1 ? ` (${people})` : ""}</th>{compared.map((c) => <td key={c.id} className="py-2 pr-4 font-semibold">${c.price * people}</td>)}</tr>
              <tr><th scope="row" className="py-2 pr-4 text-slate-500">Duration</th>{compared.map((c) => <td key={c.id} className="py-2 pr-4">{c.duration}</td>)}</tr>
              <tr><th scope="row" className="py-2 pr-4 text-slate-500">About</th>{compared.map((c) => <td key={c.id} className="py-2 pr-4">{c.tagline}</td>)}</tr>
              <tr><th scope="row" className="py-2 pr-4 text-slate-500">Formula</th>{compared.map((c) => <td key={c.id} className="py-2 pr-4">{c.formula}</td>)}</tr>
              <tr><td />{compared.map((c) => <td key={c.id} className="py-3 pr-4"><Link href={bookHref(c.id, people)} className="font-semibold text-brand hover:underline">Book →</Link></td>)}</tr>
            </tbody>
          </table>
        </section>
      )}
      <p className="mt-6 text-xs leading-relaxed text-slate-500">Every IV requires a medical assessment of suitability first. We don&apos;t recommend treatments from symptoms online, and IV therapy is not a substitute for medical care. Not an emergency service: call 911.</p>
    </div>
  );
}
