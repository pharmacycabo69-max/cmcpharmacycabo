import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { deliveryAreas } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pharmacy Delivery to Los Cabos Hotels & Resorts",
  description: "24/7 pharmacy delivery to hotels, resorts and villas in Cabo San Lucas, San José del Cabo and the Corridor. Find your hotel and order by phone or WhatsApp.",
  alternates: { canonical: "/delivery-areas" },
};

export default function DeliveryAreas() {
  const areas = deliveryAreas();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Delivery areas", href: "/delivery-areas" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Pharmacy delivery to Los Cabos hotels &amp; resorts</h1>
      <p className="mt-4 max-w-2xl text-slate-600">We deliver prescriptions, over-the-counter medicine and travel essentials 24/7 to hotels, resorts and villas across Cabo San Lucas, San José del Cabo and the Corridor. Find your hotel below, or call <a className="font-medium text-brand" href={SITE.tel}>{SITE.phone}</a>.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {areas.map((p) => (
          <li key={p.slug}><Link href={`/${p.slug}`} className="block rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{p.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
