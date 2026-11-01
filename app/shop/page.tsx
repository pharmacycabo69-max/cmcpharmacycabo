import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

type SP = { q?: string; page?: string; sort?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: "Shop Pharmacy & Health Products in Cabo",
    description: "Browse medications, vitamins, personal care and health essentials with 24/7 delivery in Cabo San Lucas & San José del Cabo.",
    alternates: { canonical: "/shop" },
    robots: sp.q || sp.sort ? { index: false, follow: true } : undefined,
  };
}

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  return <ShopView base="/shop" params={await searchParams} />;
}
