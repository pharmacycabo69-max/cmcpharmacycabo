import pages from "@/content/pages.json";
import mergedJson from "@/content/merged-pages.json";

export type Page = {
  slug: string;
  type: "page" | "post";
  title: string;
  seoTitle: string;
  description: string;
  date: string | null;
  image: string | null;
  html: string;
};

/**
 * Strip WordPress theme leftovers from imported posts: the "Uncategorized" category label at the top
 * and the comment form + "Latest Post" list at the bottom.
 */
const clean = (html: string) =>
  html
    .replace(/^\s*<h6>[\s\S]*?<\/h6>\s*/, "")
    .replace(/\s*<h2>\s*Leave a Reply[\s\S]*$/, "")
    .replace(/\s*<h4>\s*Latest Post[\s\S]*$/, "");

/**
 * Imported copy advertises 24/7 / overnight service. Confirmed hours (master data §2): delivery 8:00–23:30
 * every day, no 24/7 or immediate availability. These rules rewrite those claims at load time so the original
 * import stays untouched and the change is reversible. Order matters: specific phrases first.
 */
const HOURS = "8 am–11:30 pm";
const capFirst = (match: string, repl: string) => (/^[A-Z]/.test(match) ? repl[0].toUpperCase() + repl.slice(1) : repl);
const CLAIMS: [RegExp, string | ((m: string) => string)][] = [
  [/24\s*hours?\s+a\s+day(,?\s*(and\s+)?7\s+days\s+a\s+week)?/gi, `${HOURS}, every day`],
  [/anytime,?\s+day\s+or\s+night/gi, (m) => capFirst(m, `any day, ${HOURS}`)],
  [/day\s+or\s+night/gi, (m) => capFirst(m, `every day until 11:30 pm`)],
  [/around[- ]the[- ]clock/gi, (m) => capFirst(m, `every day from 8 am to 11:30 pm`)],
  [/\bat any hour\b/gi, `every day from 8 am to 11:30 pm`],
  [/\bany hour\b/gi, HOURS],
  [/\ball night\b/gi, "until 11:30 pm"],
  [/\b(?:24\/7|24-7)\s+(delivery)/gi, (m) => capFirst(m, "daily delivery")],
  // "24/7 pharmacy", "24-Hour Pharmacy Delivery", "24 hour pharmacy" → drop the adjective ("within 24 hours" is untouched)
  [/\b(?:24\/7|24-hours?|24 hour)\s+(?=[A-Za-z])/gi, ""],
  [/\b24\/7\b/g, `daily, ${HOURS}`],
  [/\bovernight\b/gi, (m) => capFirst(m, "late-evening")],
  // Static "Open Now · ● Live" availability chips from the old landing pages
  [/Open Now\s*·?\s*/g, ""],
  [/<p>\s*●\s*Live\s*<\/p>/g, ""],
  // WhatsApp: the bot-connected main line (master data §2)
  [/wa\.me\/521?6242673177/g, "wa.me/5216242261023"],
];
const deClaim = (s: string) => CLAIMS.reduce((acc, [re, to]) => acc.replace(re, to as string), s);

/** Duplicate hotel posts → the hotel landing page that absorbs their content (and 301s them, see next.config). */
export const MERGED: Record<string, string> = Object.fromEntries(Object.entries(mergedJson).filter(([k]) => !k.startsWith("_")));

const raw = (pages as Page[]).map((p) => ({
  ...p,
  title: deClaim(p.title),
  seoTitle: deClaim(p.seoTitle),
  description: deClaim(p.description),
  html: deClaim(clean(p.html)),
}));
const all: Page[] = raw
  .filter((p) => !MERGED[p.slug])
  .map((p) => {
    const extra = raw.filter((x) => MERGED[x.slug] === p.slug && x.html.length > 0);
    return extra.length ? { ...p, html: [p.html, ...extra.map((x) => x.html)].join("\n") } : p;
  });
// "shop" is rebuilt natively and the empty duplicate is skipped
const HIDDEN = new Set(["", "shop", "iv-therapy"]);

export const getPage = (slug: string) => all.find((p) => p.slug === slug && p.html.length > 0);
export const home = () => all.find((p) => p.slug === "")!;
export const allPages = () => all.filter((p) => !HIDDEN.has(p.slug) && p.html.length > 0);
export const posts = () =>
  all
    .filter((p) => p.type === "post")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const VALID = new Set(["/", "/shop", "/blog", "/contact-us", ...all.map((p) => `/${p.slug}`)]);

/** Rewrites internal links from the old WordPress site to routes that exist here */
export function fixLinks(html: string): string {
  return html.replace(/href="(\/[^"]*)"/g, (m, href: string) => {
    const clean = href.replace(/\/+$/, "") || "/";
    const base = clean.split(/[?#]/)[0] || "/";
    const merged = MERGED[base.slice(1)];
    if (merged) return `href="/${merged}"`;
    if (/^\/(product|product-category|wp-content)\//.test(base) || VALID.has(base)) return `href="${clean}"`;
    if (base.startsWith("/shop")) return 'href="/shop"';
    if (base.startsWith("/category") || base.startsWith("/20")) return 'href="/blog"';
    return 'href="/"';
  });
}

const AREA = /^pharmacy-(near|delivery-to|delivery-pueblo)|^need-a-pharmacy-near/;
export const deliveryAreas = () => allPages().filter((p) => AREA.test(p.slug)).sort((a, b) => a.title.localeCompare(b.title));

/** Same-type pages that share the most words with `slug`, for internal linking */
export function related(slug: string, n = 3): Page[] {
  const self = getPage(slug);
  if (!self) return [];
  const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3));
  const mine = words(self.slug);
  return allPages()
    .filter((p) => p.slug !== slug && p.type === self.type)
    .map((p) => ({ p, score: [...words(p.slug)].filter((w) => mine.has(w)).length }))
    .sort((a, b) => b.score - a.score || (b.p.date ?? "").localeCompare(a.p.date ?? ""))
    .slice(0, n)
    .map((x) => x.p);
}
