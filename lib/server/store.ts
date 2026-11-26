/**
 * Persistent store for requests, bookings, payments and the notification outbox.
 * Backend: Redis over REST (Upstash / Vercel KV). Configure KV_REST_API_URL + KV_REST_API_TOKEN
 * (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Without them, storeReady() is false and the
 * public flows refuse to confirm anything (no fake confirmations, V5 §11).
 */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
/** Keys are namespaced per brand so a shared database can serve several brands later. */
export const NS = "cmc";

export const storeReady = () => !!(URL_ && TOKEN);

type Cmd = (string | number)[];
async function run<T = unknown>(cmds: Cmd[]): Promise<T[]> {
  if (!storeReady()) throw new Error("store_not_configured");
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds.map((c) => c.map(String))),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`store_http_${r.status}`);
  const out = (await r.json()) as { result?: T; error?: string }[];
  const err = out.find((x) => x.error);
  if (err) throw new Error(`store_error_${err.error}`);
  return out.map((x) => x.result as T);
}

export const kv = {
  get: async (key: string) => (await run<string | null>([["GET", `${NS}:${key}`]]))[0],
  set: async (key: string, value: string, opts?: { nx?: boolean; ex?: number }) => {
    const c: Cmd = ["SET", `${NS}:${key}`, value];
    if (opts?.nx) c.push("NX");
    if (opts?.ex) c.push("EX", opts.ex);
    return (await run<string | null>([c]))[0] === "OK";
  },
  del: async (key: string) => run([["DEL", `${NS}:${key}`]]),
  zadd: async (key: string, score: number, member: string) => run([["ZADD", `${NS}:${key}`, score, member]]),
  zrem: async (key: string, member: string) => run([["ZREM", `${NS}:${key}`, member]]),
  zrevrange: async (key: string, start: number, stop: number) => (await run<string[]>([["ZREVRANGE", `${NS}:${key}`, start, stop]]))[0] ?? [],
  zrangeByScore: async (key: string, max: number, limit = 50) => (await run<string[]>([["ZRANGEBYSCORE", `${NS}:${key}`, "-inf", max, "LIMIT", 0, limit]]))[0] ?? [],
  mget: async (keys: string[]) => (keys.length ? (await run<(string | null)[]>([["MGET", ...keys.map((k) => `${NS}:${k}`)]]))[0] : []),
  pipeline: run,
};
