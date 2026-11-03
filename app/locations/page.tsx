import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StoreCard } from "@/components/StoreCard";
import { LOCATIONS } from "@/lib/locations";
import { JsonLd } from "@/lib/seo";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pharmacy Locations in Cabo San Lucas",
  description: `${LOCATIONS.length} pharmacies and minimarkets in the Centro and Marina area of Cabo San Lucas, open every day with English and Spanish service, plus delivery to hotels and villas.`,
  alternates: { canonical: "/locations" },
};

export default function Locations() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: LOCATIONS.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/locations/${l.slug}`), name: l.gbpName })) }} />
      <Breadcrumbs items={[{ name: "Locations", href: "/locations" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Pharmacy locations in Cabo San Lucas</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Walk in for sun care, first aid, hydration and personal care, or order delivery to your hotel or villa. All stores are open every day and attend in English and Spanish.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.map((l, i) => <StoreCard key={l.slug} l={l} priority={i < 3} />)}
      </div>
    </div>
  );
}
