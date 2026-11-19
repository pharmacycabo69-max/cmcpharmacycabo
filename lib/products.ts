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

/** Imported WooCommerce text carries HTML entities ("&#038;", "&amp;"); decode them once at load. */
export const decode = (s: string) =>
  s
    .replace(/&#0*38;|&amp;/g, "&")
    .replace(/&#0*39;|&#8217;|&apos;/g, "'")
    .replace(/&quot;|&#0*34;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;|&#160;/g, " ");

/** Products with neither a photo nor a price are hidden everywhere (listings, product pages, sitemap). */
const visible = (p: ProductSummary) => !!p.img || p.price > 0;
export const products = (indexJson as ProductSummary[]).filter(visible).map((p) => ({ ...p, name: decode(p.name) }));

// Category counts are recomputed from the visible products (each category counts its descendants too)
const rawCats = (catsJson as Category[]).map((c) => ({ ...c, name: decode(c.name) }));
const parentOf = new Map(rawCats.map((c) => [c.id, c.parent]));
const counts = new Map<number, number>();
for (const p of products) {
  const seen = new Set<number>();
  for (let id of p.cats) for (; id && !seen.has(id); id = parentOf.get(id) ?? 0) { seen.add(id); counts.set(id, (counts.get(id) ?? 0) + 1); }
}
export const categories: Category[] = rawCats.map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
export const PAGE_SIZE = 24;

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Products imported without a price are "ask for price", not free. */
export const hasPrice = (p: { price: number }) => p.price > 0;

export function getProduct(slug: string): Product | null {
  const s = products.find((p) => p.slug === slug);
  if (!s) return null;
  const p: Product = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/products/items", `${s.id}.json`), "utf8"));
  return {
    ...p,
    cats: s.cats, // detail files only carry `categories`; the listing has the ids
    name: decode(p.name),
    images: p.images.map((i) => ({ ...i, alt: decode(i.alt ?? "") })),
    categories: p.categories.map((c) => ({ ...c, name: decode(c.name) })),
  };
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
  if (sort === "price-asc") list = [...list].sort((a, b) => (hasPrice(a) ? a.price : Infinity) - (hasPrice(b) ? b.price : Infinity));
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = Math.min(Math.max(1, page), pages);
  return { items: list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE), total, pages, page: cur };
}

/** Categories named "... Rx" (and their subcategories) hold prescription-only medicines. */
const RX_CATS = (() => {
  const ids = new Set(categories.filter((c) => /\bRx\b/.test(c.name)).map((c) => c.id));
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) if (ids.has(c.parent) && !ids.has(c.id)) { ids.add(c.id); grew = true; }
  }
  return ids;
})();

/** Psychotropics/opioids controlled under Mexican law: original special prescription required. */
const CONTROLLED = /\b(codein[ea]?|code[ií]na|tramadol|clonazepam|alprazolam|diazepam|lorazepam|bromazepam|zolpidem|oxycodon[ea]?|morphin[ea]?|morfina|fentanyl|buprenorphin[ea]?|tapentadol|methylphenidate|metilfenidato|modafinil|phentermin[ea]?|fentermina)\b/i;

/** Active ingredients that need a prescription in Mexico even when the product sits in a non-Rx category. */
const RX_NAMES = /\b(semaglut\w*|ozempic|wegovy|rybelsus|tirzepat\w*|mounjaro|zepbound|liraglut\w*|saxenda|victoza|amoxicil\w*|azithromycin|azitromicina|ciprofloxac\w*|levofloxac\w*|clarithromycin|claritromicina|doxycycline|doxiciclina|cephalexin|cefalexina|ceftriaxon\w*|cefuroxim\w*|metronidazol\w*|nitrofuranto\w*|clindamic\w*|sulfamethoxazole|sulfametoxazol|trimethoprim|trimetoprima|penicil\w*|sildenafil|tadalafil|viagra|cialis|prednison\w*|prednisolon\w*|dexametason\w*|dexamethason\w*|metformin\w*|insulin\w*|sertralin\w*|fluoxetin\w*|escitalopram|paroxetin\w*|isotretino\w*|finasterid\w*)\b/i;
/** Supplies that mention a drug but are sold freely (insulin syringes, pen needles, test strips). */
const SUPPLIES = /\b(syringes?|jeringas?|needles?|agujas?|lancets?|lancetas?|strips?|tiras?)\b/i;

export const isControlled = (p: { name: string }) => CONTROLLED.test(p.name);
export const isRx = (p: { name: string; cats: number[] }) =>
  isControlled(p) || (p.cats ?? []).some((c) => RX_CATS.has(c)) || (RX_NAMES.test(p.name) && !SUPPLIES.test(p.name));
