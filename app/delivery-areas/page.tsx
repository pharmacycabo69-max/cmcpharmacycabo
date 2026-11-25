import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBanner } from "@/components/PageBanner";
import { deliveryAreas } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pharmacy Delivery to Every Hotel & Resort in Los Cabos",
  description: "We deliver medicine to every hotel, resort and villa in Cabo San Lucas, San José del Cabo and the Tourist Corridor, every day 7 am–11 pm. Free delivery on orders of $59+.",
  alternates: { canonical: "/delivery-areas" },
};

export default function DeliveryAreas() {
  const areas = deliveryAreas();
  return (
    <>
    <PageBanner />
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Delivery areas", href: "/delivery-areas" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Pharmacy delivery to every hotel &amp; resort in Los Cabos</h1>
      <p className="mt-4 max-w-2xl text-slate-600"><strong>We deliver to every hotel, resort, villa, vacation rental and home</strong> in Cabo San Lucas, San José del Cabo and the Tourist Corridor — prescriptions, over-the-counter medicine and travel essentials, every day from 7 am to 11 pm. Delivery is free on orders of ${SITE.freeDeliveryFrom} or more.</p>
      <p className="mt-3 max-w-2xl text-slate-600">Below are some of the hotels we deliver to most often. <strong>Don&apos;t see yours? We deliver there too</strong> — message us on <a className="font-medium text-brand" href={SITE.whatsapp} target="_blank" rel="noopener">WhatsApp {SITE.whatsappDisplay}</a> or call <a className="font-medium text-brand" href={SITE.tel}>{SITE.phone}</a>.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {areas.map((p) => (
          <li key={p.slug}><Link href={`/${p.slug}`} className="block rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{p.title}</Link></li>
        ))}
      </ul>
      <p className="mt-8 text-xs leading-relaxed text-slate-500">Hotel names are used only to describe where we deliver; {SITE.name} is an independent service and is not affiliated with these properties. Some hotels only accept deliveries at the front desk or concierge — we coordinate it with you.</p>
    </div>
    </>
  );
}
