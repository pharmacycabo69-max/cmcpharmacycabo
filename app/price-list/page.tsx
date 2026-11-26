import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import groups from "@/content/price-list.json";
import { hasPrice, isRx, money, products } from "@/lib/products";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

const YEAR = new Date().getFullYear();
const UPDATED = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

export const metadata: Metadata = {
  title: { absolute: `Cabo Pharmacy Price List ${YEAR} · Medicine Prices in USD` },
  description:
    "Current USD prices for what visitors buy most in Cabo San Lucas: allergy, stomach, pain, sunscreen, antibiotics, Ozempic and more. Delivery 8 am–11:30 pm.",
  alternates: { canonical: "/price-list" },
  openGraph: { title: `Cabo Pharmacy Price List ${YEAR}`, url: "/price-list", images: ["/opengraph-image"] },
};

const byId = new Map(products.map((p) => [p.id, p]));
type Item = (typeof products)[number];
const sections = groups.map((g) => ({ ...g, items: g.ids.map((id) => byId.get(id)).filter((p): p is Item => !!p && hasPrice(p)) }));

const FAQ = [
  {
    q: "Are these pharmacy prices in US dollars?",
    a: "Yes. All prices on this list are in US dollars. Final price and availability are confirmed on WhatsApp or by phone before we deliver.",
  },
  {
    q: "Do I need a prescription to buy antibiotics in Cabo?",
    a: "Yes. Mexican law requires a valid prescription for antibiotics, GLP-1 medicines such as Ozempic or Wegovy, and other prescription drugs. If you don't have one, our English-speaking doctors can consult with you by video or at your hotel.",
  },
  {
    q: "How much does pharmacy delivery cost in Cabo?",
    a: "Delivery is free on orders of $59 or more. For smaller orders we confirm the delivery fee with your total before we go. We deliver every day from 8 am to 11:30 pm to hotels, resorts and villas in Cabo San Lucas, San José del Cabo and the Corridor.",
  },
  {
    q: "How fast is delivery?",
    a: "We give you an estimated delivery time when you order; it depends on your location and the time of day.",
  },
  {
    q: "What if the medicine I need is not on this list?",
    a: "This list shows the most requested items. We stock thousands more products: search the shop or send us the name of your medicine on WhatsApp and we'll quote it.",
  },
];

export default function PriceList() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Cabo pharmacy price list ${YEAR}`,
    itemListElement: sections.flatMap((s) => s.items).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/product/${p.slug}`), name: p.name })),
  };
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={[itemList, faqSchema(FAQ)]} />
      <Breadcrumbs items={[{ name: "Price list", href: "/price-list" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Cabo pharmacy price list {YEAR}</h1>
      <p className="mt-2 text-sm text-slate-500">Updated {UPDATED} · Prices in US dollars</p>
      <p className="mt-4 max-w-2xl text-slate-600">
        What medicine costs at {SITE.name}, the delivery service of {SITE.parent} in Cabo San Lucas. These are the products visitors ask for most. Tap any item to order it on WhatsApp and we&apos;ll deliver it to your hotel or villa.
      </p>

      <nav aria-label="Price list sections" className="mt-6">
        <ul className="flex flex-wrap gap-2 text-sm">
          {sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className="inline-block rounded-full border border-line px-3 py-1 text-slate-700 hover:border-brand hover:text-brand">{s.title.replace(/\s*\(.*\)$/, "")}</a></li>
          ))}
        </ul>
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-10 scroll-mt-24" aria-labelledby={`${s.id}-h`}>
          <h2 id={`${s.id}-h`} className="text-xl font-semibold">{s.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{s.blurb}</p>
          <table className="mt-4 w-full text-sm">
            <thead className="sr-only"><tr><th>Product</th><th>Price (USD)</th></tr></thead>
            <tbody className="divide-y divide-slate-100 border-y border-line">
              {s.items.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 pr-4">
                    <Link href={`/product/${p.slug}`} className="text-slate-800 hover:text-brand">{p.name}</Link>
                    {isRx(p) && <span title="Prescription required" className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">℞ Rx</span>}
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold">{money(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <aside className="mt-12 rounded-2xl bg-brand-soft p-6 text-center">
        <p className="text-lg font-semibold">Need something that&apos;s not on the list?</p>
        <p className="mt-1 text-sm text-slate-600">Send us the name of your medicine and we&apos;ll quote it, every day 8 am – 11:30 pm.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! Can you give me the price of: ")}`} target="_blank" rel="noopener" className="btn btn-primary">Ask a price on WhatsApp</a>
          <Link href="/shop" className="btn btn-outline">Search the shop</Link>
        </div>
      </aside>

      <section className="mt-14" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
