"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Hotel = { slug: string; name: string };

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Search box + grid of the hotel pages. If the hotel is not listed, the empty state says we deliver there too. */
export function HotelFinder({ hotels, whatsapp }: { hotels: Hotel[]; whatsapp: string }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = fold(q.trim());
    return n ? hotels.filter((h) => fold(h.name).includes(n)) : hotels;
  }, [q, hotels]);
  const msg = (name: string) => `${whatsapp}?text=${encodeURIComponent(`Hi! I need a pharmacy delivery to ${name || "my hotel"} in Cabo.`)}`;

  return (
    <div>
      <label htmlFor="hotel-q" className="sr-only">Search your hotel</label>
      <div className="relative">
        <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input id="hotel-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type your hotel name…" autoComplete="off"
          className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-teal-100" />
      </div>
      <p className="mt-2 text-sm text-slate-500" aria-live="polite">{list.length} of {hotels.length} hotels shown</p>

      {list.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((h) => (
            <li key={h.slug}>
              <Link href={`/${h.slug}`} className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
                <span className="group-hover:text-brand">{h.name}</span>
                <span aria-hidden className="text-brand transition group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-teal-200 bg-brand-soft p-6 text-center">
          <p className="font-semibold">We deliver there too.</p>
          <p className="mt-1 text-sm text-slate-600">We deliver to every hotel, resort, villa and vacation rental in Los Cabos, even if its page is not listed yet.</p>
          <a href={msg(q.trim())} target="_blank" rel="noopener" className="btn btn-primary mt-4">Order for {q.trim() || "my hotel"} on WhatsApp</a>
        </div>
      )}
    </div>
  );
}
