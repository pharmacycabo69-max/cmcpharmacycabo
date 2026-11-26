import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

type SP = { q?: string; page?: string; sort?: string; type?: string; price?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const title = page > 1 ? `Shop Pharmacy & Health Products in Cabo – Page ${page}` : "Shop Pharmacy & Health Products in Cabo";
  return {
    title: { absolute: title },
    description: "Browse medications, vitamins, personal care and health essentials with daily delivery (8 am–11:30 pm) in Cabo San Lucas & San José del Cabo.",
    alternates: { canonical: page > 1 ? `/shop?page=${page}` : "/shop" },
    robots: sp.q || sp.sort || sp.type || sp.price ? { index: false, follow: true } : undefined,
  };
}

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  return <ShopView base="/shop" params={await searchParams} />;
}
