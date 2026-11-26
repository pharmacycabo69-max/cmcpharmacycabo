import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/ServiceHero";
import { JsonLd, faqSchema } from "@/lib/seo";

/**
 * Nursing care (owner V5: quoted and confirmed before payment). No specific procedures are advertised until the
 * owner confirms scope, staff and credentials; the page describes the request process only.
 */
export const metadata: Metadata = {
  title: { absolute: "Nursing Care at Your Hotel in Cabo San Lucas | Quote" },
  description: "Request nursing care at your hotel, villa or home in Los Cabos. We review what you need, confirm the professional and availability, and send a quote before payment.",
  alternates: { canonical: "/nursing-cabo" },
  openGraph: { url: "/nursing-cabo", images: ["/opengraph-image"] },
};

const FAQ = [
  { q: "What nursing care can I request?", a: "Tell us what you need and, if you have one, your doctor's instructions. We confirm whether we can provide it, who will attend and the price before anything is charged." },
  { q: "Do you need a doctor's order?", a: "Some care requires one. If you don't have it, our doctors can assess you first by video or at your hotel." },
  { q: "How is it priced?", a: "By quote, depending on the care, duration and location. Nothing is charged before you accept the quote." },
  { q: "Is this an emergency service?", a: "No. In an emergency call 911 or go to the nearest hospital." },
];

export default function Nursing() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <ServiceHero
        crumbs={[{ name: "Nursing care", href: "/nursing-cabo" }]}
        eyebrow="Nursing · Hotel, villa or home"
        title={<>Nursing care at your hotel in Cabo San Lucas</>}
        lead="Tell us what care you need. We review it with our medical team, confirm the professional and the time, and send a quote before anything is charged."
        actions={[{ href: "/book?service=nursing", label: "Request nursing care", primary: true }, { href: "/book?service=home-doctor", label: "Doctor at your hotel · $189" }]}
        points={["Quote first", "Medical review", "English & Spanish"]}
        boardTitle="How it is priced"
        board={[{ label: "Nursing care", note: "Scope and duration confirmed with you", price: "Quote", href: "/book?service=nursing" }, { label: "Doctor at your hotel", note: "If you need an assessment first", price: "$189", href: "/book?service=home-doctor" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="h2">Questions about nursing care</h2>
        <div className="mt-5 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">Looking for IV therapy? See <Link href="/iv-therapy" className="font-semibold text-brand">IV therapy at your hotel</Link>.</p>
      </div>
    </>
  );
}
