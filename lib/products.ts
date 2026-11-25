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
    .replace(/&nbsp;|&#160;/g, " ")
    // UTF-8 read as Latin-1 on import ("InducciÃ³n" → "Inducción")
    .replace(/Ã([\u0080-¿])/g, (_, c: string) => String.fromCharCode(0xc0 + c.charCodeAt(0) - 0x80));

/** Imported "photos" that are really the supplier's no-image placeholder (identified by identical file content). */
const PLACEHOLDER_PHOTOS = new Set([
  5228, 5729, 8713, 8723, 8729, 8731, 8739, 8749, 8755, 8763, 8777, 8783, 8843, 8845, 8847, 8849, 8851, 8853, 9823, 9825, 9827, 9843, 9871, 9873, 9875, 9877, 9879, 9881, 10013,
]);

/**
 * 4 imported slugs keep WordPress percent-encoding ("…-folato-%c2%b7-150-caps") and never resolved (404, also in
 * production). They become plain ASCII slugs; the broken encoded URLs had no working page to preserve.
 */
const cleanSlug = (slug: string) => (/%[0-9a-f]{2}/i.test(slug) ? slug.replace(/(%[0-9a-f]{2})+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : slug);

/** Products with neither a photo nor a price are hidden everywhere (listings, product pages, sitemap). */
const visible = (p: ProductSummary) => !!p.img || p.price > 0;
export const products = (indexJson as ProductSummary[])
  .map((p) => (PLACEHOLDER_PHOTOS.has(p.id) ? { ...p, img: null } : p))
  .filter(visible)
  .map((p) => ({ ...p, slug: cleanSlug(p.slug), name: decode(p.name) }));

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

/** 0 = photo and price, 1 = photo only, 2 = price only. */
const listingRank = (p: ProductSummary) => (p.img ? 0 : 2) + (hasPrice(p) ? 0 : 1);

export function getProduct(slug: string): Product | null {
  const s = products.find((p) => p.slug === slug);
  if (!s) return null;
  const p: Product = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/products/items", `${s.id}.json`), "utf8"));
  return {
    ...p,
    cats: s.cats, // detail files only carry `categories`; the listing has the ids
    slug: s.slug, // cleaned slug (see cleanSlug)
    name: decode(p.name),
    images: PLACEHOLDER_PHOTOS.has(s.id) ? [] : p.images.map((i) => ({ ...i, alt: decode(i.alt ?? "") })),
    categories: p.categories.map((c) => ({ ...c, name: decode(c.name) })),
  };
}

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

const sharesName = (c: Category) => categories.some((x) => x.id !== c.id && x.count > 0 && x.name === c.name);
/** Category name, with its parent when another category is called the same ("Extended Catalog (Makeup)"). */
export function categoryLabel(c: Category) {
  const parent = sharesName(c) ? categories.find((x) => x.id === c.parent) : undefined;
  return parent ? `${c.name} (${parent.name})` : c.name;
}
/** Import leftovers and near-empty twins of another category stay browsable but are not offered to search engines. */
export const isIndexableCategory = (c: Category) =>
  c.count > 0 && !/^(uncategorized|extended-catalog|medicashop-import)/.test(c.slug) && !(c.count < 4 && sharesName(c));
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

/** Categories travelers ask for most (same as the home page), used to order the main shop page. */
const TRAVEL_SLUGS = ["sun-care", "hydration-electrolytes", "digestive-gi-care", "pain-fever-relief", "allergy-otc", "wound-care-first-aid", "cold-flu", "heartburn-acid-relief", "insect-repellents"];
let travelSets: Set<number>[] | null = null;
/** Household pest products filed under "insect repellents" by the supplier are not traveler essentials. */
const HOUSEHOLD_PEST = /\b(ratones|ratas?|rat[oó]n|mouse|mice|rodent\w*|trampas?|cucarachas?|roach\w*)\b/i;
/** Position of the product's first traveler category (0 = sun care) or the list length when it has none. */
const travelRank = (p: ProductSummary) => {
  if (HOUSEHOLD_PEST.test(p.name)) return TRAVEL_SLUGS.length;
  travelSets ??= TRAVEL_SLUGS.map((slug) => { const c = categoryBySlug(slug); return c ? categoryIds(c.id) : new Set<number>(); });
  const i = travelSets.findIndex((set) => p.cats.some((c) => set.has(c)));
  return i === -1 ? travelSets.length : i;
};

export function search({ q, cat, page = 1, sort }: { q?: string; cat?: number; page?: number; sort?: string }) {
  let list = products;
  if (cat) { const ids = categoryIds(cat); list = list.filter((p) => p.cats.some((c) => ids.has(c))); }
  if (q) { const t = q.toLowerCase().split(/\s+/).filter(Boolean); list = list.filter((p) => t.every((w) => p.name.toLowerCase().includes(w) || p.sku?.toLowerCase() === w)); }
  if (sort === "price-asc") list = [...list].sort((a, b) => (hasPrice(a) ? a.price : Infinity) - (hasPrice(b) ? b.price : Infinity));
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  // Default order: complete listings first (photo + price), then photo only, then price only (stable within each group).
  // On the main shop page, what travelers need most (sun care, stomach, pain, allergy…) comes first.
  else if (!cat && !q) list = [...list].sort((a, b) => listingRank(a) - listingRank(b) || travelRank(a) - travelRank(b));
  else list = [...list].sort((a, b) => listingRank(a) - listingRank(b));
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
const RX_NAMES = /\b(semaglut\w*|ozempic|wegovy|rybelsus|tirzepat\w*|mounjaro|zepbound|liraglut\w*|saxenda|victoza|amoxicil\w*|azithromycin|azitromicina|ciprofloxac\w*|levofloxac\w*|clarithromycin|claritromicina|doxycycline|doxiciclina|cephalexin|cefalexina|ceftriaxon\w*|cefuroxim\w*|metronidazol\w*|nitrofuranto\w*|clindamic\w*|sulfamethoxazole|sulfametoxazol|trimethoprim|trimetoprima|penicil\w*|sildenafil|tadalafil|viagra|cialis|prednison\w*|prednisolon\w*|betametason\w*|betamethason\w*|dexametason\w*|dexamethason\w*|metformin\w*|insulin\w*|sertralin\w*|fluoxetin\w*|escitalopram|paroxetin\w*|isotretino\w*|finasterid\w*)\b/i;
/** Supplies that mention a drug but are sold freely (insulin syringes, pen needles, test strips) — unless a dose is given. */
const SUPPLIES = /\b(syringes?|jeringas?|needles?|agujas?|lancets?|lancetas?|strips?|tiras?)\b/i;
const isSupply = (name: string) => SUPPLIES.test(name) && !/\d\s*mg\b/i.test(name);
/** Over-the-counter in Mexico even when the import filed them under an "... Rx" category. */
const OTC_NAMES = /\b(loratadin\w*|desloratadin\w*|cetirizin\w*|levocetirizin\w*|fexofenadin\w*|meclizin\w*|meclizina|dimenhydrinat\w*|dimenhidrinato|diphenhydramin\w*|difenhidramina)\b/i;
const OTC_BLOCKERS = /\b(betamet\w*|dexamet\w*|prednis\w*|ambroxol|codein\w*|pseudoephedrin\w*|pseudoefedrina)\b/i;
const isOtc = (name: string) => OTC_NAMES.test(name) && !OTC_BLOCKERS.test(name) && !RX_NAMES.test(name);

export const isControlled = (p: { name: string }) => CONTROLLED.test(p.name);
export const isRx = (p: { name: string; cats: number[] }) =>
  isControlled(p) ||
  (RX_NAMES.test(p.name) && !isSupply(p.name)) ||
  ((p.cats ?? []).some((c) => RX_CATS.has(c)) && !isOtc(p.name));
