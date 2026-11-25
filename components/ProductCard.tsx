import Link from "next/link";
import { AddToRequest } from "@/components/AddToRequest";
import { hasPrice, isControlled, isRx, money, type ProductSummary } from "@/lib/products";

export function NoPhoto({ className = "h-full w-full" }: { className?: string }) {
  return (
    <div role="img" aria-label="Photo coming soon" className={`flex ${className} flex-col items-center justify-center gap-2 rounded-lg bg-surface text-navy/20`}>
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true"><rect x="8" y="8" width="48" height="48" rx="12" fill="currentColor" /><path fill="#fff" d="M28 16h8v12h12v8H36v12h-8V36H16v-8h12z" /></svg>
      <span className="text-[11px] font-medium text-navy/45">Photo coming soon</span>
    </div>
  );
}

/**
 * Product tile. The whole card links to the product (stretched link); "Add" puts it in the pharmacy request.
 * No stock claims: availability is confirmed by a pharmacist after the request (V4 §5).
 * Controlled medicines cannot be added: they need the original special prescription at the counter.
 */
export function ProductCard({ p }: { p: ProductSummary }) {
  const rx = isRx(p);
  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <div className="flex aspect-square items-center justify-center bg-white p-4">
        {p.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt="" width={300} height={300} loading="lazy" decoding="async" className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <NoPhoto />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-line p-4">
        {rx && <span className="w-fit rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">℞ Prescription required</span>}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-navy">
          <Link href={`/product/${p.slug}`} className="after:absolute after:inset-0 group-hover:text-brand">{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-semibold text-navy">{hasPrice(p) ? money(p.price) : <span className="text-sm font-medium text-brand">Price on request</span>}</span>
          {!isControlled(p) && <AddToRequest size="sm" item={{ id: p.id, slug: p.slug, name: p.name, price: p.price, img: p.img, rx }} />}
        </div>
      </div>
    </article>
  );
}
