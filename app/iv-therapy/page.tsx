import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookDripButton } from "@/components/BookDripButton";
import { BookingError } from "@/components/BookingError";
import { RelatedServices } from "@/components/RelatedServices";
import { JsonLd, faqSchema, orgId } from "@/lib/seo";
import { IV, IV_DRIPS, IV_FAQ, IV_PRICE_NOTES } from "@/lib/ivtherapy";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "IV Therapy Cabo San Lucas at Your Hotel | From $159" },
  description: "IV therapy at your hotel or villa in Cabo San Lucas: IV $159, Multivitamin $189, NAD+ $279 (USD, taxes included). Medical assessment first; 50% deposit to book.",
  alternates: { canonical: "/iv-therapy" },
  openGraph: { url: "/iv-therapy", images: [IV_DRIPS[0].image] },
};

const BENEFITS = [
  ["Medical assessment first", "Our team reviews your health history and rules out contraindications before any drip."],
  ["Licensed professionals", "Administered by a licensed nurse who monitors you during the session."],
  ["At your hotel or villa", "We come to you across Cabo San Lucas, San José del Cabo and the Corridor, by appointment."],
  ["Clear pricing", "At your hotel or villa: IV therapy $159, Multivitamin $189, NAD+ $279. USD, taxes included. 50% deposit to book."],
];
const STEPS = [
  ["Consult", "Short assessment with our medical team by phone or in person. We review your health history and rule out contraindications."],
  ["Drip", "A licensed nurse administers your IV at our pharmacy, your hotel or your villa. 30–90 minutes depending on the formula."],
  ["Recover", "Your nurse monitors you during the drip and gives you aftercare guidance. Effects vary from person to person."],
];
const ZONES = ["Cabo San Lucas — Marina, Pedregal, Médano Beach", "San José del Cabo — Hotel Zone, Historic District", "Tourist Corridor — resort delivery", "East Cape — by arrangement"];

export default function IvTherapy() {
  const wa = `https://wa.me/${IV.whatsapp}`;
  return (
    <>
      <JsonLd data={[
        faqSchema(IV_FAQ),
        {
          "@context": "https://schema.org", "@type": "Service", name: "Mobile IV therapy in Los Cabos", serviceType: "IV therapy",
          provider: { "@id": orgId }, areaServed: ["Cabo San Lucas", "San José del Cabo", "Los Cabos"], url: abs("/iv-therapy"),
          hasOfferCatalog: { "@type": "OfferCatalog", name: "IV drip menu", itemListElement: IV_DRIPS.map((d) => ({ "@type": "Offer", price: d.priceUsd.toFixed(2), priceCurrency: "USD", itemOffered: { "@type": "Service", name: `${d.name} IV drip`, description: `${d.tagline} Includes: ${d.includes}.` } })) },
        },
      ]} />

      <section className="border-b border-slate-100 bg-brand-soft">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <Breadcrumbs items={[{ name: "IV therapy", href: "/iv-therapy" }]} />
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">IV therapy in Cabo San Lucas, delivered to your hotel or villa</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">IV therapy administered by licensed Mexican medical professionals at your hotel, villa or our pharmacy.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#drips" className="btn btn-primary">Choose your drip &amp; book</a>
            <a href={wa} target="_blank" rel="noopener" className="btn btn-outline">WhatsApp {IV.phoneDisplay}</a>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why">
        <h2 id="why" className="h2">Why IV therapy</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(([t, d]) => <li key={t} className="rounded-xl border border-slate-200 p-5"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></li>)}
        </ul>
      </section>

      <section id="drips" className="scroll-mt-20 bg-slate-50" aria-labelledby="menu">
        <div className="section">
          <BookingError />
          <h2 id="menu" className="h2">Our IV drip menu</h2>
          <p className="mt-3 max-w-2xl text-slate-600">At your hotel or villa: $159 per IV therapy, Multivitamin (Myers) $189, NAD+ $279. Prices in USD, taxes included. {IV_PRICE_NOTES.inClinic} {IV_PRICE_NOTES.groups} Pick a drip to choose your date and time. A 50% deposit secures your visit.</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {IV_DRIPS.map((d, i) => (
              <li key={d.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image src={d.image} alt={d.alt} width={768} height={768} loading={i < 2 ? "eager" : "lazy"} sizes="(min-width: 768px) 480px, 100vw" className="aspect-[16/10] w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">{d.category}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold">{d.name}</h3>
                    <p className="whitespace-nowrap font-semibold">{d.from && <span className="mr-1 text-xs font-normal text-slate-500">From</span>}${d.priceUsd}<span className="ml-1.5 text-xs font-normal text-slate-500">· {d.duration}</span></p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{d.tagline}</p>
                  <p className="mt-3 text-sm"><strong>Includes:</strong> {d.includes}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">{d.benefits.map((b) => <li key={b}>✓ {b}</li>)}</ul>
                  <BookDripButton id={d.id} className="btn btn-primary mt-5 self-start" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-50" aria-labelledby="how">
        <div className="section">
          <h2 id="how" className="h2">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="zones">
        <h2 id="zones" className="h2">Hotel &amp; villa delivery across Los Cabos</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Our nursing team comes to you with pharmaceutical-grade fluids and sterile equipment. Rest in your room, by the pool or on your terrace. We confirm the appointment time with you.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">{ZONES.map((z) => <li key={z} className="rounded-xl border border-slate-200 p-4 text-sm">{z}</li>)}</ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-4" aria-labelledby="safety">
        <h2 id="safety" className="h2">Medical-grade, Mexican-licensed, Cabo-trusted</h2>
        <div className="prose-cmc mt-5">
          <p><strong>All IV therapy services are administered by licensed Mexican medical professionals working within Mexican health regulations.</strong> Each protocol is reviewed by our medical director, formulas use pharmaceutical-grade compounds from licensed Mexican distributors, and equipment is single-use sterile.</p>
          <p>A medical consultation is <strong>required</strong> before your first treatment. We screen for contraindications including pregnancy and breastfeeding, advanced chronic kidney disease, decompensated heart failure, known allergies to IV components, hemochromatosis (for iron-containing formulas) and G6PD deficiency (for high-dose vitamin C).</p>
          <p>This service is not a substitute for medical care. If you have an active medical condition, consult your primary healthcare provider before booking. Not for emergencies — call 911.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12" aria-labelledby="faq">
        <h2 id="faq" className="h2 text-center">IV therapy questions, answered</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {IV_FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pb-14"><RelatedServices current="/iv-therapy" /></div>
    </>
  );
}
