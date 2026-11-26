import Link from "next/link";
import { RequestBadge } from "@/components/AddToRequest";
import { LangToggle } from "@/components/LangToggle";
import { Logo } from "@/components/Logo";
import { MORE_SERVICES, NAV, SITE } from "@/lib/site";

/**
 * Header (V4 §5.1): brand, Pharmacy, Doctors, IV Therapy, More services, Insurance, EN/ES, request cart, contact.
 * Menus use <details>, so they work without JavaScript and with the keyboard.
 */
export function Header() {
  const link = "rounded-lg px-3 py-2 text-[0.94rem] font-medium text-navy/85 transition hover:bg-surface hover:text-navy";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="hidden bg-navy text-[12.5px] text-white/85 md:block">
        <div className="mx-auto flex h-9 max-w-[76rem] items-center justify-between gap-4 px-4">
          <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden />Delivery {SITE.deliveryHours.label} · Cabo San Lucas, San José del Cabo &amp; the Corridor</p>
          <p className="flex items-center gap-5">
            <Link href="/international-insurance" className="hover:text-white">US &amp; Canadian insurance: verified before your visit</Link>
            <span className="text-white/40" aria-hidden>|</span>
            <span>Emergency: <a href="tel:911" className="font-semibold text-white">911</a></span>
          </p>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-[76rem] items-center justify-between gap-4 px-4 lg:h-[4.5rem]">
        <Link href="/" aria-label="CMC Pharmacy Cabo San Lucas — home" className="shrink-0"><Logo /></Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => <Link key={n.href} href={n.href} className={link}>{n.label}</Link>)}
          <details className="group relative">
            <summary className={`${link} flex cursor-pointer items-center gap-1`}>More services<svg viewBox="0 0 20 20" className="h-4 w-4 transition group-open:rotate-180" fill="currentColor" aria-hidden><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg></summary>
            <div className="absolute left-1/2 top-full mt-3 grid w-[40rem] -translate-x-1/2 grid-cols-3 gap-6 rounded-2xl border border-line bg-white p-6 shadow-2xl shadow-navy/15">
              {MORE_SERVICES.map((g) => (
                <div key={g.title}>
                  <p className="eyebrow">{g.title}</p>
                  <ul className="mt-3 space-y-1">
                    {g.links.map(([href, label]) => <li key={href}><Link href={href} className="-mx-2 block rounded-lg px-2 py-1.5 text-sm text-navy hover:bg-surface">{label}</Link></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </details>
          <Link href="/international-insurance" className={link}>Insurance</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:inline-flex" />
          <RequestBadge />
          <Link href="/book" className="btn btn-primary hidden !px-4 !py-2.5 text-sm md:inline-flex">Book care</Link>
          <details className="group relative lg:hidden">
            <summary aria-label="Open menu" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line text-navy">
              <svg viewBox="0 0 24 24" className="h-5 w-5 group-open:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              <svg viewBox="0 0 24 24" className="hidden h-5 w-5 group-open:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
            </summary>
            <nav aria-label="Mobile" className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white px-4 pb-28 pt-4 shadow-xl">
              <div className="grid grid-cols-2 gap-2">
                {[...NAV, { href: "/international-insurance", label: "Insurance" }, { href: "/request", label: "My request" }].map((n) => (
                  <Link key={n.href} href={n.href} className="rounded-xl bg-surface px-4 py-3 font-semibold text-navy">{n.label}</Link>
                ))}
              </div>
              {MORE_SERVICES.map((g) => (
                <div key={g.title} className="mt-6">
                  <p className="eyebrow">{g.title}</p>
                  <ul className="mt-2 divide-y divide-line">
                    {g.links.map(([href, label]) => <li key={href}><Link href={href} className="flex items-center justify-between py-3 text-navy">{label}<span aria-hidden className="text-navy/30">›</span></Link></li>)}
                  </ul>
                </div>
              ))}
              <div className="mt-6 grid gap-2">
                <a href={SITE.tel} className="btn btn-outline">Call {SITE.phone}</a>
                <LangToggle className="btn btn-outline" long />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
