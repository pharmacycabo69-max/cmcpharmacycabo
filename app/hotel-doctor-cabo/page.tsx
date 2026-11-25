import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { RelatedServices } from "@/components/RelatedServices";
import { JsonLd, faqSchema, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

/**
 * Hotel doctor / house calls (master data §2: house call $189 USD, taxes included; D12/D17).
 * Distinct service and price from /doctor-consultation. No promise of immediate availability, no emergency
 * claims, no named visiting physician (assignment depends on availability).
 */
export const metadata: Metadata = {
  title: { absolute: "Hotel Doctor in Cabo San Lucas: House Calls $189" },
  description:
    "English-speaking doctor at your hotel or villa in Cabo San Lucas, San José del Cabo and the Corridor: $189 house call (USD, taxes included), by appointment.",
  alternates: { canonical: "/hotel-doctor-cabo" },
  openGraph: { url: "/hotel-doctor-cabo", images: ["/opengraph-image"] },
};

const book = `${SITE.whatsapp}?text=${encodeURIComponent("Hi! I'd like to book a doctor visit at my hotel or villa.")}`;

const INCLUDED = [
  ["Consultation at your door", "A general medical consultation and examination at your hotel, villa or home."],
  ["Prescription when appropriate", "If medicine is needed, the doctor can issue a prescription valid in Mexico."],
  ["Medicine delivered", "Our pharmacy brings your prescription to you, every day 7 am – 11 pm."],
  ["Tests if needed", "We can coordinate lab tests or imaging and tell you the quote before you book."],
  ["Total price in writing", `$${MEDICAL_PRICES.hotel} USD, taxes included. We confirm the price and time before the visit.`],
  ["English & Spanish", "Your visit and written instructions in the language you prefer."],
];

const REASONS = ["Stomach upset and traveler's diarrhea", "Sunburn and heat-related discomfort", "Cold, flu, sore throat or ear pain", "Allergies and skin irritation", "Prescription refills while you travel", "Questions about a medicine you take"];

const STEPS = [
  ["Message us", "Tell us your hotel or villa, the best time and what you need. Please don't send medical documents in the first message."],
  ["We confirm", "We confirm the doctor's availability, the time and the total price in writing."],
  ["The doctor visits", "Your doctor comes to your hotel, villa or home and assesses you."],
  ["Medicine & follow-up", "If you need medicine, we deliver it. You can message us with questions afterwards."],
];

const FAQ = [
  { q: "How much is a doctor visit at my hotel in Cabo?", a: `A doctor visit at your hotel, villa or home costs $${MEDICAL_PRICES.hotel} USD, taxes included. A video consultation is $${MEDICAL_PRICES.video} and a clinic visit is $${MEDICAL_PRICES.clinic}.` },
  { q: "Where do you make house calls?", a: "In Cabo San Lucas, San José del Cabo and the Tourist Corridor: hotels, resorts, villas, vacation rentals and homes. Some properties ask visitors to register at the gate or front desk; we coordinate it with you." },
  { q: "Can the doctor come right now?", a: "Visits are by appointment. We confirm the doctor's availability and the time when you contact us. If it's an emergency, call 911." },
  { q: "Is this an emergency service?", a: "No. For chest pain, trouble breathing, severe bleeding, loss of consciousness or any emergency, call 911 or go to the nearest hospital." },
  { q: "Can I get a prescription?", a: "Yes, when it is medically appropriate after the consultation. Our pharmacy can then deliver the medicine to your hotel." },
  { q: "Do you accept travel insurance?", a: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team before the visit to verify your eligibility and payment arrangements." },
];

export default function HotelDoctor() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Doctor visit at your hotel or villa in Los Cabos",
    serviceType: "House call doctor",
    provider: { "@id": orgId },
    areaServed: [{ "@type": "City", name: "Cabo San Lucas" }, { "@type": "City", name: "San José del Cabo" }, { "@type": "AdministrativeArea", name: "Los Cabos" }],
    offers: { "@type": "Offer", price: MEDICAL_PRICES.hotel.toFixed(2), priceCurrency: "USD", url: abs("/hotel-doctor-cabo") },
  };
  return (
    <>
      <JsonLd data={[service, faqSchema(FAQ)]} />

      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-8 md:grid-cols-2 md:pb-16">
          <div>
            <Breadcrumbs items={[{ name: "Doctor consultation", href: "/doctor-consultation" }, { name: "Hotel doctor", href: "/hotel-doctor-cabo" }]} />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand">House calls · Los Cabos</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">Hotel doctor &amp; house calls in Cabo San Lucas</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">An English-speaking doctor comes to your hotel, villa or home in Cabo San Lucas, San José del Cabo and the Corridor. By appointment.</p>
            <p className="mt-6 flex items-baseline gap-2"><span className="text-5xl font-extrabold text-brand">${MEDICAL_PRICES.hotel}</span><span className="text-slate-500">USD · taxes included</span></p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/book?service=home-doctor" className="btn btn-primary !px-6 !py-3.5">Book a hotel visit</Link>
              <Link href="/doctor-consultation" className="btn btn-outline !px-6 !py-3.5">Video $59 · Clinic $99</Link>
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-sm">
            <Image src={DOCTOR.photo} alt={`${DOCTOR.name}, physician at ${DOCTOR.clinic}`} width={720} height={900} priority sizes="(min-width: 768px) 384px, 90vw" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl shadow-navy/15" />
            <figcaption className="absolute -bottom-4 left-4 right-4 rounded-2xl bg-white p-4 text-sm shadow-lg ring-1 ring-line"><span className="block font-semibold text-navy">{DOCTOR.name}</span><span className="text-slate-600">{DOCTOR.clinic} · English &amp; Spanish</span></figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <strong>Not an emergency service.</strong> For chest pain, trouble breathing, severe bleeding, loss of consciousness or any emergency, call <a href="tel:911" className="font-semibold underline">911</a> or go to the nearest hospital.
        </p>

        <section className="py-12" aria-labelledby="included">
          <h2 id="included" className="text-2xl font-bold tracking-tight md:text-3xl">What a hotel visit includes</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <p className="font-semibold"><span aria-hidden className="mr-2 text-brand">✓</span>{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-4" aria-labelledby="reasons">
          <h2 id="reasons" className="text-2xl font-bold tracking-tight">Common reasons visitors call a doctor</h2>
          <p className="mt-2 text-slate-600">Examples only, not a complete list. Your doctor decides what is appropriate after assessing you.</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {REASONS.map((r) => <li key={r} className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-navy">{r}</li>)}
          </ul>
        </section>

        <section className="py-12" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-surface p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-brand shadow-sm">{i + 1}</span>
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-4" aria-labelledby="where">
          <h2 id="where" className="text-2xl font-bold tracking-tight">Where we make house calls</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Hotels, all-inclusive resorts, villas, vacation rentals and homes in Cabo San Lucas, San José del Cabo and the Tourist Corridor. See where we deliver medicine on our <Link href="/delivery-areas" className="font-medium text-brand">delivery areas</Link> page. We are an independent service, not affiliated with any hotel.
          </p>
        </section>

        <div className="mt-12"><InsuranceNotice compact /></div>

        <section className="py-12" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-bold tracking-tight md:text-3xl">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-slate-200 border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-navy px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Book a doctor at your hotel</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">Tell us where you are staying and when. We confirm the doctor, the time and the total price.</p>
          <Link href="/book?service=home-doctor" className="btn mt-6 bg-white !px-6 !py-3.5 text-brand hover:bg-surface">Book online</Link> <a href={book} target="_blank" rel="noopener" className="btn mt-6 !px-6 !py-3.5 text-white ring-1 ring-white/40 hover:bg-white/10">WhatsApp</a>
        </section>

        <RelatedServices current="/hotel-doctor-cabo" />
        <div className="pb-8" />
      </div>
    </>
  );
}
