import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/seo";

type Action = { href: string; label: string; primary?: boolean; external?: boolean };
export type PriceRow = { label: string; price: string; href?: string; note?: string };

/**
 * Shared hero for service pages (same visual language as the home page): deep navy, subtle grid, one H1,
 * clear prices and two actions. The right side is either a real photo or a price board — never stock imagery.
 */
export function ServiceHero({ crumbs, eyebrow, title, lead, actions, points = [], photo, board, boardTitle, lang = "en" }: {
  crumbs: Crumb[]; eyebrow: string; title: ReactNode; lead: ReactNode; actions: Action[]; points?: string[];
  photo?: { src: string; alt: string; caption?: string }; board?: PriceRow[]; boardTitle?: string; lang?: "en" | "es";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_25%_20%,black,transparent_75%)]" />
      <div aria-hidden className="absolute -left-40 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/30 blur-3xl" />
      <div className="mx-auto grid max-w-[76rem] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-14 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-20">
        <div className="min-w-0">
          <Breadcrumbs items={crumbs} tone="dark" home={lang === "es" ? "Inicio" : "Home"} />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-teal-300">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{lead}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {actions.map((a) => {
              const cls = `btn !px-6 !py-3.5 ${a.primary ? "btn-primary" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"}`;
              return a.external
                ? <a key={a.href} href={a.href} target="_blank" rel="noopener" className={cls}>{a.label}</a>
                : <Link key={a.href} href={a.href} className={cls}>{a.label}</Link>;
            })}
          </div>
          {points.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              {points.map((p) => <li key={p} className="rounded-full bg-white/10 px-3 py-1.5 text-white/85 ring-1 ring-white/15">{p}</li>)}
            </ul>
          )}
        </div>
        {photo ? (
          <figure className="relative mx-auto w-full max-w-sm">
            <Image src={photo.src} alt={photo.alt} width={720} height={900} priority sizes="(min-width: 1024px) 384px, 90vw" className="aspect-[4/5] w-full rounded-[2rem] object-cover ring-1 ring-white/15" />
            {photo.caption && <figcaption className="absolute -bottom-4 left-4 right-4 rounded-2xl bg-white p-4 text-sm text-navy shadow-2xl shadow-black/30">{photo.caption}</figcaption>}
          </figure>
        ) : board ? (
          <div className="overflow-hidden rounded-3xl bg-white text-navy shadow-2xl shadow-black/30">
            <p className="border-b border-line px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-brand">{boardTitle ?? (lang === "es" ? "Precios" : "Prices")}</p>
            <ul className="divide-y divide-line">
              {board.map((r) => {
                const body = (
                  <>
                    <span className="min-w-0"><span className="block font-semibold">{r.label}</span>{r.note && <span className="block text-xs text-slate-500">{r.note}</span>}</span>
                    <span className="shrink-0 font-display text-xl font-extrabold text-brand">{r.price}{r.href && <span aria-hidden className="ml-2 text-sm text-navy/30">→</span>}</span>
                  </>
                );
                return <li key={r.label}>{r.href ? <Link href={r.href} className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-surface">{body}</Link> : <div className="flex items-center justify-between gap-4 px-6 py-4">{body}</div>}</li>;
              })}
            </ul>
            <p className="bg-surface px-6 py-3 text-xs text-slate-500">{lang === "es" ? "USD con impuestos incluidos. No es un servicio de urgencias: llama al 911." : "USD, taxes included. Not an emergency service: call 911."}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
