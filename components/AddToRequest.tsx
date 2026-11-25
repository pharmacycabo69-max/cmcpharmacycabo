"use client";

import Link from "next/link";
import { useState } from "react";
import { addItem, useRequest, type RequestItem } from "@/lib/request";

type Item = Omit<RequestItem, "qty">;

/** "Add to request": no payment; the pharmacist confirms availability, prescription and total afterwards. */
export function AddToRequest({ item, size = "md" }: { item: Item; size?: "sm" | "md" }) {
  const items = useRequest();
  const [flash, setFlash] = useState(false);
  const inCart = items.find((i) => i.id === item.id);
  const add = () => { addItem(item); setFlash(true); setTimeout(() => setFlash(false), 1600); };
  if (size === "sm") {
    return (
      <button type="button" onClick={add} aria-label={`Add ${item.name} to your request`}
        className={`relative z-10 inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg px-3 text-xs font-semibold transition ${inCart ? "bg-brand-soft text-brand-dark ring-1 ring-brand/30" : "bg-navy text-white hover:bg-navy-deep"}`}>
        <span aria-hidden>{flash ? "✓" : "+"}</span>{flash ? "Added" : inCart ? `Added · ${inCart.qty}` : "Add"}
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={add} className="btn btn-primary">
        <span aria-hidden>{flash ? "✓" : "+"}</span> {flash ? "Added to your request" : "Add to request"}
      </button>
      {inCart && <Link href="/request" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">View request ({inCart.qty}) →</Link>}
      <span role="status" aria-live="polite" className="sr-only">{flash ? `${item.name} added to your request` : ""}</span>
    </div>
  );
}

/** Header link with the number of items in the request. */
export function RequestBadge({ className = "" }: { className?: string }) {
  const n = useRequest().reduce((s, i) => s + i.qty, 0);
  return (
    <Link href="/request" aria-label={`Your pharmacy request: ${n} item${n === 1 ? "" : "s"}`}
      className={`relative inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-navy transition hover:border-brand hover:text-brand ${className}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 4h6l1 3h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h3z" /><path d="M12 11v6M9 14h6" /></svg>
      <span className="hidden xl:inline">Request</span>
      {n > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">{n}</span>}
    </Link>
  );
}
