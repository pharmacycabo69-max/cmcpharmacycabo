import Link from "next/link";
import { SITE } from "@/lib/site";
import { topCategories } from "@/lib/products";

export function Footer() {
  const cats = topCategories().slice(0, 8);
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-slate-900">{SITE.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Licensed 24/7 pharmacy and English-speaking doctors serving Cabo San Lucas, San José del Cabo and the Corridor.</p>
          <address className="mt-4 text-sm not-italic leading-relaxed text-slate-600">
            {SITE.street}, {SITE.postalCode} {SITE.locality}, B.C.S., Mexico<br />
            <a href={SITE.tel} className="font-medium text-slate-900">{SITE.phone}</a><br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </address>
        </div>
        <FooterCol title="Services" links={[["/delivery-areas", "Delivery areas"], ["/24-7-pharmacy-delivery-cabo-san-lucas", "24/7 pharmacy delivery"], ["/doctor-consultation", "Doctor consultation"], ["/iv-therapy", "IV therapy"], ["/for-concierges", "For concierges"], ["/prescription-requirements", "Prescription requirements"]]} />
        <FooterCol title="Shop" links={[["/shop", "All products"], ...cats.map((c) => [`/product-category/${c.slug}`, c.name] as [string, string])]} />
        <FooterCol title="Company" links={[["/locations", "Our stores"], ["/about-us-pharmacy-delivery", "About us"], ["/blog", "Blog"], ["/faq", "FAQ"], ["/contact-us", "Contact"], ["/privacy-policy", "Privacy policy"]]} />
      </div>
      <p className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {links.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-brand">{label}</Link></li>)}
      </ul>
    </div>
  );
}
