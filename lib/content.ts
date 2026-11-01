import pages from "@/content/pages.json";

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

const all = pages as Page[];
// "shop" is rebuilt natively and the empty duplicate is skipped
const HIDDEN = new Set(["", "shop"]);

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
