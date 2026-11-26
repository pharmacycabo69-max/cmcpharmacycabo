import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedServices } from "@/components/RelatedServices";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { LOCATIONS } from "@/lib/locations";
import { JsonLd, pharmacySchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** Contact (master data §2, §13): WhatsApp, phone, address, hours, stores; no form that collects health data. */
export const metadata: Metadata = {
  title: { absolute: "Contact CMC Pharmacy Cabo: WhatsApp, Phone & Hours" },
  description:
    "Contact CMC Pharmacy Cabo by WhatsApp +52 624 226 1023 or phone. Delivery 8 am–11:30 pm, clinic 9 am–5 pm, 5 stores open 8 am–6 pm.",
  alternates: { canonical: "/contact-us" },
  openGraph: { url: "/contact-us", images: ["/opengraph-image"] },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.street}, ${SITE.postalCode} ${SITE.locality}, B.C.S., Mexico`)}`;

const HOURS = [
  ["Pharmacy delivery", "Every day, 8:00 am – 11:30 pm"],
  ["Pharmacies (RMC Pharmacy network)", "Every day, 8:00 am – 6:00 pm"],
  ["Clinic & doctor visits", "Every day, 9:00 am – 5:00 pm, by appointment"],
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={pharmacySchema()} />
      <Breadcrumbs items={[{ name: "Contact", href: "/contact-us" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Contact us</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        The fastest way to reach us is WhatsApp. Our team answers in English and Spanish. To protect your privacy, please don&apos;t send medical documents or policy details in your first message.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">WhatsApp</h2>
          <p className="mt-1 text-lg font-bold text-brand">{SITE.whatsappDisplay}</p>
          <p className="mt-1 text-sm text-slate-600">Orders, prices, prescriptions and appointments.</p>
          <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I have a question for CMC Pharmacy Cabo.")}`} target="_blank" rel="noopener" className="btn btn-primary mt-4">Message us</a>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Phone &amp; email</h2>
          <p className="mt-1 text-lg font-bold text-brand"><a href={SITE.tel}>{SITE.phone}</a></p>
          <p className="mt-1 text-sm text-slate-600"><a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a></p>
          <a href={SITE.tel} className="btn btn-outline mt-4">Call us</a>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold">Clinic address</h2>
          <address className="mt-1 text-sm not-italic leading-relaxed text-slate-700">{SITE.street},<br />{SITE.postalCode} {SITE.locality}, B.C.S., Mexico</address>
          <a href={mapsUrl} target="_blank" rel="noopener" className="btn btn-outline mt-4">Get directions</a>
        </div>
      </div>

      <section className="mt-10" aria-labelledby="hours">
        <h2 id="hours" className="text-xl font-semibold">Hours</h2>
        <dl className="mt-3 divide-y divide-slate-100 rounded-2xl border border-line text-sm">
          {HOURS.map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 px-5 py-3"><dt className="font-medium">{k}</dt><dd className="text-slate-600">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-slate-600">Delivery is free on orders of ${SITE.freeDeliveryFrom} or more. We confirm the total and delivery time before we go.</p>
      </section>

      <section className="mt-10" aria-labelledby="stores">
        <h2 id="stores" className="text-xl font-semibold">Our stores in Cabo San Lucas</h2>
        <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          {LOCATIONS.map((l) => (
            <li key={l.slug}><Link href={`/locations/${l.slug}`} className="block rounded-xl border border-line p-4 hover:border-brand"><span className="font-semibold">{l.gbpName} · {l.placeLabel}</span><span className="mt-1 block text-slate-600">{l.addressLine}</span></Link></li>
          ))}
        </ul>
      </section>

      <div className="mt-10"><InsuranceNotice compact /></div>

      <RelatedServices current="/contact-us" />

      <p className="mt-10 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <strong>Medical emergency?</strong> Call <a href="tel:911" className="font-semibold underline">911</a> or go to the nearest hospital. We are not an emergency service.
      </p>
    </div>
  );
}
