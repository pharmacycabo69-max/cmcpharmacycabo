import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import catalog from "@/content/lab-imaging.json";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * Lab tests & imaging (owner approved 24 Nov 2026: publish the catalogue without prices, quote on request).
 * Providers are not named: no signed agreement is confirmed (content/lab-imaging.json lists what is excluded).
 */
export const metadata: Metadata = {
  title: "Lab Tests & Imaging in Cabo San Lucas: Blood Work, X-Ray, Ultrasound",
  description:
    "Blood work, urine and stool tests, hormones, cultures, X-rays and ultrasound coordinated by our medical team in Cabo San Lucas. Ask for a quote on WhatsApp.",
  alternates: { canonical: "/lab-tests-imaging" },
  openGraph: { url: "/lab-tests-imaging", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "How much do lab tests cost?", a: "Prices depend on the tests and where the sample is taken. Send us the list of tests on WhatsApp and we will send you a quote in US dollars before you book." },
  { q: "Do I need a doctor's order?", a: "Bring the order from your doctor if you have one. If you don't, our doctors can assess you by video or in person and order the tests you need." },
  { q: "How do I prepare and when are results ready?", a: "Preparation (for example fasting) and turnaround time depend on each test. We confirm both when you book." },
  { q: "Is a radiologist's report included?", a: "We confirm who reads the study and whether a written report is included when you request your quote." },
];

const quote = `${SITE.whatsapp}?text=${encodeURIComponent("Hi! I'd like a quote for lab tests or imaging.")}`;
const count = catalog.lab.reduce((n, a) => n + a.tests.length, 0);

export default function LabTestsImaging() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={faqSchema(FAQ)} />
      <Breadcrumbs items={[{ name: "Lab tests & imaging", href: "/lab-tests-imaging" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Lab tests &amp; imaging in Cabo San Lucas</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Our medical team coordinates blood work, urine and stool tests, cultures, X-rays and ultrasound with laboratories and imaging centers in Cabo San Lucas. Prices are quoted on request, in US dollars, before you book.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={quote} target="_blank" rel="noopener" className="btn btn-primary">Request a quote on WhatsApp</a>
        <Link href="/doctor-consultation" className="btn btn-outline">Need a doctor&apos;s order?</Link>
      </div>

      <section className="mt-12" aria-labelledby="lab">
        <h2 id="lab" className="text-xl font-semibold">Laboratory tests ({count})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {catalog.lab.map((a) => (
            <div key={a.area} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold">{a.area}</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">{a.tests.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="img">
        <h2 id="img" className="text-xl font-semibold">Diagnostic imaging</h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {catalog.imaging.map((t) => <li key={t} className="rounded-xl border border-slate-200 bg-white px-4 py-3">{t}</li>)}
        </ul>
        <p className="mt-3 text-sm text-slate-600">Studies are done at the imaging center; we confirm location, preparation and report when you book.</p>
      </section>

      <div className="mt-12"><InsuranceNotice compact /></div>

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
        Don&apos;t see the test you need? Ask us on WhatsApp. Some tests are only available after a medical consultation. In an emergency, call 911.
      </p>
    </div>
  );
}
