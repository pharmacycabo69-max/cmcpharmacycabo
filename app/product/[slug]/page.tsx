import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NoPhoto, ProductCard } from "@/components/ProductCard";
import { categoryBySlug, getProduct, hasPrice, isControlled, isRx, money, products } from "@/lib/products";
import { JsonLd, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;/g, " ").replace(/\s+/g, " ").trim();
/** Cut on a word boundary so titles and snippets are not chopped mid-word. */
const cut = (s: string, max: number) => (s.length <= max ? s : s.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:(–—-]+$/, ""));

/**
 * Google shows ~60 characters of a title. Short names get the local keyword and the brand suffix;
 * long ones are shortened and shown without the suffix.
 */
function productTitle(name: string): Metadata["title"] {
  const local = `${name} in Cabo San Lucas`;
  if (local.length <= 40) return local;
  if (name.length <= 40) return name;
  return { absolute: cut(name, 60) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const cat = p.categories[0]?.name;
  const desc = cut(`${p.name}${cat ? ` — ${cat}` : ""}. ${hasPrice(p) ? `${money(p.price)}. ` : ""}Order from CMC Pharmacy Cabo with delivery to your hotel or villa in Los Cabos, 7 am–11 pm daily.`, 158);
  return {
    title: productTitle(p.name),
    description: desc,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: desc, url: `/product/${p.slug}`, images: p.images[0] ? [p.images[0].src] : undefined },
  };
}

export default async function Product({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = p.categories[0];
  const rx = isRx(p);
  const controlled = isControlled(p);
  const item = `${p.name}${p.sku ? ` (SKU ${p.sku})` : ""}`;
  const msg = encodeURIComponent(
    rx ? `Hi, I have a prescription for: ${item}. I'll send a photo of it here.`
    : `Hi, ${hasPrice(p) ? "I'd like to order" : "I'd like the price and availability of"}: ${item}`,
  );
  const same = cat ? products.filter((x) => x.cats.includes(cat.id) && x.id !== p.id && x.img).slice(0, 4) : [];
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku ?? undefined, mpn: p.sku ?? undefined,
    description: text(p.short || p.description).slice(0, 300) || p.name,
    image: p.images.map((i) => i.src), category: cat?.name,
    brand: p.brands[0] ? { "@type": "Brand", name: p.brands[0] } : undefined,
    offers: !hasPrice(p) ? undefined : {
      "@type": "Offer", url: abs(`/product/${p.slug}`), price: p.price.toFixed(2), priceCurrency: "USD",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition", seller: { "@id": orgId },
    },
  };
  const crumbs = [{ name: "Shop", href: "/shop" }, ...(cat && categoryBySlug(cat.slug) ? [{ name: cat.name, href: `/product-category/${cat.slug}` }] : []), { name: p.name, href: `/product/${p.slug}` }];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Product rich results require an offer; "ask for price" items only get breadcrumbs */}
      {hasPrice(p) && <JsonLd data={ld} />}
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {p.images.length === 0 && <div className="rounded-xl border border-slate-200 p-4"><NoPhoto className="aspect-square w-full" /></div>}
          {p.images.slice(0, 3).map((i, n) => (
            <div key={i.src} className="flex justify-center rounded-xl border border-slate-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n === 0 ? i.src : i.thumb} alt={i.alt || p.name} width={600} height={600} loading={n === 0 ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : "auto"} className="max-h-[460px] w-auto object-contain" />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl">{p.name}</h1>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{hasPrice(p) ? money(p.price) : <span className="text-2xl text-brand">Ask for price</span>}</span>
            {hasPrice(p) && p.onSale && <span className="text-slate-400 line-through">{money(p.regular)}</span>}
          </p>
          <p className="mt-2 text-sm text-slate-500">{p.sku && <>SKU {p.sku} · </>}<span className={p.inStock ? "text-brand" : "text-red-600"}>{p.inStock ? "In stock" : "Out of stock"}</span></p>
          {rx ? (
            <>
              <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">℞ Prescription required</p>
                <p className="mt-1">
                  {controlled
                    ? "Controlled medicine under Mexican law: we can only dispense it against an original special prescription from a Mexican-licensed doctor, checked at delivery."
                    : "Mexican law requires a valid prescription for this medicine. Send us a photo of yours, or get one from our English-speaking doctor."}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noopener" className="btn btn-primary">Send prescription on WhatsApp</a>
                <Link href="/doctor-consultation" className="btn btn-outline">No prescription? See a doctor</Link>
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noopener" className="btn btn-primary">{hasPrice(p) ? "Order on WhatsApp" : "Ask price on WhatsApp"}</a>
              <a href={SITE.tel} className="btn btn-outline">Call {SITE.phone}</a>
            </div>
          )}
          <ul className="mt-5 space-y-1 text-sm text-slate-600">
            <li>✓ Delivery to hotels, resorts and villas, 7 am – 11 pm daily</li>
            <li>✓ Free delivery on orders of ${SITE.freeDeliveryFrom}+</li>
            <li>✓ Total price and delivery time confirmed before we go</li>
            <li>✓ English &amp; Spanish support on WhatsApp</li>
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
