import { NextResponse } from "next/server";
import { COOKIE_NAME, cookieOptions, roleForKey, sessionToken } from "@/lib/server/auth";
import { rateLimited, sameOrigin } from "@/lib/server/http";

/** POST /api/concierge/login (form: key, name). DELETE-like logout with ?logout=1. */
export async function POST(req: Request) {
  const back = (q: string) => NextResponse.redirect(new URL(`/concierge${q}`, req.url), 303);
  if (!sameOrigin(req)) return back("?error=forbidden");
  const f = await req.formData();
  if (f.get("logout")) {
    const r = back("");
    r.cookies.set(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
    return r;
  }
  if (await rateLimited(req, "login", 8)) return back("?error=wait");
  const role = roleForKey(String(f.get("key") ?? ""));
  const name = String(f.get("name") ?? "").trim().slice(0, 40);
  if (!role || !name) return back("?error=denied");
  const r = back("");
  r.cookies.set(COOKIE_NAME, sessionToken(role, name), cookieOptions);
  return r;
}
