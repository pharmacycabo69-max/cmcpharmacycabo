import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/ServiceHero";
import catalog from "@/content/lab-imaging.json";
import { JsonLd, faqSchema } from "@/lib/seo";
import { MEDICAL_PRICES } from "@/lib/team";

/**
 * X-ray (V5 §8). Only studies listed in content/lab-imaging.json are offered; ultrasound is not.
 * Pending owner data: partner imaging center name, radiologist credentials, prices, mobile X-ray availability,
 * report turnaround. Nothing here is charged before a quote is validated and accepted.
 */
export const metadata: Metadata = {
  title: { absolute: "X-Ray in Cabo San Lucas: Quote Before You Pay" },
  description: "Chest, extremity and spine X-rays in Cabo San Lucas with a partner imaging center, coordinated by our doctors. Quote and availability confirmed before payment.",
  alternates: { canonical: "/x-ray-cabo", languages: { en: "/x-ray-cabo", es: "/es/rayos-x" } },
  openGraph: { url: "/x-ray-cabo", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "Which X-rays can I get?", a: `Currently: ${catalog.imaging.join("; ")}. Ultrasound is not offered at this time.` },
  { q: "Can the X-ray be done at my hotel?", a: "Mobile X-ray is only offered when our partner confirms it is technically viable for your case and location. Otherwise the study is done at the imaging center." },
  { q: "How much does an X-ray cost?", a: "We send a quote in US dollars with the location, preparation and report details before anything is charged." },
  { q: "Do I need a doctor's order?", a: `Bring your order if you have one. If not, our doctors can assess you by video ($${MEDICAL_PRICES.video}) or at the clinic ($${MEDICAL_PRICES.clinic}).` },
  { q: "Who reads the X-ray?", a: "The partner's radiology team. Their names and credentials are confirmed with your quote." },
];

export default function XRay() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <ServiceHero
        crumbs={[{ name: "X-ray", href: "/x-ray-cabo" }]}
        eyebrow="Diagnostic imaging · Partner imaging center"
        title={<>X-ray in Cabo San Lucas</>}
        lead="Chest, extremity and spine X-rays coordinated by our medical team with a partner imaging center. We validate the study, confirm availability and send you a quote before anything is charged."
        actions={[{ href: "/book?service=imaging", label: "Request an X-ray quote", primary: true }, { href: "/book?service=video", label: `Doctor first · $${MEDICAL_PRICES.video}` }]}
        points={["Quote first", "Report details confirmed", "English & Spanish"]}
        boardTitle="Studies offered"
        board={[...catalog.imaging.map((t) => ({ label: t, price: "Quote", href: "/book?service=imaging" })), { label: "Ultrasound", note: "Not offered at this time", price: "—" }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <section aria-labelledby="xr-how">
          <h2 id="xr-how" className="h2">How it works</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {["Request a quote with the study you need (or your doctor's order).", "We validate the study with the partner and confirm availability.", "You accept the quote and pay through a secure link.", "Study at the confirmed time; we tell you how you receive the report."].map((s, i) => (
              <li key={s} className="card p-5"><span className="font-display text-sm font-bold text-brand">0{i + 1}</span><p className="mt-2 text-sm text-navy">{s}</p></li>
            ))}
          </ol>
        </section>
        <section className="mt-12" aria-labelledby="xr-faq">
          <h2 id="xr-faq" className="h2">Questions about X-rays</h2>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <p className="mt-8 text-sm text-slate-600">Need lab tests too? See <Link href="/lab-tests-imaging" className="font-semibold text-brand">lab tests in Cabo</Link>. Not an emergency service: in an emergency call 911.</p>
      </div>
    </>
  );
}
