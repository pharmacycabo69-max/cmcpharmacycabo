import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 bg-navy-deep pb-20 text-white/70 lg:pb-0">
      <div className="mx-auto grid max-w-[76rem] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 font-display text-lg font-bold text-white"><LogoMark className="h-8 w-8" />{SITE.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">The delivery and concierge service of <Link href="/locations" className="text-white underline-offset-2 hover:underline">{SITE.parent}</Link>: English-speaking pharmacists and doctors for visitors and residents of Cabo San Lucas, San José del Cabo and the Corridor.</p>
          <dl className="mt-5 space-y-1.5 text-sm">
            <div className="flex gap-2"><dt className="text-white/50">Delivery</dt><dd>{SITE.deliveryHours.label}</dd></div>
            <div className="flex gap-2"><dt className="text-white/50">WhatsApp</dt><dd><a href={SITE.whatsapp} className="text-white">{SITE.whatsappDisplay}</a></dd></div>
            <div className="flex gap-2"><dt className="text-white/50">Phone</dt><dd><a href={SITE.tel} className="text-white">{SITE.phone}</a></dd></div>
            <div className="flex gap-2"><dt className="text-white/50">Email</dt><dd><a href={`mailto:${SITE.email}`} className="text-white">{SITE.email}</a></dd></div>
          </dl>
          <address className="mt-4 text-sm not-italic leading-relaxed text-white/60">{SITE.street}, {SITE.postalCode} {SITE.locality}, B.C.S., Mexico</address>
        </div>
        <FooterCol title="Care" links={[["/doctor-consultation", "Doctor consultation"], ["/hotel-doctor-cabo", "Doctor at your hotel"], ["/iv-therapy", "IV therapy"], ["/lab-tests-imaging", "Lab tests & imaging"], ["/aesthetic-medicine", "Aesthetic medicine"], ["/international-insurance", "International insurance"]]} />
        <FooterCol title="Pharmacy" links={[["/shop", "Shop the catalog"], ["/request", "My request"], ["/price-list", "Price list"], ["/prescription-requirements", "Prescriptions in Mexico"], ["/delivery-areas", "Hotels & delivery areas"], ["/for-concierges", "For hotels & concierges"]]} />
        <FooterCol title="Company" links={[["/locations", "Our pharmacies"], ["/about-us-pharmacy-delivery", "About us"], ["/blog", "Travel health guides"], ["/faq", "FAQ"], ["/contact-us", "Contact"], ["/es", "Español"]]} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[76rem] flex-col gap-2 px-4 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. We are not an emergency service: in an emergency, call <a href="tel:911" className="font-semibold text-white">911</a>.</p>
          <p className="flex gap-4"><Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link><Link href="/returns-and-refunds" className="hover:text-white">Returns &amp; refunds</Link></p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}
      </ul>
    </div>
  );
}
