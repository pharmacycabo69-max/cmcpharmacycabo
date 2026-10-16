import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categories, search, topCategories, type Category } from "@/lib/products";

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
  const subs = category ? categories.filter((c) => c.parent === category.id && c.count > 0) : [];
  const tops = category ? subs : topCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-4xl">{category?.name ?? "Shop"}</h1>
      <p className="mt-1 text-sm text-muted">{res.total.toLocaleString()} products</p>

      <form action={base} className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={params.q} placeholder="Search products…" className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-mint" />
        <select name="sort" defaultValue={params.sort ?? ""} className="rounded-xl border border-line bg-surface px-3 text-sm">
          <option value="">Default order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button className="btn btn-mint">Search</button>
      </form>

      {tops.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tops.slice(0, 24).map((c) => (
            <Link key={c.id} href={`/product-category/${c.slug}`} className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-mint hover:text-mint">
              {c.name} <span className="opacity-60">({c.count})</span>
            </Link>
          ))}
        </div>
      )}

      {res.items.length === 0 ? (
        <p className="mt-12 text-center text-muted">No products found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {res.items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}

      {res.pages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4 text-sm">
          {res.page > 1 && <Link href={href(res.page - 1)} className="btn btn-ghost !py-2">← Previous</Link>}
          <span className="text-muted">Page {res.page} of {res.pages}</span>
          {res.page < res.pages && <Link href={href(res.page + 1)} className="btn btn-ghost !py-2">Next →</Link>}
        </nav>
      )}
    </div>
  );
}
