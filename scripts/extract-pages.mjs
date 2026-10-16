// Extracts clean content from the scraped WordPress/Elementor pages in site/ into content/pages.json
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("site/cmcpharmacycabo.com");
const OUT = path.resolve("content/pages.json");
const ALLOWED = new Set(["h1","h2","h3","h4","h5","h6","p","ul","ol","li","a","strong","b","em","i","img","blockquote","table","thead","tbody","tr","th","td","br","hr","figure","figcaption","details","summary"]);
const SKIP_DIRS = new Set(["wp-content","wp-includes","wp-json","feed","category"]);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (fs.existsSync(path.join(p, "index.html"))) acc.push(p);
    walk(p, acc);
  }
  return acc;
}

const normLink = (href) => {
  if (!href) return href;
  let h = href.replace(/^https?:\/\/(www\.)?cmcpharmacycabo\.com/, "");
  h = h.replace(/index\.html$/, "");
  return h;
};

function clean($, root, dir) {
  root.find("style,script,noscript,svg,form,input,button,select,iframe,nav,.elementor-widget-woocommerce-products,.elementor-widget-post-info,.elementor-widget-breadcrumbs,.elementor-widget-share-buttons,.elementor-widget-post-navigation,.elementor-widget-author-box,.elementor-widget-theme-post-featured-image,.elementor-widget-search-form,.elementor-widget-html,.elementor-widget-shortcode,.elementor-widget-menu-cart,.products").remove();
  root.find("img").each((_, el) => {
    const $el = $(el);
    let src = $el.attr("data-src") || $el.attr("src") || "";
    if (src.startsWith("data:")) { $el.remove(); return; }
    const m = src.match(/wp-content\/uploads\/.+$/);
    if (m) $el.attr("src", "/" + m[0]); else if (!/^https?:/.test(src)) { $el.remove(); return; }
    for (const a of Object.keys(el.attribs)) if (!["src", "alt"].includes(a)) $el.removeAttr(a);
    $el.attr("loading", "lazy");
  });
  root.find("a").each((_, el) => {
    const $el = $(el);
    let href = $el.attr("href") || "";
    if (/^(index\.html)?#/.test(href)) href = href.replace(/^index\.html/, "");
    else if (href && !/^([a-z]+:|#|\/)/i.test(href)) href = "./" + href;
    if (/^(\.\.?\/|\/)/.test(href)) href = "/" + path.relative(ROOT, path.resolve(dir, href)).replace(/index\.html$/, "");
    href = normLink(href);
    if (/wp-content\/uploads/.test(href)) href = "/" + href.match(/wp-content\/uploads\/.+$/)[0];
    $el.attr("href", href);
  });
  // unwrap everything not allowed, strip attributes
  let changed = true;
  while (changed) {
    changed = false;
    root.find("*").each((_, el) => {
      if (!ALLOWED.has(el.tagName)) { $(el).replaceWith($(el).contents()); changed = true; }
    });
  }
  root.find("*").each((_, el) => {
    for (const a of Object.keys(el.attribs)) {
      if (el.tagName === "a" && a === "href") continue;
      if (el.tagName === "img" && ["src", "alt", "loading"].includes(a)) continue;
      $(el).removeAttr(a);
    }
  });
  root.find("p,li,h1,h2,h3,h4,h5,h6,a,strong,em,b,i,blockquote").each((_, el) => {
    if (!$(el).text().trim() && !$(el).find("img").length) $(el).remove();
  });
  root.find("h1").first().remove();
}

const pages = [];
for (const dir of ["", ...walk(ROOT).map((d) => path.relative(ROOT, d))]) {
  const file = path.join(ROOT, dir, "index.html");
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  const slug = dir; // "" = home
  let wrap = $("[data-elementor-type=wp-page],[data-elementor-type=single-post],[data-elementor-type=single]").first();
  if (!wrap.length) wrap = $("main .page-content").first();
  if (!wrap.length) wrap = $("main").first();
  const type = wrap.attr("data-elementor-type") === "single-post" ? "post" : "page";
  const title = $("h1").first().text().trim() || $("title").text().replace(/\s*[-—–]\s*CMC Pharmacy Cabo.*$/i, "").trim();
  const description = $('meta[name=description]').attr("content") || "";
  const seoTitle = $("title").text().trim();
  const date = $('meta[property="article:published_time"]').attr("content") || null;
  const image = ($('meta[property="og:image"]').attr("content") || "").match(/wp-content\/uploads\/.+$/)?.[0] || null;
  const faq = [];
  wrap.find(".elementor-accordion-item,.elementor-toggle-item,details").each((_, el) => {
    const q = $(el).find(".elementor-tab-title,summary").first().text().replace(/\s+/g, " ").trim();
    const a = $(el).find(".elementor-tab-content,p").first().text().replace(/\s+/g, " ").trim();
    if (q && a) faq.push({ q, a });
  });
  clean($, wrap, path.join(ROOT, dir));
  const html = (wrap.html() ?? "").replace(/(<br\s*\/?>\s*)+/g, " ").replace(/\s+/g, " ").trim();
  pages.push({ slug, type, title, seoTitle: seoTitle.replace(/&amp;/g, "&"), description, date, image: image ? "/" + image : null, html, faq });
}
fs.writeFileSync(OUT, JSON.stringify(pages, null, 1));
console.log(pages.length, "pages;", pages.filter((p) => p.type === "post").length, "posts;", "empty:", pages.filter((p) => p.html.length < 200).map((p) => p.slug));
