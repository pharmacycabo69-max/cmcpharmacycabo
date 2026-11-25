import type { Metadata } from "next";
import { BookingFlow } from "@/components/BookingFlow";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "Book a Doctor, IV Therapy or Tests in Cabo | CMC Pharmacy Cabo" },
  description: "Book a video consultation ($59), walk-in visit ($99), home doctor ($189), IV therapy ($159) or NAD+ ($279) in Cabo. Pay online only after we confirm your time.",
  alternates: { canonical: "/book" },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; option?: string }> }) {
  const { service, option } = await searchParams;
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-[76rem] px-4 py-10">
        <Breadcrumbs items={[{ name: "Book care", href: "/book" }]} />
        <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Book medical care</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Choose a service and a preferred time. Our team confirms availability on WhatsApp, then you pay online. Prices in USD, taxes included.</p>
          </div>
          <p className="text-sm text-slate-500">Emergency? Call <a href="tel:911" className="font-semibold text-navy">911</a></p>
        </div>
        <div className="mt-8"><BookingFlow initial={service} initialOption={option} /></div>
      </div>
    </div>
  );
}
