import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedServices } from "@/components/RelatedServices";
import { AestheticHero, GlowArt, LipsArt, RejuvenationArt, SyringeArt } from "@/components/Illustrations";
import { JsonLd, faqSchema, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

/**
 * Aesthetic medicine (master data §4.1: exactly four treatments). Visibility rule §3.1 for this brand:
 * the lead is named only — no license number, university, detailed title, photo, biography or sanitary role.
 * Prices: owner instruction 24 Nov 2026 — "from" prices as published on medicinaesteticaencabo.com (USD).
 * Images: original illustrations (components/Illustrations.tsx); no before/after photos (master data §4.1).
 */
const LEAD = "Dra. Rosibel Núñez Rojo";

export const metadata: Metadata = {
  title: { absolute: "Aesthetic Medicine in Cabo San Lucas | Lip Fillers" },
  description:
    "Lip fillers from $600, wrinkle-relaxing injections from $170 per area and skin brightening from $1,500 in Cabo San Lucas, after a medical assessment.",
  alternates: { canonical: "/aesthetic-medicine" },
  openGraph: { url: "/aesthetic-medicine", images: ["/opengraph-image"] },
};

const book = (t: string) => `${SITE.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book an aesthetic medicine assessment${t ? ` for ${t.toLowerCase()}` : ""}.`)}`;

const TREATMENTS: { name: string; art: ReactNode; price: string; priceNote?: string; what: string; points: string[] }[] = [
  {
    name: "Lip fillers",
    art: <LipsArt />,
    price: "From $600",
    what: "Hyaluronic acid to add natural-looking volume, shape and definition to the lips.",
    points: ["Local anesthetic for comfort", "Natural-looking results are the goal", "Assessment of shape and proportions first"],
  },
  {
    name: "Facial botulinum toxin treatments",
    art: <SyringeArt />,
    price: "From $170",
    priceNote: "per area · upper face $550",
    what: "Injections that soften expression lines on the forehead, between the brows and around the eyes.",
    points: ["Upper face: frown lines, forehead and crow's feet", "Single areas available", "Dose planned by your doctor"],
  },
  {
    name: "Skin brightening",
    art: <GlowArt />,
    price: "From $1,500",
    what: "A medical depigmenting peel for dark spots and uneven tone on the face.",
    points: ["Skin type assessed first", "Home-care advice from your doctor", "Sun protection is essential afterwards"],
  },
  {
    name: "Facial rejuvenation",
    art: <RejuvenationArt />,
    price: "After assessment",
    what: "A plan tailored to your skin and goals, designed with your doctor during the assessment.",
    points: ["Personalized plan", "Total price confirmed in writing", "Can be planned around your trip"],
  },
];

const STEPS = [
  ["Assessment", "In-person medical assessment at our clinic in Centro, Cabo San Lucas: health history, goals and suitability."],
  ["Plan & total price", "Your doctor explains the treatment, risks, aftercare and realistic expectations, and confirms the total in writing."],
  ["Treatment", "By appointment, usually the same visit or on a date that suits your trip."],
  ["Aftercare", "Written aftercare instructions and a WhatsApp line for your questions."],
];

const FAQ = [
  { q: "Who performs the treatments?", a: `Our aesthetic medicine division is led by ${LEAD}. Every treatment starts with an in-person medical assessment.` },
  { q: "Are prices in US dollars?", a: "Yes. These are starting prices in US dollars. Your doctor confirms the total for your treatment in writing after the assessment, before anything is done." },
  { q: "Can I have a treatment during my vacation?", a: "Often yes. Tell us your travel dates when you book; your doctor will tell you whether the treatment and its aftercare fit your trip, including sun exposure and swimming." },
  { q: "Are aesthetic treatments covered by insurance?", a: "No. Aesthetic treatments are not covered by health or travel insurance." },
  { q: "What results can I expect?", a: "Results vary from person to person. We do not guarantee results; your doctor will explain realistic expectations and possible side effects during the assessment." },
];

export default function AestheticMedicine() {
  const services = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Aesthetic medicine treatments in Cabo San Lucas",
    itemListElement: TREATMENTS.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "MedicalProcedure", name: t.name, description: t.what, url: abs("/aesthetic-medicine"), provider: { "@id": orgId } } })),
  };
  return (
    <>
      <JsonLd data={[services, faqSchema(FAQ)]} />

      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-8 md:grid-cols-2 md:pb-16">
          <div>
            <Breadcrumbs items={[{ name: "Aesthetic medicine", href: "/aesthetic-medicine" }]} />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand">Aesthetic medicine · Cabo San Lucas</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">Natural-looking aesthetic treatments in Cabo</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Lip fillers, wrinkle-relaxing injections, skin brightening and facial rejuvenation by appointment, after an in-person medical assessment. Our aesthetic medicine division is led by {LEAD}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book?service=aesthetics" className="btn btn-primary !px-6 !py-3.5">Book an assessment</Link>
              <a href="#treatments" className="btn btn-outline !px-6 !py-3.5">See treatments &amp; prices</a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <li>✓ Medical assessment first</li><li>✓ Total price in writing</li><li>✓ English &amp; Spanish</li>
            </ul>
          </div>
          <AestheticHero className="mx-auto w-full max-w-md drop-shadow-sm" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Treatments */}
        <section id="treatments" className="scroll-mt-24 py-12" aria-labelledby="treatments-h">
          <h2 id="treatments-h" className="text-2xl font-bold tracking-tight md:text-3xl">Treatments and prices</h2>
          <p className="mt-2 text-slate-600">Starting prices in US dollars. Your doctor confirms the total after the assessment.</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {TREATMENTS.map((t) => (
              <li key={t.name} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:shadow-md">
                {t.art}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="text-right"><span className="text-xl font-bold text-brand">{t.price}</span>{t.priceNote && <span className="block text-xs text-slate-500">{t.priceNote}</span>}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.what}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">{t.points.map((p) => <li key={p}>✓ {p}</li>)}</ul>
                  <a href={book(t.name)} target="_blank" rel="noopener" className="btn btn-outline mt-5 self-start !py-2">Ask about {t.name.toLowerCase()}</a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="py-10" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold tracking-tight">How it works</h2>
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

        {/* Safety */}
        <section className="py-6" aria-labelledby="safety">
          <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
            <h2 id="safety" className="text-xl font-semibold">Safety first</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Aesthetic treatments are medical procedures. They are only performed after an assessment, and your doctor may recommend not to treat — for example during pregnancy or breastfeeding, with active skin infections or with certain medications. Common, usually temporary effects include redness, swelling or bruising. We do not show before-and-after photos or promise specific results.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-slate-200 border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-6 rounded-3xl bg-navy px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Book your assessment</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">Tell us the treatment you are interested in and your travel dates. We reply in English or Spanish.</p>
          <a href={book("")} target="_blank" rel="noopener" className="btn mt-6 bg-white !px-6 !py-3.5 text-brand hover:bg-surface">Message us on WhatsApp</a>
        </section>
        <RelatedServices current="/aesthetic-medicine" />
        <p className="mt-6 pb-4 text-xs leading-relaxed text-slate-500">
          General information, not medical advice. See also <Link href="/doctor-consultation" className="text-brand">doctor consultations</Link> and <Link href="/lab-tests-imaging" className="text-brand">lab tests &amp; imaging</Link>.
        </p>
      </div>
    </>
  );
}
