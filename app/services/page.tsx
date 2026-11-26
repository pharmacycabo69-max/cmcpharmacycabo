import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServicesDirectory, type DirItem } from "@/components/ServicesDirectory";
import { BOOKABLE, MODE_LABEL } from "@/lib/booking";
import { JsonLd } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Medical & Pharmacy Services in Cabo San Lucas | CMC Pharmacy" },
  description: "Every service in one place: pharmacy delivery, video doctor $59, walk-in $99, home doctor $189, IV $159, NAD+ $279, lab tests, X-ray, aesthetics and insurance.",
  alternates: { canonical: "/services" },
};

const GROUPS = ["Pharmacy", "Doctor", "IV therapy", "Tests", "Aesthetics", "Concierge"];

export default function ServicesPage() {
  const items: DirItem[] = [
    { id: "pharmacy", name: "Pharmacy delivery", group: "Pharmacy", summary: `Prescription and OTC medicine to your hotel, villa or home, ${SITE.deliveryHours.label}. A pharmacist confirms availability and total first.`, price: "Free $99+", tags: ["No online charge", "Rx with valid prescription"], cta: "Order medicine", href: "/shop", more: "/24-7-pharmacy-delivery-cabo-san-lucas" },
    { id: "request", name: "Send a list or photo", group: "Pharmacy", summary: "Can't find it in the catalog? Build a request or send the name or a photo of the box.", price: "Free", tags: ["English & Spanish"], cta: "Start a request", href: "/request" },
    ...BOOKABLE.map((b) => ({
      id: b.id, name: b.name, group: b.group, summary: b.summary,
      price: b.price ? `${b.options ? "From " : ""}$${b.price}` : "Quote",
      tags: [...b.modes.map((m) => MODE_LABEL[m]), b.pay === "quote" ? (b.provider === "partner" ? "Partner · quote first" : "Assessment first") : "Pay after confirmation"],
      cta: b.price ? "Book" : "Request quote", href: `/book?service=${b.id}`, more: b.page,
    })),
    { id: "insurance", name: "International insurance", group: "Concierge", summary: "US and Canadian policies, subject to verification of the policy and coverage before your visit.", price: "Verify", tags: ["No direct billing promised"], cta: "Verify insurance", href: "/international-insurance" },
    { id: "concierge", name: "Hotels, villas & concierges", group: "Concierge", summary: "One contact for your guests' medicine, doctor visits and IV therapy, including groups.", price: "B2B", tags: ["No guest health data needed"], cta: "Partner with us", href: "/for-concierges#partner" },
  ];
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "CMC Pharmacy Cabo services",
    itemListElement: items.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: abs(s.more ?? s.href.split("?")[0]) })),
  };
  return (
    <div className="bg-surface">
      <JsonLd data={ld} />
      <div className="mx-auto max-w-[76rem] px-4 py-10">
        <Breadcrumbs items={[{ name: "Services", href: "/services" }]} />
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">Everything you may need in Los Cabos</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Pharmacy, doctors, IV therapy, tests and aesthetics from one team. Prices in USD, taxes included. Medical services are paid only after we confirm your time; partner services are quoted first.</p>
        <div className="mt-8"><ServicesDirectory items={items} groups={GROUPS} /></div>
        <p className="mt-8 text-xs text-slate-500">Not an emergency service: in an emergency, call 911. Lab and imaging studies are performed by partner providers and coordinated by our doctors.</p>
      </div>
    </div>
  );
}
