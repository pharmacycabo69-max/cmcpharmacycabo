"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchSuggest } from "@/components/SearchSuggest";
import { useRequest } from "@/lib/request";

const WA = "https://wa.me/5216242261023";
type Tab = "medicine" | "doctor" | "iv" | "tests" | "insurance";
const TABS: { id: Tab; label: string }[] = [
  { id: "medicine", label: "Medicine" },
  { id: "doctor", label: "Doctor" },
  { id: "iv", label: "IV & NAD+" },
  { id: "tests", label: "Tests" },
  { id: "insurance", label: "Insurance" },
];
const QUICK = ["Sunscreen", "Electrolytes", "Loperamide", "Allergy", "Ibuprofen", "Motion sickness"];
type Opt = { t: string; s: string; p: string; href: string };
const OPTIONS: Record<"doctor" | "iv" | "tests", Opt[]> = {
  doctor: [
    { t: "Video consultation", s: "From your room, by video", p: "$59", href: "/book?service=video" },
    { t: "Walk-in consultation", s: "Our clinic in Centro", p: "$99", href: "/book?service=walk-in" },
    { t: "Home doctor", s: "Hotel, villa or home", p: "$189", href: "/book?service=home-doctor" },
  ],
  iv: [
    { t: "IV therapy", s: "Hydration, recovery, jet lag…", p: "$159", href: "/book?service=iv-therapy" },
    { t: "Total Wellness IV", s: "Most complete vitamin IV", p: "$189", href: "/book?service=iv-therapy&option=myers-cocktail-classic" },
    { t: "NAD+ therapy", s: "NAD+ with hydration", p: "$279", href: "/book?service=nad" },
  ],
  tests: [
    { t: "Laboratory tests", s: "Blood, urine, stool", p: "Quote", href: "/book?service=lab" },
    { t: "X-ray", s: "With a partner center", p: "Quote", href: "/book?service=imaging" },
    { t: "Doctor first", s: "Not sure which test?", p: "$59", href: "/book?service=video" },
  ],
};

/** Delivery window from the published hours (8:00–23:30, Cabo time). A schedule, not live staffing. Requests are received 24/7. */
function useDeliveryWindow() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Mazatlan", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const m = Number(p.hour) * 60 + Number(p.minute);
    setLabel(m >= 8 * 60 && m < 23 * 60 + 30 ? "Delivery hours now · until 11:30 pm" : "Delivery starts at 8 am · requests received 24/7");
  }, []);
  return label;
}

/** Hero "concierge console": one panel to start any request (V4 §5.1 items 2–4). Every option opens a real flow. */
export function ConciergeConsole() {
  const [tab, setTab] = useState<Tab>("medicine");
  const window_ = useDeliveryWindow();
  const n = useRequest().reduce((s, i) => s + i.qty, 0);
  return (
    <div className="mt-7 overflow-hidden rounded-3xl bg-navy text-white shadow-2xl shadow-navy/30 ring-1 ring-white/10">
      <div role="tablist" aria-label="What do you need?" className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 pt-2">
        {TABS.map((t) => (
          <button key={t.id} role="tab" type="button" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-white text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="bg-white p-4 text-navy sm:p-5">
        {tab === "medicine" && (
          <>
            <form action="/search" role="search" className="flex gap-2">
              <SearchSuggest id="cc-q" placeholder="Medicine, brand or active ingredient" className="min-w-0 flex-1" />
              <button className="btn btn-primary h-12 px-5">Search</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {QUICK.map((q) => <Link key={q} href={`/search?q=${encodeURIComponent(q)}`} className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-navy hover:bg-brand-soft hover:text-brand-dark">{q}</Link>)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href="/request" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-semibold hover:border-brand">My request{n > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{n}</span>}<span aria-hidden className="text-brand">→</span></Link>
              <a href={`${WA}?text=${encodeURIComponent("Hi! I'd like to check availability of some medicines. I'll send a list or a photo.")}`} target="_blank" rel="noopener" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-semibold hover:border-brand">Send a list or photo<span aria-hidden className="text-brand">→</span></a>
            </div>
          </>
        )}
        {(tab === "doctor" || tab === "iv" || tab === "tests") && (
          <ul className="grid gap-2 sm:grid-cols-3">
            {OPTIONS[tab].map((o) => (
              <li key={o.t}>
                <Link href={o.href} className="group flex h-full flex-col rounded-2xl border border-line p-4 transition hover:border-brand hover:bg-brand-soft/40">
                  <span className="font-display text-2xl font-extrabold text-brand">{o.p}</span>
                  <span className="mt-1 font-semibold">{o.t}</span>
                  <span className="text-xs text-slate-500">{o.s}</span>
                  <span className="mt-3 text-xs font-semibold text-brand group-hover:underline">{o.p === "Quote" ? "Request quote →" : "Book →"}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {tab === "insurance" && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">US &amp; Canadian health and travel insurance, subject to policy verification and coverage confirmation before your visit.</p>
            <Link href="/international-insurance" className="btn btn-primary shrink-0">Verify my insurance</Link>
          </div>
        )}
      </div>
      <p className="flex items-center gap-2 px-5 py-3 text-xs text-white/75"><span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />{window_ || "Delivery 8 am – 11:30 pm · requests 24/7"}<span className="ml-auto hidden sm:inline">Prices in USD, taxes included</span></p>
    </div>
  );
}
