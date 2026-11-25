"use client";
/**
 * Pharmacy request cart (V4 §8). Lives only in the visitor's browser (localStorage): no payment, no server,
 * no analytics. The request is sent to the team as one WhatsApp message with a unique ID; the pharmacist then
 * confirms availability, prescription and total. Never store symptoms or health notes here.
 */
import { useSyncExternalStore } from "react";

export type RequestItem = { id: number; slug: string; name: string; price: number; img: string | null; rx: boolean; qty: number };
const KEY = "cmc-request-v1";
const EVT = "cmc-request";
const EMPTY: RequestItem[] = [];
let cache: { raw: string | null; items: RequestItem[] } = { raw: null, items: EMPTY };

function read(): RequestItem[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { return EMPTY; }
  if (raw === cache.raw) return cache.items;
  let items: RequestItem[] = EMPTY;
  try { const v = raw ? JSON.parse(raw) : []; if (Array.isArray(v)) items = v; } catch { /* corrupted: start empty */ }
  cache = { raw, items };
  return items;
}
function write(items: RequestItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* private mode: nothing persists */ }
  window.dispatchEvent(new Event(EVT));
}
const subscribe = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
};

export const useRequest = () => useSyncExternalStore(subscribe, read, () => EMPTY);
export const MAX_QTY = 20;

export function addItem(item: Omit<RequestItem, "qty">, qty = 1) {
  const items = read();
  const found = items.find((i) => i.id === item.id);
  write(found ? items.map((i) => (i.id === item.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i)) : [...items, { ...item, qty }]);
}
export const setQty = (id: number, qty: number) =>
  write(qty <= 0 ? read().filter((i) => i.id !== id) : read().map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)));
export const clearRequest = () => write([]);

/** Short unique reference the team can quote back: CMC-YYMMDD-XXXX (no personal data in it). */
export function newRequestId(now = new Date()) {
  const d = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `CMC-${d}-${[...bytes].map((b) => alphabet[b % alphabet.length]).join("")}`;
}
