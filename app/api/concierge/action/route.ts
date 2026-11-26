import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { sameOrigin } from "@/lib/server/http";
import { notify } from "@/lib/server/notify";
import { makePayToken, paymentsEnabled } from "@/lib/server/paylink";
import { getRecord, updateRecord, type Status } from "@/lib/server/records";
import { SITE } from "@/lib/site";

/** Concierge actions on one record. Every change is logged with the staff name and role. */
export async function POST(req: Request) {
  const session = await getSession();
  const f = await req.formData();
  const folio = String(f.get("folio") ?? "");
  const back = (q: Record<string, string>) => NextResponse.redirect(new URL(`/concierge/r/${folio}?${new URLSearchParams(q)}`, req.url), 303);
  if (!session || !sameOrigin(req)) return NextResponse.redirect(new URL("/concierge", req.url), 303);
  const rec = await getRecord(folio);
  if (!rec) return NextResponse.redirect(new URL("/concierge", req.url), 303);
  const by = `${session.name} (${session.role})`;
  const action = String(f.get("action") ?? "");
  const note = String(f.get("note") ?? "").trim().slice(0, 200) || undefined;
  const cents = (k: string) => { const v = Number(String(f.get(k) ?? "").replace(/[^\d.]/g, "")); return Number.isFinite(v) && v > 0 ? Math.round(v * 100) : undefined; };

  switch (action) {
    case "in_review": await updateRecord(folio, {}, { type: "in_review", status: "in_review", by }); break;
    case "assign": await updateRecord(folio, { assignedTo: session.name }, { type: "assigned", by }); break;
    case "quote": {
      const amount = cents("amount");
      if (!amount) return back({ msg: "Enter a valid amount." });
      // Fixed-price services keep their list price: the quote can't change it
      const svcFixed = rec.kind === "booking" && rec.expectedCents && !["imaging", "lab", "nursing", "aesthetics"].includes(rec.service?.id ?? "");
      if (svcFixed && amount !== rec.expectedCents) return back({ msg: "This service has an authorized fixed price; the amount can't be changed." });
      const fee = rec.kind === "pharmacy" ? cents("fee") ?? 0 : undefined;
      const r2 = await updateRecord(folio, { expectedCents: amount + (fee ?? 0), deliveryFeeCents: fee }, { type: "quote_saved", status: "quote_sent", by, amountCents: amount + (fee ?? 0) });
      await notify("quote_pending", r2, { amountCents: r2.expectedCents });
      break;
    }
    case "confirm": {
      const date = String(f.get("date") ?? ""), time = String(f.get("time") ?? "");
      const service = rec.service ? { ...rec.service, date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : rec.service.date, time: /^\d{2}:\d{2}$/.test(time) ? time : rec.service.time } : undefined;
      const r2 = await updateRecord(folio, { service }, { type: "availability_confirmed", status: "confirmed", by, note: service ? `${service.date} ${service.time}` : undefined });
      await notify("availability_confirmed", r2, { amountCents: r2.expectedCents });
      break;
    }
    case "paylink": {
      if (rec.kind !== "booking") return back({ msg: "Pharmacy orders are not charged online." });
      if (!paymentsEnabled()) return back({ msg: "Online payments are disabled (PAYMENTS_ENABLED, Stripe key or PAY_LINK_SECRET missing)." });
      if (!["confirmed", "payment_link_sent"].includes(rec.status) || !rec.expectedCents) return back({ msg: "Confirm availability and the amount first." });
      if (rec.payment?.status === "paid") return back({ msg: "Already paid." });
      const hours = Number(f.get("hours")) || 24;
      const made = makePayToken(rec.folio, rec.expectedCents, hours, rec.lang);
      if (!made) return back({ msg: "Payment links are not configured." });
      const url = `${SITE.url}/pay?t=${made.token}`;
      const r2 = await updateRecord(folio, {}, { type: "payment_link_issued", status: "payment_link_sent", by, amountCents: rec.expectedCents, note: `expires ${new Date(made.payload.exp * 1000).toISOString()}` });
      await notify("payment_link_issued", r2, { amountCents: rec.expectedCents });
      return back({ link: url });
    }
    case "completed": await updateRecord(folio, {}, { type: "completed", status: "completed", by, note }); break;
    case "cancelled": {
      if (!note) return back({ msg: "A reason is required." });
      const r2 = await updateRecord(folio, {}, { type: "cancelled", status: "cancelled", by, note });
      await notify("cancelled", r2, { detail: "see record" });
      break;
    }
    case "refund_recorded": {
      if (session.role !== "admin" || !note) return back({ msg: "Admin only, with a reference." });
      const r2 = await updateRecord(folio, {}, { type: "refund_recorded", status: "refunded" as Status, by, note });
      await notify("refunded", r2);
      break;
    }
    default: return back({ msg: "Unknown action." });
  }
  return back({ msg: "Saved." });
}
