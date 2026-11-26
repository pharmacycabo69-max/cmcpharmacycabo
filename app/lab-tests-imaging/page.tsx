import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedServices } from "@/components/RelatedServices";
import { LabAreaIcon, XrayArt } from "@/components/Illustrations";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import catalog from "@/content/lab-imaging.json";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { ServiceHero } from "@/components/ServiceHero";

/**
 * Lab tests & imaging (owner approved 24 Nov 2026: publish the catalogue without prices, quote on request).
 * Providers are not named: no signed agreement is confirmed (content/lab-imaging.json lists what is excluded).
 * Images: original illustrations (components/Illustrations.tsx).
 */
export const metadata: Metadata = {
  title: { absolute: "Lab Tests in Cabo San Lucas: Blood Work & More" },
  description:
    `Blood work, urine and stool tests and hormones in Cabo San Lucas: ${93} lab tests with partner laboratories, quoted before anything is charged. X-ray on its own page.`,
  alternates: { canonical: "/lab-tests-imaging", languages: { en: "/lab-tests-imaging", es: "/es/laboratorio" } },
  openGraph: { url: "/lab-tests-imaging", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "How much do lab tests cost?", a: "Prices depend on the tests and where the sample is taken. Send us the list of tests on WhatsApp and we will send you a quote in US dollars before you book." },
  { q: "Do I need a doctor's order?", a: "Bring the order from your doctor if you have one. If you don't, our doctors can assess you by video ($59) or in person ($99) and order the tests you need." },
  { q: "How do I prepare and when are results ready?", a: "Preparation (for example fasting) and turnaround time depend on each test. We confirm both when you book." },
  { q: "Do you do X-rays?", a: "Yes, with a partner imaging center. See our X-ray page; ultrasound is not offered at this time." },
];

const quote = (t: string) => `${SITE.whatsapp}?text=${encodeURIComponent(`Hi! I'd like a quote for ${t}.`)}`;
const count = catalog.lab.reduce((n, a) => n + a.tests.length, 0);
const xrays = catalog.imaging.filter((t) => /x-ray/i.test(t));

const STEPS = [
  ["Send your list", "Message us the tests or studies you need, or the photo of your doctor's order."],
  ["Get a quote", "We reply with the total in US dollars, preparation and where it is done."],
  ["Sample or study", "Go to the lab or imaging center at the confirmed time."],
  ["Results", "We confirm how and when you receive your results; review them with our doctor by video if you wish."],
];

export default function LabTestsImaging() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />

      {/* Hero */}
      <ServiceHero
        crumbs={[{ name: "Lab tests & imaging", href: "/lab-tests-imaging" }]}
        eyebrow="Diagnostics · Partner laboratories & imaging centers"
        title={<>Lab tests in Cabo San Lucas</>}
        lead="Blood work, urine and stool tests and hormones, coordinated by our medical team with partner laboratories in Cabo San Lucas. We validate the tests and send a quote before anything is charged."
        actions={[{ href: "/book?service=lab", label: "Request a lab quote", primary: true }, { href: "/x-ray-cabo", label: "Need an X-ray?" }]}
        points={[`${count} lab tests`, "Partner laboratories", "Quote first", "English & Spanish"]}
        boardTitle="How it is priced"
        board={[
          { label: "Laboratory tests", note: `${count} tests with partner laboratories`, price: "Quote", href: "/book?service=lab" },
          { label: "X-ray", note: "Separate service with a partner imaging center", price: "Quote", href: "/x-ray-cabo" },
          { label: "Not sure which test?", note: "See a doctor by video first", price: "$59", href: "/book?service=video" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4">
        {/* Imaging: X-ray only (V5) */}
        <section className="py-12" aria-labelledby="img">
          <h2 id="img" className="text-2xl font-bold tracking-tight md:text-3xl">X-ray</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { title: "X-ray", art: <XrayArt />, items: xrays, q: "an X-ray" },
            ].map((g) => (
              <div key={g.title} className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
                {g.art}
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-700">{g.items.map((t) => <li key={t}>• {t}</li>)}</ul>
                  <Link href="/x-ray-cabo" className="btn btn-outline mt-5 !py-2">X-ray details &amp; quote</Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Ultrasound is not offered at this time. X-rays are done with a partner imaging center; we confirm location, preparation and report before anything is charged.</p>
        </section>

        {/* Laboratory */}
        <section className="py-6" aria-labelledby="lab">
          <h2 id="lab" className="text-2xl font-bold tracking-tight md:text-3xl">Laboratory tests <span className="text-slate-500">({count})</span></h2>
          <p className="mt-2 text-slate-600">Tap an area to see every test.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.lab.map((a) => (
              <details key={a.area} className="group rounded-2xl border border-line bg-white p-5 shadow-sm open:shadow-md">
                <summary className="flex cursor-pointer items-center gap-3">
                  <LabAreaIcon area={a.area} />
                  <span className="flex-1"><span className="block font-semibold">{a.area}</span><span className="text-xs text-slate-500">{a.tests.length} tests</span></span>
                  <span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">{a.tests.map((t) => <li key={t}>{t}</li>)}</ul>
              </details>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-12" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-brand-soft p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-brand shadow-sm">{i + 1}</span>
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <InsuranceNotice compact />

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

        <section className="mb-6 rounded-3xl bg-navy px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Get your quote on WhatsApp</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">Send us the tests you need or a photo of your doctor&apos;s order. Some tests are only available after a medical consultation.</p>
          <a href={quote("lab tests")} target="_blank" rel="noopener" className="btn mt-6 bg-white !px-6 !py-3.5 text-brand hover:bg-brand-soft">Message us</a>
        </section>
        <RelatedServices current="/lab-tests-imaging" />
        <p className="mt-6 pb-4 text-xs text-slate-500">Not an emergency service: in an emergency, call 911.</p>
      </div>
    </>
  );
}
