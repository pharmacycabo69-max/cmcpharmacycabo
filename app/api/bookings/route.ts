import { getBookable, priceOf, type Mode } from "@/lib/booking";
import { json, rateLimited, sameOrigin, str } from "@/lib/server/http";
import { notify, type EventType } from "@/lib/server/notify";
import { createRecord } from "@/lib/server/records";
import { storeReady } from "@/lib/server/store";

/**
 * POST /api/bookings — medical booking request (V5 §9). Saved with a server folio before answering.
 * Fixed-price services store the list price as the expected amount; quote services wait for the concierge.
 * No availability is promised: the concierge confirms it, then issues a signed payment link.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!storeReady()) return json({ error: "storage_unavailable" }, 503);
  if (await rateLimited(req, "book")) return json({ error: "too_many_requests" }, 429);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  if (str(b.website, 5)) return json({ ok: true }, 200);

  const svc = getBookable(str(b.service, 40));
  if (!svc) return json({ error: "invalid_service" }, 400);
  const option = str(b.option, 60);
  if (option && !svc.options?.some((o) => o.id === option)) return json({ error: "invalid_option" }, 400);
  const mode = str(b.mode, 10) as Mode;
  if (!svc.modes.includes(mode)) return json({ error: "invalid_mode" }, 400);
  const date = str(b.date, 10), time = str(b.time, 5);
  const d = Date.parse(`${date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !(d > Date.now() - 2 * 864e5 && d < Date.now() + 120 * 864e5) || !/^(ASAP|\d{2}:00)$/.test(time)) return json({ error: "invalid_time" }, 400);
  const name = str(b.name, 80), phone = str(b.phone, 40), email = str(b.email, 120), place = str(b.place, 160), area = str(b.area, 40);
  if (!name || phone.replace(/\D/g, "").length < 8 || (mode === "hotel" && !place)) return json({ error: "invalid_contact" }, 400);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid_email" }, 400);

  const price = svc.pay === "online_after_confirmation" ? priceOf(svc, option || undefined) : null;
  let rec;
  try {
    rec = await createRecord({
      kind: "booking", lang: b.lang === "es" ? "es" : "en",
      contact: { name, phone, email: email || undefined },
      delivery: mode === "hotel" ? { area: area || "Not specified", place } : undefined,
      service: { id: svc.id, option: option || undefined, mode, date, time },
      expectedCents: price ? Math.round(price * 100) : undefined,
    });
  } catch (e) {
    console.error("booking save failed", (e as Error).message);
    return json({ error: "storage_unavailable" }, 503);
  }
  const type: EventType = svc.id === "imaging" ? "xray_request" : svc.id === "lab" ? "lab_request" : "booking_request";
  await notify(type, rec, { amountCents: rec.expectedCents, detail: `${mode} · ${date} ${time}` /* service details stay in the internal record */ });
  if (svc.pay === "quote") await notify("quote_pending", rec);
  return json({ folio: rec.folio, track: `/track?f=${rec.folio}&k=${rec.trackKey}` });
}
