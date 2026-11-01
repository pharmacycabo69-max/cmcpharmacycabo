// Imports the cvupharmacy catalog into this site:
//  1) adds the products cvupharmacy has that we don't (matched by slug),
//  2) builds local product photos (public/products/<id>.jpg 320px + <id>-lg.jpg 720px) from the cvupharmacy mirror
//     (falling back to this site's own mirror), and rewrites the image URLs in data/products/products.json.
// macOS only (uses `sips`). Run: node scripts/import-cvu.mjs [path/to/cvupharmacy]   then: node scripts/build-products.mjs
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const CVU = path.resolve(process.argv[2] ?? "../cvupharmacy");
const SOURCES = [path.join(CVU, "mirror/wp-content/uploads"), path.resolve("site/cmcpharmacycabo.com/wp-content/uploads")];
const OUT = path.resolve("public/products");
const ID_OFFSET = 1_000_000; // keeps imported ids from colliding with ours

const mine = JSON.parse(fs.readFileSync("data/products/products.json", "utf8"));
const theirs = JSON.parse(fs.readFileSync(path.join(CVU, "data/products.json"), "utf8"));
const cats = JSON.parse(fs.readFileSync("data/products/categories.json", "utf8"));
const theirCats = JSON.parse(fs.readFileSync(path.join(CVU, "data/categories.json"), "utf8"));

// 1) products only cvupharmacy has
const have = new Set(mine.map((p) => p.slug));
const catBySlug = new Map(cats.map((c) => [c.slug, c]));
const theirCatById = new Map(theirCats.map((c) => [c.id, c]));
const added = [];
for (const p of theirs) {
  if (have.has(p.slug)) continue;
  const mapped = p.categories.map((c) => {
    let ours = catBySlug.get(c.slug);
    if (!ours) {
      const t = theirCatById.get(c.id);
      ours = { id: c.id + ID_OFFSET, name: c.name, slug: c.slug, parent: 0, count: 0, permalink: c.link ?? null };
      cats.push(ours); catBySlug.set(ours.slug, ours);
    }
    ours.count++;
    return { ...c, id: ours.id };
  });
  const q = { ...p, id: p.id + ID_OFFSET, categories: mapped };
  mine.push(q); added.push(q.name);
}
console.log(`added ${added.length} products:`, added);

// 2) photos
const find = (src) => {
  const rel = src?.match(/wp-content\/uploads\/(.+)$/)?.[1];
  if (!rel) return null;
  for (const root of SOURCES) { const f = path.join(root, decodeURI(rel)); if (fs.existsSync(f)) return f; }
  return null;
};
fs.mkdirSync(OUT, { recursive: true });
const jobs = mine.map((p) => ({ p, from: find(p.images?.[0]?.src) })).filter((j) => j.from);

async function make(from, to, size, alpha) {
  await run("sips", ["-Z", String(size), "-s", "format", alpha ? "png" : "jpeg", ...(alpha ? [] : ["-s", "formatOptions", "72"]), from, "--out", to]);
}
async function hasAlpha(f) {
  if (!/\.(png|webp|gif)$/i.test(f)) return false;
  const { stdout } = await run("sips", ["-g", "hasAlpha", f]);
  return /hasAlpha: yes/.test(stdout);
}
let done = 0, fail = 0;
const result = new Map(); // id -> ext
async function worker(queue) {
  for (let j; (j = queue.pop()); ) {
    try {
      const alpha = await hasAlpha(j.from);
      const ext = alpha ? "png" : "jpg";
      const grid = path.join(OUT, `${j.p.id}.${ext}`), lg = path.join(OUT, `${j.p.id}-lg.${ext}`);
      if (!fs.existsSync(grid)) await make(j.from, grid, 320, alpha);
      if (!fs.existsSync(lg)) await make(j.from, lg, 720, alpha);
      result.set(j.p.id, ext);
    } catch (e) { fail++; }
    if (++done % 250 === 0) console.log(`${done}/${jobs.length}`);
  }
}
const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, () => worker(queue)));
console.log(`photos built: ${result.size}, failed: ${fail}, products without a photo source: ${mine.length - jobs.length}`);

// 3) rewrite image URLs: local photo if we have one, otherwise no image (the old remote host is gone)
for (const p of mine) {
  const ext = result.get(p.id);
  const alt = p.images?.[0]?.alt || p.name;
  p.images = ext ? [{ id: p.images?.[0]?.id ?? p.id, src: `/products/${p.id}-lg.${ext}`, thumbnail: `/products/${p.id}.${ext}`, alt, name: `${p.id}.${ext}` }] : [];
}
fs.writeFileSync("data/products/products.json", JSON.stringify(mine));
fs.writeFileSync("data/products/categories.json", JSON.stringify(cats));
