import Link from "next/link";
import Image from "next/image";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="bg-mintd/20 text-center text-xs py-1.5 text-mint">
        FREE Delivery $99+ · 24/7 in Cabo · <a href={SITE.tel} className="font-semibold">{SITE.phone}</a>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={SITE.name}>
          <Image src="/wp-content/uploads/2025/09/cmc-pharmacy-cabo-san-lucas-logo.png" alt={SITE.name} width={300} height={109} className="h-10 w-auto" priority />
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted hover:text-mint transition">{n.label}</Link>
          ))}
        </nav>
        <a href={SITE.tel} className="btn btn-cta !py-2 !px-4 text-sm">Call 24/7</a>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap text-muted">{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}
