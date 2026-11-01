import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { categoryBySlug, getProduct, money, products } from "@/lib/products";
import { JsonLd, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const cat = p.categories[0]?.name;
  const desc = `${p.name}${cat ? ` — ${cat}` : ""}. ${money(p.price)}. Order from CMC Pharmacy Cabo with 24/7 delivery to your hotel or villa in Los Cabos.`.slice(0, 158);
  return {
    title: `${p.name} in Cabo San Lucas`,
    description: desc,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: desc, url: `/product/${p.slug}`, images: p.images[0] ? [p.images[0].src] : undefined },
  };
}

export default async function Product({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = p.categories[0];
  const msg = encodeURIComponent(`Hi, I'd like to order: ${p.name}${p.sku ? ` (SKU ${p.sku})` : ""}`);
  const same = cat ? products.filter((x) => x.cats.includes(cat.id) && x.id !== p.id && x.img).slice(0, 4) : [];
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku ?? undefined, mpn: p.sku ?? undefined,
    description: text(p.short || p.description).slice(0, 300) || p.name,
    image: p.images.map((i) => i.src), category: cat?.name,
    brand: p.brands[0] ? { "@type": "Brand", name: p.brands[0] } : undefined,
    offers: {
      "@type": "Offer", url: abs(`/product/${p.slug}`), price: p.price.toFixed(2), priceCurrency: "USD",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition", seller: { "@id": orgId },
    },
  };
  const crumbs = [{ name: "Shop", href: "/shop" }, ...(cat && categoryBySlug(cat.slug) ? [{ name: cat.name, href: `/product-category/${cat.slug}` }] : []), { name: p.name, href: `/product/${p.slug}` }];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={ld} />
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {p.images.slice(0, 3).map((i, n) => (
            <div key={i.src} className="flex justify-center rounded-xl border border-slate-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n === 0 ? i.src : i.thumb} alt={i.alt || p.name} width={n === 0 ? 800 : 300} height={n === 0 ? 800 : 300} loading={n === 0 ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : "auto"} className="max-h-[460px] w-auto object-contain" />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl">{p.name}</h1>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{money(p.price)}</span>
            {p.onSale && <span className="text-slate-400 line-through">{money(p.regular)}</span>}
          </p>
          <p className="mt-2 text-sm text-slate-500">{p.sku && <>SKU {p.sku} · </>}<span className={p.inStock ? "text-brand" : "text-red-600"}>{p.inStock ? "In stock" : "Out of stock"}</span></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noopener" className="btn btn-primary">Order on WhatsApp</a>
            <a href={SITE.tel} className="btn btn-outline">Call {SITE.phone}</a>
          </div>
          <ul className="mt-5 space-y-1 text-sm text-slate-600">
            <li>✓ 24/7 delivery to hotels, resorts and villas</li>
            <li>✓ Free delivery on orders $99+</li>
            <li>✓ English-speaking pharmacists on call</li>
          </ul>
          {p.attributes.length > 0 && (
            <dl className="mt-6 space-y-1 text-sm">
              {p.attributes.map((a) => <div key={a.name} className="flex gap-2"><dt className="text-slate-500">{a.name}:</dt><dd>{a.terms.join(", ")}</dd></div>)}
            </dl>
          )}
          <div className="prose-cmc mt-8" dangerouslySetInnerHTML={{ __html: p.description }} />
        </div>
      </div>
      {same.length > 0 && (
        <section className="mt-16" aria-labelledby="rel">
          <h2 id="rel" className="text-xl font-semibold">More in <Link className="text-brand" href={`/product-category/${cat.slug}`}>{cat.name}</Link></h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">{same.map((x) => <ProductCard key={x.id} p={x} />)}</div>
        </section>
      )}
    </div>
  );
}
