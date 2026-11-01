import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { categoryBySlug } from "@/lib/products";

type SP = { q?: string; page?: string; sort?: string };
type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<SP> };

const slugOf = (path: string[]) => decodeURIComponent(path[path.length - 1]);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const c = categoryBySlug(slugOf((await params).path));
  if (!c) return {};
  const sp = await searchParams;
  return {
    title: `${c.name} in Cabo San Lucas`,
    description: `Shop ${c.name} at CMC Pharmacy Cabo with 24/7 delivery to hotels, resorts and villas in Los Cabos.`,
    alternates: { canonical: `/product-category/${c.slug}` },
    robots: sp.q || sp.sort ? { index: false, follow: true } : undefined,
  };
}

export default async function Category({ params, searchParams }: Props) {
  const category = categoryBySlug(slugOf((await params).path));
  if (!category) notFound();
  return <ShopView base={`/product-category/${category.slug}`} params={await searchParams} category={category} />;
}
