import { NextResponse } from "next/server";
import { hasPrice, isControlled, isRx, search } from "@/lib/products";
import { searchServices } from "@/lib/services";

/**
 * GET /api/search?q= — instant suggestions (top products + services). No tracking, no storage of queries.
 * Controlled medicines are never suggested.
 */
export function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) return NextResponse.json({ products: [], services: [] });
  const res = search({ q, page: 1 });
  const products = res.items.filter((p) => !isControlled(p)).slice(0, 6).map((p) => ({ slug: p.slug, name: p.name, price: hasPrice(p) ? p.price : null, img: p.img, rx: isRx(p) }));
  const services = searchServices(q).slice(0, 3).map((s) => ({ name: s.name, href: s.href, price: s.price }));
  return NextResponse.json({ products, services, total: res.total }, { headers: { "Cache-Control": "public, max-age=300", "X-Robots-Tag": "noindex" } });
}
