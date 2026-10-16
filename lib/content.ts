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
