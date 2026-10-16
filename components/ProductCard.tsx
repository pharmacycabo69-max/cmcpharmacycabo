import Link from "next/link";
import { money, type ProductSummary } from "@/lib/products";

export function ProductCard({ p }: { p: ProductSummary }) {
  return (
    <Link href={`/product/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-mint">
      <div className="aspect-square bg-white">
        {p.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-3" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-mint">{p.name}</h3>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="font-semibold text-mint">{money(p.price)}</span>
          {p.onSale && <span className="text-xs text-muted line-through">{money(p.regular)}</span>}
        </p>
      </div>
    </Link>
  );
}
