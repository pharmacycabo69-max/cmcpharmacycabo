import type { MetadataRoute } from "next";
import { allPages } from "@/lib/content";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/") }, { url: u("/shop") }, { url: u("/blog") },
    ...allPages().map((p) => ({ url: u(`/${p.slug}`), lastModified: p.date ?? undefined })),
    ...products.map((p) => ({ url: u(`/product/${p.slug}`) })),
  ];
}
