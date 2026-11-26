import { json } from "@/lib/server/http";
import { notify, retryOutbox } from "@/lib/server/notify";
import { listRecords } from "@/lib/server/records";
import { kv, storeReady } from "@/lib/server/store";

/**
 * GET /api/cron/notify — Vercel Cron (vercel.json). Authorization: Bearer CRON_SECRET.
 * 1) retries failed notifications, 2) alerts once about requests still "received" after 30 minutes.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);
  if (!storeReady()) return json({ error: "storage_unavailable" }, 503);
  const retried = await retryOutbox();
  const stale = (await listRecords("received", 100)).filter((r) => Date.now() - Date.parse(r.createdAt) > 30 * 60_000);
  let alerted = 0;
  for (const r of stale) {
    if (await kv.set(`unattended:${r.folio}`, "1", { nx: true, ex: 60 * 60 * 24 * 7 })) { await notify("unattended", r, { detail: "waiting more than 30 minutes" }); alerted++; }
  }
  return json({ retried: retried.length, ok: retried.filter((x) => x.ok).length, unattendedAlerts: alerted });
}
