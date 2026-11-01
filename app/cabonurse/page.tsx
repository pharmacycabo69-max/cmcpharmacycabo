import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, orgId } from "@/lib/seo";
import { NURSE_SERVICES } from "@/lib/cabonurse";
import { SITE, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "CaboNurse: Nurse at Your Hotel or Villa in Los Cabos",
  description: "Book a licensed nurse to come to your hotel or villa in Cabo San Lucas and San José del Cabo. Injections, wound care, IV hydration and home visits. Pay securely online.",
  alternates: { canonical: "/cabonurse" },
};

const ERRORS: Record<string, string> = {
  invalid: "Please check the form: all fields except notes are required and the date can’t be in the past.",
  config: "Online payment is temporarily unavailable. Please call or WhatsApp us to book.",
  stripe: "We couldn’t start the payment. Please try again or call us to book.",
};

export default async function CaboNurse({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: "CaboNurse — nurse visits in Los Cabos",
        serviceType: "In-home nursing", provider: { "@id": orgId }, areaServed: ["Cabo San Lucas", "San José del Cabo", "Los Cabos"], url: abs("/cabonurse"),
        hasOfferCatalog: { "@type": "OfferCatalog", name: "CaboNurse services", itemListElement: NURSE_SERVICES.map((s) => ({ "@type": "Offer", price: s.priceUsd.toFixed(2), priceCurrency: "USD", itemOffered: { "@type": "Service", name: s.name, description: s.description } })) },
      }} />
      <Breadcrumbs items={[{ name: "CaboNurse", href: "/cabonurse" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">CaboNurse: a licensed nurse at your hotel or villa</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">Choose a service, pick a time and pay securely online. A nurse comes to you anywhere in Cabo San Lucas, San José del Cabo and the Corridor.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {NURSE_SERVICES.map((s) => (
          <li key={s.id} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-baseline justify-between gap-3"><h2 className="font-semibold">{s.name}</h2><span className="font-semibold text-brand">${s.priceUsd}</span></div>
            <p className="mt-2 text-sm text-slate-600">{s.description}</p>
            <p className="mt-2 text-xs text-slate-400">{s.duration}</p>
          </li>
        ))}
      </ul>

      <section id="book" className="mt-12 scroll-mt-24 rounded-2xl bg-brand-soft p-6 md:p-8" aria-labelledby="book-h">
        <h2 id="book-h" className="text-2xl font-bold">Book a nurse</h2>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{ERRORS[error] ?? ERRORS.invalid}</p>}
        <form method="post" action="/api/cabonurse/checkout" className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">Service
            <select name="service" required className={input} defaultValue="">
              <option value="" disabled>Select a service</option>
              {NURSE_SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.priceUsd}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Full name<input name="name" required maxLength={100} autoComplete="name" className={input} /></label>
          <label className="text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className={input} /></label>
          <label className="text-sm font-medium">Phone / WhatsApp<input name="phone" type="tel" required autoComplete="tel" className={input} /></label>
          <label className="text-sm font-medium">Hotel / villa &amp; room<input name="address" required maxLength={250} className={input} /></label>
          <label className="text-sm font-medium">Date<input name="date" type="date" min={today} required className={input} /></label>
          <label className="text-sm font-medium">Time<input name="time" type="time" required className={input} /></label>
          <label className="text-sm font-medium sm:col-span-2">Notes for the nurse (optional)<textarea name="notes" rows={3} maxLength={400} className={input} /></label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="sm:col-span-2">
            <button className="btn btn-primary w-full sm:w-auto">Continue to secure payment</button>
            <p className="mt-3 text-xs text-slate-500">You’ll pay on Stripe’s secure page. We confirm your visit time by phone or WhatsApp.</p>
          </div>
        </form>
      </section>

      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">CaboNurse is not an emergency service. In an emergency call <strong>911</strong> or go to the nearest hospital. For questions before booking call <a className="font-medium underline" href={SITE.tel}>{SITE.phone}</a>.</p>
    </div>
  );
}
