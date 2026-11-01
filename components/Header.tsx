import Link from "next/link";
import Image from "next/image";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
        <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
          <Image src={SITE.logo} alt={SITE.name} width={300} height={109} className="h-9 w-auto" priority />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="hover:text-brand">{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <a href={SITE.tel} className="btn btn-primary !py-2 text-sm">
            <span className="hidden sm:inline">Call {SITE.phone}</span><span className="sm:hidden">Call 24/7</span>
          </a>
          <details className="relative lg:hidden">
            <summary aria-label="Menu" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-lg">☰</summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {NAV.map((n) => <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">{n.label}</Link>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
