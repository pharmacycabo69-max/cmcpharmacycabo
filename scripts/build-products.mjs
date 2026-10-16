// Splits data/products/products.json into a slim index + one file per product for fast static builds
import fs from "node:fs";
import path from "node:path";
const dec = (s) => (s ?? "").replace(/&amp;/g, "&").replace(/&#039;|&#8217;/g, "'").replace(/&quot;/g, '"');
const src = JSON.parse(fs.readFileSync("data/products/products.json", "utf8"));
const cats = JSON.parse(fs.readFileSync("data/products/categories.json", "utf8"));
const pathOf = (u) => (u ? u.replace(/^https?:\/\/[^/]+/, "") : null);
const outDir = "data/products/items";
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const price = (p) => Number(p.prices.price) / 10 ** (p.prices.currency_minor_unit ?? 2);
const index = [];
for (const p of src) {
  const imgs = (p.images ?? []).map((i) => ({ src: i.src, thumb: i.thumbnail, alt: i.alt || p.name }));
  index.push({
    id: p.id, slug: p.slug, name: dec(p.name), sku: p.sku || null, price: price(p),
    regular: Number(p.prices.regular_price) / 10 ** (p.prices.currency_minor_unit ?? 2),
    onSale: !!p.on_sale, img: imgs[0]?.thumb ?? null, inStock: !!p.is_in_stock,
    cats: p.categories.map((c) => c.id),
  });
  fs.writeFileSync(path.join(outDir, `${p.id}.json`), JSON.stringify({
    id: p.id, slug: p.slug, name: dec(p.name), sku: p.sku || null, price: price(p),
    regular: Number(p.prices.regular_price) / 10 ** (p.prices.currency_minor_unit ?? 2),
    onSale: !!p.on_sale, currency: p.prices.currency_code, inStock: !!p.is_in_stock,
    short: p.short_description, description: p.description, images: imgs,
    categories: p.categories.map((c) => ({ id: c.id, name: dec(c.name), slug: c.slug })),
    attributes: (p.attributes ?? []).map((a) => ({ name: dec(a.name), terms: a.terms.map((t) => dec(t.name)) })),
    brands: (p.brands ?? []).map((b) => dec(b.name)),
  }));
}
fs.writeFileSync("data/products/index.json", JSON.stringify(index));
fs.writeFileSync("data/products/categories.slim.json", JSON.stringify(cats.map((c) => ({ id: c.id, name: dec(c.name), slug: c.slug, parent: c.parent, count: c.count }))));
console.log(index.length, "products", cats.length, "categories");
