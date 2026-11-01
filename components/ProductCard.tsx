import Link from "next/link";
import { hasPrice, money, type ProductSummary } from "@/lib/products";

export function NoPhoto({ className = "h-full w-full" }: { className?: string }) {
  return (
    <div role="img" aria-label="Photo coming soon" className={`flex ${className} flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 text-slate-300`}>
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true"><rect x="8" y="8" width="48" height="48" rx="12" fill="currentColor" opacity=".35" /><path fill="#fff" d="M28 16h8v12h12v8H36v12h-8V36H16v-8h12z" /></svg>
      <span className="text-[11px] font-medium text-slate-400">Photo coming soon</span>
    </div>
  );
}

export function ProductCard({ p }: { p: ProductSummary }) {
  return (
    <Link href={`/product/${p.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand hover:shadow-sm">
      <div className="flex aspect-square items-center justify-center bg-white p-4">
        {p.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={p.name} width={300} height={300} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        ) : (
          <NoPhoto />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:text-brand">{p.name}</h3>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="font-semibold text-slate-900">{hasPrice(p) ? money(p.price) : <span className="text-sm font-medium text-brand">Ask for price</span>}</span>
          {hasPrice(p) && p.onSale && <span className="text-xs text-slate-400 line-through">{money(p.regular)}</span>}
        </p>
      </div>
    </Link>
  );
}
