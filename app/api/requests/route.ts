import { products, isControlled, isRx } from "@/lib/products";
import { json, rateLimited, sameOrigin, str } from "@/lib/server/http";
import { notify } from "@/lib/server/notify";
import { createRecord, type Item } from "@/lib/server/records";
import { storeReady } from "@/lib/server/store";
import { SITE } from "@/lib/site";

/**
 * POST /api/requests — pharmacy request (V5 §5). Nothing is charged.
 * 1) validate, 2) prices and prescription flags from the server catalog, 3) save (folio) BEFORE answering,
 * 4) notify CRM/email/WhatsApp (failures queued for retry). If saving fails, no confirmation is returned.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!storeReady()) return json({ error: "storage_unavailable" }, 503);
  if (await rateLimited(req, "req")) return json({ error: "too_many_requests" }, 429);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  if (str(b.website, 5)) return json({ ok: true }, 200); // honeypot

  const name = str(b.name, 80), phone = str(b.phone, 40), email = str(b.email, 120), place = str(b.place, 160), area = str(b.area, 40);
  const notFound = str(b.notFound, 400);
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 40) : [];
  const items: Item[] = [];
  for (const it of rawItems as { id?: unknown; qty?: unknown }[]) {
    const p = products.find((x) => x.id === Number(it?.id));
    const qty = Math.max(1, Math.min(20, Math.floor(Number(it?.qty) || 1)));
    if (!p || isControlled(p)) continue; // controlled medicines are never requested online
    items.push({ id: p.id, name: p.name, qty, unitCents: Math.round(p.price * 100), rx: isRx(p) });
  }
  if (!name || phone.replace(/\D/g, "").length < 8 || !place) return json({ error: "invalid_contact" }, 400);
  if (!items.length && !notFound) return json({ error: "empty" }, 400);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid_email" }, 400);
  const rxAnswer = b.rx === "have" || b.rx === "need" ? b.rx : undefined;
  if (items.some((i) => i.rx) && !rxAnswer) return json({ error: "rx_answer_required" }, 400);

  let rec;
  try {
    rec = await createRecord({
      kind: "pharmacy", lang: b.lang === "es" ? "es" : "en",
      contact: { name, phone, email: email || undefined },
      delivery: { area: area || "Not specified", place, window: str(b.window, 60), instructions: str(b.instructions, 200) },
      items, notFound: notFound || undefined, rxAnswer,
    });
  } catch (e) {
    console.error("request save failed", (e as Error).message);
    return json({ error: "storage_unavailable" }, 503);
  }
  const subtotal = items.reduce((s, i) => s + i.unitCents * i.qty, 0);
  await notify("pharmacy_request", rec, { amountCents: subtotal || undefined, detail: `${items.length} item(s)${notFound ? " + products by name" : ""}${subtotal >= SITE.freeDeliveryFrom * 100 ? " · free delivery threshold reached" : " · delivery fee to confirm"}` });
  return json({ folio: rec.folio, track: `/track?f=${rec.folio}&k=${rec.trackKey}`, freeDelivery: subtotal >= SITE.freeDeliveryFrom * 100 });
}
