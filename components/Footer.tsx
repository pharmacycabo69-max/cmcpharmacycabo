import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-mint">{SITE.name}</p>
          <p className="mt-2 max-w-md text-sm text-muted">
            CMC Pharmacy &amp; Doctors is Cabo’s #1 trusted choice for 24/7 pharmacy delivery and English-speaking doctors in Cabo San Lucas &amp; San José del Cabo.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/about-us-pharmacy-delivery">About us</Link></li>
            <li><Link href="/for-concierges">For concierges</Link></li>
            <li><Link href="/blog">Articles &amp; News</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy-policy">Privacy policy</Link></li>
            <li><Link href="/prescription-requirements">Prescription requirements</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Get in touch</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>{SITE.address}</li>
            <li><a href={SITE.tel}>{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} CMC Pharmacy. All rights reserved.</p>
    </footer>
  );
}
