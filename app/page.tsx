import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, faqSchema, pharmacySchema, websiteSchema } from "@/lib/seo";
import { deliveryAreas, posts } from "@/lib/content";
import { StoreCard } from "@/components/StoreCard";
import { LOCATIONS } from "@/lib/locations";
import { topCategories } from "@/lib/products";
import { photo } from "@/components/PageBanner";
import { IconBox, IconBuilding, IconClock, IconDoctor, IconDrip, IconGlobe, IconPill, IconShield, IconStar } from "@/components/Icons";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { SITE } from "@/lib/site";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: { absolute: "Pharmacy Delivery in Cabo San Lucas | English-Speaking Doctors | CMC Pharmacy Cabo" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: "Pharmacy Delivery in Cabo San Lucas | CMC Pharmacy Cabo", description: SITE.description, url: "/" },
};

const SERVICES = [
  { icon: IconBox, t: "Pharmacy delivery", d: `Prescriptions, OTC medicine and travel essentials brought to your hotel, resort or villa, ${SITE.deliveryHours.label}.`, href: "/24-7-pharmacy-delivery-cabo-san-lucas" },
  { icon: IconDoctor, t: "English-speaking doctors", d: "Video consultations and visits at your hotel or villa with bilingual physicians, by appointment.", href: "/doctor-consultation" },
  { icon: IconDrip, t: "IV therapy", d: "IV therapy at your hotel or villa, after a medical assessment, by appointment.", href: "/iv-therapy" },
  { icon: IconBuilding, t: "Concierge partnerships", d: "Guest medical support for hotels, resorts and property managers.", href: "/for-concierges" },
];

const STEPS = [
  { t: "Contact us", d: "WhatsApp, call or browse the shop. Our bilingual team answers in English and Spanish." },
  { t: "We confirm", d: "We check your prescription needs and confirm the product, total price and delivery time before we go." },
  { t: "Delivered to you", d: `Discreet delivery to your hotel, villa or home, ${SITE.deliveryHours.label}.` },
];

