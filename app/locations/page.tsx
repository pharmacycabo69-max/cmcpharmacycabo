import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IconBox, IconClock, IconGlobe, IconShield } from "@/components/Icons";
import { PageBanner } from "@/components/PageBanner";
import { RelatedServices } from "@/components/RelatedServices";
import { StoreCard } from "@/components/StoreCard";
import { hoursSummary } from "@/lib/hours";
import { LOCATIONS, fullAddress, telHref, waHref } from "@/lib/locations";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Pharmacy Near Me in Cabo San Lucas: 5 Stores, Open Daily" },
  description:
    "Looking for a pharmacy near you in Cabo San Lucas? 5 RMC Pharmacy stores open every day 8 am–6 pm in Centro and the Marina, plus hotel delivery 7 am–11 pm.",
  alternates: { canonical: "/locations" },
  openGraph: { url: "/locations", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "Is there a pharmacy near me in Cabo San Lucas?", a: `Yes. RMC Pharmacy has ${LOCATIONS.length} stores in Cabo San Lucas, in Centro, downtown and the Marina area. They are open every day from 8 am to 6 pm.` },
  { q: "What are the pharmacy opening hours?", a: "All RMC Pharmacy stores are open every day, 8:00 am to 6:00 pm. If you need something outside those hours, our delivery service brings it to your hotel or villa every day from 7 am to 11 pm." },
  { q: "Do the pharmacists speak English?", a: "Yes. Our stores and our delivery team attend in English and Spanish." },
  { q: "Can I get prescription medicine?", a: "Prescription-only medicines are dispensed with a valid prescription. If you don't have one, our English-speaking doctors can see you by video or at our clinic." },
  { q: "Do you deliver to my hotel instead?", a: `Yes. ${SITE.name}, the delivery service of ${SITE.parent}, delivers to every hotel, resort, villa and vacation rental in Los Cabos every day from 7 am to 11 pm. Delivery is free on orders of $${SITE.freeDeliveryFrom} or more.` },
];

const WHAT = [
  ["Sun care & after-sun", "Sunscreen, aloe gels and lip balm for Cabo's strong sun."],
  ["First aid & hydration", "Bandages, antiseptics, electrolytes and oral rehydration."],
  ["Travel health", "Motion sickness, stomach and allergy medicine, repellents."],
  ["Personal care", "Hygiene, skin care and baby essentials."],
];

export default function Locations() {
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RMC Pharmacy stores in Cabo San Lucas",
    itemListElement: LOCATIONS.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/locations/${l.slug}`), name: `${l.gbpName} – ${l.placeLabel}` })),
  };
  return (
    <>
      <JsonLd data={[list, faqSchema(FAQ)]} />
      <PageBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Breadcrumbs items={[{ name: "Locations", href: "/locations" }]} />
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Pharmacy near me in Cabo San Lucas</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Find the nearest of our <strong>{LOCATIONS.length} RMC Pharmacy stores</strong> in Centro and the Marina area, open every day from 8 am to 6 pm with English and Spanish service. Staying outside the center? {SITE.name}, our delivery service, brings your medicine to your hotel or villa every day from 7 am to 11 pm.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [IconShield, `${LOCATIONS.length} stores`, "Centro & Marina"],
            [IconClock, "8 am – 6 pm", "Every day"],
            [IconGlobe, "English", "& Spanish"],
            [IconBox, "Delivery", "7 am – 11 pm"],
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

        <section className="mt-12" aria-labelledby="stores">
          <h2 id="stores" className="text-2xl font-bold tracking-tight">Our pharmacies in Cabo San Lucas</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((l, i) => <StoreCard key={l.slug} l={l} priority={i < 3} />)}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="details">
          <h2 id="details" className="text-2xl font-bold tracking-tight">Addresses, hours and phone</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Store</th><th className="px-4 py-3">Address</th><th className="px-4 py-3">Hours</th><th className="px-4 py-3">Contact</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LOCATIONS.map((l) => (
                  <tr key={l.slug} className="align-top">
                    <td className="px-4 py-3 font-semibold"><Link href={`/locations/${l.slug}`} className="hover:text-brand">{l.gbpName}<span className="block text-xs font-normal text-slate-500">{l.placeLabel}</span></Link></td>
                    <td className="px-4 py-3 text-slate-600">{fullAddress(l)}</td>
                    <td className="px-4 py-3 text-slate-600">{hoursSummary(l.hours)}</td>
                    <td className="space-y-1 px-4 py-3">
                      <a href={telHref(l)} className="block font-medium text-brand">{l.phone}</a>
                      <a href={l.mapsUrl} target="_blank" rel="noopener" className="block text-slate-600 hover:text-brand">Directions</a>
                      <a href={waHref(l)} target="_blank" rel="noopener" className="block text-slate-600 hover:text-brand">WhatsApp</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="what">
          <h2 id="what" className="text-2xl font-bold tracking-tight">What you will find in store</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHAT.map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-brand-soft p-5"><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-slate-600">{d}</p></li>
            ))}
          </ul>
        </section>

        <section className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-teal-500 p-8 text-white md:p-10" aria-labelledby="delivery">
          <h2 id="delivery" className="text-2xl font-extrabold tracking-tight">Can&apos;t get to a store? We deliver to your hotel</h2>
          <p className="mt-2 max-w-2xl text-teal-50">Every day from 7 am to 11 pm to any hotel, resort or villa in Los Cabos. Free delivery on orders of ${SITE.freeDeliveryFrom} or more.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need a pharmacy delivery in Cabo.")}`} target="_blank" rel="noopener" className="btn !bg-[#25d366] text-[#05301b] hover:!bg-[#2ee170]">Order on WhatsApp</a>
            <Link href="/delivery-areas" className="btn bg-white text-brand hover:bg-teal-50">Find your hotel</Link>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-bold tracking-tight">Pharmacy FAQ</h2>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedServices current="/locations" />
      </div>
    </>
  );
}
