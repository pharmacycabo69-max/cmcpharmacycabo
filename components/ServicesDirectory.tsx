"use client";

import Link from "next/link";
import { useState } from "react";

export type DirItem = { id: string; name: string; group: string; summary: string; price: string; tags: string[]; cta: string; href: string; more?: string };

/** Filterable service directory. Filters are buttons (aria-pressed); everything is in the HTML for crawlers. */
export function ServicesDirectory({ items, groups }: { items: DirItem[]; groups: string[] }) {
  const [g, setG] = useState("All");
  const shown = g === "All" ? items : items.filter((i) => i.group === g);
  return (
    <>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filter services">
        {["All", ...groups].map((x) => (
          <button key={x} type="button" aria-pressed={g === x} onClick={() => setG(x)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${g === x ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line hover:ring-brand"}`}>
            {x}{x !== "All" && <span className="ml-1.5 text-xs opacity-60">{items.filter((i) => i.group === x).length}</span>}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{shown.length} services shown</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.id} className="card card-hover flex flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow">{s.group}</p>
              <p className="shrink-0 font-display text-2xl font-extrabold text-navy">{s.price}</p>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-navy">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {s.tags.map((t) => <li key={t} className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-navy/70">{t}</li>)}
            </ul>
            <div className="mt-5 flex items-center gap-4">
              <Link href={s.href} className="btn btn-primary !py-2.5">{s.cta}</Link>
              {s.more && <Link href={s.more} className="text-sm font-semibold text-brand hover:underline">Details</Link>}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
