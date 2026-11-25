import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * Aesthetic medicine (master data §4.1: exactly four treatments). Visibility rule §3.1 for this brand:
 * the lead is named only — no license number, university, detailed title, photo, biography or sanitary role.
 * Prices: owner instruction 24 Nov 2026 — "from" prices as published on medicinaesteticaencabo.com (USD).
 */
const LEAD = "Dra. Rosibel Núñez Rojo";

export const metadata: Metadata = {
  title: "Aesthetic Medicine in Cabo San Lucas: Lip Fillers, Wrinkle Relaxers & Skin Brightening",
  description:
    "Lip fillers from $600, facial wrinkle-relaxing injections from $170 per area, skin brightening from $1,500 and facial rejuvenation, after an in-person medical assessment in Cabo San Lucas.",
  alternates: { canonical: "/aesthetic-medicine" },
  openGraph: { url: "/aesthetic-medicine", images: ["/opengraph-image"] },
};

const TREATMENTS = [
  {
    name: "Lip fillers",
    what: "Hyaluronic acid to add natural volume and definition to the lips, with local anesthetic.",
    price: "From $600",
  },
  {
    name: "Facial botulinum toxin treatments",
    what: "Injections that soften expression lines. Upper face (frown lines, forehead and crow's feet): $550.",
    price: "From $170 per area",
  },
  {
    name: "Skin brightening",
    what: "Medical depigmenting peel for dark spots and uneven tone on the face.",
    price: "From $1,500",
  },
  {
    name: "Facial rejuvenation",
    what: "A plan tailored to your skin, defined with your doctor during the assessment.",
    price: "Price after assessment",
  },
];

const STEPS = [
  ["Assessment", "An in-person medical assessment at our clinic in Centro, Cabo San Lucas, to review your health history and goals."],
  ["Plan & total price", "Your doctor explains the recommended treatment, risks, aftercare and realistic expectations, and confirms the total price in writing."],
  ["Treatment", "The procedure is done by appointment, usually the same visit or on a date that suits your trip."],
  ["Aftercare", "Written aftercare instructions and a way to contact us on WhatsApp if you have questions."],
];

const FAQ = [
  { q: "Who performs the treatments?", a: `Our aesthetic medicine division is led by ${LEAD}. Every treatment starts with an in-person medical assessment.` },
  { q: "Are prices in US dollars?", a: "Yes. Prices are in US dollars and are starting prices: your doctor confirms the total for your treatment in writing after the assessment, before anything is done." },
  { q: "Are aesthetic treatments covered by insurance?", a: "No. Aesthetic treatments are not covered by health or travel insurance." },
  { q: "What results can I expect?", a: "Results vary from person to person and depend on your skin and the treatment chosen. We do not guarantee results; your doctor will explain realistic expectations and possible side effects during the assessment." },
];

const book = `${SITE.whatsapp}?text=${encodeURIComponent("Hi! I'd like to book an aesthetic medicine assessment.")}`;

export default function AestheticMedicine() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={faqSchema(FAQ)} />
      <Breadcrumbs items={[{ name: "Aesthetic medicine", href: "/aesthetic-medicine" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Aesthetic medicine in Cabo San Lucas</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Our aesthetic medicine division, led by {LEAD}, offers four treatments by appointment after an in-person medical assessment at our clinic in Centro, Cabo San Lucas.
      </p>

      <section className="mt-10" aria-labelledby="treatments">
        <h2 id="treatments" className="text-xl font-semibold">Treatments and prices</h2>
        <p className="mt-1 text-sm text-slate-600">Starting prices in US dollars. Your total is confirmed in writing after the assessment.</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {TREATMENTS.map((t) => (
            <li key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{t.name}</h3>
                <span className="whitespace-nowrap text-sm font-semibold text-brand">{t.price}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.what}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={book} target="_blank" rel="noopener" className="btn btn-primary">Book an assessment on WhatsApp</a>
          <a href={SITE.tel} className="btn btn-outline">Call {SITE.phone}</a>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="how">
        <h2 id="how" className="text-xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-brand-soft p-5">
              <p className="text-sm font-bold text-brand">Step {i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-slate-500">
        Aesthetic treatments are medical procedures and are only performed after an assessment. This page is general information, not medical advice. Looking for something else? See our <Link href="/doctor-consultation" className="text-brand">doctor consultations</Link> or <Link href="/lab-tests-imaging" className="text-brand">lab tests &amp; imaging</Link>.
      </p>
    </div>
  );
}
