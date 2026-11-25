import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, faqSchema } from "@/lib/seo";
import { INSURANCE, SITE } from "@/lib/site";

/** FAQ rebuilt from owner-confirmed data (master data §2, §2.1, D11–D17). Replaces the imported 24/7 copy. */
export const metadata: Metadata = {
  title: { absolute: "Pharmacy & Doctor FAQ for Visitors to Cabo San Lucas" },
  description:
    "Delivery hours, free delivery from $59, prescriptions in Mexico, doctor and IV prices, insurance and payments for visitors to Cabo San Lucas.",
  alternates: { canonical: "/faq" },
  openGraph: { url: "/faq", images: ["/opengraph-image"] },
};

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Ordering & delivery",
    items: [
      { q: "What are your delivery hours?", a: "We deliver every day from 7:00 am to 11:00 pm to hotels, resorts, villas and homes in Cabo San Lucas, San José del Cabo and the Corridor." },
      { q: "How much is delivery?", a: `Delivery is free on orders of $${SITE.freeDeliveryFrom} or more. For smaller orders we confirm the delivery fee with your total before we go.` },
      { q: "How long does delivery take?", a: "It depends on where you are staying and the time of day. We give you an estimated delivery time when you order." },
      { q: "Can you deliver to my hotel room?", a: "Yes — we deliver to every hotel, resort, villa and vacation rental in Cabo San Lucas, San José del Cabo and the Tourist Corridor. Some hotels only allow delivery to the front desk or concierge; we coordinate it with you. We are an independent service, not affiliated with any hotel." },
      { q: "How do I order?", a: `Send us a WhatsApp message to ${SITE.whatsappDisplay} with the product or a photo of the box. You can also browse the shop and tap "Order on WhatsApp" on any product.` },
    ],
  },
  {
    title: "Prescriptions",
    items: [
      { q: "Do I need a prescription in Mexico?", a: "Antibiotics, GLP-1 medicines such as Ozempic or Wegovy and other prescription-only medicines require a valid prescription. Controlled medicines require an original special prescription from a Mexican-licensed doctor." },
      { q: "Can I use my prescription from home?", a: "Send us a photo and our team will tell you whether we can dispense it or whether you need a consultation with one of our doctors." },
      { q: "I don't have a prescription. What can I do?", a: "Book a consultation with an English-speaking doctor: video $59, clinic visit $99 or a visit at your hotel or villa $189 (USD, taxes included)." },
    ],
  },
  {
    title: "Doctors, IV therapy & other services",
    items: [
      { q: "Is this an emergency service?", a: "No. In an emergency, call 911 or go to the nearest hospital. We provide general consultations, IV therapy and other services by appointment." },
      { q: "How much is IV therapy?", a: "At your hotel or villa: IV therapy $159, Multivitamin $189 and NAD+ $279. At the clinic: IV therapy $129, Multivitamin $154 and NAD+ $279. Groups of 3 or more: $139 per person. USD, taxes included, after a medical assessment. A 50% deposit secures your booking." },
      { q: "Do you offer lab tests and imaging?", a: "Yes. Our medical team coordinates blood work, urine and stool tests, X-rays and ultrasound. Ask for a quote on WhatsApp." },
    ],
  },
  {
    title: "Insurance & payment",
    items: [
      { q: "Do you accept insurance?", a: INSURANCE.body },
      { q: "Is Mexican insurance accepted?", a: "No. We only work with international health and travel insurance from the United States and Canada, subject to verification." },
      { q: "Are prices in US dollars?", a: "Yes. Service prices are in US dollars and include taxes. We confirm the total before any service or delivery." },
    ],
  },
  {
    title: "Privacy",
    items: [
      { q: "What should I send in my first message?", a: "Just the service you need and where you are staying. Please don't send medical documents, insurance policies or card numbers by WhatsApp; our team will tell you how to share anything that is needed." },
    ],
  },
];

export default function Faq() {
  const all = GROUPS.flatMap((g) => g.items);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={faqSchema(all)} />
      <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h1>
      <p className="mt-4 text-slate-600">Answers for visitors to Cabo San Lucas and San José del Cabo. Can&apos;t find yours? <a href={SITE.whatsapp} target="_blank" rel="noopener" className="font-medium text-brand">Message us on WhatsApp</a>.</p>
      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10" aria-label={g.title}>
          <h2 className="text-xl font-semibold">{g.title}</h2>
          <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
            {g.items.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm text-slate-600">
        See also: <Link href="/price-list" className="text-brand">price list</Link> · <Link href="/doctor-consultation" className="text-brand">doctor consultations</Link> · <Link href="/contact-us" className="text-brand">contact</Link>
      </p>
    </div>
  );
}
