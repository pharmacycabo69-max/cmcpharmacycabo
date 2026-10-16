import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, money, products } from "@/lib/products";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const desc = p.short.replace(/<[^>]+>/g, "").trim().slice(0, 160);
  return { title: p.name, description: desc, openGraph: { images: p.images[0] ? [p.images[0].src] : undefined } };
}

export default async function Product({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const msg = encodeURIComponent(`Hi, I'd like to order: ${p.name}${p.sku ? ` (SKU ${p.sku})` : ""}`);
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku ?? undefined,
    image: p.images.map((i) => i.src),
    offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "USD", availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="text-sm text-muted">
        <Link href="/shop" className="text-mint">Shop</Link>
        {p.categories[0] && <> / <Link href={`/product-category/${p.categories[0].slug}`} className="text-mint">{p.categories[0].name}</Link></>}
      </p>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {p.images.slice(0, 4).map((i, n) => (
            <div key={i.src} className="rounded-2xl bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n === 0 ? i.src : i.thumb} alt={i.alt} loading={n === 0 ? "eager" : "lazy"} className="mx-auto max-h-[480px] object-contain" />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-snug md:text-3xl">{p.name}</h1>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-mint">{money(p.price)}</span>
            {p.onSale && <span className="text-muted line-through">{money(p.regular)}</span>}
          </p>
          {p.sku && <p className="mt-1 text-sm text-muted">SKU: {p.sku}</p>}
          <p className="mt-1 text-sm">{p.inStock ? <span className="text-mint">In stock</span> : <span className="text-cta">Out of stock</span>}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noopener" className="btn btn-cta">Order on WhatsApp</a>
            <a href={SITE.tel} className="btn btn-ghost">Call {SITE.phone}</a>
          </div>
          <p className="mt-3 text-xs text-muted">Free delivery on orders $99+. 24/7 delivery to hotels, resorts &amp; villas.</p>
          {p.attributes.length > 0 && (
            <dl className="mt-6 space-y-1 text-sm">
              {p.attributes.map((a) => <div key={a.name} className="flex gap-2"><dt className="text-muted">{a.name}:</dt><dd>{a.terms.join(", ")}</dd></div>)}
            </dl>
          )}
          <div className="prose-cmc mt-8" dangerouslySetInnerHTML={{ __html: p.description }} />
        </div>
      </div>
    </div>
  );
}
