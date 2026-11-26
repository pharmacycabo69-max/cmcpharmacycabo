import Link from "next/link";
import { categoryBySlug } from "@/lib/products";

/**
 * Commercial categories (V5 §4) as original banners (gradients + line icons, no stock photos), and curated
 * "essentials" lists that open a search: no bundle prices or discounts are invented.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const CATS: { slug?: string; q?: string; label: string; from: string; to: string; icon: React.ReactNode }[] = [
  { slug: "sun-care", label: "Sun Care", from: "#fde68a", to: "#fb923c", icon: <g {...S}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g> },
  { slug: "hydration-electrolytes", label: "Hydration & Electrolytes", from: "#a5f3fc", to: "#22d3ee", icon: <g {...S}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></g> },
  { slug: "wound-care-first-aid", label: "First Aid", from: "#fecaca", to: "#f87171", icon: <g {...S}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v5M9.5 13.5h5" /></g> },
  { slug: "baby-kids", label: "Baby Care", from: "#fbcfe8", to: "#f472b6", icon: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M9 11h.01M15 11h.01M9.5 15a3.5 3.5 0 0 0 5 0" /></g> },
  { slug: "skin-care", label: "Skin Care", from: "#e9d5ff", to: "#a78bfa", icon: <g {...S}><path d="M8 3h8v4a4 4 0 0 1-8 0V3ZM12 11v4M8 21h8l-1-6H9l-1 6Z" /></g> },
  { slug: "personal-care", label: "Personal Care", from: "#bfdbfe", to: "#60a5fa", icon: <g {...S}><path d="M7 21V9a5 5 0 0 1 10 0v12M7 13h10" /></g> },
  { slug: "vitamins-supplements", label: "Vitamins & Supplements", from: "#bbf7d0", to: "#34d399", icon: <g {...S}><rect x="4" y="9" width="16" height="7" rx="3.5" transform="rotate(-30 12 12.5)" /><path d="m10 9 4 7" /></g> },
  { q: "travel", label: "Travel Essentials", from: "#99f6e4", to: "#087f83", icon: <g {...S}><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V5h6v2M4 12h16" /></g> },
];

const KITS = [
  { t: "Beach Essentials", d: "Sunscreen, after-sun, hydration and insect repellent.", q: ["Sunscreen", "Aloe", "Electrolytes", "Repellent"] },
  { t: "Family Travel Essentials", d: "Children's pain & fever relief, thermometer, bandages, diapers.", q: ["Thermometer", "Bandages", "Diapers", "Pediatric"] },
  { t: "Vacation Essentials", d: "Motion sickness, stomach relief, allergy and hydration.", q: ["Motion sickness", "Loperamide", "Allergy", "Electrolytes"] },
];

export function CategoryRail() {
  const cats = CATS.filter((c) => !c.slug || (categoryBySlug(c.slug)?.count ?? 0) > 0);
  return (
    <section className="mt-8" aria-labelledby="cat-rail">
      <h2 id="cat-rail" className="sr-only">Shop by category</h2>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0">
        {cats.map((c) => (
          <li key={c.label} className="w-36 shrink-0 snap-start lg:w-auto">
            <Link href={c.slug ? `/product-category/${c.slug}` : `/search?q=${encodeURIComponent(c.q!)}`} className="group block overflow-hidden rounded-2xl ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-24 items-end justify-between p-3 text-white" style={{ backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-white drop-shadow" aria-hidden>{c.icon}</svg>
              </span>
              <span className="block bg-white px-3 py-2.5 text-sm font-semibold leading-tight text-navy group-hover:text-brand">{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {KITS.map((k) => (
          <div key={k.t} className="card p-5">
            <p className="font-display font-bold text-navy">{k.t}</p>
            <p className="mt-1 text-sm text-slate-600">{k.d}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{k.q.map((q) => <li key={q}><Link href={`/search?q=${encodeURIComponent(q)}`} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-navy hover:bg-brand-soft hover:text-brand-dark">{q}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Suggested lists, not bundles: items and prices are confirmed by a pharmacist with your request.</p>
    </section>
  );
}
