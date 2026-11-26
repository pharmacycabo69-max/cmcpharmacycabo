"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type P = { slug: string; name: string; price: number | null; img: string | null; rx: boolean };
type S = { name: string; href: string; price: string };

/**
 * Instant search input (V5 §4): suggestions while typing (bilingual, typo tolerant), keyboard navigation,
 * works as a normal form field without JavaScript (name="q").
 */
export function SearchSuggest({ id, placeholder, className = "", defaultValue = "", lang = "en" }: { id: string; placeholder: string; className?: string; defaultValue?: string; lang?: "en" | "es" }) {
  const [q, setQ] = useState(defaultValue);
  const [res, setRes] = useState<{ products: P[]; services: S[]; total: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const list = useId();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) { setRes(null); return; }
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, { signal: ctl.signal }).then((r) => r.json()).then((j) => { setRes(j); setOpen(true); setActive(-1); }).catch(() => undefined);
    }, 180);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const options = [...(res?.services ?? []).map((s) => ({ href: s.href, label: s.name, sub: s.price, img: null as string | null, rx: false })), ...(res?.products ?? []).map((p) => ({ href: `/product/${p.slug}`, label: p.name, sub: p.price ? `$${p.price.toFixed(2)}` : lang === "es" ? "Precio a consultar" : "Price on request", img: p.img, rx: p.rx }))];
  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !options.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + options.length) % options.length); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); window.location.href = options[active].href; }
    else if (e.key === "Escape") setOpen(false);
  };
  return (
    <div ref={box} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input id={id} name="q" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} onFocus={() => res && setOpen(true)} autoComplete="off" placeholder={placeholder}
        role="combobox" aria-expanded={open && options.length > 0} aria-controls={list} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${list}-${active}` : undefined}
        className="field h-12 w-full" />
      {open && res && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-left shadow-2xl shadow-navy/15">
          {options.length ? (
            <ul id={list} role="listbox" className="max-h-96 overflow-y-auto py-1">
              {options.map((o, i) => (
                <li key={o.href} id={`${list}-${i}`} role="option" aria-selected={i === active}>
                  <Link href={o.href} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${i === active ? "bg-surface" : "hover:bg-surface"}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.img ? <img src={o.img} alt="" width={36} height={36} className="h-full w-full object-contain" /> : <span aria-hidden className="text-brand">→</span>}
                    </span>
                    <span className="min-w-0 flex-1"><span className="line-clamp-1 text-navy">{o.label}</span>{o.rx && <span className="text-[11px] font-semibold text-amber-800">℞ {lang === "es" ? "Requiere receta" : "Prescription required"}</span>}</span>
                    <span className="shrink-0 text-xs font-semibold text-brand">{o.sub}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-600">{lang === "es" ? "Sin coincidencias. Pídelo por nombre en tu solicitud." : "No match. Request it by name in your pharmacy request."} <Link href="/request" className="font-semibold text-brand">{lang === "es" ? "Solicitar" : "Request it"}</Link></p>
          )}
          {res.total > 6 && <p className="border-t border-line px-4 py-2 text-xs text-slate-500">{lang === "es" ? `${res.total} resultados · Enter para ver todos` : `${res.total} results · press Enter to see all`}</p>}
        </div>
      )}
    </div>
  );
}
