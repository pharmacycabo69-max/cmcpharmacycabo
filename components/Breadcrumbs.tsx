import Link from "next/link";
import { JsonLd, breadcrumbSchema, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className={`text-sm ${dark ? "text-white/60" : "text-slate-500"}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? <span aria-current="page" className={dark ? "text-white/90" : "text-slate-700"}>{c.name}</span> : <Link href={c.href} className={dark ? "hover:text-white" : "hover:text-brand"}>{c.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
