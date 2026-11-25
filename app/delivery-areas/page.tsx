import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HotelFinder } from "@/components/HotelFinder";
import { IconBox, IconBuilding, IconClock, IconGlobe } from "@/components/Icons";
import { PageBanner } from "@/components/PageBanner";
import { RelatedServices } from "@/components/RelatedServices";
import { deliveryAreas, hotelName } from "@/lib/content";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Pharmacy Delivery to Every Hotel in Los Cabos" },
  description:
    "We deliver medicine to every hotel, resort and villa in Cabo San Lucas, San José del Cabo and the Corridor, 7 am–11 pm. Free from $59.",
  alternates: { canonical: "/delivery-areas" },
  openGraph: { url: "/delivery-areas", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "Do you deliver to my hotel?", a: "Yes. We deliver to every hotel, resort, villa and vacation rental in Cabo San Lucas, San José del Cabo and the Tourist Corridor. Search your hotel above, or message us if it is not listed." },
  { q: "What time do you deliver?", a: "Every day from 7:00 am to 11:00 pm. We confirm the estimated delivery time when you order." },
  { q: "How much does delivery cost?", a: `Delivery is free on orders of $${SITE.freeDeliveryFrom} or more. For smaller orders we confirm the delivery fee with your total before we go.` },
  { q: "Can you leave my order at the front desk?", a: "Some hotels only accept deliveries at the front desk or concierge. We coordinate it with you and tell you where to pick it up." },
  { q: "Are you affiliated with the hotels?", a: `No. ${SITE.name} is an independent pharmacy delivery service. Hotel names are used only to describe where we deliver.` },
];

const STEPS = [
  ["Tell us your hotel", "Send your hotel (and room or villa name if you wish) by WhatsApp."],
  ["We confirm", "We confirm your products, total price and delivery time."],
  ["We deliver", "Every day 7 am – 11 pm to your room, villa or the front desk."],
];

export default function DeliveryAreas() {
  const hotels = deliveryAreas().map((p) => ({ slug: p.slug, name: hotelName(p.title) })).sort((a, b) => a.name.localeCompare(b.name));
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hotels and resorts we deliver to in Los Cabos",
    itemListElement: hotels.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: h.name, url: abs(`/${h.slug}`) })),
  };
  return (
    <>
      <JsonLd data={[list, faqSchema(FAQ)]} />
      <PageBanner />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ name: "Delivery areas", href: "/delivery-areas" }]} />
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Pharmacy delivery to every hotel &amp; resort in Los Cabos</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          <strong>We deliver to every hotel, resort, villa, vacation rental and home</strong> in Cabo San Lucas, San José del Cabo and the Tourist Corridor: prescriptions, over-the-counter medicine and travel essentials, every day from 7 am to 11 pm.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [IconClock, "7 am – 11 pm", "Every day"],
            [IconBox, `Free from $${SITE.freeDeliveryFrom}`, "Delivery on orders of $59+"],
            [IconBuilding, "Every hotel", "Resorts, villas, rentals"],
            [IconGlobe, "English", "& Spanish support"],
          ].map(([Icon, big, small]) => {
            const I = Icon as typeof IconClock;
            return (
              <li key={big as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><I className="h-5 w-5" /></span>
                <p><span className="block text-sm font-bold leading-tight">{big as string}</span><span className="block text-xs text-slate-500">{small as string}</span></p>
              </li>
            );
          })}
        </ul>

        <section className="mt-12" aria-labelledby="find">
          <h2 id="find" className="text-2xl font-bold tracking-tight">Find your hotel</h2>
          <p className="mb-4 mt-1 text-slate-600">Search your hotel to see its delivery page. <strong>Not listed? We deliver there too.</strong></p>
          <HotelFinder hotels={hotels} whatsapp={SITE.whatsapp} />
        </section>

        <section className="mt-14" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold tracking-tight">How hotel delivery works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-brand-soft p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-brand shadow-sm">{i + 1}</span>
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need a pharmacy delivery to my hotel in Cabo.")}`} target="_blank" rel="noopener" className="btn btn-primary">Order on WhatsApp</a>
            <a href={SITE.tel} className="btn btn-outline">Call {SITE.phone}</a>
            <Link href="/price-list" className="btn btn-outline">See prices</Link>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-bold tracking-tight">Hotel delivery FAQ</h2>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedServices current="/delivery-areas" />
        <p className="mt-10 text-xs leading-relaxed text-slate-500">Hotel names are used only to describe where we deliver; {SITE.name} is an independent service and is not affiliated with these properties.</p>
      </div>
    </>
  );
}
