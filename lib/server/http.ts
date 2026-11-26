import { NextResponse } from "next/server";
import { kv, storeReady } from "@/lib/server/store";

/** JSON response that is never cached or indexed. */
export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });

export const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Simple per-IP rate limit (10 submissions per 10 minutes). Fails open if the store is down: storage errors are handled by the caller. */
export async function rateLimited(req: Request, bucket: string, max = 10) {
  if (!storeReady()) return false;
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const k = `cmc:rl:${bucket}:${ip}:${Math.floor(Date.now() / 600_000)}`;
  try {
    const [n] = await kv.pipeline<number>([["INCR", k], ["EXPIRE", k, 900]]);
    return Number(n) > max;
  } catch { return false; }
}

/** Same-origin check for browser POSTs (CSRF defence in addition to SameSite cookies). */
export function sameOrigin(req: Request) {
  const o = req.headers.get("origin");
  if (!o) return true;
  try { return new URL(o).host === new URL(req.url).host; } catch { return false; }
}
