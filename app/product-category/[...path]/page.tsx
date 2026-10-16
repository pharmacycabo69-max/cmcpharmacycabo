import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { categoryBySlug } from "@/lib/products";

type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<{ q?: string; page?: string; sort?: string }> };

const slugOf = (path: string[]) => decodeURIComponent(path[path.length - 1]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = categoryBySlug(slugOf((await params).path));
  return c ? { title: c.name, description: `Shop ${c.name} at CMC Pharmacy Cabo with 24/7 delivery in Los Cabos.` } : {};
}

export default async function Category({ params, searchParams }: Props) {
  const { path } = await params;
  const category = categoryBySlug(slugOf(path));
  if (!category) notFound();
  return <ShopView base={`/product-category/${path.join("/")}`} params={await searchParams} category={category} />;
}
