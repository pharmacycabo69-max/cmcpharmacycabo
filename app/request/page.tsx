import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RequestView } from "@/components/RequestView";

export const metadata: Metadata = {
  title: "Your pharmacy request",
  description: "Review the products in your pharmacy request and send it to our team. No payment until a pharmacist confirms availability and the total.",
  alternates: { canonical: "/request" },
  robots: { index: false, follow: true },
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10">
      <Breadcrumbs items={[{ name: "Pharmacy", href: "/shop" }, { name: "Your request", href: "/request" }]} />
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Your pharmacy request</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Build your list, send it once, and a pharmacist confirms availability, prescription requirements and the total. Nothing is charged online.</p>
      <RequestView />
    </div>
  );
}
