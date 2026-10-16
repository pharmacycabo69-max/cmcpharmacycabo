import fs from "node:fs";
import path from "node:path";
import indexJson from "@/data/products/index.json";
import catsJson from "@/data/products/categories.slim.json";

export type ProductSummary = {
  id: number; slug: string; name: string; sku: string | null; price: number; regular: number;
  onSale: boolean; img: string | null; inStock: boolean; cats: number[];
};
export type Category = { id: number; name: string; slug: string; parent: number; count: number };
export type Product = ProductSummary & {
  currency: string; short: string; description: string;
  images: { src: string; thumb: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: { name: string; terms: string[] }[]; brands: string[];
};

export const products = indexJson as ProductSummary[];
export const categories = catsJson as Category[];
export const PAGE_SIZE = 24;

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function getProduct(slug: string): Product | null {
  const s = products.find((p) => p.slug === slug);
  if (!s) return null;
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/products/items", `${s.id}.json`), "utf8"));
}

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const topCategories = () => categories.filter((c) => c.parent === 0 && c.count > 0 && c.slug !== "uncategorized").sort((a, b) => b.count - a.count);

/** ids of a category and all its descendants */
export function categoryIds(id: number): Set<number> {
  const ids = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) if (ids.has(c.parent) && !ids.has(c.id)) { ids.add(c.id); grew = true; }
  }
  return ids;
}

export function search({ q, cat, page = 1, sort }: { q?: string; cat?: number; page?: number; sort?: string }) {
  let list = products;
  if (cat) { const ids = categoryIds(cat); list = list.filter((p) => p.cats.some((c) => ids.has(c))); }
  if (q) { const t = q.toLowerCase().split(/\s+/).filter(Boolean); list = list.filter((p) => t.every((w) => p.name.toLowerCase().includes(w) || p.sku?.toLowerCase() === w)); }
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = Math.min(Math.max(1, page), pages);
  return { items: list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE), total, pages, page: cur };
}
