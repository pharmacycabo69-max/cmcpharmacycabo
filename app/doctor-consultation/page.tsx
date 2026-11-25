import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { JsonLd, faqSchema, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

/**
 * Medical services (master data §2, D12, D17: USD, taxes included). Replaces the imported page, which showed
 * placeholder doctor/reviews and a 24/7 "AI doctor".
 * Named physician: published on the owner's explicit instruction (24 Nov 2026), data from master data §3.
 * No photo until an authorized one is supplied.
 */
const DOCTOR = {
  name: "Dr. Kevin González Adame",
  degree: "Médico Cirujano y Partero (Physician and Surgeon)",
  school: "Instituto Politécnico Nacional (IPN)",
  license: "14796516",
  languages: ["English", "Spanish"],
  clinic: "Cabo Walk-In Clinic",
};
export const metadata: Metadata = {
  title: "English-Speaking Doctor in Cabo San Lucas: Video $59, Clinic $99, Hotel Visit $189",
  description:
    "See an English-speaking doctor in Cabo San Lucas: video consultation $59, clinic visit $99 or a doctor at your hotel or villa for $189 (USD, taxes included), by appointment.",
  alternates: { canonical: "/doctor-consultation" },
  openGraph: { url: "/doctor-consultation", images: ["/opengraph-image"] },
};

const wa = (text: string) => `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

const SERVICES = [
  {
    name: "Video consultation",
    price: 59,
    where: "From your phone or laptop, wherever you are staying.",
    detail: "Advice, prescriptions when appropriate and referrals, without leaving your room.",
    cta: "Book a video consultation",
    msg: "Hi! I'd like to book a video consultation with a doctor.",
  },
  {
    name: "Clinic visit",
    price: 99,
    where: `At our clinic in Centro, Cabo San Lucas (${SITE.street.split(",")[0]}). Every day 9:00 am – 5:00 pm.`,
    detail: "In-person consultation and physical examination.",
    cta: "Book a clinic visit",
    msg: "Hi! I'd like to book a clinic visit with a doctor.",
  },
  {
    name: "Doctor at your hotel or villa",
    price: 189,
    where: "At your hotel, villa or home in Cabo San Lucas, San José del Cabo and the Corridor.",
    detail: "The doctor comes to you; we coordinate access with your hotel.",
    cta: "Book a hotel or villa visit",
    msg: "Hi! I'd like a doctor visit at my hotel or villa.",
  },
];

const STEPS = [
  ["Message us", "Tell us which service you need and where you are staying. Please don't send medical documents in the first message."],
  ["We confirm", "We confirm the doctor's availability, time and total price in writing before the visit."],
  ["Consultation", "The doctor assesses you and, when appropriate, gives you a prescription valid in Mexico."],
  ["Medicine delivered", "If you need medicine, our pharmacy delivers it to you, every day 7:00 am – 11:00 pm."],
];

const FAQ = [
  { q: "How much does a doctor visit cost in Cabo?", a: "Video consultation $59, clinic visit $99 and a doctor at your hotel or villa $189. Prices are in US dollars and include taxes." },
  { q: "Are you available after hours?", a: "The clinic is open every day from 9:00 am to 5:00 pm. Appointments outside those hours may be possible, subject to the doctor's confirmation." },
  { q: "Is this an emergency service?", a: "No. We provide general medical consultations by appointment. In an emergency, call 911 or go to the nearest hospital." },
  { q: "Can the doctor give me a prescription?", a: "Yes, when it is medically appropriate after the consultation. Prescription medicines can then be dispensed by our pharmacy and delivered to you." },
  { q: "Do you accept travel insurance?", a: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team before the visit to verify your eligibility and payment arrangements." },
];

export default function DoctorConsultation() {
  const offers = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Doctor consultations in Cabo San Lucas",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Service", name: s.name, provider: { "@id": orgId }, areaServed: "Los Cabos", offers: { "@type": "Offer", price: s.price.toFixed(2), priceCurrency: "USD", url: abs("/doctor-consultation") } },
    })),
  };
  const physician = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DOCTOR.name,
    jobTitle: "Physician",
    knowsLanguage: DOCTOR.languages,
    alumniOf: { "@type": "CollegeOrUniversity", name: DOCTOR.school },
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "Cédula profesional (Mexico)", identifier: DOCTOR.license },
    worksFor: { "@type": "MedicalClinic", name: DOCTOR.clinic },
  };
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={[offers, faqSchema(FAQ), physician]} />
      <Breadcrumbs items={[{ name: "Doctor consultation", href: "/doctor-consultation" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">English-speaking doctor in Cabo San Lucas</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Bilingual general medical consultations by video, at our clinic or at your hotel or villa, by appointment. Prices in US dollars, taxes included.
      </p>

      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p className="mt-1 text-3xl font-bold text-brand">${s.price}<span className="ml-1 text-sm font-medium text-slate-500">USD</span></p>
            <p className="mt-3 text-sm text-slate-700">{s.where}</p>
            <p className="mt-2 text-sm text-slate-600">{s.detail}</p>
            <a href={wa(s.msg)} target="_blank" rel="noopener" className="btn btn-primary mt-5 justify-center">{s.cta}</a>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="doctor">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your doctor</p>
        <h2 id="doctor" className="mt-1 text-xl font-semibold">{DOCTOR.name}</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Degree</dt><dd className="font-medium">{DOCTOR.degree}</dd></div>
          <div><dt className="text-slate-500">University</dt><dd className="font-medium">{DOCTOR.school}</dd></div>
          <div><dt className="text-slate-500">Mexican professional license (cédula)</dt><dd className="font-medium">{DOCTOR.license}</dd></div>
          <div><dt className="text-slate-500">Languages</dt><dd className="font-medium">{DOCTOR.languages.join(" & ")}</dd></div>
          <div className="sm:col-span-2"><dt className="text-slate-500">Clinic</dt><dd className="font-medium">{DOCTOR.clinic} · {SITE.street.split(",")[0]}, Centro, Cabo San Lucas</dd></div>
        </dl>
        <p className="mt-3 text-xs text-slate-500">You can verify any Mexican professional license in the public registry of the Secretaría de Educación Pública (SEP).</p>
      </section>

      <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <strong>Not an emergency service.</strong> For chest pain, trouble breathing, severe bleeding, loss of consciousness or any emergency, call <a href="tel:911" className="font-semibold underline">911</a> or go to the nearest hospital.
      </p>

      <section className="mt-12" aria-labelledby="how">
        <h2 id="how" className="text-xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-brand-soft p-5">
              <p className="text-sm font-bold text-brand">Step {i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12"><InsuranceNotice compact /></div>

      <section className="mt-12" aria-labelledby="more">
        <h2 id="more" className="text-xl font-semibold">Other services</h2>
        <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <li><Link href="/iv-therapy" className="block rounded-xl border border-slate-200 p-4 font-medium hover:border-brand hover:text-brand">IV therapy at your hotel — from $159</Link></li>
          <li><Link href="/lab-tests-imaging" className="block rounded-xl border border-slate-200 p-4 font-medium hover:border-brand hover:text-brand">Lab tests &amp; imaging — quote on request</Link></li>
          <li><Link href="/aesthetic-medicine" className="block rounded-xl border border-slate-200 p-4 font-medium hover:border-brand hover:text-brand">Aesthetic medicine — after assessment</Link></li>
        </ul>
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
    </div>
  );
}
