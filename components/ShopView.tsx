import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { categories, isIndexableCategory, search, topCategories, type Category } from "@/lib/products";
import { categoryContent, relatedGuides } from "@/lib/category-content";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

type Params = { q?: string; page?: string; sort?: string };

export function ShopView({ base, params, category }: { base: string; params: Params; category?: Category }) {
  const res = search({ q: params.q, cat: category?.id, page: Number(params.page) || 1, sort: params.sort });
  const href = (page: number) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.sort) sp.set("sort", params.sort);
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };
  // Shoppable categories only: supplier taxonomy (brands, import buckets, extended catalog) stays out of navigation (V4 §5)
  const chips = (category ? categories.filter((c) => c.parent === category.id && c.count > 0) : topCategories()).filter(isIndexableCategory).filter((c) => !/^(brands|medicashop|extended)/.test(c.slug)).slice(0, 20);
  const crumbs = category ? [{ name: "Shop", href: "/shop" }, { name: category.name, href: base }] : [{ name: "Shop", href: "/shop" }];
  // Editorial content only on the canonical first page (not on search/sort/paginated variants)
  const content = category && !params.q && !params.sort && res.page === 1 ? categoryContent(category.slug) : undefined;
  const guides = content ? relatedGuides(content) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />
      {category && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: category.name, url: abs(base), mainEntity: { "@type": "ItemList", itemListElement: res.items.slice(0, 12).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/product/${p.slug}`), name: p.name })) } }} />
      )}
      {content && <JsonLd data={faqSchema(content.faq)} />}
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">{category ? categoryContent(category.slug)?.h1 ?? category.name : "Pharmacy & health products in Cabo"}</h1>
      <p className="mt-2 text-slate-600">
        {category ? `Shop ${category.name.toLowerCase()} with delivery to your hotel or villa in Los Cabos, 7 am – 11 pm daily.` : "Medications, vitamins, personal care and health essentials, delivered daily in Cabo San Lucas and San José del Cabo."}{" "}
        <span className="text-slate-500">{res.total.toLocaleString()} items in the catalog · availability confirmed by a pharmacist</span>
      </p>
      {content && (
        <div className="mt-4 max-w-3xl space-y-3 text-[15px] leading-relaxed text-slate-700">
          {content.intro.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
        </div>
      )}

      <form action={base} className="mt-6 grid gap-3 sm:flex" role="search">
        <label className="sr-only" htmlFor="q">Search products</label>
        <input id="q" name="q" defaultValue={params.q} placeholder="Search products…" className="field min-w-0 sm:flex-1" />
        <label className="sr-only" htmlFor="sort">Sort</label>
        <select id="sort" name="sort" defaultValue={params.sort ?? ""} className="field sm:w-52">
          <option value="">Default order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </form>

      {chips.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c.id}><Link href={`/product-category/${c.slug}`} className="inline-block rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy hover:border-brand hover:text-brand">{c.name} <span className="text-slate-400">({c.count})</span></Link></li>
          ))}
        </ul>
      )}

      {res.items.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">No products found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {res.items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}

      {res.pages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4 text-sm">
          {res.page > 1 && <Link href={href(res.page - 1)} rel="prev" className="btn btn-outline !py-2">← Previous</Link>}
          <span className="text-slate-500">Page {res.page} of {res.pages}</span>
          {res.page < res.pages && <Link href={href(res.page + 1)} rel="next" className="btn btn-outline !py-2">Next →</Link>}
        </nav>
      )}

      {!category && !params.q && !params.sort && res.page === 1 && (
        <section className="mt-14" aria-labelledby="how-order">
          <h2 id="how-order" className="text-xl font-semibold">How to order from our Cabo pharmacy</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["1. Send your list", "Tap Order on any product, or send us a photo of what you need on WhatsApp, in English or Spanish. Prescription medicines require a valid prescription."],
              ["2. Confirm the total", `We confirm availability, price and delivery time before we go. Delivery is free on orders of $${SITE.freeDeliveryFrom} or more.`],
              ["3. Receive it", "We deliver to hotels, resorts, villas and homes in Cabo San Lucas and San José del Cabo, every day from 7 am to 11 pm."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-slate-600">
            Looking for prices? See the <Link href="/price-list" className="font-medium text-brand">Cabo pharmacy price list</Link>. Need a prescription? <Link href="/doctor-consultation" className="font-medium text-brand">See an English-speaking doctor</Link> by appointment, or find <Link href="/locations" className="font-medium text-brand">a pharmacy near you</Link>.
          </p>
        </section>
      )}

      {content && (
        <section className="mt-14 max-w-3xl" aria-labelledby="cat-faq">
          <h2 id="cat-faq" className="text-xl font-semibold">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-slate-200 border-y border-line">
            {content.faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Prices for the most requested items are on our <Link href="/price-list" className="font-medium text-brand">Cabo pharmacy price list</Link>.
          </p>
          {guides.length > 0 && (
            <>
              <h2 className="mt-8 text-lg font-semibold">Related guides</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {guides.map((g) => <li key={g.href}><Link href={g.href} className="text-brand hover:underline">{g.title}</Link></li>)}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}
