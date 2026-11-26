import crypto from "node:crypto";
import { kv } from "@/lib/server/store";

/**
 * Operational records: pharmacy requests and medical bookings, one per folio.
 * Full customer data lives only here (the internal system); notifications carry the folio and a link.
 */
export const BRAND = "CMC Pharmacy";
export type Kind = "pharmacy" | "booking";
export type Status =
  | "received" // saved, team notified
  | "in_review" // concierge working on it
  | "quote_sent" // price / availability sent to the customer
  | "confirmed" // availability confirmed, conditions accepted
  | "payment_link_sent"
  | "paid"
  | "payment_failed"
  | "completed"
  | "cancelled"
  | "refunded";
export type RecordEvent = { at: string; type: string; status: Status; by: string; note?: string; amountCents?: number };
export type Item = { id: number; name: string; qty: number; unitCents: number; rx: boolean };
export type Rec = {
  folio: string;
  kind: Kind;
  brand: string;
  lang: "en" | "es";
  createdAt: string;
  status: Status;
  /** Random key that lets the customer see the status of this folio (never the full record). */
  trackKey: string;
  contact: { name: string; phone: string; email?: string };
  delivery?: { area: string; place: string; window?: string; instructions?: string };
  items?: Item[];
  notFound?: string; // pharmacy: products requested by name
  rxAnswer?: "have" | "need";
  service?: { id: string; option?: string; mode: string; date: string; time: string; people?: number };
  /** Server-computed. Fixed-price services: list price. Quote services and pharmacy: set by the concierge. */
  expectedCents?: number;
  deliveryFeeCents?: number;
  payment?: { sessionId?: string; status: "pending" | "paid" | "failed" | "expired" | "refunded" | "partially_refunded"; amountCents?: number; currency?: string; paymentIntent?: string; updatedAt: string };
  assignedTo?: string;
  events: RecordEvent[];
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const rand = (n: number) => [...crypto.randomBytes(n)].map((b) => ALPHABET[b % ALPHABET.length]).join("");
/** Folio: CMC-P-YYMMDD-XXXXX (pharmacy) / CMC-B-YYMMDD-XXXXX (booking), generated on the server. */
export function newFolio(kind: Kind, now = new Date()) {
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mazatlan", year: "2-digit", month: "2-digit", day: "2-digit" }).format(now).replace(/-/g, "");
  return `CMC-${kind === "pharmacy" ? "P" : "B"}-${d}-${rand(5)}`;
}
export const FOLIO_RE = /^CMC-[PB]-\d{6}-[A-Z2-9]{5}$/;
export const newTrackKey = () => crypto.randomBytes(12).toString("base64url");

const key = (folio: string) => `rec:${folio}`;

export async function createRecord(r: Omit<Rec, "folio" | "createdAt" | "status" | "trackKey" | "events" | "brand">): Promise<Rec> {
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const rec: Rec = { ...r, brand: BRAND, folio: newFolio(r.kind, now), createdAt: now.toISOString(), status: "received", trackKey: newTrackKey(), events: [{ at: now.toISOString(), type: "created", status: "received", by: "customer" }] };
    // NX: a folio is never overwritten; retry on the (unlikely) collision
    if (await kv.set(key(rec.folio), JSON.stringify(rec), { nx: true })) {
      await kv.pipeline([["ZADD", "cmc:idx:all", now.getTime(), rec.folio], ["ZADD", `cmc:idx:status:${rec.status}`, now.getTime(), rec.folio]]);
      return rec;
    }
  }
  throw new Error("folio_collision");
}

export async function getRecord(folio: string): Promise<Rec | null> {
  if (!FOLIO_RE.test(folio)) return null;
  const v = await kv.get(key(folio));
  return v ? (JSON.parse(v) as Rec) : null;
}

export async function updateRecord(folio: string, patch: Partial<Rec>, ev: Omit<RecordEvent, "at" | "status"> & { status?: Status }): Promise<Rec> {
  const cur = await getRecord(folio);
  if (!cur) throw new Error("not_found");
  const status = ev.status ?? patch.status ?? cur.status;
  const next: Rec = { ...cur, ...patch, status, events: [...cur.events, { ...ev, status, at: new Date().toISOString() }] };
  await kv.set(key(folio), JSON.stringify(next));
  if (status !== cur.status) {
    await kv.pipeline([["ZREM", `cmc:idx:status:${cur.status}`, folio], ["ZADD", `cmc:idx:status:${status}`, Date.parse(cur.createdAt), folio]]);
  }
  return next;
}

export async function listRecords(status?: Status, limit = 100): Promise<Rec[]> {
  const ids = await kv.zrevrange(status ? `idx:status:${status}` : "idx:all", 0, limit - 1);
  const vals = await kv.mget(ids.map(key));
  return vals.filter((v): v is string => !!v).map((v) => JSON.parse(v) as Rec);
}

/** Public, minimal view for the customer tracking page: no contact data. */
export function publicView(r: Rec) {
  return { folio: r.folio, kind: r.kind, status: r.status, createdAt: r.createdAt, service: r.service ? { id: r.service.id, option: r.service.option, date: r.service.date, time: r.service.time } : undefined, items: r.items?.map((i) => ({ name: i.name, qty: i.qty })), expectedCents: r.expectedCents, events: r.events.map((e) => ({ at: e.at, status: e.status, type: e.type })) };
}
