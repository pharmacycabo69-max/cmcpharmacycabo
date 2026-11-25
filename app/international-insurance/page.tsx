import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, faqSchema } from "@/lib/seo";
import { INSURANCE, SITE } from "@/lib/site";
import { MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Travel Insurance for a Doctor in Cabo: US & Canada Policies" },
  description: "See a doctor in Cabo with your US or Canadian health or travel insurance. We verify your policy and coverage before your visit and confirm how payment works.",
  alternates: { canonical: "/international-insurance" },
  openGraph: { url: "/international-insurance", images: ["/opengraph-image"] },
};

const STEPS = [
  { t: "Message us before your visit", d: "Tell us the name of your insurer and the service you need. We'll explain what information we need and how to send it through a private channel." },
  { t: "We verify your policy", d: "Our team checks eligibility, coverage and the payment arrangement that applies to your policy (for example, pay and claim, or another modality the insurer accepts)." },
  { t: "You decide, then receive care", d: "You know the conditions before the consultation. If coverage can't be confirmed, you can still be seen at the listed price." },
];

const FAQ = [
  { q: "Which insurance do you accept?", a: INSURANCE.body },
  { q: "Do you bill my insurer directly?", a: "It depends on your policy and your insurer. We don't promise direct billing: we verify the payment arrangement with you before the service, so there are no surprises." },
  { q: "Which services can be covered?", a: "Medical services such as doctor consultations by video, at our clinic or at your hotel. Whether a specific service is covered is confirmed during verification." },
  { q: "Should I send my policy documents through the website?", a: "No. Please don't send documents, policy numbers or medical details through website forms. Message us and we'll explain the private channel to use." },
  { q: "What if it's an emergency?", a: "Call 911 or go to the nearest hospital. We are not an emergency service." },
];

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[76rem] items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <Breadcrumbs items={[{ name: "International insurance", href: "/international-insurance" }]} />
            <p className="eyebrow mt-6">United States &amp; Canada</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-5xl">Using your travel or health insurance in Cabo</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">{INSURANCE.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={INSURANCE.href} target="_blank" rel="noopener" className="btn btn-primary">{INSURANCE.cta}</a>
              <Link href="/doctor-consultation" className="btn btn-outline">See doctor options</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="/locations/mercado-marina/02-counter-service.jpg" alt="Pharmacist at the counter of one of our pharmacies in Cabo San Lucas" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[35%_50%]" priority />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ins-how">
        <h2 id="ins-how" className="h2">How verification works</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="card p-6">
              <span className="font-display text-sm font-bold text-brand">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-navy">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[["Video consultation", MEDICAL_PRICES.video, "/doctor-consultation"], ["Clinic visit", MEDICAL_PRICES.clinic, "/doctor-consultation"], ["Doctor at your hotel", MEDICAL_PRICES.hotel, "/hotel-doctor-cabo"]].map(([t, p, href]) => (
            <Link key={String(t)} href={String(href)} className="card card-hover flex items-center justify-between p-5">
              <span className="font-semibold text-navy">{t}</span><span className="text-sm text-slate-600">${p} USD, taxes included</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8" aria-labelledby="ins-faq">
        <h2 id="ins-faq" className="h2">Questions about insurance</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">{SITE.name} does not advertise agreements with specific insurers: each policy is reviewed individually.</p>
      </section>
    </>
  );
}