const FAQ = [
  { q: "What are your delivery hours?", a: "We deliver every day from 8:00 am to 11:30 pm to hotels, resorts, villas and homes in Cabo San Lucas, San José del Cabo and the Corridor. We confirm the estimated delivery time when you order." },
  { q: "Do you deliver to hotels, resorts and Airbnbs?", a: "Yes. We deliver discreetly to hotels, all-inclusive resorts, villas and vacation rentals across Los Cabos. Some hotels only allow delivery to the front desk; we coordinate with you." },
  { q: "Can I get prescription medication from an English-speaking pharmacy?", a: "Yes. Our team is bilingual and can guide you through Mexican prescription requirements. Prescription-only medicines are dispensed only with a valid prescription." },
  { q: "Do you offer doctor visits?", a: "We coordinate English-speaking doctors by video consultation or by appointment at your hotel or villa. We are not an emergency service: in an emergency, call 911." },
  { q: "Do you accept travel insurance?", a: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team to verify your eligibility and payment arrangements before receiving medical services." },
];

export default function Home() {
  const areas = deliveryAreas().slice(0, 8);
  const arco = photo("arco");
  const eyebrow = "text-xs font-bold uppercase tracking-[0.16em] text-brand";
  return (
    <>
      <JsonLd data={[pharmacySchema(), websiteSchema(), faqSchema(FAQ)]} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={arco.src} alt={arco.alt} fill priority quality={60} sizes="100vw" className="-z-20 object-cover object-[62%_45%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/15" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-slate-950/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 md:pb-36 md:pt-24">
          <div className="max-w-2xl">
            {/* Trust chips: only verifiable facts (no seals or ratings until the owner confirms them) */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconShield className="h-4 w-4" />Part of {SITE.parent} · {LOCATIONS.length} stores in Cabo</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconGlobe className="h-4 w-4" />English &amp; Spanish</span>
              {SITE.rating && <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconStar className="h-3.5 w-3.5 text-amber-300" />{SITE.rating.value.toFixed(1)} · {SITE.rating.count} Google reviews</span>}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
              Pharmacy delivery in <span className="text-teal-300">Cabo San Lucas</span> &amp; San José del Cabo
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">English-speaking pharmacy team and doctor visits by appointment. Prescriptions, medicine and health essentials delivered to your hotel or villa, every day from 8 am to 11:30 pm.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need a pharmacy delivery in Cabo.")}`} target="_blank" rel="noopener" className="btn !bg-[#25d366] !px-6 !py-3.5 text-[#05301b] shadow-lg shadow-black/20 hover:!bg-[#2ee170]">Order on WhatsApp</a>
              <a href={SITE.tel} className="btn !px-6 !py-3.5 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/15">Call {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4">
        <ul className="grid grid-cols-2 divide-slate-100 rounded-2xl bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 md:grid-cols-4 md:divide-x">
          {[
            [IconClock, "8 am – 11:30 pm", "Delivery, every day"],
            [IconBox, `${LOCATIONS.length} stores`, `${SITE.parent} in Cabo San Lucas`],
            [IconGlobe, "English", "Pharmacists & doctors"],
            [IconDrip, `${products.length.toLocaleString("en-US")}+`, "Products in the shop"],
          ].map(([Icon, big, small]) => {
            const I = Icon as typeof IconClock;
            return (
              <li key={big as string} className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><I className="h-5 w-5" /></span>
                <p><span className="block text-lg font-bold leading-tight">{big as string}</span><span className="block text-xs text-slate-600">{small as string}</span></p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Services */}
      <section className="section" aria-labelledby="services">
        <p className={eyebrow}>What we do</p>
        <h2 id="services" className="h2 mt-2">Everything your trip needs, delivered</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li key={s.t}>
              <Link href={s.href} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-teal-500 text-white shadow-md shadow-teal-900/20"><s.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 font-semibold">{s.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.d}</p>
                <span className="mt-4 text-sm font-semibold text-brand">Learn more <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-brand-soft to-white" aria-labelledby="how">
        <div className="section">
          <p className={eyebrow}>Simple &amp; fast</p>
          <h2 id="how" className="h2 mt-2">How it works</h2>
          <ol className="relative mt-10 grid gap-6 md:grid-cols-3">
            <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent md:block" />
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white shadow-lg shadow-teal-900/20 ring-8 ring-brand-soft">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Shop by category */}
      <section className="section" aria-labelledby="shop">
        <div className="flex items-end justify-between gap-4">
          <div><p className={eyebrow}>Online shop</p><h2 id="shop" className="h2 mt-2">Shop by category</h2></div>
          <Link href="/shop" className="text-sm font-semibold text-brand">All products →</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {topCategories().slice(0, 8).map((c) => (
            <li key={c.id}>
              <Link href={`/product-category/${c.slug}`} className="group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand"><IconPill className="h-5 w-5" /></span>
                <span className="text-sm font-semibold leading-tight group-hover:text-brand">{c.name}<span className="mt-0.5 block text-xs font-normal text-slate-500">{c.count} products</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Stores */}
      <section className="bg-slate-50" aria-labelledby="stores">
        <div className="section">
          <div className="flex items-end justify-between gap-4">
            <div><p className={eyebrow}>Walk-in pharmacies</p><h2 id="stores" className="h2 mt-2">Visit us in Cabo San Lucas</h2></div>
            <Link href="/locations" className="text-sm font-semibold text-brand">All locations →</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.slice(0, 3).map((l) => <StoreCard key={l.slug} l={l} />)}
          </div>
        </div>
      </section>

      {/* Delivery areas */}
      <section className="section" aria-labelledby="areas">
        <div className="flex items-end justify-between gap-4">
          <div><p className={eyebrow}>We come to you</p><h2 id="areas" className="h2 mt-2">Delivery to Los Cabos hotels &amp; resorts</h2></div>
          <Link href="/delivery-areas" className="text-sm font-semibold text-brand">All areas →</Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {areas.map((p) => <li key={p.slug}><Link href={`/${p.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{p.title}<span aria-hidden className="text-brand">→</span></Link></li>)}
        </ul>
      </section>

      {/* Testimonials removed until authentic, attributable reviews are supplied (master data §8: no invented reviews). */}

      {/* International insurance (master data §2.1) */}
      <section className="mx-auto max-w-4xl px-4 pt-16" aria-label="International insurance">
        <InsuranceNotice />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq">
        <h2 id="faq" className="h2 text-center">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-center text-sm"><Link href="/faq" className="font-semibold text-brand">More answers →</Link></p>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-6xl px-4 pb-4" aria-labelledby="blog">
        <h2 id="blog" className="h2">From the blog</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts().slice(0, 3).map((p) => (
            <article key={p.slug} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md">
              <h3 className="font-semibold leading-snug"><Link href={`/${p.slug}`} className="hover:text-brand">{p.title}</Link></h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-teal-500 px-6 py-12 text-center text-white shadow-xl md:px-12">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">Need something from the pharmacy?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-teal-50">Message us in English or Spanish. We deliver to your hotel or villa every day, 8 am – 11:30 pm.</p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a href={SITE.tel} className="btn !px-6 !py-3.5 bg-white text-brand hover:bg-teal-50">Call {SITE.phone}</a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener" className="btn !px-6 !py-3.5 !bg-[#25d366] text-[#05301b] hover:!bg-[#2ee170]">WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
