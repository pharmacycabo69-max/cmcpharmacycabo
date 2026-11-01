import Link from "next/link";
import { money, type ProductSummary } from "@/lib/products";

export function ProductCard({ p }: { p: ProductSummary }) {
  return (
    <Link href={`/product/${p.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand hover:shadow-sm">
      <div className="flex aspect-square items-center justify-center bg-white p-4">
        {p.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={p.name} width={300} height={300} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-slate-100 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:text-brand">{p.name}</h3>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="font-semibold text-slate-900">{money(p.price)}</span>
          {p.onSale && <span className="text-xs text-slate-400 line-through">{money(p.regular)}</span>}
        </p>
      </div>
    </Link>
  );
}
