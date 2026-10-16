import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

export const metadata: Metadata = { title: "Shop", description: "Browse medications, vitamins, personal care and health essentials delivered 24/7 in Cabo San Lucas & San José del Cabo." };

export default async function Shop({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; sort?: string }> }) {
  return <ShopView base="/shop" params={await searchParams} />;
}
