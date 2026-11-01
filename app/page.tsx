import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, faqSchema, pharmacySchema, websiteSchema } from "@/lib/seo";
import { deliveryAreas, posts } from "@/lib/content";
import { topCategories } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "24/7 Pharmacy in Cabo San Lucas | Hotel Delivery & English-Speaking Doctors" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: "24/7 Pharmacy in Cabo San Lucas | CMC Pharmacy Cabo", description: SITE.description, url: "/" },
};

const SERVICES = [
  { t: "24/7 pharmacy delivery", d: "Prescriptions, OTC medicine and travel essentials brought to your hotel, resort or villa.", href: "/24-7-pharmacy-delivery-cabo-san-lucas" },
  { t: "English-speaking doctors", d: "Video consultations and hotel visits with bilingual physicians, available now.", href: "/doctor-consultation" },
  { t: "IV therapy", d: "Book a licensed nurse for hydration, hangover, immunity and NAD+ drips at your hotel or villa.", href: "/iv-therapy" },
  { t: "Concierge partnerships", d: "Guest medical support for hotels, resorts and property managers.", href: "/for-concierges" },
];

const STEPS = [
  { t: "Contact us", d: "Call, WhatsApp or browse the shop. A pharmacist answers 24/7 in English." },
  { t: "We confirm", d: "We verify your prescription needs and confirm the product, price and delivery time." },
  { t: "Delivered to you", d: "Discreet delivery to your door, typically within 60–90 minutes." },
];

const FAQ = [
  { q: "How fast is pharmacy delivery in Cabo?", a: "Most orders arrive within 60–90 minutes in Cabo San Lucas, San José del Cabo and the Corridor, day or night." },
  { q: "Do you deliver to hotels, resorts and Airbnbs?", a: "Yes. We deliver discreetly and securely to hotels, all-inclusive resorts, villas and vacation rentals across Los Cabos." },
  { q: "Is there a 24-hour pharmacy in Cabo San Lucas?", a: "Yes. CMC Pharmacy Cabo is reachable 24/7 by phone and WhatsApp, with a pharmacist always on call." },
  { q: "Can I get prescription medication from an English-speaking pharmacy?", a: "Yes. Our pharmacists and doctors are bilingual and can guide you through Mexican prescription requirements." },
  { q: "Do you offer doctor visits or urgent care?", a: "We connect you with English-speaking doctors by video consultation or in-person visits at your hotel or villa." },
];

const REVIEWS = [
  { q: "They delivered my prescription to our hotel in Cabo within 45 minutes. English-speaking staff and the pharmacist even called to confirm dosage.", n: "Sarah M.", w: "Vermont, USA" },
  { q: "Ordered at midnight and had my meds by 8 AM. The team is incredibly professional and speaks perfect English.", n: "John D.", w: "Toronto, Canada" },
  { q: "As a diabetic traveling from Canada, finding reliable insulin in Cabo was a worry. CMC Pharmacy made it seamless.", n: "Emma R.", w: "Vancouver, Canada" },
];

export default function Home() {
  const areas = deliveryAreas().slice(0, 8);
  return (
    <>
      <JsonLd data={[pharmacySchema(), websiteSchema(), faqSchema(FAQ)]} />

      <section className="border-b border-slate-100 bg-brand-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-semibold text-brand">COFEPRIS licensed · LegitScript certified</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">24/7 pharmacy delivery in Cabo San Lucas &amp; San José del Cabo</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">English-speaking pharmacists and doctors. Prescriptions, medicine and health essentials delivered to your hotel or villa, any hour.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={SITE.tel} className="btn btn-primary">Call {SITE.phone}</a>
              <Link href="/shop" className="btn btn-outline">Browse the shop</Link>
            </div>
            <p className="mt-5 text-sm text-slate-500"><span className="font-semibold text-slate-800">★ {SITE.rating.value.toFixed(1)}</span> on Google · {SITE.rating.count} verified reviews</p>
          </div>
          <Image src="/wp-content/uploads/2026/07/cabo-pharmacy-english-speaking-pharmacist-cmc.png" alt="English-speaking pharmacist at CMC Pharmacy Cabo in Cabo San Lucas" width={800} height={800} priority sizes="(min-width: 768px) 560px, 100vw" className="w-full rounded-2xl" />
        </div>
      </section>

      <section className="section" aria-labelledby="services">
        <h2 id="services" className="h2">Everything your trip needs, delivered</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.t}>
              <Link href={s.href} className="block h-full rounded-xl border border-slate-200 p-6 transition hover:border-brand">
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-50" aria-labelledby="how">
        <div className="section">
          <h2 id="how" className="h2">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="shop">
        <div className="flex items-end justify-between gap-4">
          <h2 id="shop" className="h2">Shop by category</h2>
          <Link href="/shop" className="text-sm font-medium text-brand">All products →</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {topCategories().slice(0, 8).map((c) => (
            <li key={c.id}><Link href={`/product-category/${c.slug}`} className="block rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{c.name}<span className="mt-1 block text-xs font-normal text-slate-400">{c.count} products</span></Link></li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-50" aria-labelledby="areas">
        <div className="section">
          <div className="flex items-end justify-between gap-4">
            <h2 id="areas" className="h2">Delivery to Los Cabos hotels &amp; resorts</h2>
            <Link href="/delivery-areas" className="text-sm font-medium text-brand">All areas →</Link>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {areas.map((p) => <li key={p.slug}><Link href={`/${p.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{p.title}</Link></li>)}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="reviews">
        <h2 id="reviews" className="h2">What travelers say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="rounded-xl border border-slate-200 p-6">
              <p aria-label="5 out of 5 stars" className="text-brand">★★★★★</p>
              <blockquote className="mt-3 text-sm leading-relaxed text-slate-600">“{r.q}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">{r.n} <span className="font-normal text-slate-500">· {r.w}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8" aria-labelledby="faq">
        <h2 id="faq" className="h2 text-center">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-center text-sm"><Link href="/faq" className="font-medium text-brand">More answers →</Link></p>
      </section>

      <section className="section" aria-labelledby="blog">
        <h2 id="blog" className="h2">From the blog</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts().slice(0, 3).map((p) => (
            <article key={p.slug} className="rounded-xl border border-slate-200 p-5 transition hover:border-brand">
              <h3 className="font-semibold leading-snug"><Link href={`/${p.slug}`} className="hover:text-brand">{p.title}</Link></h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
