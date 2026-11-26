import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pages from "@/content/pages.json";
import mergedJson from "@/content/merged-pages.json";
import { SITE } from "@/lib/site";

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
  tidyLanding(html)
    .replace(/^\s*<h6>[\s\S]*?<\/h6>\s*/, "")
    .replace(/\s*<h2>\s*Leave a Reply[\s\S]*$/, "")
    .replace(/\s*<h4>\s*Latest Post[\s\S]*$/, "");

/**
 * The oldest hotel landing pages were flattened on import: their own title repeated, availability chips, buttons
 * and labels run together as loose text. Keep the paragraphs and service blocks; the page header
 * (components/AreaStrip) already provides the order button.
 */
const LANDING = /^\s*<p>\s*CMC Pharmacy Cabo\s*—[\s\S]*?<\/p>\s*(?:Open Now\s*·?\s*Delivery to [^<]*)?/;
function tidyLanding(html: string) {
  if (!LANDING.test(html)) return html;
  return html
    .replace(LANDING, "")
    .replace(/\s*<a href="(?:https:\/\/wa\.me|tel:)[^"]*">[\s\S]*?<\/a>/g, "")
    .replace(/\s*Licensed Pharmacy[^<]*?What do you need today\?\s*(?:<p>\s*●\s*Live\s*<\/p>)?/, " <h2>What do you need today?</h2>")
    .replace(/<strong>Free delivery to ([^<]*)<\/strong>[^<]*/, (_, place: string) => `<p><strong>Free delivery to ${place.trim()}</strong> on orders of $${SITE.freeDeliveryFrom} or more.</p>`);
}

/**
 * Imported copy advertises 24/7 / overnight service. Confirmed hours (owner V5, 26 Nov 2026): delivery 8:00–23:30
 * every day, no 24/7 or immediate availability. These rules rewrite those claims at load time so the original
 * import stays untouched and the change is reversible. Order matters: specific phrases first.
 */
const HOURS = "8 am–11:30 pm";
// Used as String.replace replacements, where "$$" is a literal "$" (so "$59" is not read as a group reference)
const FREE_FROM = `$$${SITE.freeDeliveryFrom}`;
const FREE_DELIVERY_SENTENCE = `Delivery is free on orders of ${FREE_FROM} or more; for smaller orders we confirm the delivery fee with your total before we go.`;
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
  // Delivery fees (owner V5, 26 Nov 2026): free on orders of $99+. Imported copy invents fees/minimums ($5–15, $20–25,
  // free from $25/$50/$99): any sentence that states a fee, minimum or threshold with an amount becomes the policy.
  [
    /[^.!?<>]+[.!]?/g,
    (sentence) => {
      const amount = /\$\s?\d|\d+\s?(?:pesos|MXN)\b/i.test(sentence);
      const fee = /deliver/i.test(sentence) && /fee|charge|cost|pric|free|over|minimum|threshold|waiv|starting/i.test(sentence);
      const minimum = /minimum (?:order|purchase)/i.test(sentence);
      return amount && (fee || minimum) ? ` ${FREE_DELIVERY_SENTENCE.replace(/\$\$/g, "$")}` : sentence;
    },
  ],
  [/\bFree (?:for|with|on) orders over [^<.]*?(?:\$\s?\d+|\d+\s?(?:MXN|pesos))(?:\s?USD)?/gi, `Free on orders of ${FREE_FROM}+`],
  [/\bOn orders over \$\d+(?:\s?USD)?/g, `On orders of ${FREE_FROM}+`],
  // Invented tables of delivery tiers, delivery times and per-item prices
  [/<table\b[\s\S]*?<\/table>/gi, (t) => (/delivery/i.test(t) && /\$\s?\d/.test(t) ? "" : t)],
  [/Free Delivery on Orders \$99\+/g, `Free delivery on orders of ${FREE_FROM}+`],
  [/\bFree delivery to ([^<.]+)(?!<\/strong> on orders)(?![^<.])/g, `Free delivery on orders of ${FREE_FROM}+ to $1`],
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
const merged: Page[] = raw
  .filter((p) => !MERGED[p.slug])
  .map((p) => {
    const extra = raw.filter((x) => MERGED[x.slug] === p.slug && x.html.length > 0);
    return extra.length ? { ...p, html: [p.html, ...extra.map((x) => x.html)].join("\n") } : p;
  });

/**
 * The imported posts reuse a handful of photos under different file names (15 posts shared one image) and
 * some "photos" are 2+ MB PNG renders of people. A post keeps its image only if it is a small JPG/WebP that
 * exists in /public AND no newer post already uses the same file content; every other post gets a branded
 * cover (components/PostCover). Fingerprints are computed at build time.
 */
const MAX_PHOTO_BYTES = 400_000;
function photoFingerprint(src: string | null): string | null {
  if (!src || !/\.(jpe?g|webp)$/i.test(src)) return null;
  try {
    const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    if (fs.statSync(file).size > MAX_PHOTO_BYTES) return null;
    return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
  } catch {
    return null;
  }
}
function withUniqueImages(list: Page[]): Page[] {
  const seen = new Set<string>();
  const keep = new Map<string, string | null>();
  for (const p of list.filter((x) => x.type === "post").sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))) {
    const h = photoFingerprint(p.image);
    if (h && !seen.has(h)) { seen.add(h); keep.set(p.slug, p.image); } else keep.set(p.slug, null);
  }
  return list.map((p) => (p.type === "post" ? { ...p, image: keep.get(p.slug) ?? null } : p));
}
const all: Page[] = withUniqueImages(merged);
// "shop" is rebuilt natively and the empty duplicate is skipped
// Rebuilt natively in app/: shop, iv-therapy, doctor-consultation, contact-us, faq
const HIDDEN = new Set(["", "shop", "iv-therapy", "doctor-consultation", "contact-us", "faq"]);

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

/** Short display name for a hotel landing page ("Pharmacy delivery to Nobu Hotel Los Cabos" → "Nobu Hotel Los Cabos"). */
export const hotelName = (title: string) =>
  title
    .replace(/^\s*Pharmacy\s+(?:delivery\s+to|near)\s+/i, "")
    .split(/\s*[:–—|]\s*/)[0]
    .trim();
