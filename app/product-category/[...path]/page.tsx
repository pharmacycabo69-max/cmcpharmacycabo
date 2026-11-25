import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { categoryContent } from "@/lib/category-content";
import { categoryBySlug, categoryLabel, isIndexableCategory } from "@/lib/products";

type SP = { q?: string; page?: string; sort?: string };
type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<SP> };

const slugOf = (path: string[]) => decodeURIComponent(path[path.length - 1]);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const c = categoryBySlug(slugOf((await params).path));
  if (!c) return {};
  const sp = await searchParams;
  const content = categoryContent(c.slug);
  // Paginated pages are their own indexable URLs; search and sort variants are not indexed
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const full = `${categoryLabel(c)} in Cabo San Lucas`;
  const name = content?.title ?? (full.length <= 60 ? full : `${categoryLabel(c)} in Cabo`);
  const title = page > 1 ? `${name} – Page ${page}` : name;
  return {
    // "| CMC Pharmacy Cabo" is appended only when the result still fits in 60 characters
    title: title.length > 40 ? { absolute: title } : title,
    description: content?.description ?? `Shop ${categoryLabel(c)} at CMC Pharmacy Cabo with daily delivery to hotels, resorts and villas in Los Cabos.`,
    alternates: { canonical: `/product-category/${c.slug}${page > 1 ? `?page=${page}` : ""}` },
    robots: sp.q || sp.sort || !isIndexableCategory(c) ? { index: false, follow: true } : undefined,
  };
}

export default async function Category({ params, searchParams }: Props) {
  const category = categoryBySlug(slugOf((await params).path));
  if (!category) notFound();
  return <ShopView base={`/product-category/${category.slug}`} params={await searchParams} category={category} />;
}
