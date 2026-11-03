import type { MetadataRoute } from "next";
import { allPages } from "@/lib/content";
import { LOCATIONS } from "@/lib/locations";
import { categories, products } from "@/lib/products";
import { SITE } from "@/lib/site";

const CHUNK = 1000;
const u = (p: string) => `${SITE.url}${p}`;
const productChunks = Math.ceil(products.length / CHUNK);

// id 0 = site pages, 1 = categories, 2.. = product chunks
export async function generateSitemaps() {
  return Array.from({ length: 2 + productChunks }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  if (id === 0) {
    return [
      { url: u("/"), priority: 1, changeFrequency: "weekly" },
      { url: u("/shop"), priority: 0.8, changeFrequency: "daily" },
      { url: u("/blog"), priority: 0.6, changeFrequency: "weekly" },
      { url: u("/delivery-areas"), priority: 0.8 },
      { url: u("/iv-therapy"), priority: 0.9, changeFrequency: "weekly" },
      { url: u("/locations"), priority: 0.8 },
      ...LOCATIONS.map((l) => ({ url: u(`/locations/${l.slug}`), priority: 0.8 })),
      ...allPages().map((p) => ({ url: u(`/${p.slug}`), lastModified: p.date ?? undefined, priority: p.type === "post" ? 0.5 : 0.7 })),
    ];
  }
  if (id === 1) return categories.filter((c) => c.count > 0 && c.slug !== "uncategorized").map((c) => ({ url: u(`/product-category/${c.slug}`), priority: 0.6 }));
  return products.slice((id - 2) * CHUNK, (id - 1) * CHUNK).map((p) => ({ url: u(`/product/${p.slug}`), priority: 0.4 }));
}
