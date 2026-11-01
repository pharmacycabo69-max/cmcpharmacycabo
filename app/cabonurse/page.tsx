import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookingWizard } from "@/components/BookingWizard";
import { JsonLd, orgId } from "@/lib/seo";
import { NURSE, NURSE_SERVICES } from "@/lib/cabonurse";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "CaboNurse: IV Therapy & Nurse at Your Hotel or Villa in Los Cabos",
  description: "Book a licensed nurse for IV hydration, recovery and immunity drips at your hotel or villa in Cabo San Lucas and San José del Cabo. Pick a time online and pay a 50% deposit securely.",
  alternates: { canonical: "/cabonurse" },
};

export default async function CaboNurse({ searchParams }: { searchParams: Promise<{ error?: string; service?: string }> }) {
  const { error, service } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: "CaboNurse — IV therapy and nurse visits in Los Cabos",
        serviceType: "Mobile IV therapy", provider: { "@id": orgId }, areaServed: ["Cabo San Lucas", "San José del Cabo", "Los Cabos"], url: abs("/cabonurse"),
        hasOfferCatalog: { "@type": "OfferCatalog", name: "CaboNurse services", itemListElement: NURSE_SERVICES.map((s) => ({ "@type": "Offer", price: s.priceUsd.toFixed(2), priceCurrency: "USD", itemOffered: { "@type": "Service", name: s.name, description: s.description } })) },
      }} />
      <Breadcrumbs items={[{ name: "CaboNurse", href: "/cabonurse" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">CaboNurse: IV therapy and a nurse at your hotel or villa</h1>
      <p className="mt-4 text-lg text-slate-600">A licensed nurse comes to you anywhere in Cabo San Lucas, San José del Cabo and the Corridor. Choose your drip, pick a time and secure it with a 50% deposit. The balance is paid after the service.</p>
      <div className="mt-8"><BookingWizard initialService={service} error={error} /></div>
      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">CaboNurse is not an emergency service. In an emergency call <strong>911</strong> or go to the nearest hospital. Questions before booking? Call or WhatsApp <strong>{NURSE.phoneDisplay}</strong>.</p>
    </div>
  );
}
