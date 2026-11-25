import Link from "next/link";
import { IconBox, IconBuilding, IconDoctor, IconDrip, IconPill, IconStar } from "@/components/Icons";

const ITEMS = [
  { href: "/doctor-consultation", t: "Doctor consultation", d: "Video $59 · clinic $99", icon: IconDoctor },
  { href: "/hotel-doctor-cabo", t: "Doctor at your hotel", d: "House call $189", icon: IconBuilding },
  { href: "/iv-therapy", t: "IV therapy", d: "From $159 at your hotel", icon: IconDrip },
  { href: "/lab-tests-imaging", t: "Lab tests & imaging", d: "Blood work · X-ray · ultrasound", icon: IconPill },
  { href: "/aesthetic-medicine", t: "Aesthetic medicine", d: "Lip fillers · wrinkle care · glow", icon: IconStar },
  { href: "/price-list", t: "Pharmacy price list", d: "Medicine prices in USD", icon: IconBox },
];

/** Internal-link block shown at the bottom of service pages (current page excluded). */
export function RelatedServices({ current, title = "More from CMC Pharmacy Cabo" }: { current?: string; title?: string }) {
  const items = ITEMS.filter((i) => i.href !== current).slice(0, 6);
  return (
    <section className="mt-14" aria-labelledby="related-services">
      <h2 id="related-services" className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="group flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white"><i.icon className="h-5 w-5" /></span>
              <span><span className="block text-sm font-semibold group-hover:text-brand">{i.t}</span><span className="block text-xs text-slate-500">{i.d}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
