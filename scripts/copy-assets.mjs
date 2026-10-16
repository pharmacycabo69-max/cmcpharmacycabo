// Copies only the uploads referenced by content/pages.json (plus the logo) into public/
import fs from "node:fs";
import path from "node:path";
const pages = JSON.parse(fs.readFileSync("content/pages.json", "utf8"));
const refs = new Set(["/wp-content/uploads/2025/09/cmc-pharmacy-cabo-san-lucas-logo.png"]);
for (const p of pages) {
  if (p.image) refs.add(p.image);
  for (const m of p.html.matchAll(/src="(\/wp-content\/uploads\/[^"]+)"/g)) refs.add(m[1]);
}
let n = 0, miss = [];
for (const r of refs) {
  const from = path.join("site/cmcpharmacycabo.com", decodeURI(r));
  if (!fs.existsSync(from)) { miss.push(r); continue; }
  const to = path.join("public", decodeURI(r));
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to); n++;
}
console.log("copied", n, "missing", miss.length, miss.slice(0, 5));
