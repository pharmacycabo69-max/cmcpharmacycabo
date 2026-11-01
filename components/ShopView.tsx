import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { categories, search, topCategories, type Category } from "@/lib/products";
import { JsonLd } from "@/lib/seo";
import { abs } from "@/lib/site";

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
  const chips = category ? categories.filter((c) => c.parent === category.id && c.count > 0) : topCategories().slice(0, 20);
  const crumbs = category ? [{ name: "Shop", href: "/shop" }, { name: category.name, href: base }] : [{ name: "Shop", href: "/shop" }];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={crumbs} />
      {category && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: category.name, url: abs(base), mainEntity: { "@type": "ItemList", itemListElement: res.items.slice(0, 12).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/product/${p.slug}`), name: p.name })) } }} />
      )}
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{category ? category.name : "Pharmacy & health products in Cabo"}</h1>
      <p className="mt-2 text-slate-600">
        {category ? `Shop ${category.name.toLowerCase()} with 24/7 delivery to your hotel or villa in Los Cabos.` : "Medications, vitamins, personal care and health essentials, delivered 24/7 in Cabo San Lucas and San José del Cabo."}{" "}
        <span className="text-slate-400">{res.total.toLocaleString()} products</span>
      </p>

      <form action={base} className="mt-6 flex flex-wrap gap-3" role="search">
        <label className="sr-only" htmlFor="q">Search products</label>
        <input id="q" name="q" defaultValue={params.q} placeholder="Search products…" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand" />
        <label className="sr-only" htmlFor="sort">Sort</label>
        <select id="sort" name="sort" defaultValue={params.sort ?? ""} className="rounded-lg border border-slate-300 bg-white px-3 text-sm">
          <option value="">Default order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </form>

      {chips.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c.id}><Link href={`/product-category/${c.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-brand hover:text-brand">{c.name} <span className="text-slate-400">({c.count})</span></Link></li>
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
    </div>
  );
}
