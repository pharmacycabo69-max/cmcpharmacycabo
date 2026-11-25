import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { posts } from "@/lib/content";
import { search } from "@/lib/products";
import { searchServices } from "@/lib/services";
import { SITE } from "@/lib/site";

type SP = { q?: string; area?: string };

/** Internal results are never indexed (V4 §5.1). */
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { q = "", area = "" } = await searchParams;
  const term = q.trim().slice(0, 80);
  const services = term ? searchServices(term) : [];
  const products = term ? search({ q: term }) : { items: [], total: 0 };
  const words = term.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const guides = words.length ? posts().filter((p) => words.every((w) => `${p.title} ${p.description}`.toLowerCase().includes(w))).slice(0, 4) : [];
  const wa = `${SITE.whatsapp}?text=${encodeURIComponent("Hi! I'm looking for something I couldn't find on the website.")}`;

  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10">
      <Breadcrumbs items={[{ name: "Search", href: "/search" }]} />
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">{term ? <>Results for “{term}”</> : "Search products and services"}</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-2xl gap-2">
        <label htmlFor="sq" className="sr-only">Search</label>
        <input id="sq" name="q" defaultValue={term} placeholder="Medicine, product or service" className="field" />
        {area && <input type="hidden" name="area" value={area} />}
        <button className="btn btn-primary">Search</button>
      </form>
      {area && <p className="mt-3 text-sm text-slate-600">Delivery area: <strong className="text-navy">{area}</strong>. We deliver {SITE.deliveryHours.label}; delivery time is confirmed with your order.</p>}

      {term && services.length > 0 && (
        <section className="mt-10" aria-labelledby="s-services">
          <h2 id="s-services" className="text-lg font-semibold text-navy">Services</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id}><Link href={s.href} className="card card-hover flex h-full items-start justify-between gap-4 p-5">
                <span><span className="block font-semibold text-navy">{s.name}</span><span className="mt-1 block text-sm text-slate-600">{s.short}</span></span>
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">{s.price}</span>
              </Link></li>
            ))}
          </ul>
        </section>
      )}

      {term && (
        <section className="mt-10" aria-labelledby="s-products">
          <div className="flex items-end justify-between gap-4">
            <h2 id="s-products" className="text-lg font-semibold text-navy">Products <span className="font-normal text-slate-500">({products.total.toLocaleString()} in catalog)</span></h2>
            {products.total > 12 && <Link href={`/shop?q=${encodeURIComponent(term)}`} className="text-sm font-semibold text-brand hover:underline">See all →</Link>}
          </div>
          {products.items.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.items.slice(0, 12).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <div className="card mt-4 p-6">
              <p className="font-semibold text-navy">No catalog match for “{term}”.</p>
              <p className="mt-1 text-sm text-slate-600">Our online catalog doesn&apos;t list everything we can source. Ask a pharmacist: send the name or a photo of the box.</p>
              <a href={wa} target="_blank" rel="noopener" className="btn btn-wa mt-4">Ask on WhatsApp</a>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">Availability is confirmed by a pharmacist after you send your request.</p>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-10" aria-labelledby="s-guides">
          <h2 id="s-guides" className="text-lg font-semibold text-navy">Guides</h2>
          <ul className="mt-3 space-y-2">{guides.map((g) => <li key={g.slug}><Link href={`/${g.slug}`} className="text-brand hover:underline">{g.title}</Link></li>)}</ul>
        </section>
      )}
    </div>
  );
}
